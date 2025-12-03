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
                        STREAKS: {profile.streaks || 0}
                    </div>
                    <div className="profile-items">
                        TROPHIES: {profile.trophies?.length || 0}
                    </div>
                    <div className="profile-items">
                        FRIENDS: {profile.friends?.length || 0}
                    </div>
                    <div className="profile-items">
                        PROJECTS: {profile.projects?.length || 0}
                    </div>
                </div>
            </div>

            <div id="luro-section">
                <div id="luro-header">
                    <span id="luro-title">LUROS</span>
                    <div id="luro-counter">{profile.luros?.length || 0}</div>
                </div>

                <div id="luro-grid">
                    {profile.luros?.map((luro, index) => (
                        <div key={luro.id} className="luros">
                            <img src={luro.image} alt={luro.name} />
                        </div>
                    )) || <div className="luros">No Luros yet</div>}
                </div>
            </div>
        </>
    );
}