import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import './index.css'

const Filter = ({newFilter, handleFilterChange}) => (
	<form >
        <div>filter shown with: <input value={newFilter} onChange={handleFilterChange}/></div>
    </form>
)
const PersonForm = ({addPerson, newName, 
	handleNameChange, newNumber, handleNumberChange}) => (
		<form onSubmit = {addPerson}>
		<div>name: <input value={newName} onChange={handleNameChange}/></div>
		<div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
		<div><button type="submit">add</button></div>
		</form>
)

const ShowPerson = ({person, deletePerson}) => (
	<div>
	  {person.name} {person.number}
	  <button onClick={() => deletePerson(person.id)}>delete</button>
	</div>
)
const ShowPersons = ({personsToShow, deletePerson}) => (
	personsToShow.map(person => 
	<ShowPerson 
	  key = {person.id} 
	  person = {person} 
	  deletePerson = {deletePerson} 
	/>)
)
const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}
const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')  
  const [greenMessage, setGreenMessage] = useState(null)
  const [redMessage, setRedMessage] = useState(null)
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  const deletePerson = (id) => {
	const person = persons.find(p => p.id === id)
	if (confirm(`Delete ${person.name}?`)) {
	  personService
	    .remove(id)
	    .then(returnedPerson => {
		  setPersons(persons.filter(p => p.id !== id))
	    })
		
	}
  }
  const addPerson = (event) => {
	event.preventDefault()
	if (newName === '' || newNumber === '') {
		alert('name or number cannot be empty')
	} else {
		let isPresent = false
		persons.forEach(person => {
			if (person.name === newName) {
				isPresent = true
			}
		})
		if (!isPresent) {
		  personService
			.create({name: newName, number: newNumber})
			.then(returnedPerson => {
			  setPersons(persons.concat(returnedPerson))
			  setNewName('')
			  setNewNumber('')
			  
			  setGreenMessage(`Added ${newName}`)		
              setTimeout(() => {
                setGreenMessage(null)
              }, 5000)
			  
			})
		  
		
		} else {
		      const temp = newName
			  if (confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
				personService
				  .update(persons.find(p => p.name === newName).id, {name: newName, number: newNumber})
				  .then(returnedPerson => {
					const newPersons = persons.filter(p => p.name != newName)
				  
					setPersons(newPersons.concat(returnedPerson))
					setNewName('')
					setNewNumber('')
				  })
				  .catch(error => {
					setRedMessage(
					  `Information of ${newName} has already been removed from server`)		
					setTimeout(() => {
					  setRedMessage(null)
					}, 5000)
					setPersons(persons.filter(p => p.name !== temp))
				  })
				  
				}
		}
	}
	
  }
  
  const handleNameChange = (event) => {
	setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
	setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
	setNewFilter(event.target.value)
  }
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
  
  return (
    <div>
      <h2>Phonebook</h2>
	  <Notification message={greenMessage} type='green'/>
	  <Notification message={redMessage} type='red'/>
	  <Filter newFilter = {newFilter} handleFilterChange = {handleFilterChange}/>
	  <h2>add a new</h2>
      <PersonForm addPerson = {addPerson} newName = {newName} 
		handleNameChange = {handleNameChange} 
		newNumber = {newNumber} handleNumberChange = {handleNumberChange} />
      <h2>Numbers</h2>
      <ShowPersons personsToShow = {personsToShow} deletePerson = {deletePerson}/>
    </div>
  )
}

export default App