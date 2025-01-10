import React from 'react'
import ProfileInfo from './Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom';

const Navbar = ({userInfo}) => {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  }


  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
      <img src="https://i.ibb.co/Ky0rm7t/logo.png" alt="logo" className="h-11" />

      {isToken && <ProfileInfo userInfo= {userInfo} onLogout={onLogout}/>}
    </div>
  )
}

export default Navbar
