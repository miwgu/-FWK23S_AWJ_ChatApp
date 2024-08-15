import React from 'react'
import { useEffect } from 'react';

const Chat = () => {

  useEffect(() => {
    // Check if the page has been refreshed before 
    // Delete hasRefreshed when user logout 
    const hasRefreshed = localStorage.getItem('hasRefreshed');
    
    if (!hasRefreshed) {
      // If not, reload the page
      localStorage.setItem('hasRefreshed', 'true');
      window.location.reload();
    }
  }, []);

  return (
    <div>Chat</div>
  )
}

export default Chat