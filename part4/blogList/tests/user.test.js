const mongoose = require('mongoose')
mongoose.set('bufferTimeoutMS', 30000)
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)


const initialUsers = [
  {
    username: 'test',
    passwordHash: 'test',
    name: 'test'
  },
  {
    username: 'test',
    passwordHash: 'test',
    name: 'test'
  },
  {
    username: 'test',
    passwordHash: 'test',
    name: 'test'
  }
]
beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(initialUsers)
})

test('cannot add invalid users', async () => {
  const user = { name: 'test' }
  await api
    .post('/api/users').send(user)
    .expect(400)
})

afterAll(async () => {
  await mongoose.connection.close()
})
