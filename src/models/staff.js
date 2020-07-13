const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')

const staffSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate (value) {
      if (!validator.isEmail(value)) {
        throw new Error('Please enter a valid email')
      }
    }
  },
  staffId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate (value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot password')
      }
    }
  },
  department: {
    type: String,
    lowercase: true,
    required: true
  },
  subject: {
    type: String,
    lowercase: true,
    required: true
  },
  setTest: {
    type: Boolean,
    default: false
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

staffSchema.methods.generateAuthToken = async function () {
  const staff = this
  const token = await jwt.sign({
    _id: staff._id.toString()
  }, process.env.JWT_SECRET)
  staff.tokens = staff.tokens.concat({
    token
  })
  await staff.save()
  return token
}

staffSchema.statics.findByCredentials = async function (staffId, password) {
  const staff = await Staff.findOne({
    staffId
  })

  if (!staff) {
    throw new Error('Incorrect Staff Id')
  }

  const isMatch = await bcrypt.compare(password, staff.password)

  if (!isMatch) {
    throw new Error('invalid password')
  }

  return staff
}

staffSchema.pre('save', async function (req, res, next) {
  const staff = this

  if (staff.isModified('password')) {
    staff.password = await bcrypt.hash(staff.password, 8)
  }

  next()
})

const Staff = mongoose.model('Staff', staffSchema)

module.exports = Staff
