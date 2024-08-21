import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RiSendPlane2Line } from "react-icons/ri";
import Button from 'react-bootstrap/Button';
import { Container, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import authService from '../utils/authService';
import eventService from '../utils/eventService';
import ListGroup from 'react-bootstrap/ListGroup';
import { ToastContainer, toast } from 'react-toastify';
import DOMPurify from 'dompurify';

const InvitationModal = () => {
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const accessToken = localStorage.getItem('access_token');
    const loggedInUserId = Number(localStorage.getItem('userId'));
    const loggedInUsername = localStorage.getItem('username');

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
          const res = await axios.get(`${import.meta.env.VITE_RAILWAY_URL}/users`, {
            headers:{
              Authorization: `Bearer ${accessToken}`
            }
          })

          const usersWithoutLoggedInU =  res.data.filter((user)=> user.userId !== loggedInUserId )
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

      const handleUserSelect = (user) =>{
        setSelectedUser(user);
      }

      const handleSendInvitation =async() =>{

         if(!selectedUser) return;

            try {
                const newConversationId = crypto.randomUUID();
                const res =await axios.post(`${import.meta.env.VITE_RAILWAY_URL}/invite/${selectedUser.userId}`,{
                    "conversationId":  newConversationId
                    },
                    {
                    headers:{
                        Authorization: `Bearer ${accessToken}`
                    }
                    })

                console.log ('Send a message successful!:', res.data)

            /*  */

            try {
                
                const messageRes =
                    await axios.post(import.meta.env.VITE_RAILWAY_URL + '/messages', {
                        text: `Hej ${selectedUser.username}! Det är ${loggedInUsername}. `,
                        conversationId: newConversationId,  // Use the generated conversationId
                    },
                    {
                        headers: {
                        Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                console.log ('Send a firstmail successful!:', messageRes.data)
                
                //close modal
                handleClose()

                toast.success(
                    <div>Send a invitation and your first mail to ${selectedUser.username} successful!</div>
                )
                 setTimeout (()=>{
                    window.location.reload();// Need to refresh page to show new friend
                 }, 3000)
                

            } catch (error) {
                console.error('Error sending the first message!:', error);
                toast.error(
                <div>
                    <strong>Error sending the first message!</strong><br/>
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(error.response ? error.response.data : error.message) }}>
                    </div>
                </div>
                );

                
            }
     } catch (error) {
                console.error('Error sending invitation:', error);
        toast.error(
        <div>
            <strong>Error sending invitation!</strong><br/>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(error.response ? error.response.data : error.message) }}>
            </div>
        </div>
        );

    }


      }

  return (
    <>
       <Button variant='light' onClick={() => handleShow(true)} >
          <RiSendPlane2Line />
       </Button>
    
        <Modal show={show} fullscreen={fullscreen} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title className="w-100 text-center" >Search for your friend to send invitation</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form className="d-flex justify-content-center m-2 p-2">
                    <Form.Control
                    type="search"
                    placeholder="Search"
                    className="w-75"
                    aria-label="Search"
                    value ={searchTerm}
                    onChange={handleSearchChange}
                    />
                </Form>
         
            <Container style={{ maxHeight: '380px', overflowY: 'auto' }}>
                <ListGroup>
                    { filteredUsers.map((user)=>(
                    <ListGroup.Item 
                        key ={user.userId}
                        action
                        onClick ={()=> handleUserSelect(user)}
                        active={selectedUser && selectedUser.userId === user.userId} // Highlight selected user
                    >
                        {user.username}
                    </ListGroup.Item>
                    ))
                    }

    
                </ListGroup>
            
            </Container>

            <Container className="d-flex justify-content-center p-3">
                {/* Display the preview text if a user is selected */}
                {selectedUser && (
                    
                    <Form.Control className='mt-3'
                        type="text"
                        placeholder= {`Hej ${selectedUser.username}! Det är ${loggedInUsername}. `}
                        aria-label="Disabled input example"
                        readOnly
                        />
                )}

                    <Button className='mt-3 ms-3' disabled={!selectedUser} onClick={handleSendInvitation}>
                            Send Invitation
                    </Button>
            </Container>  

            </Modal.Body>
        </Modal>
        <ToastContainer />
    </>
  )
}

export default InvitationModal