import React, { useContext } from 'react'
import { UserContext } from './UserContext';
import RegisterAndLogin from './RegisterAndLogin';

const Routes = () => {
    const {username,id} = useContext(UserContext);
    if(username){
      return 'Loggid In!'+username;
    }




  return (
    <RegisterAndLogin/>
  )
}

export default Routes
