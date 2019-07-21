const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const User = require('../../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

/**
 * @Route       GET api/auth
 * @desc        Get user details if Authorized or Logged in
 * @access      Private
 */
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

/**
 * @Route       POST api/auth
 * @desc        Login/Authenticate user and get Token
 * @access      Public
 */
router.post('/', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    
    try {
        // Check for already Registered User
        let user = await User.findOne({ email })

        if(!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials.' }] })
        }
        
        // Hash Password
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials.' }] })
        }
        
        const payload = {
            user: {
                id: user.id
            }
        };

        // Return jsonwebtoken
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            // Validity -> Seconds * Hours * Days
            { expiresIn: (3600 * 24 * 3) }, // Valid for 3 days
            function(err, token) {
                if(err) throw err;
                res.json({ token })
            }
        );

    } catch(err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

module.exports = router;