import { supabase } from '../config/supabase.js';

export const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        console.log('Auth Middleware: No token provided');
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error('Auth Middleware Error:', error?.message || 'No user found');
            return res.status(401).json({ error: 'Invalid token.' });
        }

        req.userId = user.id;
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Middleware Exception:', error);
        res.status(401).json({ error: 'Invalid token.' });
    }
};
