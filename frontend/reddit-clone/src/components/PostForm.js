import React, { useState } from 'react';
import axios from 'axios';

const PostForm = ({ subreddit }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`/api/subreddits/${subreddit}/posts/submit`, {
                title,
                content,
            });
            console.log('Post submitted:', response.data);
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    return (
        <div>
            <h2>Submit a Post to /r/{subreddit}</h2>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default PostForm;

