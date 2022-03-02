const mongoose = require('mongoose')
const password = process.argv[2]
const url = `mongodb+srv://fs-part3c-onclass:${password}@cluster0.ux1bg.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})
const Person = mongoose.model('Person', personSchema)

const getAll = () => {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((item) => console.log(`${item.name} ${item.number}`))
    mongoose.connection.close()
  })
}

const add = () => {
  const newName = process.argv[3]
  const newNumber = process.argv[4]
  const newPerson = new Person({
    name: newName,
    number: newNumber,
  })
  newPerson.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  getAll()
} else if (process.argv.length === 4) {
  console.log(`Please provide a number for ${process.argv[3]}`)
  process.exit(1)
} else if (process.argv.length === 5) {
  add()
}
