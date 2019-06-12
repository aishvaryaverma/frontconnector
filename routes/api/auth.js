const express = require('express');
const route = express.Router();

const auth = require('../../middleware/auth');
const User = require('../../modals/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

/**
 * @Route       GET api/auth
 * @desc        Get User if Authorized
 * @access      Public
 */
route.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.error(err);
        res.status(500).send(err.message);
    }
    // res.send(req.user)
});

/**
 * @Route       POST api/auth
 * @desc        Authenticate user and get Token
 * @access      Public
 */
route.post('/', [
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
            { expiresIn: 360000 },
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

module.exports = route;