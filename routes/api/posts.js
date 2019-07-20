const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/auth');

// Modals
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

/**
 * @Route       POST api/posts
 * @desc        Create a post
 * @access      Private
 */
router.post('/', [ auth, [
    // checking for required feild
    check('text', 'Text is required.').not().isEmpty()
] ], async (req, res) => {
    // Checking if any error and pushing to errors const
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(404).json({ errors: errors.array() });
    }

    try {
        // Getting user from database with user id in token
        const user = await User.findById(req.user.id).select('-password');

        // Create a new post data to add into database
        const newPost = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };

        // Adding data to database using mongoose
        const post = new Post(newPost);
        await post.save();

        // Sending back response with post which we just added into database
        res.json(post);
    } catch (err) {
        // Sending error response if anything goes wrong
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
        // Pulling all from from database using mongoose
        const post = await Post.find().sort({ data: -1 });

        // Sending response with all post found in database post table
        res.json(post);
    } catch (err) {
        // Sending error response if anything goes wrong
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
        // Get a single post with help of ID parameter from database using mongoose
        const post = await Post.findById(req.params.id);

        // Checking if there is no post found with "id" passed in URL
        if(!post) {
            // Sending error response with msg
            return res.status(404).json({ msg: "Post not found!" });
        }

        // If post found then sending post in response
        res.json(post);

    } catch (err) {
        // Sending error response if anything goes wrong
        console.error(err);

        // Checking error kind (kind method is available from mongoose)
        if(err.kind === 'ObjectId') {
            // Sending conditional response with msg
            return res.status(404).json({ msg: "Post not found!" });
        }

        // Sending error response
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
        // Get a single post with help of ID parameter from database using mongoose
        const post = await Post.findById(req.params.id);

        // Checking if there is no post found with "id" passed in URL
        if(!post) {
            // Sending error response with msg
            return res.status(404).json({ msg: "Post not found!" });
        }

        // Checking by post owner/user and delete request user if same
        // The user who has this post only he can delete the post not any other one
        if(post.user.toString() !== req.user.id) {
            // Sending response with error msg
            return res.status(401).json({ msg: "User not authorized" })
        }
        
        // Deleting post from database mongoose
        await post.remove();

        // Sending status and Success response msg
        return res.status(200).json({ msg: "Post removed" });

    } catch (err) {
        // Sending error response if anything goes wrong
        console.error(err);

        // Checking error kind (kind method is available from mongoose)
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found!" });
        }

        // Sending error response
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
        // Getting single post by ID passed in URL from database mongoose
        const post = await Post.findById(req.params.id);
        
        // Check if post already liked by this/current/logged-in user
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(404).json({ msg: 'Post already liked.' })
        }

        // Adding data to database
        // Using unshift on likes as likes are array in database
        // With help unshift we can add data at begin of array (normal javascript unshift array method)
        post.likes.unshift({ user: req.user.id })
        await post.save();

        // Sending response with likes data
        res.json(post.likes);
    } catch (err) {
        // Sending error response
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
        // Getting single post by ID passed in URL from database mongoose
        const post = await Post.findById(req.params.id);
        
        // Check if post not liked by this/current/logged-in user
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(404).json({ msg: 'Post has not yet been liked.' })
        }

        // Getting index of post as likes type is array in database
        const removeIndex = post.likes.findIndex(like => like.user.toString() === req.user.id);

        // Removing post found already liked
        post.likes.splice(removeIndex, 1);
        await post.save();

        // Sending success reponse
        res.json(post.likes);
    } catch (err) {
        // Sending error response
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
    // Checking if required feild are not empty
    check('text', 'Text is required.').not().isEmpty()
] ], async (req, res) => {
    // Adding validation result to errors
    const errors = validationResult(req);

    // Checking for errors found and sending error response
    if(!errors.isEmpty()) {
        res.status(404).json({ errors: errors.array() });
    }
    
    try {
        // Getting user from database based on user that logged in
        const user = await User.findById(req.user.id).select('-password');

        // Getting post from database based on ID passed in URL
        const post = await Post.findById(req.params.id);

        // Creating new comment data
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };

        // Adding data to database with mongoose
        post.comments.unshift(newComment);
        await post.save();

        // Sending success response
        res.json(post.comments);

    } catch (err) {
        // Sending error response
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
        // Getting single post by ID passed in URL from database mongoose
        const post = await Post.findById(req.params.post_id);

        // Find the index of comment in posts.comments array based on comment id passed in URL
        const removeIndex = post.comments.findIndex(comment => comment.id === req.params.comment_id);

        // Check is request user is authrized to do this action
        // Checking the request user with the user which we have in post(got from database)
        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "This user is not authorized to delete comment." })
        }

        // Checking if the post exits in database
        if(removeIndex < 0) {
            return res.status(404).json({ msg: 'Comment does not exits' })
        }
        
        // Removing post from database
        post.comments.splice(removeIndex, 1);
        await post.save();

        // Sending success responsve
        res.json(post.comments);
    } catch (err) {
        // Sending error responsve
        console.error(err);
        res.status(500).send('Server error.');
    }
});

module.exports = router;