const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/auth');

// Modals
const User = require('../../modals/User');
const Profile = require('../../modals/Profile');
const Post = require('../../modals/Post');

/**
 * @Route       POST api/posts
 * @desc        Create a post
 * @access      Private
 */
router.post('/', [ auth, [
    check('text', 'Text is required.').not().isEmpty()
] ], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(404).json({ errors: errors.array() });
    }
    
    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };
        const post = new Post(newPost);
        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error!');   
    }
});

/**
 * @Route       GET api/posts
 * @desc        Get all posts
 * @access      Private
 */
router.get('/', auth, async (req, res) => {
    try {
        const post = await Post.find().sort({ data: -1 });
        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error!');
    }
});

/**
 * @Route       GET api/posts/id
 * @desc        Get post by ID
 * @access      Private
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({ msg: "Post not found!" });
        }

        res.json(post);
    } catch (err) {
        console.error(err);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found!" });
        }
        res.status(500).send('Server error!');
    }
});

/**
 * @Route       DELETE api/posts/id
 * @desc        Delete post by ID
 * @access      Private
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({ msg: "Post not found!" });
        }

        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" })
        }
        
        await post.remove();

        return res.status(200).json({ msg: "Post removed" });

    } catch (err) {
        console.error(err);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found!" });
        }
        res.status(500).send('Server error!');
    }
});

module.exports = router;