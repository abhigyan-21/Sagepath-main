import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import courseRoutes from './routes/courses.js';
import communityRoutes from './routes/community.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/community', communityRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Sagepath API is running with Supabase' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
