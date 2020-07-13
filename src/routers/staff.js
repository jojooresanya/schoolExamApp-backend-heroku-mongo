const {
  Router
} = require('express')
const Staff = require('../models/staff')
const auth = require('../middleware/staff/auth')
const Student = require('../models/student')

const router = new Router()

router.post('/staff', async (req, res) => {
  const staff = await new Staff(req.body)
  try {
    await staff.save()
    const token = await staff.generateAuthToken()
    res.status(201).json({
      staff,
      token
    })
  } catch (e) {
    res.status(400).json({
      error: e.message
    })
  }
})

router.post('/staff/user/login', async (req, res) => {
  try {
    const staff = await Staff.findByCredentials(req.body.staffId, req.body.password)
    const token = await staff.generateAuthToken()
    res.json({
      staff,
      token
    })
  } catch (e) {
    res.status(404).json({
      error: e.message
    })
  }
})

router.get('/staff/user/logout', auth, async (req, res) => {
  try {
    req.staff.tokens = req.staff.tokens.filter(token => token.token !== req.token)
    await req.staff.save()
    res.send()
  } catch (e) {
    res.status(400).json({
      error: e.message
    })
  }
})

router.get('/staff/user/subject', auth, async (req, res) => {
  const subject = req.staff.subject
  const name = `${req.staff.firstName} ${req.staff.lastName}`
  try {
    res.json({
      name,
      subject
    })
  } catch (e) {
    res.status(400).json({
      error: e.message
    })
  }
})

router.post('/staff/user/available', auth, async (req, res) => {
  try {
    req.staff.setTest = true
    const subject = req.staff.subject
    const students = await Student.find({
      'subjects.subject': req.staff.subject
    })

    for (const student of students) {
      student.available = student.available.concat({
        subject
      })
      await student.save()
    }
    await req.staff.save()
    res.json({
      students
    })
  } catch (e) {
    res.status(400).json({
      error: e.message
    })
  }
})

router.get('/staff/user/available', auth, async (req, res) => {
  try {
    const setTest = req.staff.setTest
    res.json({
      setTest
    })
  } catch (e) {
    res.status(400).json({
      error: e.message
    })
  }
})

router.post('/staff/user/unavailable', auth, async (req, res) => {
  try {
    req.staff.setTest = false
    const subject = req.staff.subject
    const students = await Student.find({
      'subjects.subject': req.staff.subject
    })

    for (const student of students) {
      student.available = student.available.filter(available => available.subject !== subject)
      await student.save()
    }
    await req.staff.save()
    res.json({
      students
    })
  } catch (e) {
    res.status(400).json({
      error: e.message
    })
  }
})


module.exports = router