const express = require('express');
const route = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../modals/Profile');
const User = require('../../modals/User');

const { check, validationResult } = require('express-validator/check');

/**
 * @Route       GET api/profile/me
 * @desc        Get current user profile
 * @access      Private
 */
route.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        if(!profile) {
            res.status(400).json({ msg: 'There is no profile for this user' })
        }
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error ' + err.message);
    }
});

/**
 * @Route       POST api/profile
 * @desc        Add and Update the User Profile
 * @access      Private
 */
route.post('/', [auth, [
        check('status', 'Status is Required').not().isEmpty(),
        check('skills', 'Skills is Required').not().isEmpty()
    ]], async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        // Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        // Build social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id });

            if(profile) {
                // Update User
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                )
                return res.json(profile);
            }

            // Create Profile
            profile = new Profile(profileFields);
            await profile.save();
            return res.json(profile);
        } catch(err) {
            console.error(err);
            res.status(400).send('Server error');
        }
    }
);


/**
 * @Route       GET api/profile/
 * @desc        Get all profiles
 * @access      Public
 */
route.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error ' + err.message);
    }
});

/**
 * @Route       GET api/profile/user/:user_id
 * @desc        Get profile by user ID
 * @access      Public
 */
route.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if(!profile) return res.status(400).json({ msg: 'Profile Not Found.' });

        res.json(profile);
    } catch(err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') return res.status(400).json({ msg: 'Profile Not Found.' });
        res.status(500).send('Server error ' + err.message);
    }
});

/**
 * @Route       DELETE api/profile
 * @desc        Delete Profile, User and Posts
 * @access      Private
 */
route.delete('/', auth, async (req, res) => {
    try {
        // @TODO - Delte Post

        // Delete Profile
        await Profile.findOneAndDelete({ user: req.user.id });

        // Delete User
        await User.findOneAndDelete({ _id: req.user.id });
        
        res.json({ msg: "Deleted Scussessfully!" });
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @Route       PUT api/profile/experience
 * @desc        Delete Profile, User and Posts
 * @access      Private
 */
route.put('/experience', [ auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
] ], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(newExp);
        await profile.save();
        res.send(profile)

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = route;