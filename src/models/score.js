const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
  subject: {
    type: String,
    lowercase: true,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Student'
  }

}, {
  timestamps: true
})

const Score = mongoose.model('Score', scoreSchema)

module.exports = Score