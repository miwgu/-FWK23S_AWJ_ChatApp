import React, {useState, useEffect} from 'react';
import {useCookies} from 'react-cookie';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import DOMPurify from 'dompurify';
import './Register.css'

/**
 * npm i react-cookie axios dompurify
 * 
 */


const Register = () => {
   const[username, setUsername]= useState('');
   const[email, setEmail]= useState('');
   const[password, setPassword]= useState('');
   const[avatar, setAvatar]= useState('');
   const[csrfToken, setCsrfToken]= useState('');
   const[cookies, setCookie]= useCookies(['CSRF-TOKEN']);

   useEffect(()=>{
    console.log('Fetching CSRF token...');
    axios.patch('https://chatify-api.up.railway.app/csrf')
    .then(res =>{
      const token = res.data.csrfToken;
      setCookie('CSRF-TOKEN', token, {path: '/'});
      setCsrfToken(token);
      console.log('CSRF token set:', token);
    })
    .catch(error=>{
      console.error('Error fetching CSRF token!:', error);
    });
   }, [setCookie]);

   const handleSubmit =(e) =>{
    e.preventDefault();
    console.log('Form submitted');

    axios.post('https://chatify-api.up.railway.app/auth/register', {
      username,
      password,
      email,
      avatar,
      csrfToken: cookies['CSRF-TOKEN']
    })
    .then(res=>{
      console.log('Registration successful!:', res.data);
    })
    .catch(error=>{
      const sanitizedErrorMessage = DOMPurify.sanitize(error.res ? error.res.data : error.message);
      console.error('Error! registering user:', sanitizedErrorMessage);
    });
   };

    return (
        <div className='register_bg'>
    
        <div className='container pt-5 mt-5'>
         <h2 className='center-content mt-3'>Register</h2>
          <Form className='form-container container' onSubmit={handleSubmit} >
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label className='left-label'>Username</Form.Label>
              <Form.Control 
                className='bg-primary'
                type="text"
                placeholder="Enter Username"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className='left-label'>E-mail</Form.Label>
              <Form.Control 
                className='bg-primary'
                type="email"
                placeholder="Enter E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
    
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className='left-label'>Password</Form.Label>
              <Form.Control 
                className='bg-primary'
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>

            <DropdownButton id="dropdown-basic-button" title="Select an Avatar">
       
                <Dropdown.Item onClick={() => setAvatar('https://i.pravatar.cc/150')}>
                    <img
                    src={'https://i.pravatar.cc/150'}
                    alt="avatar"
                    style={{ width: '30px', height: '30px', marginRight: '10px' }}
                    />
                    
                </Dropdown.Item>
        
            </DropdownButton>
      
        <div>
          <h5>Selected Avatar:</h5>
          <img src={avatar} alt="Selected Avatar" style={{ width: '100px', height: '100px' }} />
        </div>
      
    
           <div className='center-content'>
            <Button  variant="primary" type="submit">
              Register
            </Button>
            </div>
          </Form>
          </div>
        </div>
      )
}

export default Register