import { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
const StatisticLine = ({text, value}) => (
	<tr>
		<td>{text}</td> <td>{value}</td>
	</tr>
	)
const Statistics = ({good, neutral, bad}) => {
	const total = good + neutral + bad
	if (total == 0) {
		return (
		<div><br />No feedback given</div>
		)
	}
	const positive = (100 * good / total).toString().concat('%')
	return (
	<div>
		<h1>Statistics</h1>
		<table>
			<StatisticLine text = 'Good' value = {good} />
			<StatisticLine text = 'Neutral' value = {neutral} />
			<StatisticLine text = 'Bad' value = {bad} />
			<StatisticLine text = 'All' value = {total} />
			<StatisticLine text = 'Average' value = {(good - bad) / total} />
			<StatisticLine text = 'Positive' value = {positive} /> 
		</table>
	</div>
	)
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const handleGood = () => {
    const updatedGood = good + 1
	setGood(updatedGood)
  }
  const handleBad = () => {
    const updatedBad = bad + 1
	setBad(updatedBad)
  }
  const handleNeutral = () => {
    const updatedNeutral = neutral + 1
	setNeutral(updatedNeutral)
  }
  return (
    <div>
      <h1>Give feedback</h1>
	  <Button handleClick = {handleGood} text = 'Good' />
	  <Button handleClick = {handleNeutral} text = 'Neutral' />
	  <Button handleClick = {handleBad} text = 'Bad' />
	  <Statistics good = {good} neutral = {neutral} bad = {bad} />
    </div>
  )
}

export default App