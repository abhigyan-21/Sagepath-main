import { useState } from 'react';
import { communityAPI } from '../services/api';

export default function CreatePostModal({ isOpen, onClose, onSuccess, initialType = 'project' }) {
    const [type, setType] = useState(initialType);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await communityAPI.createPost({
                type,
                title,
                description,
                image,
                content
            });
            onSuccess();
            onClose();
            // Reset form
            setTitle('');
            setDescription('');
            setImage('');
            setContent('');
        } catch (err) {
            setError(err.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New {type === 'project' ? 'Project' : 'Post'}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label>Type</label>
                        <div className="type-toggle">
                            <button
                                type="button"
                                className={`type-btn ${type === 'project' ? 'active' : ''}`}
                                onClick={() => setType('project')}
                            >
                                Project
                            </button>
                            <button
                                type="button"
                                className={`type-btn ${type === 'post' ? 'active' : ''}`}
                                onClick={() => setType('post')}
                            >
                                Post
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            placeholder="Enter title..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            placeholder="Short description..."
                            rows="2"
                        />
                    </div>

                    <div className="form-group">
                        <label>Image (Optional)</label>
                        <div className="file-input-wrapper">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setImage(e.target.files[0])}
                                className="file-input"
                            />
                            {image && (
                                <div className="file-preview">
                                    <span>Selected: {image.name}</span>
                                    <button type="button" onClick={() => setImage('')} className="remove-file">
                                        &times;
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
