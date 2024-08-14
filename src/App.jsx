
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import Chat from './components/Chat'
import Register from './components/Register'
import SideNav from './components/nav/SideNav'
import ProtectedRoute from './utils/ProtectedRoute';
import './App.css'

function App() {

  return (
    <>
    <Router>
      <SideNav />
      <Routes>
      <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>

        <Route element={<ProtectedRoute />}> 
          <Route path='/chat' element={<Chat/>} />
        </Route>
        
      </Routes>
      </Router>
    </>
  )
}

export default App
