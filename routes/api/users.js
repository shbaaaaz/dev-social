const express = require('express')
const router = express.Router()
const { validationResult, body } = require('express-validator')
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

  (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) return res.send(`Hello ${req.body.name}`)
    res.status(400).send({ errors: errors.array() })
  }
)

module.exports = router
