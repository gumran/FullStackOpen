const User = require('../models/user')
const jwt = require('jsonwebtoken')

const setToken = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
}

const tokenExtractor = (request, response, next) => {
  // code that extracts the token
  setToken(request)
  next()
}

const userExtractor = async (request, response, next) => {
  let decodedToken = {}
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET)
  }
  catch(error) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  request.user = user
  next()
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

module.exports = { tokenExtractor, errorHandler, userExtractor }