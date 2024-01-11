const mongoose = require('mongoose')
mongoose.set('bufferTimeoutMS', 30000)
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)

const initialBlogs = [
  {
    title: 'test',
    author: 'test',
    url: 'test',
    likes: 0
  },
  {
    title: 'test',
    author: 'test',
    url: 'test',
    likes: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  const response = await api.get('/api/blogs')
  expect(response.type).toBe('application/json')
  expect(response.body).toHaveLength(initialBlogs.length)
}, 100000)

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(x => expect(x.id).toBeDefined())
}, 100000)

test('post requests work correctly', async () => {
  const tempBlog = {
    title: 'test',
    author: 'test',
    url: 'test',
    likes: 0
  }
  await api
    .post('/api/blogs')
    .send(tempBlog)

  const newLength = (await api.get('/api/blogs')).body.length
  expect(newLength).toBe(initialBlogs.length + 1)
}, 100000)

test('id defaults to 0 if missing', async () => {
  const tempBlog = {
    title: 'test',
    author: 'test',
    url: 'test',
  }
  const response = await api.post('/api/blogs').send(tempBlog)
  expect(response.body.likes).toBe(0)
}, 100000)

test('responds with 400 if title or url is missing', async () => {
  const tempBlog = { author: 'test' }
  const response = await api.post('/api/blogs').send(tempBlog)
  expect(response.status).toBe(400)
}, 100000)

test('delete requests work correctly', async () => {
  const id = (await api.get('/api/blogs')).body[0].id
  await api.delete(`/api/blogs/${id}`)
  const newLength = (await api.get('/api/blogs')).body.length
  expect(newLength).toBe(initialBlogs.length - 1)
})

test('update requests work correctly', async () => {
  const id = (await api.get('/api/blogs')).body[1].id
  console.log(id)
  const tempBlog = {
    title: 'test',
    author: 'test',
    url: 'test',
    likes: 1
  }
  //const temp = await api.get(`/api/blogs/${id}`)
  //console.log(temp.body)
  const response = await api.put(`/api/blogs/${id}`).send(tempBlog)
  //console.log(response.body)
  expect(response.body.likes).toBe(1)
}, 100000)

afterAll(async () => {
  await mongoose.connection.close()
})
