const fs = require('fs')
const path = require('path')
const {
  Router
} = require('express')
const Student = require('../models/student')
const auth = require('../middleware/student/auth')

const router = new Router()

router.post('/student', async (req, res) => {
  const student = new Student(req.body)

  try {
    await student.save()
    const token = await student.generateAuthToken()
    res.status(201).json({
      student,
      token
    })
  } catch (e) {
    res.status(400).json({
      error: e.message
    })
  }
})

router.post('/student/user/login', async (req, res) => {
  try {
    const student = await Student.findByCredentials(req.body.studentId, req.body.password)
    const token = await student.generateAuthToken()
    res.json({
      student,
      token
    })
  } catch (e) {
    res.status(404).json({
      error: e.message
    })
  }
})

router.get('/student/user/logout', auth, async (req, res) => {
  try {
    req.student.tokens = req.student.tokens.filter(token => token.token !== req.token)
    await req.student.save()
    res.json({})
  } catch (e) {
    res.status(400).json({
      error: e.message
    })
  }
})

router.post('/student/user/courses', auth, async (req, res) => {
  try {
    const student = await Student.updateOne({
      _id: req.student._id
    }, {
      department: req.body.department
    })
    req.body.subjects.forEach(subject => req.student.subjects = req.student.subjects.concat({
      subject
    }))
    await req.student.save()
    res.json({
      student
    })
  } catch (e) {
    res.status(400).json({
      error: e.message
    })
  }
})

router.get('/student/user/courses', auth, async (req, res) => {
  const subjects = req.student.subjects
  const name = `${req.student.firstName} ${req.student.lastName}`
  try {
    res.json({
      name,
      subjects
    })
  } catch (e) {
    res.status(400).json({
      error: e.message
    })
  }
})

router.get('/student/user/tests/available', auth, async (req, res) => {
  try {
    const available = req.student.available
    res.json({
      available
    })
  } catch (e) {
    res.status(400).json({
      error: e.message
    })
  }
})

router.post('/student/user/tests/unavailable', auth, async (req, res) => {
  try {
    req.student.available = req.student.available.filter(subject => subject.subject !== req.body.subject)
    await req.student.save()
    res.json()
  } catch (e) {
    res.status(400).json({
      error: e.message
    })
  }
})

router.get('/student/quiz/questions', auth, (req, res) => {
  try {
    const subject = req.query.subject
    const subjectDirectory = path.join(__dirname, `../../public/json/quizQuestions/${subject}.json`)
    const response = fs.readFileSync(subjectDirectory)
    const question = JSON.parse(response)
    res.json({
      question
    })
  } catch (e) {
    res.status(404).json({
      error: e.message
    })
  }
})

module.exports = router