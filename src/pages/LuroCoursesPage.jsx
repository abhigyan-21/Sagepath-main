import { useState, useEffect } from 'react';
import { courseAPI } from '../services/api';
import LuroCard from '../components/LuroCard';

export default function LuroCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCourses();
    }, []);

    async function loadCourses() {
        try {
            const data = await courseAPI.getAll();
            setCourses(data);
        } catch (error) {
            console.error('Failed to load courses:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div>Loading courses...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Choose Your Learning Path</h1>
            <p style={{ marginBottom: '2rem' }}>Select a Luro to begin your journey</p>
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '2rem' 
            }}>
                {courses.map(course => (
                    <LuroCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
}
