const jwt = require('jsonwebtoken')
const Student = require('../../models/student')

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '')
    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
    const student = await Student.findOne({
      _id: decoded._id,
      'tokens.token': token
    })

    if (!student) {
      throw new Error()
    }

    req.student = student
    req.token = token

    next()
  } catch (e) {
    res.status(401).json({
      error: 'Please Authenticate'
    })
  }
}

module.exports = auth