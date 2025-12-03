import { useState, useEffect } from 'react';
import { communityAPI } from '../services/api';

export default function CommunityPage() {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState('project');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPosts();
    }, [filter]);

    async function loadPosts() {
        setLoading(true);
        try {
            const data = await communityAPI.getPosts(filter);
            setPosts(data);
        } catch (error) {
            console.error('Failed to load posts:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="filter-bar">
                <button 
                    className={`filter-btn ${filter === 'project' ? 'active' : ''}`}
                    onClick={() => setFilter('project')}
                >
                    Projects <i className="fas fa-chevron-down"></i>
                </button>
                <button 
                    className={`filter-btn ${filter === 'post' ? 'active' : ''}`}
                    onClick={() => setFilter('post')}
                >
                    Posts <i className="fas fa-chevron-down"></i>
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : posts.length === 0 ? (
                <div>No {filter}s yet</div>
            ) : (
                posts.map(post => (
                    <div key={post.id} className="card">
                        {post.image && <div className="card-img" style={{backgroundImage: `url(${post.image})`}}></div>}
                        <div className="card-text">
                            <h3>{post.title}</h3>
                            <p>{post.description}</p>
                            <small>by {post.profiles?.name}</small>
                        </div>
                    </div>
                ))
            )}
        </>
    );
}