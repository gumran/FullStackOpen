import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
const api_key = import.meta.env.VITE_SOME_KEY
const ShowCountry = ({country}) => {
  const [show, setShow] = useState(false)
  
  
  
  
  return(
	<div>
	  {country.name.common}
	  <button onClick={() => setShow(!show)}>{show ? 'unshow' : 'show'}</button>
	  {show ? <ShowInfo country={country} /> : null}
	  
	</div>
  )
}

		
const ShowInfo = ({country}) => {
	const [weather, setWeather] = useState(null)
	const lat = country.capitalInfo.latlng[0]
    const lng = country.capitalInfo.latlng[1]
	if (!weather) {
      axios
	    .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${api_key}`)
        .then(response => {setWeather(response.data)})
    }
	return(
		<div>
		  <h1>{country.name.common}</h1>
		  capital {country.capital[0]}<br/>
		  area {country.area}<br/><br/>
		  <h2>languages:</h2> 
		  <ul>{Object.values(country.languages).map(
			l => <li key = {l}>{l}</li>)}</ul>
		  <img src={country.flags.png} alt='flag' />
		  {weather 
		     ? 
			   <div>
			     <h2>Weather in {country.capital}</h2> 
				 <p>temperature {weather.main.temp} Celcius</p>
				 <p>wind {weather.wind.speed} m/s</p>
			   </div> 
			 : null}
		</div>
		)
}
const ShowCountries = ({countriesToShow, handleClick}) => (
    countriesToShow.length <= 10
	  ? countriesToShow.length === 1
	    ? <ShowInfo country={countriesToShow[0]} />	
	    : countriesToShow.map(country => 
	      <ShowCountry 
	        key = {country.name.official} 
	        country = {country} 
	      />)
      : <div>Too many mathes, specify another filter</div>
)
const App = () => {
  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [show, setShow] = useState(false)
  const handleFilterChange = (event) => {
	  setNewFilter(event.target.value)
  }
  
  useEffect(() => {
    axios
	  .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
		
        setCountries(response.data)
		
      })
  }, [])
  const countriesToShow = (countries) 
    ? countries.filter(
	    c => c.name.common.toLowerCase().includes(newFilter.toLowerCase()))
	: null
  
  return (
    <>
      <form>
	    find countries <input value = {newFilter } onChange={handleFilterChange}/>
	  </form>
	  <ShowCountries countriesToShow = {countriesToShow} />
    </>
  )
}

export default App
