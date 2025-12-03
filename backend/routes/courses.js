import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*, topics(*)');

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', authenticate, async (req, res) => {
    try {
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('*, topics(*)')
            .eq('id', req.params.id)
            .single();

        if (courseError) throw courseError;

        const { data: progress } = await supabase
            .from('progress')
            .select(`
                *,
                completed_topics(topic_id),
                doubts(*)
            `)
            .eq('user_id', req.userId)
            .eq('course_id', req.params.id)
            .single();

        res.json({ course, progress });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/progress', authenticate, async (req, res) => {
    try {
        const { topicId } = req.body;

        // Get or create progress
        let { data: progress } = await supabase
            .from('progress')
            .select('*')
            .eq('user_id', req.userId)
            .eq('course_id', req.params.id)
            .single();

        if (!progress) {
            const { data: newProgress, error } = await supabase
                .from('progress')
                .insert([{
                    user_id: req.userId,
                    course_id: req.params.id,
                    current_topic_id: topicId
                }])
                .select()
                .single();

            if (error) throw error;
            progress = newProgress;
        }

        // Check if already completed
        const { data: existingCompletion } = await supabase
            .from('completed_topics')
            .select('*')
            .eq('progress_id', progress.id)
            .eq('topic_id', topicId)
            .single();

        if (existingCompletion) {
            // Unmark as completed
            const { error: deleteError } = await supabase
                .from('completed_topics')
                .delete()
                .eq('progress_id', progress.id)
                .eq('topic_id', topicId);

            if (deleteError) throw deleteError;

            // Optional: Deduct XP logic here if needed, but skipping for now to keep it simple

            res.json({ message: 'Topic marked as incomplete', status: 'incomplete' });
        } else {
            // Mark as completed
            const { error: completedError } = await supabase
                .from('completed_topics')
                .insert([{
                    progress_id: progress.id,
                    topic_id: topicId
                }]);

            if (completedError) throw completedError;

            // Award XP
            const { data: course } = await supabase
                .from('courses')
                .select('xp_reward, topics(id)')
                .eq('id', req.params.id)
                .single();

            const xpGain = Math.floor(course.xp_reward / course.topics.length);

            await supabase.rpc('increment_xp', {
                user_id: req.userId,
                xp_amount: xpGain
            });

            // Update current topic
            await supabase
                .from('progress')
                .update({
                    current_topic_id: topicId,
                    last_accessed_at: new Date()
                })
                .eq('id', progress.id);

            res.json({ message: 'Topic marked as completed', status: 'completed', xpGained: xpGain });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/doubts', authenticate, async (req, res) => {
    try {
        const { question } = req.body;

        let { data: progress } = await supabase
            .from('progress')
            .select('id')
            .eq('user_id', req.userId)
            .eq('course_id', req.params.id)
            .single();

        if (!progress) {
            const { data: newProgress } = await supabase
                .from('progress')
                .insert([{
                    user_id: req.userId,
                    course_id: req.params.id
                }])
                .select()
                .single();
            progress = newProgress;
        }

        const { data, error } = await supabase
            .from('doubts')
            .insert([{
                progress_id: progress.id,
                question
            }])
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
