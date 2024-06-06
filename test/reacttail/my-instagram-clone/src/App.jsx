// import { useState } from 'react'
import './App.css'
import UserProfile from './components/UserProfile'
// import Home from './components/Home'
import { BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import Home from './components/Home';
function App() {

  return (
    <>
    {/* <p>hello</p> */}
      {/* <Home /> */}
      {/* <UserProfile /> */}

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:username" element={<UserProfile />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
