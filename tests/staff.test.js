const request = require('supertest')
const app = require('../src/index')
const Staff = require('../src/models/staff')
const {
  staffOne,
  staffOneId,
  setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('should signup staff', async () => {
  const response = await request(app)
    .post('/staff')
    .send({
      firstName: 'tubosun',
      lastName: 'afunlehin',
      email: 'tubs@gmail.com',
      staffId: 5324,
      department: 'tech',
      subject: 'chemistry',
      password: 'tubs12345'
    })
    .expect(201)

  const staff = await Staff.findById(response.body.staff._id)
  expect(staff).not.toBeNull()
})

test('should not signup staff with invalid credentials', async () => {
  await request(app)
    .post('/staff')
    .send({
      firstName: 'tubosun',
      lastName: 'afunlehin',
      email: 'tubs@gmail',
      staffId: 5324,
      department: 'tech',
      subject: 'chemistry',
      password: 'tub'
    })
    .expect(400)
})

test('should sign in existing staff', async () => {
  await request(app)
    .post('/staff/user/login')
    .send({
      staffId: 4444, //staffOne
      password: 'john12345'
    })
    .expect(200)
})

test('should not sign in existing staff with invalid credentials', async () => {
  await request(app)
    .post('/staff/user/login')
    .send({
      staffId: 4444,
      password: 'john12346'
    })
    .expect(404)
})

test('Should get staff subject', async () => {
  const response = await request(app)
    .get('/staff/user/subject')
    .set('Authorization', `Bearer ${staffOne.tokens[0].token}`)
    .send()
    .expect(200)

  expect(response.body.subject).toEqual(staffOne.subject)
})

test('Should not get subject for unauthenticated staff', async () => {
  await request(app)
    .get('/staff/user/subject')
    .send()
    .expect(401)
})

test('should set test for authenticated staff', async () => {
  const response = await request(app)
    .post('/staff/user/available')
    .set('Authorization', `Bearer ${staffOne.tokens[0].token}`)
    .send()
    .expect(200)

  const staff = await Staff.findById(staffOneId)
  expect(staff.setTest).toEqual(true)
})

test('should not set test for unauthenticated staff', async () => {
  await request(app)
    .post('/staff/user/available')
    .send()
    .expect(401)

  const staff = await Staff.findById(staffOneId)
  expect(staff.setTest).toEqual(false)

})

test('should stop test for authenticated staff', async () => {
  await request(app)
    .post('/staff/user/unavailable')
    .set('Authorization', `Bearer ${staffOne.tokens[0].token}`)
    .send()
    .expect(200)

  const staff = await Staff.findById(staffOneId)
  expect(staff.setTest).toEqual(false)
})

test('should not stop test for unauthenticated staff', async () => {
  await request(app)
    .post('/staff/user/unavailable')
    .send()
    .expect(401)

  const staff = await Staff.findById(staffOneId)
  expect(staff.setTest).toEqual(false)
})