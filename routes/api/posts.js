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

/**
 * @Route       PUT api/posts/like/id
 * @desc        Like the post
 * @access      Private
 */
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        // Check if post already liked by this user
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(404).json({ msg: 'Post already liked.' })
        }

        post.likes.unshift({ user: req.user.id })

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

/**
 * @Route       PUT api/posts/unlike/id
 * @desc        Unlike the post
 * @access      Private
 */
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log(post.likes.filter(like => like.user.toString() === req.user.id).length)
        
        // Check if post already liked by this user
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(404).json({ msg: 'Post has not yet been liked.' })
        }

        const removeIndex = post.likes.findIndex(like => like.user.toString() === req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

/**
 * @Route       POST api/posts/comment/id
 * @desc        Add a comment
 * @access      Private
 */
router.post('/comment/:id', [ auth, [
    check('text', 'Text is required.').not().isEmpty()
] ], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(404).json({ errors: errors.array() });
    }
    
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };

        post.comments.unshift(newComment);
        
        await post.save();

        res.json(post.comments);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error!');   
    }
});


/**
 * @Route       DELETE api/posts/comment/post_id/comment_id
 * @desc        Delete a comment
 * @access      Private
 */
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        const removeIndex = post.comments.findIndex(comment => comment.id === req.params.comment_id);

        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "This user is not authorized to delete comment." })
        }

        if(removeIndex < 0) {
            return res.status(404).json({ msg: 'Comment does not exits' })
        }
        
        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});

module.exports = router;