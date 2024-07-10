import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = ({ username }) => {
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await axios.get(`/api/users/${username}/subreddits`);
                setSubscriptions(response.data);
            } catch (error) {
                console.error('Error fetching user subscriptions:', error);
            }
        };
        fetchSubscriptions();
    }, [username]);

    return (
        <div>
            <h2>{`${username}'s Subscriptions`}</h2>
            <ul>
                {subscriptions.map(sub => (
                    <li key={sub}>{sub}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserProfile;
