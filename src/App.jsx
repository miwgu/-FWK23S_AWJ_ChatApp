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
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

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

      {/* Button to test Sentry error capturing */}
        <button onClick={() => methodDoesNotExist()}>
          Break the world
        </button> 
      </Router>
    </>
  )
}

export default App
