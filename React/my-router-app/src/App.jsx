//note: in react router dom we always need to give address
import React from "react";
import Home from "./HomePage";
import About from "./AboutPage";

//React-Router
import {BrowserRouter , Routes , Route, Link} from 'react-router-dom'
function App(){
// BrowserRouter - stops reloading and helps you change the pages.
// Routes - group of all the address
// Route- to create individual address
return(
<BrowserRouter>

<nav>
  <Link to="/" style={{ marginRight:'15px'}}>Home</Link>

  <Link to="/about">About</Link>
</nav>

<Routes>

{/* Path-Address of Different Pages*/}
 <Route path="/"     element={<Home />}  />  {/*   / means home page address  */}
<Route path="/about" element={<About />}  />

</Routes>

</BrowserRouter>
)
}
export default  App