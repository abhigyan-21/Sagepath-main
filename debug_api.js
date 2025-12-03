
const fetch = require('node-fetch');

async function checkCourses() {
    try {
        // Login first to get token (if needed, but courses might be public or we can check public routes)
        // Looking at routes/courses.js, it uses 'authenticate' middleware.
        // So we need to login.

        // Let's try to login with a test user or register one.
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
        });

        let token;
        if (loginRes.ok) {
            const data = await loginRes.json();
            token = data.token;
        } else {
            // Try registering if login fails
            const regRes = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'password123' })
            });
            const data = await regRes.json();
            token = data.token;
        }

        if (!token) {
            console.error('Failed to get token');
            return;
        }

        const coursesRes = await fetch('http://localhost:5000/api/courses', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const courses = await coursesRes.json();
        console.log('Courses found:', courses.length);

        courses.forEach(course => {
            console.log(`Course: ${course.title} (${course.id})`);
            course.topics.forEach(topic => {
                console.log(`  Topic: ${topic.title}`);
                console.log(`  Video URL: ${topic.video_url}`);
            });
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

checkCourses();
