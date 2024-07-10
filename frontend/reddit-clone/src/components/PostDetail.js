import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostDetail = ({ postId }) => {
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/posts/${postId}`);
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };
        fetchPost();
    }, [postId]);

    const handleUpvote = async () => {
        try {
            await axios.post(`/api/posts/${postId}/upvote`);
        } catch (error) {
            console.error('Error upvoting post:', error);
        }
    };

    const handleSubmitComment = async () => {
        try {
            await axios.post(`/api/posts/${postId}/comments`, { content: comment });
            setComment('');
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    if (!post) return <div>Loading post...</div>;

    return (
        <div>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button onClick={handleUpvote}>Upvote</button>
            <div>
                <h3>Comments</h3>
                {post.comments.map(comment => (
                    <div key={comment._id}>
                        <p>{comment.content}</p>
                    </div>
                ))}
                <input
                    type="text"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button onClick={handleSubmitComment}>Submit</button>
            </div>
        </div>
    );
};

export default PostDetail;