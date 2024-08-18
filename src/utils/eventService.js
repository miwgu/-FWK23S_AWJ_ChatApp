/**
 * When a user is logged out by itself and due to a 403 error (token expiration),
 * the UI still displays the username, avatar, and logout link, 
 * even though the user is actually logged out. 
 * 
 * Need to trigger this event when the user logout
 */
const eventService = {
    triggerLogout() {
      const event = new Event('userLogout');
      window.dispatchEvent(event);

      // This forces a full page reload 
      //otherwise user cannot login again without refresh login page manually
      window.location.reload(); 
    }
  };
  
  export default eventService;