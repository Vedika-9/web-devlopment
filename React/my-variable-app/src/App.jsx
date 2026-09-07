import {useState} from "react";

function App(){
const[show,setShow] = useState(false)

return(
  <>
   <input type={show ? "text" : "password"} placeholder="Enter Your Password"        />
   <button onClick={ ()=>   setShow(!show)}>Show/Hide</button>
  </>
)
}
export default App


//Example 1
// import React from "react";

// function App(){
// let username = "Vedika"

// function Greet(){
//    alert(`Good Evening ${username}`)
// }

// return(
//   <>
//   <h2>My Name is : {username}  </h2>   // curly brackets are imp

//   <button onClick={Greet}>Greet</button>
//   </>
// )
// }
// export default App



//Example 2 - Variable vs React Variable   

// import React from "react";
// function App(){
// let count = 10
// function IncreaseCount(){
//   count = count + 1;
//   console.log(count)
// }
// return(
//   <>
//   <h2>Like/Cart/Quanity :  {count} </h2>
//   <button onClick={IncreaseCount}>Increase</button>
//   </>
// )
// }
// export default App


//Example-3 useState Varibale
//React Variable- useState -(React Hooks)
//Special React Variable That Stores The Updated Value Along With It Also Updates The Screen automatically
//const [mainVariableName-screen , setVariableName-store updated value] = useState(Inital Value)

// import React , {useState} from "react";
// function App(){
// const [like, setLike] = useState(12)
// function IncreaseLike(){
//   setLike(like + 1)
//   console.log(like)
// }

// return(
//   <>
//   <h2>Like/Cart/Quanity :  {like} </h2>
//   <button onClick={IncreaseLike}>Increase</button>
//   </>
// )
// }
// export default App


