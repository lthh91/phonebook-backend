const express = require('express')
const morgan = require('morgan')
const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

morgan.token('body', (request, response) => {
  const body = request.body
  if (!Object.keys(body).length) {
    return ""
  } else {
    return JSON.stringify(body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.json());
app.use(express.static('build'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const d = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${d}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const p = persons.find(p => p.id === id)
  if (p) {
    response.json(p)
  } else {
    response.status(404).json({ error: 'Person id not found'})
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id != id)
  response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
  const p = request.body
  
  if (!p) {
    return response.status(400).json({ error: 'content missing' })
  }
  if (!p.name || !p.number) {
    return response.status(400).json({ error: 'either name or number missing' })
  }
  const dup = persons.find(person => person.name === p.name)
  if (dup) {
    return response.status(400).json({ error: 'name must be unique' })
  }
  while(true) {
    const id = Math.floor(Math.random() * 10000)
    const p_dup = persons.find(person => person.id === id)
    if (!p_dup) {
      const new_person = {id: id, name: p.name, number: p.number}
      persons = persons.concat(new_person)
      return response.status(200).end()
    }
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})