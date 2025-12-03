import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';

export default function CourseModal({ course, onClose }) {
    const [enrolled, setEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        checkEnrollment();

    }, []);



    async function checkEnrollment() {
        try {
            const data = await courseAPI.getById(course.id);
            setEnrolled(!!data.progress);
        } catch (error) {
            console.error('Failed to check enrollment:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleEnroll() {
        try {
            await courseAPI.updateProgress(course.id, course.topics?.[0]?.id);
            navigate(`/course/${course.id}`);
        } catch (error) {
            console.error('Failed to enroll:', error);
            alert('Failed to enroll. Please try again.');
        }
    }

    function handleContinue() {
        navigate(`/course/${course.id}`);
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(19, 19, 19, 0.89)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#3e3c3c95',
                    padding: '2rem',
                    borderRadius: '12px',
                    maxWidth: '500px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflow: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        style={{ width: '150px', height: '150px', objectFit: 'contain', borderRadius: '50%', background: '#f5f5dc' }}
                    />
                </div>

                <h2>{course.title}</h2>
                <p style={{ marginBottom: '1rem', opacity: 0.9 }}>{course.description}</p>

                <div style={{ marginBottom: '1.5rem' }}>
                    <strong>Difficulty:</strong> {course.difficulty}
                    <br />
                    <strong>XP Reward:</strong> {course.xp_reward} XP
                    <br />
                    <strong>Topics:</strong> {course.topics?.length || 0} modules
                </div>



                {loading ? (
                    <div>Loading...</div>
                ) : enrolled ? (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={handleContinue}
                            style={{
                                flex: 1,
                                padding: '0.8rem',
                                background: '#4CAF50',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            Continue Learning
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '0.8rem',
                                background: '#e83d3dff',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={handleEnroll}
                            style={{
                                flex: 1,
                                padding: '0.8rem',
                                background: '#2196F3',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            Enroll Now
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '0.8rem',
                                background: '#666',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            Enroll Later
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
