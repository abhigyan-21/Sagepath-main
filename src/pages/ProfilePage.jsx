import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {
        if (profile) {
            setNewName(profile.name);
        }
    }, [profile]);

    async function loadProfile() {
        try {
            const data = await userAPI.getProfile();
            setProfile(data);
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('profile_image', file);

            const updatedProfile = await userAPI.updateProfile(formData);
            setProfile(prev => ({ ...prev, profile_image: updatedProfile.profile_image }));
        } catch (error) {
            console.error('Failed to upload image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    }

    async function handleNameSave() {
        if (!newName.trim() || newName === profile.name) {
            setIsEditingName(false);
            return;
        }

        try {
            const updatedProfile = await userAPI.updateProfile({ name: newName });
            setProfile(prev => ({ ...prev, name: updatedProfile.name }));
            setIsEditingName(false);
        } catch (error) {
            console.error('Failed to update name:', error);
            alert('Failed to update name');
        }
    }

    if (loading) return <div>Loading...</div>;
    if (!profile) return <div>Failed to load profile</div>;

    return (
        <>
            <div id="profile-container">
                <div id="profile-img-container">
                    <div id="profile-img">
                        <img src={profile.profile_image || '/images/Pixel Wizard with Flaming Staff.png'} alt="profile image" />
                        {uploading && <div className="upload-overlay">Uploading...</div>}
                    </div>
                    <label htmlFor="profile-upload" className="edit-icon-overlay" title="Change Profile Picture">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                        </svg>
                    </label>
                    <input
                        type="file"
                        id="profile-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                </div>

                <div id="profile-name-container">
                    {isEditingName ? (
                        <div className="name-edit-mode">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="name-input"
                                autoFocus
                            />
                            <button onClick={handleNameSave} className="save-btn">Save</button>
                            <button onClick={() => setIsEditingName(false)} className="cancel-btn">Cancel</button>
                        </div>
                    ) : (
                        <div className="name-display-mode">
                            <div id="profile-name">{profile.name}</div>
                            <button onClick={() => setIsEditingName(true)} className="edit-name-btn" title="Edit Name">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                <div id="profile-item-container">
                    <div className="profile-items">
                        <div className="item-label">STREAKS</div>
                        <div className="item-value">{profile.streaks || 0}</div>
                    </div>
                    <div className="profile-items">
                        <div className="item-label">TROPHIES</div>
                        <div className="item-value">{profile.trophies?.length || 0}</div>
                    </div>
                    <div className="profile-items">
                        <div className="item-label">FRIENDS</div>
                        <div className="item-value">{profile.friendsCount || 0}</div>
                    </div>
                    <div className="profile-items">
                        <div className="item-label">PROJECTS</div>
                        <div className="item-value">{profile.projectsCount || 0}</div>
                    </div>
                </div>
            </div>

            <div id="luro-section">
                <div id="luro-header">
                    <span id="luro-title">LUROS</span>
                    <div id="luro-counter">{profile.lurosCount || 0}</div>
                </div>

                <div id="luro-grid">
                    {profile.luros?.length > 0 ? (
                        profile.luros.map((luro, index) => (
                            <div key={luro.id || index} className="luro-card">
                                <div className="luro-image">
                                    <img src={luro.image} alt={luro.name} />
                                </div>
                                <div className="luro-info">
                                    <h4>{luro.name}</h4>
                                    <div className="luro-stats">
                                        <span>Lv. {luro.level}</span>
                                        <span>{luro.xp} XP</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-luros">Complete courses to earn Luros!</div>
                    )}
                </div>
            </div>
        </>
    );
}