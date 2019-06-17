const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const request = require('request');
const config = require('config');

// Data Modals
const User = require('../../modals/User');
const Profile = require('../../modals/Profile');

const { check, validationResult } = require('express-validator/check');


/**
 * @Route       GET api/profile
 * @desc        Get all profiles
 * @access      Public
 */
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error ' + err.message);
    }
});

/**
 * @Route       GET api/profile/me
 * @desc        Get current user profile
 * @access      Private
 */
router.get('/me', auth, async (req, res) => {
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
 * @desc        Add/Update user profile
 * @access      Private
 */
router.post('/', [auth, [
        check('status', 'Status is Required').not().isEmpty(),
        check('skills', 'Skills is Required').not().isEmpty()
    ]], async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Pulling data from request body
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

        // Initialize profile object
        const profileFields = {};

        // Setting user id value to profile object getting from request user
        profileFields.user = req.user.id;

        // Checking if value exist then pushing into profile object
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            // Creating array using split method
            // Taking care of string // HTML, CSS , JS, jQuery, React JS, Node Js
            // Output: ['HTML','CSS','JS','jQuery','React JS','Node JS']
            profileFields.skills = skills
                .split(',') // Converting String into array sprating with ","
                .map(skill => skill.trim()); // Triming eacy item value i.e. 'React JS ' -> 'React Js' || ' jQuery' -> 'jQuery'
        }

        // Initialize social object
        profileFields.social = {};

        // Checking if value exist then pushing into profile object
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            // Getting profile of logged-in/Request user
            let profile = await Profile.findOne({ user: req.user.id });

            // Checking if profile exist then update profile action runs
            if(profile) {
                // Update user
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id }, // Find the user based of request user
                    { $set: profileFields }, // Update/Set data to database mongoose
                    { new: true }
                )
                return res.json(profile);
            }

            // Adding profile to database
            profile = new Profile(profileFields);
            await profile.save();

            // Sending success response
            return res.json(profile);
        } catch(err) {
            console.error(err);
            res.status(400).send('Server error');
        }
    }
);

/**
 * @Route       GET api/profile/user/:user_id
 * @desc        Get profile by user id
 * @access      Public
 */
router.get('/user/:user_id', async (req, res) => {
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
 * @desc        Delete profile, user and posts
 * @access      Private
 */
router.delete('/', auth, async (req, res) => {
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
 * @desc        Add/Update profile experience
 * @access      Private
 */
router.put('/experience', [ auth, [
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

/**
 * @Route       DELETE api/profile/experience/exp_id
 * @desc        Delete experience from profile
 * @access      Private
 */
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        const removeIndex = profile.experience.findIndex(item => item.id === req.params.exp_id);

        await profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @Route       PUT api/profile/education
 * @desc        Add/Update profile education
 * @access      Private
 */
router.put('/education', [ auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
] ], async (req, res) => {

    // Check for errors and response accordingly
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newEdu);
        await profile.save();
        res.send(profile)
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @Route       DELETE api/profile/education/edu_id
 * @desc        Delete education from profile
 * @access      Private
 */
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        const removeIndex = profile.education.findIndex(item => item.id === req.params.edu_id);

        await profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @Route       GET api/profile/github/:username
 * @desc        Get user repos from Github
 * @access      Public
 */
router.get('/github/:username', auth, async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${
              req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
              'githubClientId'
            )}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
          };

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: "No Github profile found" });
            }

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;