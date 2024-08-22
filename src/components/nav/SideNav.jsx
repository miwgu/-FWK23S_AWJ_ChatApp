import React, { useEffect, useState } from 'react'
import * as FaIcons from "react-icons/fa";
import { RiCloseLargeFill } from "react-icons/ri";
import { BiSolidPencil } from "react-icons/bi";
import { IoMdLogIn } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FaRegFaceSmileWink } from "react-icons/fa6";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import {Link, useLocation} from 'react-router-dom';
import './SideNav.css';
import {IconContext} from 'react-icons';
import { useNavigate } from 'react-router-dom';
import authService from '../../utils/authService';
import eventService from '../../utils/eventService';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import SwitchFriendModal from '../SwitchFriendModal';
import InvitationModal from '../InvitationModal';



const SideNav = ({ selectedConversationId, setSelectedConversationId }) => {
    const [sidebar, setSidebar]=useState(false);
    const [isAuth, setIsAuth]= useState(false);
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');

    //const [fullscreen, setFullscreen] = useState(true);
    //const [show, setShow] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState('Friends');
    //const [selectedConversationId, setSelectedConversationId] = useState(null); 
    
    const navigate = useNavigate();
    const location = useLocation();

    const showSidebar =() => setSidebar(!sidebar)

    const syncAuthState=()=>{
        
            const loggedInAuthStatus = localStorage.getItem('isAuthenticated') ;
            const loggedInUsername = localStorage.getItem('username');
            const loggedInAvatar = localStorage.getItem('avatar');
            
            setIsAuth(loggedInAuthStatus);

            if(loggedInAuthStatus){
            setUsername(loggedInUsername || '');
            setAvatar(loggedInAvatar || '');
            } else {
                setUsername('');
                setAvatar('');
            }
    };

    useEffect(()=>{
        syncAuthState();

        window.addEventListener('userLogout', handleLogout);

        // Clean up the event listener when the component unmounts
        return () => {
        window.removeEventListener('userLogout', handleLogout);
        };
    }, []);

    const handleLogout =() =>{
        authService.signOut(()=>{
            eventService.triggerLogout();
            localStorage.clear()
            syncAuthState();//Reset state
            navigate('/')
        })
    };

/*     const handleFriendSelect = (friend) =>{
        setSelectedFriend(friend);
        setShow(false);//close modal

        // all logic after
    }

    const handleShow = (breakpoint) =>{
        setFullscreen(breakpoint);
        setShow(true);
    } */

        useEffect(() => {
            console.log("Selected Conversation ID in SideNav: ", selectedConversationId);
        }, [selectedConversationId]);

  return(
  <>
  <IconContext.Provider value={{color: '#c1c1c1'}}>
   <div className="navbar" >
       <Link to ="#" className = 'menu-bars'>
           <FaIcons.FaBars onClick={showSidebar}/>
       </Link> 

       {/*---------- Display friend selection when on Chat page ------------ */}
       {isAuth && location.pathname === '/chat' && (

        <SwitchFriendModal
           selectedFriend={selectedFriend}
           setSelectedFriend={setSelectedFriend}
           // To update the conversationId
           setSelectedConversationId={setSelectedConversationId}    
        />

       )}

       {/*---------- Display Invitation icon------------ */}
       {isAuth && location.pathname === '/chat' && (

           <InvitationModal />

        )}

       {/*---------- Display loggedin username and avatar------------ */}
       {isAuth && (
        <div className="user-info">
            <span className="username">{username}</span>
            {avatar && <img src={avatar} alt="Avatar" className="avatar" />}
        </div>
       )}

   </div>
    <nav className={sidebar ? 'nav-menu active' : 'nav-menu' }>
        <ul className='nav-menu-items' onClick={showSidebar}>
            <li className ='navbar-toggle'>
                <Link to ="#" >
                    <RiCloseLargeFill  onClick={showSidebar} />
                </Link> 
            </li>
          {/*   {SidebarData.map((item,index) => {
              return(
                  <li key={index} className={item.cName}>
                      <Link to={item.path}>
                          {item.icon}
                          <span>{item.title}</span>
                      </Link>
                  </li>
              )
            })} */}

            
               {!isAuth ?
               <li className='nav-text'>
                    <Link to='/login'>
                        <IoMdLogIn />
                        <span className='uLine-text'>Login</span>
                    </Link>
                </li>:
                <li className='nav-text'>
                <Link to='/' onClick={handleLogout}>
                    <IoMdLogOut />
                    <span className='uLine-text'>Logout</span>
                </Link>
                </li>
                
                }

                {!isAuth ? 
                <li className='nav-text'>
                  <Link to='/register' >
                      <BiSolidPencil />
                      <span className='uLine-text'>Register</span>
                  </Link>

                </li>:
                <li className='nav-text'>
                    <Link to='/profile' >
                        <CgProfile />
                        <span className='uLine-text'>Profile</span>
                    </Link>
                </li>
                                }

                {!isAuth ? 
                null:
                <li className='nav-text'>
                    <Link to='/chat' >
                        <FaRegFaceSmileWink />
                        <span className='uLine-text'>Chat</span>
                    </Link>
                </li>
                                }

            
        </ul>
    </nav>
    </IconContext.Provider>

    {/* Fullscreen Modal for Friend Selection */}
{/*         <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Select a Friend</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Button variant="primary" onClick={() => handleFriendSelect('Oskar')}>Oskar</Button>
                <Button variant="primary" onClick={() => handleFriendSelect('Friend 2')}>Friend 2</Button>
                <Button variant="primary" onClick={() => handleFriendSelect('Friend 3')}>Friend 3</Button>
            </Modal.Body>
        </Modal> */}
  </>
  ) 
}

export default SideNav