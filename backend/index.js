const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoURI = 'mongodb+srv://yunggshampy:QFnpJquHdndwyExi@cluster0.hgkkqpp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    subscribedSubreddits: [String],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
}));

const Subreddit = mongoose.model('Subreddit', new mongoose.Schema({
    name: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
}));

const Post = mongoose.model('Post', new mongoose.Schema({
    title: String,
    content: String,
    subreddit: { type: mongoose.Schema.Types.ObjectId, ref: 'Subreddit' },
    upvotes: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}));

const Comment = mongoose.model('Comment', new mongoose.Schema({
    content: String,
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}));

app.get('/api/subreddits/:subreddit/posts', async (req, res) => {
    const posts = await Post.find({ subreddit: req.params.subreddit }).sort({ createdAt: -1 });
    res.send(posts);
});

app.post('/api/subreddits/:subreddit/posts', async (req, res) => {
    const subreddit = await Subreddit.findOne({ name: req.params.subreddit });
    if (!subreddit) return res.status(404).send('Subreddit not found');
    const post = new Post({ ...req.body, subreddit: subreddit._id });
    await post.save();
    subreddit.posts.push(post);
    await subreddit.save();
    res.send(post);
});

app.post('/api/posts/submit', async (req, res) => {
    try {
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
        });

        await post.save();

        res.status(201).send(post);
    } catch (error) {
        console.error('Error submitting post:', error);
        res.status(500).send('Server Error');
    }
});

app.post('/api/users/:username/subscriptions/:subreddit', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).send('User not found');

        if (user.subscribedSubreddits.includes(req.params.subreddit)) {
            return res.status(400).send('User already subscribed to this subreddit');
        }

        user.subscribedSubreddits.push(req.params.subreddit);
        await user.save();
        res.send('Subscribed successfully');
    } catch (err) {
        console.error('Error subscribing user:', err);
        res.status(500).send('Server Error');
    }
});

app.post('/api/users/:username/upvotes/:post_id', async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).send('User not found');
    const post = await Post.findById(req.params.post_id);
    if (!post) return res.status(404).send('Post not found');
    if (!user.upvotes.includes(post._id)) {
        user.upvotes.push(post._id);
        post.upvotes++;
        await user.save();
        await post.save();
    }
    res.send(post);
});

app.post('/api/posts/:post_id/upvote', async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) return res.status(404).send('Post not found');

        if (post.upvotes.includes(req.user.id)) {
            return res.status(400).send('You have already upvoted this post');
        }

        post.upvotes.push(req.user.id);
        post.upvotesCount++;
        await post.save();

        res.send('Post upvoted successfully');
    } catch (err) {
        console.error('Error upvoting post:', err);
        res.status(500).send('Server Error');
    }
});

app.post('/api/posts/:post_id/comments', async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) return res.status(404).send('Post not found');

        const comment = new Comment({
            content: req.body.content,
            user: req.user.id,
            post: post._id,
        });
        await comment.save();

        post.comments.push(comment);
        await post.save();

        res.json(comment);
    } catch (err) {
        console.error('Error submitting comment:', err);
        res.status(500).send('Server Error');
    }
});

app.get('/api/users/:username/subreddits', async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    res.send(user ? user.subscribedSubreddits : []);
});

app.get('/api/users/:username/upvotes', async (req, res) => {
    const user = await User.findOne({ username: req.params.username }).populate('upvotes');
    res.send(user ? user.upvotes : []);
});

app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.send(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/api/users/:username/subreddits', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        res.json(user.subscribedSubreddits);
    } catch (err) {
        console.error('Error fetching user subscriptions:', err);
        res.status(500).send('Server Error');
    }
});

app.get('/api/users/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
                                 .populate('upvotes');
        if (!user) return res.status(404).send('User not found');

        res.json({
            subscribedSubreddits: user.subscribedSubreddits,
            upvotes: user.upvotes,
        });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).send('Server Error');
    }
});

app.get('/api/subreddits/:subreddit/posts', async (req, res) => {
    try {
        const posts = await Post.find({ subreddit: req.params.subreddit })
                                 .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).send('Server Error');
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

