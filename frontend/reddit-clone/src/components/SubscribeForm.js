import React, { useState } from 'react';
import axios from 'axios';

const SubscribeForm = ({ userId }) => {
    const [subredditId, setSubredditId] = useState('');

    const handleSubscribe = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/api/users/${userId}/subscribe`, {
                subredditId,
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error subscribing:', error);
        }
    };

    return (
        <div>
            <h2>Subscribe to Subreddit</h2>
            <input
                type="text"
                placeholder="Enter subreddit ID"
                value={subredditId}
                onChange={(e) => setSubredditId(e.target.value)}
            />
            <button onClick={handleSubscribe}>Subscribe</button>
        </div>
    );
};

export default SubscribeForm;

