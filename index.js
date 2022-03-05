const express = require('express')
require('dotenv').config()
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('post', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  } else {
    return
  }
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :post')
)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then((result) => response.json(result))
})

app.get('/api/info', (request, response) => {
  const date = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p> `
  )
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((result) => {
      if (result) {
        response.json(result)
      } else {
        response.status(404).end('id not exist')
      }
    })
    .catch((error) => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

/* app.post('/api/persons', (request, response) => {
  const responseBody = request.body
  const nameExisted = persons.find((item) => item.name === responseBody.name)

  if (!responseBody.name || !responseBody.number) {
    return response.status(400).json({ error: 'content missing' })
  }
  if (nameExisted) {
    return response.status(400).json({ error: 'name must be unique' })
  }
  const newId = Math.floor(Math.random() * 100000000)
  const newPerson = { id: newId, ...responseBody }
  persons = persons.concat(newPerson)
  response.json(newPerson)
}) */

app.post('/api/persons', (request, response) => {
  const reqBody = request.body
  const newPerson = new Person({
    name: reqBody.name,
    number: reqBody.number,
  })
  newPerson.save().then((result) => response.json(result))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((result) => {
      response.json(result)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
