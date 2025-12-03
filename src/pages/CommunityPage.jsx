import { useState, useEffect } from 'react';
import { communityAPI } from '../services/api';
import CreatePostModal from '../components/CreatePostModal';
import PostDetailModal from '../components/PostDetailModal';

export default function CommunityPage() {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState('project');
    const [sort, setSort] = useState('newest');
    const [scope, setScope] = useState('others'); // 'others' (All) or 'mine' (My)
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) setCurrentUserId(user.id);
        loadPosts();
    }, [filter, sort, scope]);

    async function loadPosts() {
        setLoading(true);
        try {
            const data = await communityAPI.getPosts(filter, sort, scope);
            const formattedData = data.map(post => ({
                ...post,
                likes_count: post.likes?.[0]?.count || 0,
                comments_count: post.comments?.[0]?.count || 0
            }));
            setPosts(formattedData);
        } catch (error) {
            console.error('Failed to load posts:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleLike = async (postId) => {
        try {
            const { likes, action } = await communityAPI.likePost(postId);
            setPosts(posts.map(p => {
                if (p.id === postId) {
                    return { ...p, likes_count: likes };
                }
                return p;
            }));

            // Update selected post if open
            if (selectedPost && selectedPost.id === postId) {
                setSelectedPost(prev => ({ ...prev, likes_count: likes }));
            }
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await communityAPI.deletePost(postId);
            setPosts(posts.filter(p => p.id !== postId));
            if (selectedPost?.id === postId) setSelectedPost(null);
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('Failed to delete post');
        }
    };

    return (
        <div className="community-page">
            <div className="community-header">
                <div className="toggles-container" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {/* Project/Post Toggle */}
                    <div className="filter-pill">
                        <div className={`pill-background ${filter === 'post' ? 'slide-right' : ''}`}></div>
                        <button
                            className={`pill-option ${filter === 'project' ? 'active' : ''}`}
                            onClick={() => setFilter('project')}
                        >
                            Projects
                        </button>
                        <button
                            className={`pill-option ${filter === 'post' ? 'active' : ''}`}
                            onClick={() => setFilter('post')}
                        >
                            Posts
                        </button>
                    </div>

                    {/* All/My Toggle */}
                    <div className="filter-pill">
                        <div className={`pill-background ${scope === 'mine' ? 'slide-right' : ''}`}></div>
                        <button
                            className={`pill-option ${scope === 'others' ? 'active' : ''}`}
                            onClick={() => setScope('others')}
                        >
                            All
                        </button>
                        <button
                            className={`pill-option ${scope === 'mine' ? 'active' : ''}`}
                            onClick={() => setScope('mine')}
                        >
                            My
                        </button>
                    </div>
                </div>

                <div className="sort-bar">
                    <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
                        <option value="newest">Newest</option>
                        <option value="earliest">Earliest</option>
                        <option value="most_liked">Most Liked</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : posts.length === 0 ? (
                <div className="empty-state">No {filter}s yet. Be the first to create one!</div>
            ) : (
                <div className="posts-grid">
                    {posts.map(post => (
                        <div
                            key={post.id}
                            className="post-card"
                            onClick={() => setSelectedPost(post)}
                            style={{ cursor: 'pointer' }}
                        >
                            {post.image && (
                                <div className="post-image" style={{ backgroundImage: `url(${post.image})` }}></div>
                            )}
                            <div className="post-content">
                                <div className="post-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3>{post.title}</h3>
                                    {currentUserId === post.author_id && (
                                        <button
                                            className="delete-btn"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                                            title="Delete Post"
                                            style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '5px' }}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    )}
                                </div>
                                <p className="post-desc">
                                    {post.description && post.description.length > 100
                                        ? `${post.description.substring(0, 100)}...`
                                        : post.description}
                                </p>
                                {post.description && post.description.length > 100 && (
                                    <span className="read-more">Read more...</span>
                                )}
                                <div className="post-meta">
                                    <span className="author">
                                        <img src={post.profiles?.profile_image || '/default-avatar.png'} alt={post.profiles?.name} className="avatar-small" />
                                        {post.profiles?.name}
                                    </span>
                                    <button
                                        className="like-btn"
                                        onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                                    >
                                        <i className="fas fa-heart"></i> {post.likes_count || 0}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button className="fab-btn" onClick={() => setIsModalOpen(true)}>
                <i className="fas fa-plus"></i>
            </button>

            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadPosts}
                initialType={filter}
            />

            <PostDetailModal
                isOpen={!!selectedPost}
                onClose={() => setSelectedPost(null)}
                post={selectedPost}
                currentUserId={currentUserId}
                onDelete={handleDelete}
                onLike={handleLike}
            />
        </div>
    );
}