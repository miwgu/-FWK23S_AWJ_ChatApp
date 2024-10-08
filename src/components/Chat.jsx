import React from 'react'
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css';
import { Form } from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import { PiTrashDuotone } from "react-icons/pi";
import { IoMdSend } from "react-icons/io";
import authService from '../utils/authService';
import eventService from '../utils/eventService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DOMPurify from 'dompurify';


const Chat = ({ selectedConversationId }) => {

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [allUsers, setAllUsers] = useState([]); // To stor alluser to show Avatar

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);// Reference to the bottom of the chat

  //In localStrage userId stored as string so it change to Number
  const loggedInUserId = Number(localStorage.getItem('userId'));

  // Trigger getMessages when selectedConversationId changes
  useEffect(() => {
    console.log('Chat',"Selected ConversationId:", selectedConversationId);
    getMessages();
    getAllUsers();
  }, [selectedConversationId]);
  
  useEffect(() => {
    //--------Here to refresh this page to show loggind user name and avatar-----------
    // Check if the page has been refreshed before 
    // Delete hasRefreshed when user logout 
    const hasRefreshed = localStorage.getItem('hasRefreshed');
    
    if (!hasRefreshed) {
      // If not, reload the page
      localStorage.setItem('hasRefreshed', 'true');
      window.location.reload();
    }
    //-------refresh page end-------------

    getMessages();
  }, []);

  

  const getMessages = async ()=>{
    try {
      const accessToken = localStorage.getItem('access_token')
      
      console.log("Selected ConversationId", selectedConversationId)
      if(selectedConversationId){
      const res = await axios.get(`${import.meta.env.VITE_RAILWAY_URL}/messages?conversationId=${selectedConversationId}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Convert message IDs to integers
      const messagesWithIntIds = res.data.map((msg) => ({
        ...msg,
        id: parseInt(msg.id, 10),  // Convert ID to integer
      }));

      setMessages(messagesWithIntIds);
      console.log('Chat','Fetched messages',messagesWithIntIds);
    } else {

      setMessages([]);
      console.log('No conversation selected, empty messages array set.');

    }
      
    } catch (error){
      console.error('Error fetching messages:', error);
      if(error.response && error.response.status === 403 ){
       handleLogout();
      }
    }
  };

  const getAllUsers = async () =>{
    try {
      const accessToken = localStorage.getItem('access_token');
      const res = await axios.get(`${import.meta.env.VITE_RAILWAY_URL}/users`, {
        headers:{
          Authorization: `Bearer ${accessToken}`
        }
      })
      setAllUsers(res.data)
    }catch (error){
      console.error('Error fetching users:', error);

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

  const handleDeleteMessage = async (msgId) =>{
    
    const intMsgId = parseInt(msgId, 10);//It should be Integer

   try{
    const accessToken = localStorage.getItem('access_token');
    await axios.delete(`${import.meta.env.VITE_RAILWAY_URL}/messages/${intMsgId}` ,{
      headers :{
        Authorization: `Bearer ${accessToken}`
      }
    });

    // Filter and save remaining messages except deleted messages
      setMessages ((prevMessages) => prevMessages.filter ((msg)=> msg.id !==intMsgId))
      console.log('Message deleted successfully!');

   } catch (error){
    console.error('Error deleting message:', error);
   }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    console.log('Try send message');

    if (newMessage.trim() === '') return;

    // Sanitize the message before sending
    const sanitizedMessage = DOMPurify.sanitize(newMessage);

    try{
      const accessToken = localStorage.getItem('access_token');
      const res =
      await axios.post(import.meta.env.VITE_RAILWAY_URL + '/messages', {
        text: sanitizedMessage,
        conversationId: selectedConversationId,  // change from null to chosen conversationId
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
    }
  );

      console.log ('Send a message successful!:', res.data)
      setNewMessage(''); // Clear the input field
      getMessages(); // Fetch message again after successful post new message

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(
      <div>
        <strong>Error sending message!</strong><br/>
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(error.response ? error.response.data : error.message) }}>
        </div>
      </div>
      );
    }
  };


  const isLoggedInUser = (userId) => userId === loggedInUserId;//Boolean true
  console.log(loggedInUserId)
  
  //sort the combined all messages in ascending order by the createdAt timestamp
  const allMessages = [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  console.table(allMessages);

  // log using JSON.stringify
  console.log(JSON.stringify(allMessages, null, 2));

  //Scroll to bottom whenever allMessages change
  useEffect(() => {
    if (messagesEndRef.current) { // Need to check  if the messagesEndRef exists (the bottom of the message list has been rendered)
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allMessages]);

  return (
    <div className="chat-container">
      <div className="messages">
        {allMessages.map((message) => {
          console.log("All user:", allUsers)
          console.log("all Messages:", allMessages )

          //Need to find sender´s id from all messages for showing sender´s Avatar 
          const sender = allUsers.find(user => user.userId === message.userId)
          console.log("Sender", sender)
          return(
          <div
            key= {message.id}  
            className={`message ${isLoggedInUser(message.userId) ? 'right' : 'left'}`}
          >
            {!isLoggedInUser(message.userId) && sender && (
            <div 
             className="avatar">
              <img src={sender.avatar} alt="Avatar" />
            </div>
            )}
            <div className={`text ${isLoggedInUser(message.userId) ? 'right' : 'left'}`}>
              {message.text}

              {isLoggedInUser(message.userId) && ( 
                <Link to ="#" className='delete-icon' onClick={() => handleDeleteMessage(message.id)}>
                <PiTrashDuotone />
                </Link>
              )}
            </div>
          </div>
    );
})}
        {/* This is the end of the messages to scroll into view */}
        <div ref={messagesEndRef}/>

      </div>
      <div className='message-input'>
      <Form.Control 
          type="text" 
          className ="message-input-field"
          placeholder="Send your message"
          value ={newMessage}
          onChange ={(e)=> setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
           />
           <IoMdSend 
            className='send-icon'
            onClick={handleSendMessage} />
      </div>
    </div>
  );
};

export default Chat