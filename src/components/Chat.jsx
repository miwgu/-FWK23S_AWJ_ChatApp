import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';
import { Container } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { PiTrashDuotone } from "react-icons/pi";

const Chat = () => {

  const [messages, setMessages] = useState([]);
  const [fakeChat] = useState([
    {
      id:1,
      userId: 0,
      text: "Hej Det är jag. Vad gör du?",
      createdAt: "2024-08-15T11:19:56.240Z",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Oskar",
      conversationId: null
    },
    { 
      id:2,
      userId: 0,
      text: "Det är Oskar",
      createdAt: "2024-08-15T11:20:56.240Z",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Oskar",
      conversationId: null
    },
    { 
      id:3,
      userId: 0,
      text: "Är du inte där? hej....!",
      createdAt: "2024-08-15T11:21:56.240Z",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Oskar",
      conversationId: null
    }
  ]);

  //In localStrage userId stored as string so it change to Number
  const loggedInUserId = Number(localStorage.getItem('userId'));

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

    const getMessages = async ()=>{
      try {
        const accessToken = localStorage.getItem('access_token')
        const res = await axios.get(import.meta.env.VITE_RAILWAY_URL + '/messages',{
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        setMessages(res.data);
        console.log(res.data);
      } catch (error){
        console.error('Error fetchinf messages:', error);
      }
    };

    getMessages();
  }, []);

  const handleDeleteMessage = async (msgId) =>{
   try{
    const accessToken = localStorage.getItem('access_token');
    await axios.delete(import.meta.env.VITE_RAILWAY_URL + '/messages/{msgId}' ,{
      headers :{
        Authorization: `Bearer ${accessToken}`
      }
    });

    // Filter and save remaining messages except deleted messages
      setMessages ((prevMessages) => prevMessages.filter ((m)=> m.id !==msgId))

   } catch (error){
    console.error('Error deleting message:', error);

   }
  }

  const isLoggedInUser = (userId) => userId === loggedInUserId;
  console.log(loggedInUserId)
  
  //Sorts the combined all message array by the createdAt date.
  const allMessages =[...messages, ...fakeChat].sort((a,b)=> new Date(a.createdAt - new Date(b.createdAt)));
  console.table(allMessages);

  // OR log using JSON.stringify
  console.log(JSON.stringify(allMessages, null, 2));

  return (
    <Container className="chat-container">
      <div className="messages">
        {allMessages.map((message) => (
          
          <div
            key= {message.id} 
            
            className={`message ${isLoggedInUser(message.userId) ? 'right' : 'left'}`}
          >
            {!isLoggedInUser(message.userId) && (
            <div 
             key= {message.id}
             className="avatar">
              <img src={message.avatar} alt="Avatar" />
            </div>
            )}
            <Container className={`text ${isLoggedInUser(message.userId) ? 'right' : 'left'}`}>
              {message.text}

              {isLoggedInUser(message.userId) && ( 
                <Link to ="#" className='delete-icon' onClick={() => handleDeleteMessage(message.id)}>
                <PiTrashDuotone />
                </Link>
              )}
            </Container>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Chat