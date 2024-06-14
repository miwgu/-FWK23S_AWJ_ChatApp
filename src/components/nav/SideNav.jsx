import React, { useState } from 'react'
import * as FaIcons from "react-icons/fa";
import { RiCloseLargeFill } from "react-icons/ri";
import { BiSolidPencil } from "react-icons/bi";
import { IoMdLogIn } from "react-icons/io";
import {Link} from 'react-router-dom';
import './SideNav.css';
import {IconContext} from 'react-icons';


const SideNav = () => {
    const [sidebar, setSidebar]=useState(false)
    const showSidebar =() => setSidebar(!sidebar)
  return(
  <>
  <IconContext.Provider value={{color: '#c1c1c1'}}>
   <div className="navbar" >
       <Link to ="#" className = 'menu-bars'>
           <FaIcons.FaBars onClick={showSidebar}/>
       </Link> 
       {/* <Link to="#" className='menu-bars' onClick={showSidebar}>
            {sidebar ? <FaIcons.FaRegWindowClose /> : <FaIcons.FaBars />}
        </Link> */}
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

            
                <li className='nav-text'>
                    <Link to='/login' >
                        <IoMdLogIn />
                        <span>Login</span>
                    </Link>
                </li>
                <li className='nav-text'>
                        <Link to='/register' >
                        <BiSolidPencil />
                        <span>Register</span>
                    </Link>

                </li>
            
        </ul>
    </nav>
    </IconContext.Provider>
  </>
  ) 
}

export default SideNav