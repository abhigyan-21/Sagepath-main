-- Insert the three main course tracks (Luros)
INSERT INTO courses (id, title, description, thumbnail, difficulty, xp_reward) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Full-Stack Web Development', 'Master modern web development from frontend to backend, databases, and deployment.', '/Pixel Art Otter Creature.png', 'beginner', 700),
('550e8400-e29b-41d4-a716-446655440002', 'Programming Fundamentals & DSA', 'Build strong programming foundations with data structures, algorithms, and problem-solving.', '/Pixel Art Fox Creature.png', 'intermediate', 500),
('550e8400-e29b-41d4-a716-446655440003', 'AI & Machine Learning', 'Learn AI, ML, deep learning, NLP, and modern AI pipelines including RAG and MLOps.', '/Pixelated Phoenix with Flames.png', 'advanced', 600);

-- Full-Stack Web Development Topics
INSERT INTO topics (course_id, title, type, video_url, content, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'HTML, CSS & JavaScript Basics', 'lesson', 'https://www.youtube.com/watch?v=pQN-pnXPaVg', 'Learn the fundamentals of web development with HTML, CSS, and JavaScript.', 1),
('550e8400-e29b-41d4-a716-446655440001', 'JavaScript Deep Dive', 'lesson', 'https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP', 'Master JavaScript with Namaste JavaScript series.', 2),
('550e8400-e29b-41d4-a716-446655440001', 'React Basics', 'lesson', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gTg2g8e1n9E0ROlmGAc3n6', 'Build modern UIs with React.', 3),
('550e8400-e29b-41d4-a716-446655440001', 'Node.js & Express', 'lesson', 'https://www.youtube.com/watch?v=Oe421EPjeBE', 'Create backend APIs with Node.js and Express.', 4),
('550e8400-e29b-41d4-a716-446655440001', 'Databases (SQL + MongoDB)', 'lesson', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU', 'Master database design and queries.', 5),
('550e8400-e29b-41d4-a716-446655440001', 'Full-Stack Integration', 'lesson', 'https://www.youtube.com/watch?v=7CqJlxBYj-M', 'Build complete MERN stack applications.', 6),
('550e8400-e29b-41d4-a716-446655440001', 'Git, Docker & Deployment', 'lesson', 'https://www.youtube.com/watch?v=RGOj5yH7evk', 'Deploy your applications to production.', 7);

-- Programming Fundamentals & DSA Topics
INSERT INTO topics (course_id, title, type, video_url, content, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Programming Basics', 'lesson', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 'Learn programming fundamentals with Python or Java.', 1),
('550e8400-e29b-41d4-a716-446655440002', 'Object-Oriented Programming', 'lesson', 'https://www.youtube.com/watch?v=BSVKUk58K6U', 'Master OOP concepts and design patterns.', 2),
('550e8400-e29b-41d4-a716-446655440002', 'DSA Essentials', 'lesson', 'https://www.youtube.com/playlist?list=PLfqMhTWNBTe15uFv4qzJot6DgP2f8Yroe', 'Learn essential data structures.', 3),
('550e8400-e29b-41d4-a716-446655440002', 'Algorithms', 'lesson', 'https://www.youtube.com/playlist?list=PLG9aCp4uE-s37tBD2IA9tDqcBv111TNRJ', 'Master algorithm design and analysis.', 4),
('550e8400-e29b-41d4-a716-446655440002', 'Problem Solving', 'lesson', 'https://www.youtube.com/watch?v=EgI5nU9etnU', 'Practice coding patterns and problem-solving.', 5);

-- AI & Machine Learning Topics
INSERT INTO topics (course_id, title, type, video_url, content, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'Math for ML', 'lesson', 'https://www.youtube.com/watch?v=aircAruvnKk', 'Learn the mathematical foundations for ML.', 1),
('550e8400-e29b-41d4-a716-446655440003', 'Machine Learning Foundations', 'lesson', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 'Master ML fundamentals with Andrew Ng.', 2),
('550e8400-e29b-41d4-a716-446655440003', 'Deep Learning', 'lesson', 'https://www.youtube.com/watch?v=VyWAvY2CF9c', 'Build neural networks and deep learning models.', 3),
('550e8400-e29b-41d4-a716-446655440003', 'Computer Vision', 'lesson', 'https://www.youtube.com/watch?v=oXlwWbU8l2o', 'Process and analyze images with OpenCV.', 4),
('550e8400-e29b-41d4-a716-446655440003', 'NLP & LLM Foundations', 'lesson', 'https://www.youtube.com/watch?v=BrN7_lLO1b8', 'Work with transformers and language models.', 5),
('550e8400-e29b-41d4-a716-446655440003', 'Modern AI Pipelines (RAG + MLOps)', 'lesson', 'https://www.youtube.com/watch?v=UkgvZRYaIiU', 'Build production AI systems with RAG and MLOps.', 6);
