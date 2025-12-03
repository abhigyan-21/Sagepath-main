
import fetch from 'node-fetch';
import fs from 'fs';

async function checkCourses() {
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'abhigyandutta@yahoo.com', password: 'abhigyan_sage' })
        });

        let token;
        if (loginRes.ok) {
            const data = await loginRes.json();
            token = data.token;
        } else {
            console.log('Login failed');
            return;
        }

        const coursesRes = await fetch('http://localhost:5000/api/courses', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const courses = await coursesRes.json();

        const debugData = courses.map(c => ({
            title: c.title,
            topics: c.topics.map(t => ({
                title: t.title,
                video_url: t.video_url
            }))
        }));

        fs.writeFileSync('debug_output.json', JSON.stringify(debugData, null, 2));
        console.log('Debug data written to debug_output.json');

    } catch (error) {
        console.error('Error:', error);
    }
}

checkCourses();
