import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Create auth user with metadata
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name
                },
                emailRedirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`
            }
        });

        if (authError) {
            return res.status(400).json({ error: authError.message });
        }

        if (!authData.user) {
            return res.status(400).json({ error: 'Failed to create user' });
        }

        // Check if email confirmation is required
        if (!authData.session) {
            return res.status(201).json({
                message: 'Registration successful! Please check your email to confirm your account.',
                requiresConfirmation: true,
                email: email
            });
        }

        // If session exists (email confirmation disabled), create profile and return token
        // Wait a moment for auth.users to be ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ 
                id: authData.user.id, 
                name,
                email 
            }]);

        if (profileError) {
            console.log('Profile creation error:', profileError.message);
            // Continue anyway, profile will be created on first login
        }

        res.status(201).json({
            token: authData.session.access_token,
            user: {
                id: authData.user.id,
                name,
                email,
                profileImage: '/Pixel Wizard with Flaming Staff.png',
                level: 1,
                xp: 0,
                streaks: 0
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Get or create profile
        let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        // If profile doesn't exist, create it
        if (profileError || !profile) {
            // ... (existing profile creation code) ...
        } else {
            // Update streaks
            const today = new Date();
            const lastLogin = profile.last_login ? new Date(profile.last_login) : null;
            
            let newStreak = profile.streaks;
            
            if (lastLogin) {
                const diffTime = Math.abs(today - lastLogin);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

                if (diffDays === 1) {
                    // Consecutive day
                    newStreak += 1;
                } else if (diffDays > 1) {
                    // Missed a day (or more), reset
                    newStreak = 1;
                }
                // If diffDays === 0 (same day), do nothing
            } else {
                // First login ever (or since tracking started)
                newStreak = 1;
            }

            // Update profile with new streak and last_login
            const { data: updatedProfile, error: updateError } = await supabase
                .from('profiles')
                .update({ 
                    streaks: newStreak,
                    last_login: new Date().toISOString()
                })
                .eq('id', profile.id)
                .select()
                .single();

            if (!updateError) {
                profile = updatedProfile;
            }
        }

        res.json({
            token: data.session.access_token,
            user: {
                id: data.user.id,
                name: profile.name,
                email: data.user.email,
                profileImage: profile.profile_image,
                level: profile.level,
                xp: profile.xp,
                streaks: profile.streaks
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/logout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

router.post('/reset-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password`,
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
