import { useState, useEffect } from 'react';
import { courseAPI, userAPI } from '../services/api';
import CourseModal from '../components/CourseModal';
import { useNavigate } from 'react-router-dom';

function Homepage() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [activeCourseData, setActiveCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
        loadUserName();
    }, []);

    async function loadData() {
        try {
            const [coursesData, activeData] = await Promise.all([
                courseAPI.getAll(),
                userAPI.getActiveCourse()
            ]);
            setCourses(coursesData);
            setActiveCourseData(activeData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    }

    function loadUserName() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserName(user.name || 'Student');
    }

    const handleContinue = () => {
        if (activeCourseData?.course?.id) {
            navigate(`/course/${activeCourseData.course.id}`);
        }
    };

    return (
        <>
            <div className="main-container">
                {activeCourseData ? (
                    <div className="welcome-back-container">
                        <div className="welcome-left">
                            <div className="mascot-wrapper">
                                <img id="mascot-img-large" src="/Pixel Wizard with Flaming Staff.png" alt="mascot" />
                            </div>
                            <div className="welcome-text">
                                <h1>Welcome Back, <br/> <h2>{userName}</h2></h1>
                            </div>
                        </div>

                        <div className="continue-course-box">
                            <div className="course-preview">
                                <img src={activeCourseData.course.thumbnail} alt={activeCourseData.course.title} />
                                <div className="course-info-overlay">
                                    <h3>{activeCourseData.course.title}</h3>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${activeCourseData.progress.percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">{activeCourseData.progress.percentage}% Complete</span>
                                </div>
                            </div>
                            <div className="action-buttons">
                                <button className="continue-btn" onClick={handleContinue}>
                                    continue
                                </button>
                                <button className="progress-btn" onClick={() => navigate('/profile')}>
                                    progress
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <img id="mascot-img" src="/Pixel Wizard with Flaming Staff.png" alt="mascot" />
                        <span id="mascot">Welcome {userName}</span>
                        <span className="dialoguebox">Choose your Luro to begin your journey...</span>
                    </>
                )}

                <div className="luro-section-home">
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