import React, {useState, useEffect} from 'react';
import {useCookies} from 'react-cookie';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css'

/**
 * npm i react-cookie axios dompurify  react-toastify
 * 
 */


const Register = () => {
   const[username, setUsername]= useState('');
   const[email, setEmail]= useState('');
   const[password, setPassword]= useState('');
   const[avatar, setAvatar]= useState('');
   const[csrfToken, setCsrfToken]= useState('');
   const[cookies, setCookie]= useCookies(['CSRF-TOKEN']);

   const [errors, setErrors]= useState({
   username: '',
   email: '',
   password: '',
   avatar: '',
   });

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
    console.log('Try form submitted');

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
      

    axios.post('https://chatify-api.up.railway.app/auth/register', {
      username,
      password,
      email,
      avatar,
      csrfToken: cookies['CSRF-TOKEN']
    })
    .then(res=>{
      console.log('Registration successful!:', res.data);
      toast.success(<div>Registration successful! 🎉</div>);
    })
    .catch(error=>{

    if (error.response && error.response.status === 400 ){
      const serverErrorMessage = error.response.data.error;
      const existMessage = "Username or email already exists"
      if(serverErrorMessage === existMessage){

        setErrors({
          ...errors,
          username: serverErrorMessage,
          email: serverErrorMessage
        
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
       
                <Dropdown.Item onClick={() => setAvatar('https://i.pravatar.cc/150')}>
                    <img
                    src={'https://i.pravatar.cc/150'}
                    alt="avatar"
                    style={{ width: '30px', height: '30px', marginRight: '10px' }}
                    />
                    
                </Dropdown.Item>
        
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
          <ToastContainer />
        </div>
      )
}

export default Register