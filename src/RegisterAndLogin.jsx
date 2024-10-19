import React, { useState } from 'react'
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from './UserContext';
const RegisterAndLogin = () => {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
   const {setUsername:setLoggedInUsername,setId}=  useContext(UserContext);
   const [isLoginOrRegister, setIsLoginOrRegister] = useState('register');
  async  function handleSubmit(ev){
    ev.preventDefault();
    const url = isLoginOrRegister === 'register' ? 'register' : 'login'
const {data} = await axios.post(url,{username,password})//here data is getting from the backend in response
 setLoggedInUsername(username);
 setId(data.id);
    }
  return (
    <div className='bg-blue-50 h-screen flex items-center'>
     <form className='w-64 mx-auto mb-12' onSubmit={handleSubmit}>
        <input value={username} 
        onChange={ev =>setUsername(ev.target.value)} 
        type='text' placeholder='UserName' className='block w-full rounded-2xl p-2 mb-2 border'/>
        <input value={password} 
         onChange={ev =>setPassword(ev.target.value)} 
         type='password' placeholder='Password' className='block w-full rounded-2xl p-2 mb-2 border '/>
        <button className='bg-blue-500 text-white block w-full rounded-2xl p-2'>
          {isLoginOrRegister === 'register' ?  'Register': 'Login'}{/**changing the test in register button */}
          </button>
        <div className='text-center m-2'>
       
          {isLoginOrRegister === 'register' && (
            <div>
   Already a member? 
   <button onClick={()=> setIsLoginOrRegister('login')}>Login here</button>
            </div>
          )}
        {isLoginOrRegister === 'login' && (
            <div>
            Dont have an account?
            <button onClick={()=> setIsLoginOrRegister('register')}>Register</button>
                     </div>
        )}
          </div>
     </form>
    </div>
  )
}

export default RegisterAndLogin
