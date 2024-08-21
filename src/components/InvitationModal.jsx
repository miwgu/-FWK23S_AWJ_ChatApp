import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RiSendPlane2Line } from "react-icons/ri";
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import authService from '../utils/authService';
import eventService from '../utils/eventService';
import ListGroup from 'react-bootstrap/ListGroup';

const InvitationModal = () => {
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    const handleShow = (breakpoint) =>{
        setFullscreen(breakpoint);
        setShow(true);
    }
  
    const handleClose = () => {
        setShow(false);
      };

      const handleLogout =() =>{
        authService.signOut(()=>{
            eventService.triggerLogout();// // Trigger logout event
            //remove all items from localStrage 
            localStorage.clear();
            navigate('/login')
        })
      };

      useEffect (()=> {
        getAllUsers();

      }, [])

      const getAllUsers = async () =>{
        try {
          const accessToken = localStorage.getItem('access_token');
          const loggedInUserId = Number(localStorage.getItem('userId'));

          const res = await axios.get(`${import.meta.env.VITE_RAILWAY_URL}/users`, {
            headers:{
              Authorization: `Bearer ${accessToken}`
            }
          })

          const usersWithoutLoggedInU = res.data.filter((user)=> user.userId !== loggedInUserId )
          setAllUsers(usersWithoutLoggedInU)
          setFilteredUsers(usersWithoutLoggedInU); // Initially show all users without loggedinUser
          console.log("Filtered users",filteredUsers)
        }catch (error){
          console.error('Error fetching users:', error);
          if(error.response && error.response.status === 403){
            handleLogout();
        }
    
        }
      }

      const filterUsers = (searchTerm) =>{
        if (searchTerm){
            const filtered = allUsers.filter (user =>
              user.username.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(allUsers);
        }
      }

      const handleSearchChange = () =>{
        setSearchTerm(event.target.value);
        filterUsers(event.target.value);

      }

  return (
    <>
       <Button variant='light' onClick={() => handleShow(true)} >
          <RiSendPlane2Line />
       </Button>
    
        <Modal show={show} fullscreen={fullscreen} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Search a Friend for sending invitation</Modal.Title>
            </Modal.Header>
            <Modal.Body>

         <Form className="d-flex m-2">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value ={searchTerm}
              onChange={handleSearchChange}
            />
          </Form>
         
         <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <ListGroup>
                { filteredUsers.map((user)=>(
                 <ListGroup.Item key ={user.userId}>
                    {user.username}
                </ListGroup.Item>
                ))
                 }
                
            </ListGroup>
        </div>

              <Button className='m-2'>

                Button
              </Button>
            
            </Modal.Body>
        </Modal>
    </>
  )
}

export default InvitationModal