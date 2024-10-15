import React, { useState } from 'react'
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from './UserContext';
const Register = () => {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState();
   const {setUsernam:setLoggedInUsername,setId}=  useContext(UserContext);
  async  function register(ev){
    ev.preventDefault();
const {data} = await axios.post('/register',{username,password})//here data is getting from the backend in response
 setLoggedInUsername(username);
 setId(data.id);
    }
  return (
    <div className='bg-blue-50 h-screen flex items-center'>
     <form className='w-64 mx-auto mb-12' onSubmit={register}>
        <input value={username} 
        onChange={ev =>setUsername(ev.target.value)} 
        type='text' placeholder='UserName' className='block w-full rounded-2xl p-2 mb-2 border'/>
        <input value={password} 
         onChange={ev =>setPassword(ev.target.value)} 
         type='password' placeholder='Password' className='block w-full rounded-2xl p-2 mb-2 border '/>
        <button className='bg-blue-500 text-white block w-full rounded-2xl p-2'>Register</button>
     </form>
    </div>
  )
}

export default Register
