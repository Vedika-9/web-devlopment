import React from "react";
import { useState , useEffect } from "react";
import './App.css';


function App(){
  const [users,setUsers] = useState([])

  //https://jsonplaceholder.typicode.com/users

  useEffect(()=>{
                
  fetch("https://jsonplaceholder.typicode.com/users")

  .then(response => response.json() )
  .then(data => setUsers(data))  //setUsers - for Updated data

  .catch(error => console.log("Error Fetching" , error))

  },[]);

return(
  <>
<div className="app">
<h2 className="title">EMPLOYYE DASHBOARD</h2>

{/* API Data is Storing in my user array-Extract The Data from user array and Put it on Html Tag */}
{/* map- every element in an array and return a brand-new array containing the modified results of task. */}

{users.map(abc=>(

<div key={abc.id}>
<h3>{abc.name}</h3>
<p>{abc.email}</p>
</div>

))}
</div>
</>
)
}
export default App