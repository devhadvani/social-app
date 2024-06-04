// import { useState } from 'react'
import './App.css'
import UserProfile from './components/UserProfile'
// import Home from './components/Home'
import { BrowserRouter as Router, Route,Routes} from 'react-router-dom';
function App() {

  return (
    <>
    {/* <p>hello</p> */}
      {/* <Home /> */}
      {/* <UserProfile /> */}

    <Router>
      <Routes>
        <Route path="/:username" element={<UserProfile />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
