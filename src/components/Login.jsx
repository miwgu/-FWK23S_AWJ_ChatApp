import React, { useState } from 'react';
//import { useNavigate, useLocation } from 'react-router-dom';
//import fakeAuth from '../utils/fakeAuth';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
//import Spinner from 'react-bootstrap/Spinner';
import './Login.css';

const Login = () => {
  return (
    <div className='login_bg'>

    <div className='container pt-5 mt-5'>
     <h2 className='center-content mt-3'>Login 🔐</h2>
      <Form className='form-container container'  >
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label className='left-label'>Username</Form.Label>
          <Form.Control 
            className='bg-primary'
            type="text"
            placeholder="Enter username"
            /* value={username} */
            /* onChange={(e) => setUsername(e.target.value)} */ />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label className='left-label'>Password</Form.Label>
          <Form.Control 
            className='bg-primary'
            type="password"
            placeholder="Password"
            /* value={password} */
            /* onChange={(e) => setPassword(e.target.value)} */ />
        </Form.Group>

       <div className='center-content'>
        <Button  variant="primary" type="submit">
          Login
        </Button>
        </div>
      </Form>
      </div>
    </div>
  )
}

export default Login