const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route /api/user
// desc test route
// mode public
router.post(
  '/',
  [
    // username must be an email
    check('name', 'name is required').not().notEmpty(),
    check('email', 'email is required').isEmail(),
    // password must be at least 5 chars long
    check('password', 'pass should be of min 5 chars').isLength({ min: 5 }),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, email, password } = req.body;
      // see if user already exists
      let userExist = await User.findOne({ email: email });
      if (userExist) {
        return res
          .status(400)
          .send({ errors: [{ msg: 'user already exists' }] });
      }
      // create avatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });
      // create user
      let user = new User({
        name,
        email,
        password,
        avatar,
      });
      //   encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      //   save the user
      await user.save();
      //   send jwtToken
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000000 },
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
