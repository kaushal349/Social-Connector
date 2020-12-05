const express = require('express');
const router = express.Router();
const config = require('config');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// @route GET /api/auth
// @desc test route
// @mode private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send('server error');
  }
});

// @route POST /api/auth
// @desc Auth and Login
// @mode public
router.post(
  '/',
  [
    // username must be an email
    check('email', 'email is required').isEmail(),
    // password must be at least 5 chars long
    check('password', 'pass is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      // see if user already exists;
      let userExist = await User.findOne({ email: email });
      if (!userExist) {
        return res
          .status(400)
          .send({ errors: [{ msg: 'Invalid Credentials!' }] });
      }
      const isMatch = await bcrypt.compare(password, userExist.password);
      if (!isMatch) {
        return res
          .status(400)
          .send({ errors: [{ msg: 'Invalid Credentials!' }] });
      }
      //  send jwtToken

      const payload = {
        user: {
          id: userExist.id,
        },
      };
      // console.log(payload);
      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 3600000000 },
        (err, token) => {
          if (err) throw err;
          return res.json({ token });
        }
      );
    } catch (err) {
      return res.status(500).send('Server error');
    }
  }
);

module.exports = router;
