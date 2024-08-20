import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

const SwitchFriendModal = ({selectedFriend, setSelectedFriend}) => {
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const [conversationIds, setConversationIds] = useState([]);
    const [conversationMap, setConversationMap] = useState({});

    const userId = Number(localStorage.getItem('userId'));
    const accessToken = localStorage.getItem('access_token')

    const handleFriendSelect = (friend) =>{
        setSelectedFriend(friend);
        setShow(false);//close modal
    }

    const handleShow = (breakpoint) =>{
        setFullscreen(breakpoint);
        setShow(true);
    }
  
    const handleClose = () => {
        setShow(false);
      };

    const getButtonName = (conversationId) => {
        return conversationMap[conversationId] || `Friend ${conversationIds.indexOf(conversationId) + 1}`;
      };

    useEffect (()=>{

        const fetchMessagesAndInvites = async () => {
            try{
                /* Get loggedin users´ own info */
                const messagesRes = await axios.get(import.meta.env.VITE_RAILWAY_URL + '/messages', {
                    headers: {
                      Authorization: `Bearer ${accessToken}`
                    }
                  });
                const messages = messagesRes.data;

                // Filter out messages where comversationId is null
                const validMessages = messages.filter(msg =>msg.conversationId !==null)
                console.log("Valid messages with conversationId:", validMessages);

                // unique conversatioIds
                const messageConversations = [...new Set(validMessages.map(msg => msg.conversationId))];
                console.log("Unique conversationIds from messages:", messageConversations);

                /* Get loggedin users´ own info with who ivite the user and conversationId */
                const userRes = await axios.get(`${import.meta.env.VITE_RAILWAY_URL}/users/${userId}`, {
                    headers: {
                      Authorization: `Bearer ${accessToken}`
                    }
                  });

                console.log("Full user response:", userRes);
                console.log("User response data:", userRes.data);
                
                const inviteString = userRes.data[0].invite;
                console.log("ID test", userRes.data[0].id)
                console.log("Invite string:", inviteString);

                const invites = JSON.parse(inviteString || '[]');

                console.log ("invites", invites)

                //Filter the latest invate per username
                const inviteMap = {};
                invites.forEach(invite => {
                    console.log(`Mapping invite for ${invite.username}:`, invite.conversationId);
                  inviteMap[invite.username] = invite.conversationId;
                 });

                 setConversationMap(inviteMap);
                 console.log ("inviteMap", inviteMap)

                const inviteConversations = Object.values(inviteMap);
                console.log("Unique conversationIds from invites:", inviteConversations);

                // Combine message and invite conversationIds
                const combinedConversations = [...new Set([...messageConversations, ...inviteConversations])];
                console.log("Combined unique conversationIds:", combinedConversations);

                setConversationIds(combinedConversations);

            } catch (error){
                console.error('Error fetching messages or user infomation (invites):', error)
            }
        };

        fetchMessagesAndInvites();
    },[])

    return (
    <>
       <Button variant='light' onClick={() => handleShow(true)} >
         {selectedFriend} 
         <MdOutlineKeyboardArrowDown />
       </Button>
    
        <Modal show={show} fullscreen={fullscreen} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select a Friend</Modal.Title>
            </Modal.Header>
            <Modal.Body>

            {conversationIds.length > 0 ? (
            conversationIds.map((conversationId, index) => (
              <Button
                key={index}
                variant="primary"
                onClick={() => {
                    handleFriendSelect(getButtonName(conversationId));
                }}
              >
                {/* {conversationId} */}
                {getButtonName(conversationId)}
              </Button>
            ))
          ) : (
            <p>No conversations available</p>
          )}
            
            
               {/*  <Button variant="primary" onClick={() => handleFriendSelect('Oskar')}>Oskar</Button>
                <Button variant="primary" onClick={() => handleFriendSelect('Friend 2')}>Friend 2</Button>
                <Button variant="primary" onClick={() => handleFriendSelect('Friend 3')}>Friend 3</Button> */}
            </Modal.Body>
        </Modal>
    </>
  )
}

export default SwitchFriendModal