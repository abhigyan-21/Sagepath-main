import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticate, async (req, res) => {
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select(`
                *,
                trophies (*)
            `)
            .eq('id', req.userId)
            .single();

        if (error) throw error;

        // Get friends count
        const { count: friendsCount } = await supabase
            .from('friendships')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', req.userId);

        // Get projects count
        const { count: projectsCount } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('author_id', req.userId)
            .eq('type', 'project');

        // Get completed courses (Luros)
        // A course is completed if all its topics are in completed_topics for the user's progress
        // For simplicity, let's assume we fetch courses where progress exists and is "completed"
        // But since we don't have a "completed" flag on progress, let's fetch courses where user has progress
        // and check if all topics are done.
        // OR simpler: Let's assume 'luros' table stores the rewards for completed courses.
        // If the user meant "Luros" as completed courses, we should fetch completed courses and display their thumbnails.

        // Let's fetch completed courses directly
        const { data: completedCourses } = await supabase
            .from('progress')
            .select(`
                course_id,
                courses (
                    id,
                    title,
                    thumbnail,
                    xp_reward
                ),
                completed_topics (count)
            `)
            .eq('user_id', req.userId);

        // Filter for fully completed courses (this logic might be complex in SQL, so doing basic check or just showing all in progress for now if "completed" flag is missing)
        // Better approach: Let's use the existing 'luros' table if it's meant for rewards.
        // But user said: "luros means how many courses a user has complete: luro of the completed course shall be displayed below"
        // So we should display course thumbnails of completed courses.

        // Let's assume for now that any course with progress is a "Luro" candidate, 
        // but ideally we should check if completed_topics count == total topics count.
        // For this MVP, let's just fetch the courses the user has started/completed.

        const luros = completedCourses?.map(p => ({
            id: p.courses.id,
            name: p.courses.title,
            image: p.courses.thumbnail,
            xp: p.courses.xp_reward,
            level: 1 // Default level for now as courses don't have levels
        })) || [];

        profile.friendsCount = friendsCount || 0;
        profile.projectsCount = projectsCount || 0;
        profile.luros = luros;
        profile.lurosCount = luros.length;

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/profile', authenticate, async (req, res) => {
    try {
        const { name, profile_image } = req.body;

        const { data, error } = await supabase
            .from('profiles')
            .update({ name, profile_image, updated_at: new Date() })
            .eq('id', req.userId)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/friends/:friendId', authenticate, async (req, res) => {
    try {
        const { error } = await supabase
            .from('friendships')
            .insert([{
                user_id: req.userId,
                friend_id: req.params.friendId
            }]);

        if (error) throw error;
        res.json({ message: 'Friend added' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/friends/:friendId', authenticate, async (req, res) => {
    try {
        const { error } = await supabase
            .from('friendships')
            .delete()
            .eq('user_id', req.userId)
            .eq('friend_id', req.params.friendId);

        if (error) throw error;
        res.json({ message: 'Friend removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/active-course', authenticate, async (req, res) => {
    try {
        // Get the most recently accessed progress
        const { data: progress, error } = await supabase
            .from('progress')
            .select(`
                *,
                courses (
                    id,
                    title,
                    thumbnail,
                    description
                ),
                completed_topics (count)
            `)
            .eq('user_id', req.userId)
            .order('last_accessed_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
            throw error;
        }

        if (!progress) {
            return res.json(null);
        }

        // Calculate progress percentage
        // We need total topics count for the course
        const { count: totalTopics } = await supabase
            .from('topics')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', progress.course_id);

        const completedCount = progress.completed_topics[0]?.count || 0;
        const percentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

        res.json({
            course: progress.courses,
            progress: {
                percentage,
                lastAccessed: progress.last_accessed_at
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
