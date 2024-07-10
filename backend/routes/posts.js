const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.post('/posts', async (req, res) => {
    try {
        const { title, content, author } = req.body;

        const newPost = new Post({ title, content, author });
        await newPost.save();

        res.status(201).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
