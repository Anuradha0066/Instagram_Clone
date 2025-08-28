import React from 'react'
import Login from './Login'
import SignUp from './SignUp'
import {Route,Routes} from 'react-router-dom'
import MainPage from './MainPage'
const App = () => {
  return (
<div >
 
  <Routes>
    <Route path="/" element={<MainPage />} />
    <Route path="/signup" element={<SignUp />} />
  </Routes>
</div>
  )
}

export default App
