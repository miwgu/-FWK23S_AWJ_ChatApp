import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { ToastContainer, toast } from 'react-toastify';
import authService from '../utils/authService';
import eventService from '../utils/eventService';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css'
import DeleteModal from './DeleteModal';

const Profile = () => {
    const[username, setUsername]= useState('');
    const[email, setEmail]= useState('');
    const[avatar, setAvatar]= useState('');
    const [modalShow, setModalShow] = useState(false);
 
    const [errors, setErrors]= useState({
    username: '',
    email: '',
    avatar: '',
    });

    const [storedProfile, setStoredProfile] = useState({
    userId: localStorage.getItem('userId'),
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email'),
    avatar: localStorage.getItem('avatar'),
    })
 
    const [isEditMode, setIsEditMode] = useState(false);
    const [hasChanges, setHasChanges] = useState(false); // Track if any changes are made
    const [initialProfile, setInitialProfile] = useState({}); // To store the initial state before editing

    const avatarOptions = [
     'https://i.pravatar.cc/100?img=4',
     'https://i.pravatar.cc/100?img=5',
     'https://i.pravatar.cc/100?img=9',
     'https://i.pravatar.cc/100?img=12',
     'https://i.pravatar.cc/100?img=14',
     'https://i.pravatar.cc/100?img=16',
     'https://i.pravatar.cc/100?img=17',
     'https://i.pravatar.cc/100?img=20',
     'https://i.pravatar.cc/100?img=24',
     'https://i.pravatar.cc/100?img=25',
    ] 

    const handleAvatarSelect = (avatarUrl) =>{
        setAvatar(avatarUrl);
        setHasChanges(true);
    }
 
    useEffect(()=>{
        // Initialize form fields with stored profile data
        setUsername(storedProfile.username || '');
        setEmail(storedProfile.email || '');
        setAvatar(storedProfile.avatar || '');

        // Save initial state
        setInitialProfile({
             username: storedProfile.username, 
             email: storedProfile.email, 
             avatar: storedProfile.avatar 
            }); 

    }, []);
 
 
    const handleUpdate =(e) =>{
     e.preventDefault();
 
     let hasErrors =false;
     let formErrors = {};
   
     if(!username){
       formErrors.username= "Username is required";
       hasErrors = true;
     }
     if(!email){
       formErrors.email= "Email is required";
       hasErrors = true;
     }
    
     if(!avatar){
       formErrors.avatar= "You need to choose an avatar";
       hasErrors = true;
     }
 
     setErrors(formErrors);
 
     if(hasErrors){
       return;  //Client side error: Prevent submit
     }
    
     const accessToken = localStorage.getItem('access_token');
     const sanitizedUsername = DOMPurify.sanitize(username);
     const sanitizedEmail = DOMPurify.sanitize(email);

     const payload ={
        userId: storedProfile.userId, //Add userId from storedProfile
        updatedData: {
            username: sanitizedUsername,
            email:sanitizedEmail,
            avatar,
        }
     };
     
     axios.put(import.meta.env.VITE_RAILWAY_URL + '/user', payload, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
          },
     })
     .then(res=>{
       console.log('Profile Update successful!:', res.data);
       toast.success(<div>Profile update successful! ✨</div>);
     
       // Update the stored profile in both local storage and stat
       setStoredProfile({
        userId: storedProfile.userId,
        username: sanitizedUsername,
        email: sanitizedEmail,
        avatar,
       });

       localStorage.setItem('username', sanitizedUsername);
       localStorage.setItem('email', sanitizedEmail);
       localStorage.setItem('avatar', avatar)

       setTimeout(() =>{
       window.location.reload()}, 3000 ) 

       setIsEditMode(false);
       setHasChanges(false);

       
     })
     .catch(error=>{
 
     if (error.response && error.response.status === 400 ){
       const serverErrorMessage = error.response.data.error;
       const sanitizedServerErrorMessage = DOMPurify.sanitize(serverErrorMessage);
       const existMessage = "Username or email already exists"
       if(sanitizedServerErrorMessage === existMessage){
 
         setErrors({
           ...errors,
           username: sanitizedServerErrorMessage,
           email: sanitizedServerErrorMessage
         
         })
         hasErrors = true;
         
       }
 
     } else {
 
       const sanitizedErrorMessage = DOMPurify.sanitize(error.response ? error.response.data : error.message);
       console.error('Error! registering user:', sanitizedErrorMessage);
       toast.error(
         <div>
          <strong>Registration failed.</strong><br />
          <div dangerouslySetInnerHTML={{ __html: sanitizedErrorMessage }} />
          <p>Please refresh the page and try again.</p>
         </div>
       );
     }
 
      if(hasErrors){
       return; // server side error : prevene submit
     } 
 
     });
    };

     const handleEditClick = () =>{
        setIsEditMode(true)
    }

    const handleInputChange = (setter) =>(e) =>{
        setter (e.target.value);
        setHasChanges(true);
    }
 
    const handleCancelEdit = () => {
        // Reset form fields to the initial state
        setUsername(initialProfile.username);
        setEmail(initialProfile.email);
        setAvatar(initialProfile.avatar);
        setIsEditMode(false); // Exit edit mode
        setHasChanges(false); // No changes
      };

     return (
         <div className='profile_bg'>
     
         <div className='container pt-5 mt-5'>
          <h2 className='center-content mt-3' style={{color:'#ffffff' }}>Profile</h2>
           <Form className='form-container container' onSubmit={handleUpdate} >
             <Form.Group className="mb-3" controlId="formBasicUsername">
               <Form.Label className='left-label'>Username</Form.Label>
               <Form.Control 
                 className={isEditMode ? 'bg-primary' : 'bg-light'} 
                 type="text"
                 placeholder= {storedProfile.username}
                 value={username} 
                 onChange={handleInputChange(setUsername)} 
                 disabled={!isEditMode}
                />
               {errors.username && <p style={{ color: '#ff0066' }}>{errors.username}</p>}
             </Form.Group>
 
             <Form.Group className="mb-3" controlId="formBasicEmail">
               <Form.Label className='left-label'>E-mail</Form.Label>
               <Form.Control 
                 className={isEditMode ? 'bg-primary' : 'bg-light'} 
                 type="email"
                 placeholder= {storedProfile.email}
                 value={email}
                 onChange={handleInputChange(setEmail)} 
                 disabled={!isEditMode}
                 />
                {errors.email && <p style={{ color: '#ff0066' }}>{errors.email}</p>}
             </Form.Group>
 
            {isEditMode &&(
             <DropdownButton id="dropdown-basic-button" title="Select an Avatar">
                 {avatarOptions.map((avatarUrl, index)=>(
                 <Dropdown.Item key ={index} onClick={() => handleAvatarSelect(avatarUrl)}>
                     <img
                     src={avatarUrl}
                     alt={`avatar-${index}`}
                     style={{ width: '30px', height: '30px', marginRight: '10px' }}
                     />
                      Avatar {index + 1}
                 </Dropdown.Item>
             ))}       
             </DropdownButton>
            )}
 
             {errors.avatar && <p style={{ color: '#ff0066' }}>{errors.avatar}</p>}
       
         <div>
           <h5>Selected Avatar:</h5>
           { avatar ? (
           <img src={avatar} alt="Selected Avatar" style={{ width: '100px', height: '100px' }} />
           ):(
             <p style={{color: '#ff0066'}}>Avatar not yet selected.</p>
           )
         }
           </div>
       
     
            <div className='center-content'>
             {!isEditMode && (
               <Button  variant="success" className='mt-2 me-2' onClick={handleEditClick}>
                 Edit
               </Button>
             )}

             {!isEditMode && (
               <Button  variant="danger" className='mt-2' onClick={() => setModalShow(true)}>
                 Delete
               </Button>
             )}

             {isEditMode &&  (
                <Button variant='secondary' className="mt-2 me-2" onClick={handleCancelEdit}>
                 Back
                </Button>
             )}
            
             {isEditMode && hasChanges && (
                <Button variant='primary' type='submit' className='mt-2' >
                 Save
                </Button>
             )}
             </div>
           </Form>
           </div>
           <DeleteModal
             show={modalShow}
             onHide={() => setModalShow(false)}
      />
         </div>
       )
};

export default Profile