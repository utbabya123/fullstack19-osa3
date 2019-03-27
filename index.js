const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

let persons = [
  {
    "name": "Martti Tienari",
    "number": "040-123321",
    "id": 1
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-223344",
    "id": 3
  },
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 4
  }
]

const generateId = () => (
  Math.floor(Math.random() * 100000)
)

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({error: 'name or number missing'})
  }

  const personObject = {
    name: body.name,
    number: body.number,
    id: generateId()
  } 

  if (persons.find(person => person.name === personObject.name)) {
    return res.status(409).json({ error: 'name must be unique' })
  } else {
    persons = persons.concat(personObject)
    res.json(personObject)
  }
})
  
app.get('/info', (req, res) => {
  res.send(`puhelinluettelossa ${persons.length} henkilön tiedot <p>${new Date().toString()}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})