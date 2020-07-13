const {
  Router
} = require('express')

const router = new Router()

router.get('', (req, res) => {
  res.render('index')
})

router.get('/student/signup', (req, res) => {
  res.render('student-signup')
})

router.get('/student/login', (req, res) => {
  res.render('student-login')
})

router.get('/staff/signup', (req, res) => {
  res.render('staff-signup')
})

router.get('/staff/login', (req, res) => {
  res.render('staff-login')
})

router.get('/student/courses', (req, res) => {
  res.render('student-courses')
})

router.get('/student/profile', (req, res) => {
  res.render('student-profile')
})

router.get('/staff/profile', (req, res) => {
  res.render('staff-profile')
})

router.get('/student/quiz', (req, res) => {
  res.render('student-quiz')
})

module.exports = router
