const Header = (props) => {
  return (
    <div>
	  <h2>{props.course.name}</h2>
	</div>
  )
}
const Part = (props) => {
  return (
    <div>
	  <p>{props.name} {props.exercises}</p>
	</div>
  )
}
const Content = ({course}) => {
  return (
	<div>
	  {course.parts.map(part => 
	    <Part key = {part.id} name = {part.name} exercises = {part.exercises} />
	  )}
	</div>
  )
}
const Total = ({course}) => {
  const sum = course.parts.reduce((a, part) => (a + part.exercises), 0)
  return (
    
    <div>
	  <p>
	    <b>total of {sum} exercises</b>
	  </p>
	</div>
  )
}
const Course = ({course}) => { 
  return(
	<div>
	  <Header course = {course} />
	  <Content course = {course} />
	  <Total course = {course} />
	</div>
	)
}
export default Course
	