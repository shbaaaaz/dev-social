const express = require('express')
require('dotenv').config()
const router = express.Router()
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const { validationResult, body } = require('express-validator')
const User = require('../../models/User')

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
  '/',

  [
    body('name').notEmpty(),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Please enter a valid password'),
  ],

  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() })
    }
    const { name, email, password } = req.body
    try {
      let user = await User.findOne({ email })

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] })
      }
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      })

      const salt = await bcrypt.genSalt(10)
      user = new User({ name, email, password, avatar })
      user.password = await bcrypt.hash(password, salt)
      await user.save()
      const payload = {
        user: {
          id: user.id,
        },
      }
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err
          return res.json({ token })
        }
      )
    } catch (err) {
      console.log(err)
      res.status(500).send('Server error')
    }
  }
)

module.exports = router
