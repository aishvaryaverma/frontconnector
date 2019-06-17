const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const User = require('../../modals/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

/**
 * @Route       POST api/users
 * @desc        Register user
 * @access      Public
 */
router.post('/', [
    // Checking required fields
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter min 6 characters required').isLength({ min: 6 })
], async (req, res) => {
    // Pushing validation result in errors const
    const errors = validationResult(req);

    // Checking is there is an error
    if(!errors.isEmpty()) {
        // Sending error response
        return res.status(400).json({ errors: errors.array() })
    }
    
    // Pulling data from request body
    const { name, email, password } = req.body;
    
    try {
        // Searching for user in database based on email id we got from request body
        let user = await User.findOne({ email })
        
        // Check if user is already registered
        if(user) {
            // Sending error response
            return res.status(400).json({ errors: [{ msg: 'User already exists.' }] })
        }

        // Getting user gravatar by using gravatar library
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        
        // Adding user into database using MODAL
        user = new User({
            name,
            email,
            avatar,
            password
        });

        // *************
        //ENCRYPT PASSWORD
        
        // Creating a salt for password
        const salt = await bcrypt.genSalt(10);

        // Hash Password
        user.password = await bcrypt.hash(password, salt);

        // Send and Save User to database using mongoose
        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        // Generating jsonwebtoken
        jwt.sign(
            payload, // This will container user id we got back from database // auto generated user id from mongoDB
            config.get('jwtSecret'), // This is our manual secret key
            { expiresIn: 360000 }, // Setting the exipre time value
            function(err, token) {
                if(err) throw err;
                res.json({ token })
            }
        );
    } catch(err) {
        // Sending error response
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;