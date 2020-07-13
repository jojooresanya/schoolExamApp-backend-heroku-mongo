const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Staff = require('../../src/models/staff')
const Student = require('../../src/models/student')
const Score = require('../../src/models/score')

const studentOneId = new mongoose.Types.ObjectId()
const studentOne = {
  _id: studentOneId,
  firstName: 'jojo',
  lastName: 'oresanya',
  email: 'jojooresanya@gmail.com',
  studentId: 6343,
  password: 'jojo12345',
  tokens: [{
    token: jwt.sign({
      _id: studentOneId
    }, process.env.JWT_SECRET)
  }]
}

const studentTwoId = new mongoose.Types.ObjectId()
const studentTwo = {
  _id: studentTwoId,
  firstName: 'jess',
  lastName: 'brown',
  email: 'jessbrown@gmail.com',
  studentId: 3434,
  password: 'jess12345',
  tokens: [{
    token: jwt.sign({
      _id: studentTwoId
    }, process.env.JWT_SECRET)
  }]
}

const staffOneId = new mongoose.Types.ObjectId()
const staffOne = {
  _id: staffOneId,
  firstName: 'john',
  lastName: 'doe',
  email: 'johndoe@gmail.com',
  staffId: 4444,
  department: 'art',
  subject: 'literature',
  password: 'john12345',
  tokens: [{
    token: jwt.sign({
      _id: staffOneId
    }, process.env.JWT_SECRET)
  }]
}

const staffTwoId = new mongoose.Types.ObjectId()
const staffTwo = {
  _id: staffTwoId,
  firstName: 'mike',
  lastName: 'woods',
  email: 'mikewoods@gmail.com',
  staffId: 1212,
  department: 'tech',
  subject: 'chemistry',
  password: 'mike12345',
  tokens: [{
    token: jwt.sign({
      _id: staffTwoId
    }, process.env.JWT_SECRET)
  }]
}

const setupDatabase = async () => {
  await Student.deleteMany()
  await Staff.deleteMany()
  await Score.deleteMany()
  await new Student(studentOne).save()
  await new Student(studentTwo).save()
  await new Staff(staffOne).save()
  await new Staff(staffTwo).save()
}

module.exports = {
  studentOne,
  studentOneId,
  studentTwo,
  studentTwoId,
  staffOne,
  staffOneId,
  staffTwo,
  staffTwoId,
  setupDatabase
}