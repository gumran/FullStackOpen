const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  try {
    if (!request.body.password) {
      response.status(400).send('password missing')
    } else if (request.body.password.length <= 3) {
      response.status(400).send('must be at least 3 characters')
    } else {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(request.body.password, saltRounds)
      const user = new User({
        username: request.body.username,
        passwordHash: passwordHash,
        name: request.body.name
      })
      const savedUser = await user.save()
      response.status(201).json(savedUser)
    }
  }
  catch(error) {
    response.status(400).send(error.message)
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
  response.json(users)
})

module.exports = usersRouter