import React from 'react'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import authService from '../utils/authService';
import eventService from '../utils/eventService'
import { IoIosWarning } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeleteModal = (props) => {

    const handleDelete =async () =>{

        const loggedInUserId= Number(localStorage.getItem('userId'));
  
       try{
        const accessToken = localStorage.getItem('access_token');
        await axios.delete(`${import.meta.env.VITE_RAILWAY_URL}/users/${loggedInUserId}` ,{
        headers :{
          Authorization: `Bearer ${accessToken}`
        }
      });
       
        console.log("Delete account successful!")
        handleLogout();
        
       }catch (error){
        console.error('Error deleting user´s account:', error);
        toast.error(
          <div>
            <strong>Error deleting user´s account!</strong><br/>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(error.response ? error.response.data : error.message) }}>
            </div>
          </div>
          );
  
       }
  
      }

      const handleLogout =() =>{
        authService.signOut(()=>{
            eventService.triggerLogout();// // Trigger logout event
            //remove all items from localStrage 
            localStorage.clear();
            navigate('/login')
        })
      };

    return (
        <>
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter" className="w-100 text-center">
               <IoIosWarning color="#F51A1A" size="2em" />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <h4>Are you sure?</h4>
            <p>
              Do you really want to delete your account for Chat?
              This process cannot be undone.
            </p>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={props.onHide}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </Modal.Footer>
        </Modal>
        <ToastContainer />
    
        </>
      );
}

export default DeleteModal