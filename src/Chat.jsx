import React, { useContext, useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import Logo from './Logo';
import { UserContext } from './UserContext';
import axios from 'axios';

const Chat = () => {
  // State to store WebSocket connection
  const [ws, setWs] = useState(null);
  // State to store online users
  const [onlinePeople, setOnlinePeople] = useState({});
  // State to track selected user for chat
  const [selectedUserId, setSelectedUserId] = useState(null);
  //state for messages
  const [newMessageText,setNewMessageText] = useState('');
  //state for storing messages
  const [messages,setMessages] = useState([]);
  const { username, id } = useContext(UserContext);
  const divUnderMessages = useRef();

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket('ws://localhost:4000');
    setWs(ws);

    // Add event listener for receiving messages
    ws.addEventListener('message', handleMessage);

    // Cleanup function to close the WebSocket connection when component unmounts
    return () => {
      ws.close();
    };
  }, []);

  // Function to update the online users' list
  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  // Function to handle incoming WebSocket messages
  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    console.log({ev})
    // Check if the message contains online user info
    if ('online' in messageData) {
      showOnlinePeople(messageData.online);
    }else if('text' in messageData){
     setMessages(prev=>([...prev,{...messageData}]));
    }
  }
//function to send message
  function sendMessage(ev){
   
ev.preventDefault(ev);
ws.send(JSON.stringify({
 
    recepient: selectedUserId,
    text:newMessageText,
  }
));
setNewMessageText('')
setMessages(prev => ([...prev,{
  text:newMessageText,
   sender:id,
   recepient:selectedUserId,
   id:Date.now(),
  
  }]))
  }
  useEffect(()=>{
    const div =  divUnderMessages.current;
    if(div){
      div.scrollIntoView({behavior:'smooth',block:'end'});//this useeffect is used to slide the mssg section down 
    }

  },[messages])

  useEffect(()=>{
if(selectedUserId){
  axios.get('/messages/'+selectedUserId)
}
  },[selectedUserId])



  // Exclude the current user from the list of online people
  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[id];

  return (
    <div className='flex h-screen'>
      {/* Sidebar for online users */}
      <div className="bg-white w-1/3">
        <Logo />
        {/* List of online users */}
        {Object.keys(onlinePeopleExclOurUser).map(userId => (
          <div 
            key={userId}
            onClick={() => setSelectedUserId(userId)}
            className={`border-b border-gray-100 flex items-center gap-2 cursor-pointer ${userId === selectedUserId ? 'bg-blue-200' : ''}`}
          >
            {/* Highlighted bar for selected user */}
            {userId === selectedUserId && (
              <div className='w-1 bg-blue-500 h-12 rounded-md'></div>
            )}
            <div className="flex gap-2 py-2 pl-2 items-center">
              <Avatar username={onlinePeople[userId]} userId={userId} />
              <span className='text-gray-800'>{onlinePeople[userId]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main chat area */}
      <div className="flex flex-col bg-blue-50 w-2/3 p-2">
        <div className='flex-grow'>{!selectedUserId && (
          <div className='flex  h-full items-center justify-center'> 
          <div className='text-gray-400'>
         &larr; Select a person from sidebar
          </div>
          </div>
        )}
        {!!selectedUserId && (
          
 <div className='relative h-full '>
     <div className='overflow-y-scroll absolute top-0 left-0 right-0 bottom-2'>{/**to pritn all the messages */}
            {messages.map(message =>(
              <div className={(message.sender === id ? 'text-right': 'text-left')}>
  <div className={'text-left inline-block p-2 my-2 rounded-md text-sm '+(message.sender === id ? 'bg-blue-500 text-white': 'bg-white text-gray-500')}> 
               sender:{message.sender}<br/>
               my id:{id}<br/>
               {message.text}</div> </div>
            ))}
            <div  ref={divUnderMessages}> </div>
          </div> 
           </div>
        
     
        )}
        </div>
{/*logic to not see the send message form if we haven't selected the user still  */}
{!!selectedUserId && (
 <form className='flex gap-2' onSubmit={sendMessage}>
 {/* Input for typing new messages */}
 <input
   type="text"
   value={newMessageText}
   onChange={ev => setNewMessageText(ev.target.value)}
   placeholder="Type your message"
   className="bg-white border p-2 flex-grow rounded-sm"
 />
 {/* Send button */}
 <button type='submit' className='bg-blue-500 p-2 text-white rounded-sm'>
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
     <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
   </svg>
 </button>
</form>
)}
 
      </div>
    </div>
  );
};

export default Chat;
