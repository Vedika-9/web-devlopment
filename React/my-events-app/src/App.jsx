// in React 'On' will be will in every start of event eg. OnClick
// import React from "react";
// function App(){

// function handleClcik(){
//   alert('Good evening Welcome To React')
// }
// return(
//   <>
//   <button onClick={handleClcik}>Click Me</button>
//   </>
// )
// }
// export default  App


//Example -2 
// import React from "react";
// import { useState } from "react";

// function App(){
// const[isFollow , setIsFollowed] = useState(false)

// return(
//   <>
//   <button onClick={()=> setIsFollowed(!isFollow)}>
//          {isFollow ? "Following":"Follow"}
//   </button>
//   </>
// )
// }
// export default  App


import React from "react";
import { useState } from "react";

function App(){
const [text,setText] = useState("")      // inital state  should be written in useState( ....)

return(
  <>
  <input 
  type="text"
  placeholder="Search..."
  onChange={(e)=> setText(e.target.value)}  />

  <h3>You typed : {text}</h3>
  </>
)
}
export default  App