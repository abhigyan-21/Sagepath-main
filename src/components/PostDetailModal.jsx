import React from 'react';

export default function PostDetailModal({ isOpen, onClose, post, currentUserId, onDelete, onLike }) {
    if (!isOpen || !post) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content post-detail-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="user-info">
                        <img
                            src={post.profiles?.profile_image || '/default-avatar.png'}
                            alt={post.profiles?.name}
                            className="avatar-small"
                        />
                        <span className="username">{post.profiles?.name}</span>
                        {post.profiles?.level && <span className="user-level">Lvl {post.profiles.level}</span>}
                    </div>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="post-detail-body">
                    {post.image && (
                        <div className="full-post-image">
                            <img src={post.image} alt={post.title} />
                        </div>
                    )}

                    <h2>{post.title}</h2>
                    <p className="post-full-desc">{post.description}</p>

                    {post.content && (
                        <div className="post-extra-content">
                            {post.content}
                        </div>
                    )}

                    <div className="post-actions-bar">
                        <button className="like-btn" onClick={() => onLike(post.id)}>
                            <i className="fas fa-heart"></i> {post.likes_count || 0} Likes
                        </button>

                        {currentUserId === post.author_id && (
                            <button
                                className="delete-btn-text"
                                onClick={() => {
                                    onDelete(post.id);
                                    onClose();
                                }}
                            >
                                <i className="fas fa-trash"></i> Delete Post
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
