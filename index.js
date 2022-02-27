const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
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
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  const date = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p> `
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((item) => item.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((item) => item.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
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
})

const PORT = 3001
app.listen(PORT)
