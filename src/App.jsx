
//import { Routes, Route } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import Chat from './components/Chat'
import Register from './components/Register'
import SideNav from './components/nav/SideNav'
import './App.css'

function App() {

  return (
    <>
    <Router>
      <SideNav />
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>

        {/* <Route element={<ProtectedRouth />}> */}
          <Route path='/chat' element={<Chat/>} />
        {/* </Route> */}
        
      </Routes>
      </Router>
    </>
  )
}

export default App
