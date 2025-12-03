import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseModal from './CourseModal';

export default function LuroCard({ course }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div 
                className="luro-card"
                onClick={() => setShowModal(true)}
                style={{
                    cursor: 'pointer',
                    border: '2px solid #333',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    background: 'var(--card-bg, #1a1a1a)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <div style={{ marginBottom: '1rem' }}>
                    <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                    />
                </div>
                <h3>{course.title}</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    {course.description?.substring(0, 80)}...
                </p>
                <div style={{ marginTop: '1rem' }}>
                    <span style={{ 
                        padding: '0.3rem 0.8rem', 
                        background: '#333', 
                        borderRadius: '20px',
                        fontSize: '0.8rem'
                    }}>
                        {course.difficulty}
                    </span>
                </div>
            </div>

            {showModal && (
                <CourseModal 
                    course={course} 
                    onClose={() => setShowModal(false)} 
                />
            )}
        </>
    );
}
