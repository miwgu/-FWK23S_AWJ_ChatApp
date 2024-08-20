import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

const SwitchFriendModal = ({selectedFriend, setSelectedFriend}) => {
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);

    const handleFriendSelect = (friend) =>{
        setSelectedFriend(friend);
        setShow(false);//close modal

        // all logic after
    }

    const handleShow = (breakpoint) =>{
        setFullscreen(breakpoint);
        setShow(true);
    }
  
    return (
    <>
       <Button variant='light' onClick={() => handleShow(true)} >
         {selectedFriend} 
         <MdOutlineKeyboardArrowDown />
       </Button>
    
        <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Select a Friend</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Button variant="primary" onClick={() => handleFriendSelect('Oskar')}>Oskar</Button>
                <Button variant="primary" onClick={() => handleFriendSelect('Friend 2')}>Friend 2</Button>
                <Button variant="primary" onClick={() => handleFriendSelect('Friend 3')}>Friend 3</Button>
            </Modal.Body>
        </Modal>
    </>
  )
}

export default SwitchFriendModal