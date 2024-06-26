const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const { body, validationResult } = require('express-validator')

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    )

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private

router.post(
  '/profile',
  [
    auth,
    [
      body('status').notEmpty().withMessage('Status is required'),
      body('skills are required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
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
      linkedin,
    } = req.body

    const profileFields = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim())
    }
    profileFields.social = {}
    if (youtube) profileFields.youtube = youtube
    if (twitter) profileFields.twitter = twitter
    if (facebook) profileFields.facebook = facebook
    if (linkedin) profileFields.linkedin = linkedin
    if (instagram) profileFields.instagram = instagram

    try {
      let profile = await Profile.findOne({ user: req.user.id })
      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          {
            new: true,
          }
        )
        return res.json(profile)
      }
      // Create

      profile = new Profile(profileFields)
      await profile.save()
      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

module.exports = router
