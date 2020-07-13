const request = require('supertest')
const app = require('../src/index')
const Score = require('../src/models/score')
const {
  studentOne,
  setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('should create score for authenticated student', async () => {
  const response = await request(app)
    .post('/score')
    .set('Authorization', `Bearer ${studentOne.tokens[0].token}`)
    .send({
      subject: 'chemistry',
      score: 15
    })
    .expect(201)
})

test('should not create score for unauthenticated student', async () => {
  await request(app)
    .post('/score')
    .send({
      subject: 'chemistry',
      score: 15
    })
    .expect(401)
})