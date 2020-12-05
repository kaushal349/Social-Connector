const express = require('express');
const Profile = require('../models/Profile');
const User = require('../models/User');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
// @route GET /api/profile/me
// @desc returns current user pofile
// @mode private
router.get('/me', auth, async (req, res) => {
  try {
    const userprofile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!userprofile) {
      return res.status(400).send('user not found');
    }
    return res.json(userprofile);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error');
  }
});

// @route POST /api/profile
// @desc creates or update user profile
// @mode private
router.post(
  '/',
  [
    auth,
    [
      check('skills', 'skills are required').not().notEmpty(),
      check('status', 'status is required').not().notEmpty(),
    ],
  ],
  async (req, res) => {
    console.log(req.user);
    console.log('printed');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      profileobject = {};
      const {
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram,
      } = req.body;
      if (company) {
        profileobject.company = company;
      }
      if (website) {
        profileobject.website = website;
      }
      if (location) {
        profileobject.location = location;
      }
      if (status) {
        profileobject.status = status;
      }
      if (skills) {
        const skillsarray = skills.split(',').map((skill) => skill.trim());
        profileobject.skills = skillsarray;
      }
      if (bio) {
        profileobject.bio = bio;
      }
      if (githubusername) {
        profileobject.githubusername = githubusername;
      }
      profileobject.social = {};
      if (youtube) {
        profileobject.social.youtube = youtube;
      }
      if (facebook) {
        profileobject.social.facebook = facebook;
      }
      if (linkedin) {
        profileobject.social.linkedin = linkedin;
      }
      if (instagram) {
        profileobject.social.instagram = instagram;
      }
      if (twitter) {
        profileobject.social.twitter = twitter;
      }
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // update the profile and return updated data
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileobject },
          { new: true }
        );
        console.log(profile.user);
        return res.json(profile);
      }
      // profile doesn't exits create one
      profileobject.user = req.user.id;
      profile = new Profile(profileobject);
      await profile.save();
      console.log(profile);
      return res.json(profile);
    } catch (error) {
      console.log(error);
      return res.status(500).send('server error');
    }
  }
);

// @route GET /api/profile
// @desc returns all profiles
// @mode public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user');
    return res.json(profiles);
  } catch (error) {
    console.log(error);
    return res.status(500).send('server erorr');
  }
});

// @route POST /api/profile/user/:user_id
// @desc returns user_id from user
// @mode public
router.get('/user/:user_id', async (req, res) => {
  try {
    const userprofile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!userprofile) {
      return res.status(400).send('profile not found');
    }
    return res.json(userprofile);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error');
  }
});

// @route DELETE /api/profile
// @desc deletes user
// @mode private
router.delete('/', auth, async (req, res) => {
  try {
    // @To-DO delete posts
    // delete profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // delete user
    await User.findOneAndRemove({ _id: req.user.id });
    return res.json({ msg: 'user deleted' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error');
  }
});

// @route PUT /api/profile/experience
// @desc adds experience
// @mode private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'title is required').not().isEmpty(),
      check('company', 'company is required').not().isEmpty(),
      check('from', 'from is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;
    const newexp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    newexp.from = new Date(from);
    if (to) {
      newexp.to = new Date(to);
    }
    try {
      let userprofile = await Profile.findOne({ user: req.user.id });
      userprofile.experience.unshift(newexp);
      await userprofile.save();
      return res.json(userprofile);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('server error');
    }
  }
);

// @route DELETE /api/profile/experience/:exp_id
// @desc deletes experience
// @mode private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    let userprofile = await Profile.findOne({ user: req.user.id });
    const removeat = userprofile.experience
      .map((exp) => exp.id)
      .indexOf(req.params.exp_id);
    userprofile.experience.splice(removeat, 1);
    await userprofile.save();
    return res.json(userprofile);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error');
  }
});

// @route PUT /api/profile/education
// @desc adds education
// @mode private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'school is required').not().isEmpty(),
      check('degree', 'degree is required').not().isEmpty(),
      check('typeofstudy', 'typeofstudy is required').not().isEmpty(),
      check('from', 'from is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      typeofstudy,
      from,
      to,
      current,
      description,
    } = req.body;
    const newed = {
      school,
      degree,
      typeofstudy,
      from,
      to,
      current,
      description,
    };
    newed.from = new Date(from);
    if (to) {
      newed.to = new Date(to);
    }
    try {
      let userprofile = await Profile.findOne({ user: req.user.id });
      userprofile.education.unshift(newed);
      await userprofile.save();
      return res.json(userprofile);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('server error');
    }
  }
);

// @route DELETE /api/profile/experience/:exp_id
// @desc deletes experience
// @mode private
router.delete('/education/:ed_id', auth, async (req, res) => {
  try {
    let userprofile = await Profile.findOne({ user: req.user.id });
    const removeat = userprofile.education
      .map((ed) => ed.id)
      .indexOf(req.params.ed_id);
    userprofile.education.splice(removeat, 1);
    await userprofile.save();
    return res.json(userprofile);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error');
  }
});

module.exports = router;
