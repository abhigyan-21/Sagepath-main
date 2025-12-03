import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courseAPI, userAPI } from '../services/api';

export default function CoursePage() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [progress, setProgress] = useState(null);
    const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCourse();
        fetchUserProfile();
    }, [courseId]);

    async function fetchUserProfile() {
        try {
            const data = await userAPI.getProfile();
            setUserProfile(data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    }

    async function loadCourse() {
        try {
            const data = await courseAPI.getById(courseId);
            setCourse(data.course);
            setProgress(data.progress);

            if (data.progress?.current_topic_id) {
                const index = data.course.topics.findIndex(t => t.id === data.progress.current_topic_id);
                setCurrentTopicIndex(index >= 0 ? index : 0);
            }
        } catch (error) {
            console.error('Failed to load course:', error);
        } finally {
            setLoading(false);
        }
    }

    function getYouTubeEmbedUrl(url) {
        try {
            // Handle already embed format
            if (url.includes('/embed/')) {
                return url;
            }

            const urlObj = new URL(url);
            let videoId = '';

            // Handle youtu.be
            if (urlObj.hostname === 'youtu.be') {
                videoId = urlObj.pathname.slice(1);
            }
            // Handle youtube.com
            else if (urlObj.hostname.includes('youtube.com')) {
                if (urlObj.pathname === '/watch') {
                    videoId = urlObj.searchParams.get('v');
                } else if (urlObj.pathname.startsWith('/embed/')) {
                    videoId = urlObj.pathname.split('/')[2];
                }
            }

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&loop=1&playlist=${videoId}&iv_load_policy=3`;
            }

            // Fallback for playlist or other formats if needed
            if (url.includes('playlist?list=')) {
                const playlistId = url.split('playlist?list=')[1].split('&')[0];
                return `https://www.youtube.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1&iv_load_policy=3`;
            }

            return url;
        } catch (error) {
            console.error('Error parsing YouTube URL:', error);
            return url;
        }
    }

    async function handleTopicComplete(topic) {
        try {
            const targetTopic = topic || course.topics[currentTopicIndex];
            await courseAPI.updateProgress(courseId, targetTopic.id);

            // Check if we just completed the current topic to auto-advance
            // Only auto-advance if we are on the topic that was just completed and it wasn't already complete
            if (!topic || topic.id === course.topics[currentTopicIndex].id) {
                const wasCompleted = progress?.completed_topics?.some(ct => ct.topic_id === targetTopic.id);
                if (!wasCompleted && currentTopicIndex < course.topics.length - 1) {
                    setCurrentTopicIndex(currentTopicIndex + 1);
                }
            }

            await loadCourse();
            // Refresh profile to update XP
            await fetchUserProfile();
        } catch (error) {
            console.error('Failed to update progress:', error);
        }
    }

    if (loading) return <div>Loading course...</div>;
    if (!course) return <div>Course not found</div>;

    const currentTopic = course.topics[currentTopicIndex];
    const completedCount = progress?.completed_topics?.length || 0;
    const progressPercent = (completedCount / course.topics.length) * 100;

    return (
        <>
            {/* progress bar */}
            <div id="progress-container">
                <button
                    className="progress-control"
                    aria-label="Previous"
                    onClick={() => setCurrentTopicIndex(Math.max(0, currentTopicIndex - 1))}
                    disabled={currentTopicIndex === 0}
                >
                    &#8249;
                </button>

                <div id="progress-bar">
                    {course.topics.map((topic, index) => (
                        <div
                            key={topic.id}
                            className={`progress-item ${progress?.completed_topics?.some(ct => ct.topic_id === topic.id) ? 'completed' :
                                index === currentTopicIndex ? 'current' : ''
                                }`}
                            onClick={() => setCurrentTopicIndex(index)}
                            style={{ cursor: 'pointer' }}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>

                <button
                    className="progress-control"
                    aria-label="Next"
                    onClick={() => setCurrentTopicIndex(Math.min(course.topics.length - 1, currentTopicIndex + 1))}
                    disabled={currentTopicIndex === course.topics.length - 1}
                >
                    &#8250;
                </button>
            </div>

            {/* <!-- Course Content --> */}
            <div className="content-grid">

                {/* <!-- Left column (video + doubts panel) --> */}
                <div className="course-container">

                    <div id="course-video-panel">
                        <h2>{currentTopic.title}</h2>
                        {currentTopic.video_url && (
                            <div className="video-responsive-wrapper">
                                <iframe
                                    className="video-responsive-iframe"
                                    src={getYouTubeEmbedUrl(currentTopic.video_url)}
                                    title={currentTopic.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                    </div>

                    <div id="Doubts-panel">
                        <div id="doubt-mascot-imgcontainer">
                            <img id="doubt-mascot-img" src="/Pixel Wizard with Flaming Staff.png" alt="mascot"></img>
                        </div>
                        <div className="doubts-content">
                            <h2>Doubts Panel</h2>
                            <p>Have questions? Ask here!</p>
                            <form className="doubts-form" onSubmit={(e) => e.preventDefault()}>
                                <input type="text" placeholder="Type your question..." />
                                <button type="submit">Ask</button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* <!-- Right column (sidebar) --> */}
                <aside className="course-sidebar">

                    <div className="stats-card">
                        <div id="luro-img-container">
                            <img id="luro-img" src="/Pixel Art Otter Creature.png" alt="luro image"></img>
                        </div>
                        <div className="stats-info">
                            <h3>Otter</h3>
                            <p>Level {userProfile?.level || 1}</p>
                            <p>XP: {userProfile?.xp || 0}</p>
                        </div>
                    </div>

                    <div className="topics-list">
                        <h3>Course Topics</h3>
                        {course.topics.map((topic, index) => {
                            const isCompleted = progress?.completed_topics?.some(ct => ct.topic_id === topic.id);
                            return (
                                <div
                                    key={topic.id}
                                    className={`topic-item ${index === currentTopicIndex ? 'highlight' : ''} topic-item-content`}
                                >
                                    <span
                                        onClick={() => setCurrentTopicIndex(index)}
                                        className="topic-title"
                                    >
                                        {topic.title}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTopicComplete(topic);
                                        }}
                                        className={`topic-complete-btn ${isCompleted ? 'completed' : ''}`}
                                    >
                                        {isCompleted ? 'Completed' : 'Mark'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </aside>
            </div>

        </>
    )
}