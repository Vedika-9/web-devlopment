// whatever is written in app.jsx is shown in web page. 
      // app.jx is the heart of react  , all code written should be under function only.
import React from "react";    // imp line
 import CartButton from "./btn"; 
function App() {
  //Js code should be written here

return (
  //HTML Tags - code
// <> = this are called empty fragments , they are used for storing all/multiple html tags
  <>  
<h1>Welcome to React</h1>  
<h2>Hello Vedika</h2>
 <CartButton />   {/* calling the other file.(ie calling the function under html tag) */}
   <CartButton />    {/*code reusability */}
  </>
)
} // to run  react go in integrated terminal and write "npm run dev" so you the get the webpage.
export default App //  write this whenever you create a function(this is kind of calling function)
