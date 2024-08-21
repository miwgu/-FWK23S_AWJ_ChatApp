import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import authService from '../utils/authService';
import eventService from '../utils/eventService';

const SwitchFriendModal = ({selectedFriend, setSelectedFriend,setSelectedConversationId}) => {
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const [conversationIds, setConversationIds] = useState([]);
    const [conversationMap, setConversationMap] = useState({});
    const [usernameAndConversationId, setUsernameAndConversationId] = useState([]);
    const [inviteMap, setInviteMap] = useState({});

    const userId = Number(localStorage.getItem('userId'));
    const accessToken = localStorage.getItem('access_token')

    const handleFriendSelect = (conversationId, username) =>{
        console.log("Selected Conversation ID: ", conversationId);
        // Changed from conversationId to username In Nav I want to show username(same as Selected Button name)
        setSelectedFriend(username);
        setSelectedConversationId(conversationId); 
        setShow(false);//close modal
    }

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

     const getButtonName = (conversationId, index) => {
        return inviteMap[conversationId] || `Friend ${index + 1}`;
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
                    inviteMap[invite.username] = invite.conversationId;
                });

                // setConversationMap(inviteMap);
                setInviteMap(inviteMap)
                 console.log ("inviteMap", inviteMap)

                const inviteConversations = Object.values(inviteMap);
                console.log("Unique conversationIds from invites:", inviteConversations);

                // Combine message and invite conversationIds
                const combinedConversations = [...new Set([...messageConversations, ...inviteConversations])];
                console.log("Combined unique conversationIds:", combinedConversations);

                //setConversationIds(combinedConversations);

                // Create the usernameAndConversationId array
                const usernameAndConversationIdArray = combinedConversations.map((conversationId) => {
                    const username = Object.keys(inviteMap).find(key => inviteMap[key] === conversationId) || null;
                    return { [username]: conversationId };
                });

                setUsernameAndConversationId(usernameAndConversationIdArray);
                console.log("usernameAndConversationIdArray", usernameAndConversationIdArray)
                

            } catch (error){
                console.error('Error fetching messages or user infomation (invites):', error)
                if(error.response && error.response.status === 403 ){
                    handleLogout();
                }
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

            {usernameAndConversationId.length > 0 ? (
            usernameAndConversationId.map((item, index) => {
                    const username = Object.keys(item)[0];
                    const conversationId = item[username];
                    const buttonName = username !== 'null' ? username : `Friend ${index + 1}`;
            return (
              <Button
                key={index}
                variant="primary"
                onClick={() => {
                    //handleFriendSelect(getButtonName(conversationId, index));
                    handleFriendSelect(conversationId,buttonName);
                }}
              >
                {/* {conversationId} */}
                {/* {getButtonName(conversationId, index)} */}
                {buttonName}
              </Button>
            );
           })
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