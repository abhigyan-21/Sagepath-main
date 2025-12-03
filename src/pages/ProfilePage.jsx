import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

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

    if (loading) return <div>Loading...</div>;
    if (!profile) return <div>Failed to load profile</div>;

    return (
        <>
            <div id="profile-container">
                <div id="profile-img">
                    <img src={profile.profile_image || '/images/Pixel Wizard with Flaming Staff.png'} alt="profile image" />
                </div>
                <div id="profile-name">{profile.name}</div>

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