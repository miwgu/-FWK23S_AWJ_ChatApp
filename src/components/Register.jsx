import React from 'react'
import './Register.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Dropdown, DropdownButton } from 'react-bootstrap';


const Register = () => {
    return (
        <div className='register_bg'>
    
        <div className='container pt-5 mt-5'>
         <h2 className='center-content mt-3'>Register</h2>
          <Form className='form-container container'  >
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label className='left-label'>Username</Form.Label>
              <Form.Control 
                className='bg-primary'
                type="text"
                placeholder="Enter Username"
                /* value={username} */
                /* onChange={(e) => setUsername(e.target.value)} */ />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className='left-label'>E-mail</Form.Label>
              <Form.Control 
                className='bg-primary'
                type="email"
                placeholder="Enter E-mail"
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

            <DropdownButton id="dropdown-basic-button" title="Select an Avatar">
       
                <Dropdown.Item >
                    <img
                    src={''}
                    alt="avatar"
                    style={{ width: '30px', height: '30px', marginRight: '10px' }}
                    />
                    
                </Dropdown.Item>
        
            </DropdownButton>
      
        <div>
          <h5>Selected Avatar:</h5>
          <img src={null} alt="Selected Avatar" style={{ width: '100px', height: '100px' }} />
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