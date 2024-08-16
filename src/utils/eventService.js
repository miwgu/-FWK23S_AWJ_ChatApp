/**
 * When a user is logged out due to a 403 error (token expiration),
 * the UI still displays the username, avatar, and logout link, 
 * even though the user is actually logged out. 
 * 
 * Need to trigger this event when the 403 error occurs
 */
const eventService = {
    triggerLogout() {
      const event = new Event('userLogout');
      window.dispatchEvent(event);
    }
  };
  
  export default eventService;