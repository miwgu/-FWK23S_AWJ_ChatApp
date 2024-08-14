import React, {useState, useEffect} from 'react';
import axios from 'axios';
//import { useNavigate, useLocation } from 'react-router-dom';
//import fakeAuth from '../utils/fakeAuth';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
//import Spinner from 'react-bootstrap/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {useCookies} from 'react-cookie';
import './Login.css';

const Login = () => {
  const[username, setUsername] = useState('');
  const[password, setPassword] = useState('');
  const[cookie, setCookie] = useCookies(['CSRF-TOKEN']);
  const navigate = useNavigate();

  useEffect(()=>{
    console.log('Fetching CSRF token...');

    axios.patch('https://chatify-api.up.railway.app/csrf')
    .then(res => {
      const token = res.data.csrfToken;

      // Store the CSRF token in a cookie
      setCookie('CSRF-TOKEN', token, {
        path: '/',      // Make the cookie available site-wide
        secure: true,   // security for cookie: Ensure the cookie is sent over HTTPS only 
        sameSite: 'Strict', // security for cookie: Prevent cross-site request forgery
        httpOnly: false // I cannot change true because I need to access csrftoken in JavaScript (for sending login requests)
      });

      console.log('CSRF token set:', token);
    })
    .catch(error => {
      console.error('Error fetching CSRF token:', error);
      toast.error(
        <div>Faied to retrieve CSRF token!</div>
      );
    });
  }, [setCookie]);

  const handleSubmit = (e) =>{
   e.preventDefault();

   const csrfToken = cookie['CSRF-TOKEN'];

   axios.post('https://chatify-api.up.railway.app/auth/token', {
     username,
     password,
     csrfToken
   })
   .then(res=> {
     const accessToken = res.data.token; 
     console.log('Generate token Login successful!:', accessToken);

     localStorage.setItem('access_token', accessToken);

     axios.get('https://chatify-api.up.railway.app/users',{
     headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  .then(usersRes => {

    const loggedInUser = usersRes.data.find(loggedinU => loggedinU.username === username);
      
    if(loggedInUser){
      console.log('Logged-in user fetched:', loggedInUser);

      localStorage.setItem('userId', loggedInUser.userId);
      localStorage.setItem('username', loggedInUser.username);
      localStorage.setItem('avatar', loggedInUser.avatar);
      
      toast.success (
        <div>Login successful!</div>
      );

      setTimeout(()=>{
        navigate('/chat'); // Navigate to login page after 3 seconds
      }, 3000);

    } else {
      console.error('User not found!')
      toast.error(<div>
        User not found
      </div>)
    }
    })
    .catch(usersError =>{
      console.error('Error fetching users:', usersError);
      toast.error(
        <div>Problems occur. Please wait and try again!</div>
      )
    });

    })
    .catch(error =>{
      const errorMessage = error.response ? error.response.date.error : error.message;
      toast.error(
        <div>
        <strong>Login failed.</strong><br />
        <div>{errorMessage}</div>
        </div>
      );
      console.error('Error during login (generate token):', errorMessage)

    })
   

  }

  return (
    <div className='login_bg'>

    <div className='container pt-5 mt-5'>
     <h2 className='center-content mt-3'>Login 🔐</h2>
      <Form className='form-container container' onSubmit={handleSubmit} >
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label className='left-label'>Username</Form.Label>
          <Form.Control 
            className='bg-primary'
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label className='left-label'>Password</Form.Label>
          <Form.Control 
            className='bg-primary'
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

       <div className='center-content'>
        <Button  variant="primary" type="submit">
          Login
        </Button>
        </div>
      </Form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login