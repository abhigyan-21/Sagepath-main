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
                luros (*),
                trophies (*)
            `)
            .eq('id', req.userId)
            .single();

        if (error) throw error;

        // Get friends
        const { data: friendships } = await supabase
            .from('friendships')
            .select('friend_id, profiles!friendships_friend_id_fkey(id, name, profile_image, level)')
            .eq('user_id', req.userId);

        profile.friends = friendships?.map(f => f.profiles) || [];

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

export default router;
