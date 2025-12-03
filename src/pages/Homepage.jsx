import { useState, useEffect } from 'react';
import { courseAPI } from '../services/api';
import CourseModal from '../components/CourseModal';

function Homepage() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        loadCourses();
        loadUserName();
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

    function loadUserName() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserName(user.name || 'Student');
    }

    return (
        <>
            <div className="main-container">
                <img id="mascot-img" src="/Pixel Wizard with Flaming Staff.png" alt="mascot" />
                <span id="mascot">Welcome {userName}</span>
                <span className="dialoguebox">Choose your Luro to begin your journey...</span>

                <div className="luro">
                    {loading ? (
                        <div>Loading courses...</div>
                    ) : courses.length === 0 ? (
                        <div>No courses available..</div>
                    ) : (
                        courses.map((course) => (
                            <div
                                key={course.id}
                                className="luro-item"
                                onClick={() => setSelectedCourse(course)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {selectedCourse && (
                <CourseModal
                    course={selectedCourse}
                    onClose={() => setSelectedCourse(null)}
                />
            )}
        </>
    );
}

export default Homepage;