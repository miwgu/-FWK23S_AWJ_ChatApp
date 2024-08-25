import React, {useState, useEffect} from 'react';
import {useCookies} from 'react-cookie';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css'

/**
 * npm i react-cookie axios dompurify  react-toastify loglevel  npm install --save @sentry/react
 * 
 */


const Register = () => {
   const[username, setUsername]= useState('');
   const[email, setEmail]= useState('');
   const[password, setPassword]= useState('');
   const[avatar, setAvatar]= useState('');
   const[cookies, setCookie]= useCookies(['CSRF-TOKEN']);

   const [errors, setErrors]= useState({
   username: '',
   email: '',
   password: '',
   avatar: '',
   });

   const avatarOptions = [
    'https://i.pravatar.cc/100?img=4',
    'https://i.pravatar.cc/100?img=5',
    'https://i.pravatar.cc/100?img=9',
    'https://i.pravatar.cc/100?img=12',
    'https://i.pravatar.cc/100?img=14',
    'https://i.pravatar.cc/100?img=16',
    'https://i.pravatar.cc/100?img=17',
    'https://i.pravatar.cc/100?img=20',
    'https://i.pravatar.cc/100?img=24',
    'https://i.pravatar.cc/100?img=25',
   ] 

   const navigate = useNavigate();

   const handleAvatarSelect = (avatarUrl) =>{
     setAvatar(avatarUrl);
   }

   useEffect(()=>{
 
    axios.patch(import.meta.env.VITE_RAILWAY_URL + '/csrf')
    .then(res =>{
      const token = res.data.csrfToken;
      // Store the CSRF token in a cookie
      setCookie('CSRF-TOKEN', token, {
        path: '/',      // Make the cookie available site-wide
        secure: true,   // security for cookie: Ensure the cookie is sent over HTTPS only 
        sameSite: 'Strict', // security for cookie: Prevent cross-site request forgery
        httpOnly: false // I cannot change true because I need to access csrftoken in JavaScript (for sending login requests)
      });
      console.log('CSRF token set');
    })
    .catch(error=>{
      console.error('Error fetching CSRF token!:', error);
    });
   }, [setCookie]);


   const handleSubmit =(e) =>{
    e.preventDefault();;

    let hasErrors =false;
    let formErrors = {};
  
    if(!username){
      formErrors.username= "Username is required";
      hasErrors = true;
    }
    if(!email){
      formErrors.email= "Email is required";
      hasErrors = true;
    }
    if(!password){
      formErrors.password= "Password is required";
      hasErrors = true;
    }
    if(!avatar){
      formErrors.avatar= "You need to choose an avatar";
      hasErrors = true;
    }

    setErrors(formErrors);

    if(hasErrors){
      return;  //Client side error: Prevent submit
    }
      
    const sanitizedUsername = DOMPurify.sanitize(username);
    const sanitizedEmail = DOMPurify.sanitize(email);

    axios.post(import.meta.env.VITE_RAILWAY_URL + '/auth/register', {
      username: sanitizedUsername,
      password,
      email:sanitizedEmail,
      avatar,
      csrfToken: cookies['CSRF-TOKEN']
    })
    .then(res=>{
      console.log('Registration successful!:', res.data);
      toast.success(<div>Registration successful! 🎉✨</div>);
    
      setTimeout(()=>{
        navigate('/login'); // Navigate to login page after 3 seconds
      }, 3000);
    })
    .catch(error=>{

    if (error.response && error.response.status === 400 ){
      const serverErrorMessage = error.response.data.error;
      const sanitizedServerErrorMessage = DOMPurify.sanitize(serverErrorMessage);
      const existMessage = "Username or email already exists"
      if(sanitizedServerErrorMessage === existMessage){

        setErrors({
          ...errors,
          username: sanitizedServerErrorMessage,
          email: sanitizedServerErrorMessage
        
        })
        hasErrors = true;
        
      }

    } else {

      const sanitizedErrorMessage = DOMPurify.sanitize(error.response ? error.response.data : error.message);
      console.error('Error! registering user:', sanitizedErrorMessage);
      toast.error(
        <div>
         <strong>Registration failed.</strong><br />
         <div dangerouslySetInnerHTML={{ __html: sanitizedErrorMessage }} />
         <p>Please refresh the page and try again.</p>
        </div>
      );
    }

     if(hasErrors){
      return; // server side error : prevene submit
    } 

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
              {errors.username && <p style={{ color: '#ff0066' }}>{errors.username}</p>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className='left-label'>E-mail</Form.Label>
              <Form.Control 
                className='bg-primary'
                type="email"
                placeholder="Enter E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
               {errors.email && <p style={{ color: '#ff0066' }}>{errors.email}</p>}
            </Form.Group>
    
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className='left-label'>Password</Form.Label>
              <Form.Control 
                className='bg-primary'
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
               {errors.password && <p style={{ color: '#ff0066' }}>{errors.password}</p>}
            </Form.Group>

            <DropdownButton id="dropdown-basic-button" title="Select an Avatar">
                {avatarOptions.map((avatarUrl, index)=>(
                <Dropdown.Item key ={index} onClick={() => setAvatar(avatarUrl)}>
                    <img
                    src={avatarUrl}
                    alt={`avatar-${index}`}
                    style={{ width: '30px', height: '30px', marginRight: '10px' }}
                    />
                     Avatar {index + 1}
                </Dropdown.Item>
            ))}       
            </DropdownButton>

            {errors.avatar && <p style={{ color: '#ff0066' }}>{errors.avatar}</p>}
      
        <div>
          <h5>Selected Avatar:</h5>
          { avatar ? (
          <img src={avatar} alt="Selected Avatar" style={{ width: '100px', height: '100px' }} />
          ):(
            <p style={{color: '#ff0066'}}>Avatar not yet selected.</p>
          )
        }
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