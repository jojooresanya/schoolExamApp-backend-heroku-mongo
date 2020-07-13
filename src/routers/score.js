const {
  Router
} = require('express')
const Score = require('../models/score')
const auth = require('../middleware/student/auth')

const router = new Router()

router.post('/score', auth, async (req, res) => {
  const score = new Score({
    ...req.body,
    student: req.student._id
  })
  try {
    await score.save()
    res.status(201).json({
      score
    })
  } catch (e) {
    res.status(400).json({
      error: e.message
    })
  }
})

module.exports = router
