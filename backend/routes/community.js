import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const { type } = req.query;
        
        let query = supabase
            .from('posts')
            .select(`
                *,
                profiles!posts_author_id_fkey(id, name, profile_image, level),
                likes(count),
                comments(count)
            `)
            .order('created_at', { ascending: false })
            .limit(50);

        if (type) {
            query = query.eq('type', type);
        }

        const { data, error } = await query;
        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', authenticate, async (req, res) => {
    try {
        const { type, title, description, image, content } = req.body;

        const { data, error } = await supabase
            .from('posts')
            .insert([{
                author_id: req.userId,
                type,
                title,
                description,
                image,
                content
            }])
            .select(`
                *,
                profiles!posts_author_id_fkey(id, name, profile_image, level)
            `)
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/like', authenticate, async (req, res) => {
    try {
        // Check if already liked
        const { data: existing } = await supabase
            .from('likes')
            .select('id')
            .eq('post_id', req.params.id)
            .eq('user_id', req.userId)
            .single();

        if (existing) {
            // Unlike
            await supabase
                .from('likes')
                .delete()
                .eq('id', existing.id);
        } else {
            // Like
            await supabase
                .from('likes')
                .insert([{
                    post_id: req.params.id,
                    user_id: req.userId
                }]);
        }

        // Get updated count
        const { count } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', req.params.id);

        res.json({ likes: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/comment', authenticate, async (req, res) => {
    try {
        const { text } = req.body;

        const { data, error } = await supabase
            .from('comments')
            .insert([{
                post_id: req.params.id,
                user_id: req.userId,
                text
            }])
            .select(`
                *,
                profiles!comments_user_id_fkey(id, name, profile_image)
            `)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
