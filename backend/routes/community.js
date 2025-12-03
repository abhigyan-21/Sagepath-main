import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const { type, sort, scope } = req.query;

        let query = supabase
            .from('posts')
            .select(`
                *,
                profiles!posts_author_id_fkey(id, name, profile_image, level),
                likes(count),
                comments(count)
            `);

        // Filter by scope
        if (scope === 'mine') {
            query = query.eq('author_id', req.userId);
        } else if (scope === 'others') {
            query = query.neq('author_id', req.userId);
        }

        // Apply sorting
        if (sort === 'earliest') {
            query = query.order('created_at', { ascending: true });
        } else if (sort === 'most_liked') {
            // query = query.order('likes_count', { ascending: false });
            // Fallback to newest for now since likes_count column is missing
            query = query.order('created_at', { ascending: false });
        } else {
            // Default to newest
            query = query.order('created_at', { ascending: false });
        }

        if (type) {
            query = query.eq('type', type);
        }

        query = query.limit(50);

        const { data, error } = await query;
        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

router.post('/', authenticate, upload.single('image'), async (req, res) => {
    try {
        const { type, title, description, content } = req.body;
        let imageUrl = req.body.image; // Fallback if URL is provided manually

        // Handle file upload
        if (req.file) {
            const file = req.file;
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('community-images')
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                });

            if (uploadError) {
                // If bucket doesn't exist, try to create it (though usually done in setup)
                if (uploadError.message.includes('Bucket not found')) {
                    await supabase.storage.createBucket('community-images', { public: true });
                    // Retry upload
                    const { error: retryError } = await supabase
                        .storage
                        .from('community-images')
                        .upload(filePath, file.buffer, {
                            contentType: file.mimetype,
                        });
                    if (retryError) throw retryError;
                } else {
                    throw uploadError;
                }
            }

            // Get public URL
            const { data: { publicUrl } } = supabase
                .storage
                .from('community-images')
                .getPublicUrl(filePath);

            imageUrl = publicUrl;
        }

        const { data, error } = await supabase
            .from('posts')
            .insert([{
                author_id: req.userId,
                type,
                title,
                description,
                image: imageUrl,
                content,
                // likes_count: 0 // Column doesn't exist
            }])
            .select(`
                *,
                profiles!posts_author_id_fkey(id, name, profile_image, level)
            `)
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Create post error:', error);
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

        let action = '';

        if (existing) {
            // Unlike
            await supabase
                .from('likes')
                .delete()
                .eq('id', existing.id);
            action = 'unliked';

            // Increment/Decrement RPCs removed
        } else {
            // Like
            await supabase
                .from('likes')
                .insert([{
                    post_id: req.params.id,
                    user_id: req.userId
                }]);
            action = 'liked';
        }

        // Get updated count from likes table
        const { count } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', req.params.id);

        res.json({ likes: count, action });
    } catch (error) {
        // Fallback if RPC fails (e.g. function doesn't exist yet)
        console.error('Like error:', error);

        // Try to get count manually if RPC failed
        const { count } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', req.params.id);

        res.json({ likes: count });
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

router.delete('/:id', authenticate, async (req, res) => {
    try {
        // Check ownership
        const { data: post, error: fetchError } = await supabase
            .from('posts')
            .select('author_id')
            .eq('id', req.params.id)
            .single();

        if (fetchError) throw fetchError;
        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.author_id !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Delete post (cascade should handle likes/comments)
        const { error: deleteError } = await supabase
            .from('posts')
            .delete()
            .eq('id', req.params.id);

        if (deleteError) throw deleteError;
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
