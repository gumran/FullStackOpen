const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) {
    response.status(400).send('title or url missing')
  } else {
    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes || 0,
      user: request.user._id
    })
    await blog.populate('user', { username: 1, name: 1, id: 1 })
    const temp = await blog.save()
    response.status(201).json(temp)
  }
  
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if(!blog) {
    response.status(400).send('blog does not exist')
  }
  if (blog.user.toString() === request.user.id) {
    await Blog.deleteOne(blog)
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'token missing or invalid' })
  }
})

module.exports = blogsRouter