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
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter min 6 characters required').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body;
    
    try {
        // Check for already Registered User
        let user = await User.findOne({ email })

        if(user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists.' }] })
        }

        // Get User gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });

        // *************
        //ENCRYPT PASSWORD
        
        // Created Salt
        const salt = await bcrypt.genSalt(10);

        // Hash Password
        user.password = await bcrypt.hash(password, salt);

        // Send and Save User to database(mongoDB);
        await user.save()

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
        res.status(500).send('Server Error');
    }
});

module.exports = router;