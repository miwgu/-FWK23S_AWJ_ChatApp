import React, { useEffect, useState } from 'react'
import * as FaIcons from "react-icons/fa";
import { RiCloseLargeFill } from "react-icons/ri";
import { BiSolidPencil } from "react-icons/bi";
import { IoMdLogIn } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import {Link} from 'react-router-dom';
import './SideNav.css';
import {IconContext} from 'react-icons';
import { useNavigate } from 'react-router-dom';
import authService from '../../utils/authService';
import eventService from '../../utils/eventService';


const SideNav = () => {
    const [sidebar, setSidebar]=useState(false);
    const [isAuth, setIsAuth]= useState(false);
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');
    
    const navigate = useNavigate();

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

  return(
  <>
  <IconContext.Provider value={{color: '#c1c1c1'}}>
   <div className="navbar" >
       <Link to ="#" className = 'menu-bars'>
           <FaIcons.FaBars onClick={showSidebar}/>
       </Link> 

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
                </li>}

                {!isAuth ? 
                <li className='nav-text'>
                        <Link to='/register' >
                        <BiSolidPencil />
                        <span className='uLine-text'>Register</span>
                    </Link>

                </li>:
                null}

            
        </ul>
    </nav>
    </IconContext.Provider>
  </>
  ) 
}

export default SideNav