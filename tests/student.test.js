const request = require('supertest')
const app = require('../src/index')
const Student = require('../src/models/student')
const {
  studentOne,
  studentOneId,
  setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('should signup student', async () => {
  const response = await request(app)
    .post('/student')
    .send({
      firstName: 'paul',
      lastName: 'rudd',
      email: 'paulr@gmail.com',
      studentId: 2236,
      password: 'paul12345'
    })
    .expect(201)

  const student = await Student.findById(response.body.student._id)
  expect(student).not.toBeNull()
})

test('should not signup student with invalid credentials', async () => {
  await request(app)
    .post('/student')
    .send({
      firstName: 'paul',
      lastName: 'rudd',
      email: 'paulr@gmail',
      studentId: 2236,
      password: 'paul1'
    })
    .expect(400)

})

test('should sign in existing student', async () => {
  await request(app)
    .post('/student/user/login')
    .send({
      studentId: 6343, //studentOne
      password: 'jojo12345'
    })
    .expect(200)
})

test('should not sign in existing student with invalid credentials', async () => {
  await request(app)
    .post('/student/user/login')
    .send({
      studentId: 6343,
      password: 'jojo12346'
    })
    .expect(404)
})

test('should save courses for authenticated student', async () => {
  await request(app)
    .post('/student/user/courses')
    .set('Authorization', `Bearer ${studentOne.tokens[0].token}`)
    .send({
      subjects: ['mathematics', 'english language', 'physics', 'chemistry'],
      department: 'tech'
    })
    .expect(200)
})

test('should not save courses for unauthenticated student', async () => {
  await request(app)
    .post('/student/user/courses')
    .send({
      subjects: ['mathematics', 'english language', 'physics', 'chemistry'],
      department: 'tech'
    })
    .expect(401)
})

test('should get courses for authenticated student', async () => {
  const response = await request(app)
    .get('/student/user/courses')
    .set('Authorization', `Bearer ${studentOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should not get courses for unauthenticated student', async () => {
  await request(app)
    .get('/student/user/courses')
    .send()
    .expect(401)
})

test('should get available tests for authenticated student', async () => {
  await request(app)
    .get('/student/user/tests/available')
    .set('Authorization', `Bearer ${studentOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should not get available tests for unauthenticated student', async () => {
  await request(app)
    .get('/student/user/tests/available')
    .send()
    .expect(401)
})