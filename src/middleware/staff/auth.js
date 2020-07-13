const jwt = require('jsonwebtoken')
const Staff = require('../../models/staff')

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '')
    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
    const staff = await Staff.findOne({
      _id: decoded._id,
      'tokens.token': token
    })

    if (!staff) {
      throw new Error()
    }

    req.staff = staff
    req.token = token

    next()
  } catch (e) {
    res.status(401).json({
      error: 'Please Authenticate'
    })
  }
}

module.exports = auth