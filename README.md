# Frontend_React_ChatApp
##  Backend 
Use CSRF JWT
Swagger: https://chatify-api.up.railway.app/api-docs/

## How to start (React.js)
npm install react-cookie axios dompurify  react-toastify react-bootstrap bootstrap
### Local
npm run dev

sentry.io -> 
npm install --save @sentry/react

### Deploy
https://chatapp-mi.netlify.app/
*Unstable sometimes you can get 404 but you go back to this URL and click link to a page where you want

## Log in 
- user1 Mi  password:1
- user2 Mii  password:2
- user3 Miii  password:3
- user4 Mika  password:4
- user5 Reiko  password:5

## Logic of Chat with Friend
There is no logic for group-chat in frontend (It is possible to do group chat using this backend)
Chat is just one by one with conversationId
Even if the friend deleted his/ har accont loggedIn user can send message to the user which deleted own account (There is no logic to delete conversationId in the backend)
- coversationId: Login user can generate conversionId when send invitation to other user (Friend)

### Invite a user(Friend) to chat
- When a user invite friends the user can send invitatios to a same user many times-> send meny conversationId  
- When a user send invitation the user sand a first fixt text, `Hej ${selectedUser.username}! Det är ${loggedInUsername}. 
- When a user invite a friend  the friend-name does not be displayed in Switch friend. You can find invited friends as Friend 1,2,3....
* Even if you invite same user many times it is displayes Friend 1 Frend 5. 
　Multiple invitations to the same person appear as if they are sent to different people.
　This is something to consider.(The first fixed message has users name who get a invitation it can be potential ...(there is no userid who get invitation in backend )

### You get invitations
- When a user which recieve invitation take the latest conversationId if the user get many invitations by same friend. (Frontend controll it)
- The friend-name which send invitation is displayed in Switch friend.
*But a user can change own username. This is something to consider. 


