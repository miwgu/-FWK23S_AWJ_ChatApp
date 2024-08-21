import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import Chat from './components/Chat'
import Profile from './components/Profile';
import Register from './components/Register'
import SideNav from './components/nav/SideNav'
import ProtectedRoute from './utils/ProtectedRoute';
import './App.css'

function App() {
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  return (
    <>
    <Router>
      <SideNav 
       selectedConversationId={selectedConversationId}
       setSelectedConversationId={setSelectedConversationId}
      />
      
      <Routes>
      <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>

        <Route element={<ProtectedRoute />}> 
          <Route path='/chat' element={<Chat selectedConversationId={selectedConversationId}/>} />
          <Route path='/profile' element={<Profile/>} />
        </Route>
        
      </Routes>
      </Router>
    </>
  )
}

export default App
