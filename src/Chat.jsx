import React, { useContext, useEffect, useState } from 'react';
import Avatar from './Avatar';
import Logo from './Logo';
import { UserContext } from './UserContext';

const Chat = () => {
  const [ws, setWs] = useState(null); // storing the state
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const {username,id} = useContext(UserContext);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000');
    setWs(ws);
    ws.addEventListener('message', handleMessage);

    // Cleanup function to close the WebSocket connection
    return () => {
      ws.close();
    };
  }, []);

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    if ('online' in messageData) {
      showOnlinePeople(messageData.online);
    }
  }
{/*for future scope we can have separate component for this contacts if it grows too much */}
const onlinepeopleExclouruser = {...onlinePeople};
delete onlinepeopleExclouruser[id]
  return (
    <div className='flex h-screen'>
      <div className="bg-white w-1/3 ">
       <Logo/>
    
        {Object.keys(onlinepeopleExclouruser).map(userId => (
          <div 
            key={userId}
            onClick={() => setSelectedUserId(userId)}
            className={`border-b border-gray-100 py-2 pl-2 flex items-center gap-2 cursor-pointer ${userId === selectedUserId ? 'bg-blue-200' : ''}`}
          >
            {userId === selectedUserId && (
              <div className='w-1 bg-blue-500 '></div>
            )}
            <Avatar username={onlinePeople[userId]} userId={userId} />
            <span className='text-gray-800'>{onlinePeople[userId]}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col bg-blue-50 w-2/3 p-2">
        <div className='flex-grow'>Messages with selected person</div>
        <div className='flex gap-2'>
          <input
            type="text"
            placeholder="Type your message"
            className="bg-white border p-2 flex-grow rounded-sm"
          />
          <button className='bg-blue-500 p-2 text-white rounded-sm'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
