const mongoose = require('mongoose')
//if there were less than three process.arguments
const password = process.argv[2]
const url = `mongodb+srv://fs-part3c-onclass:${password}@cluster0.ux1bg.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

const firstPerson = new Person({
  name: 'wuhu',
  number: 110,
})

firstPerson.save().then((result) => {
  console.log('first person saved')
  mongoose.connection.close()
})
