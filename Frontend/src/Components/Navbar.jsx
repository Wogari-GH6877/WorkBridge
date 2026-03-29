import React from 'react'
import { useNavigate, NavLink } from "react-router-dom"
import { assets } from '../assets/assets';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const NavList = [
    { label: "HOME", link: "/" },
    { label: "MY-APPLICATION", link: "/my-application" },
    { label: "MY JOBS", link: "/my-jobs" }
  ];

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload(); 
  }

  // Define a shared class for the professional rectangular look
  const btnBase = "text-sm font-medium px-6 py-2 rounded-md transition-all duration-300 active:scale-95";

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 border-b border-gray-200 bg-white py-4'>
      <div className='flex items-center gap-2'>
        <img 
          className='w-28 sm:w-32 cursor-pointer' 
          src={assets.logo} 
          alt="Logo" 
          onClick={() => navigate("/")} 
        />
      </div>

      <div className='hidden md:flex gap-8'>
        {NavList.map((item, index) => (
          <NavLink 
            to={item.link} 
            key={index} 
            className={({ isActive }) => 
              `font-medium text-lg transition-colors ${isActive ? "text-primary border-b-2 border-primary" : "text-gray-600 hover:text-primary"}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className='flex gap-3'>
        {!token ? (
          <>
            <button 
              onClick={() => navigate("/login")} 
              className={`${btnBase} border border-primary text-primary hover:bg-blue-50`}
            >
              Login
            </button>
            <button 
              onClick={() => navigate("/sign-up")} 
              className={`${btnBase} bg-primary text-white hover:bg-blue-700 shadow-sm`}
            >
              Sign Up
            </button>
          </>
        ) : (
          <button 
            onClick={logout} 
            className={`${btnBase} bg-red-600 text-white hover:bg-red-700 shadow-sm`}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar