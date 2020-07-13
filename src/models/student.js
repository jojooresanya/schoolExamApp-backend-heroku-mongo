const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')

const studentSchema = new mongoose.Schema({
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
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Please enter a valid email')
      }
    }
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot password')
      }
    }
  },
  department: {
    type: String,
    lowercase: true
  },
  subjects: [{
    subject: {
      type: String,
      lowercase: true
    }
  }],
  available: [{
    subject: {
      type: String,
      lowercase: true
    }
  }],
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

studentSchema.virtual('score', {
  ref: 'Score',
  localField: '_id',
  foreignField: 'student'
})

studentSchema.methods.toJSON = function () {
  const student = this
  const studentObject = student.toObject()

  delete studentObject.password
  delete studentObject.tokens

  return studentObject
}

studentSchema.methods.generateAuthToken = async function () {
  const student = this
  const token = await jwt.sign({
    _id: student._id.toString()
  }, process.env.JWT_SECRET)
  student.tokens = student.tokens.concat({
    token
  })
  await student.save()
  return token
}

studentSchema.statics.findByCredentials = async function (studentId, password) {
  const student = await Student.findOne({
    studentId
  })

  if (!student) {
    throw new Error('Incorrect Student Id')
  }

  const isMatch = await bcrypt.compare(password, student.password)

  if (!isMatch) {
    throw new Error('invalid password')
  }

  return student
}

studentSchema.pre('save', async function (req, res, next) {
  const student = this

  if (student.isModified('password')) {
    student.password = await bcrypt.hash(student.password, 8)
  }

  next()
})

const Student = mongoose.model('Student', studentSchema)

module.exports = Student