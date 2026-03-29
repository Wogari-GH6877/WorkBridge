import React, { useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { assets } from '../assets/assets';
import API from '../Service/Api'; // Import your Axios instance
import { toast } from 'react-toastify';

function SignUp({ isLogin }) {
  const navigate = useNavigate();
  const [state, setState] = useState("SignUp"); // Toggle between "SignUp" and "Login"
  
  // State for form fields
  const [Fname, setFName] = useState('');
  const [Lname, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Cpassword, setCPassword] = useState('');

  // Sync internal state with the URL/Prop
  useEffect(() => {
    if (isLogin) {
      setState("Login");
    } else {
      setState("SignUp");
    }
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload

    // Basic Validation
    if (state === "SignUp" && password !== Cpassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      // Logic to switch endpoint based on state
      const endpoint = state === "SignUp" ? "/sign-up" : "/login";
      
      const formData = state === "SignUp" 
        ? { name: `${Fname} ${Lname}`, email, password } 
        : { email, password };

      const res = await API.post("/api/user"+ endpoint, formData);

      if (res.data.success) {
        toast.success(res.data.message);
        // If login/signup returns a token, save it
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        navigate("/"); // Redirect on success
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className='flex gap-7'>
      <div className='h-screen flex justify-center w-full'>
        <form onSubmit={handleSubmit} className='mt-5 flex justify-center items-center px-4 w-150'>
          <div className='w-full border border-gray-300 shadow-lg px-6 py-8 rounded-xl bg-white'>
            <h2 className='text-xl mb-2 font-semibold text-gray-600'>
              <img src={assets.logo} alt="Logo" className='mt-3 mb-2' />
              {state === "SignUp" ? "Create Account" : "Login"}
            </h2>

            {/* Conditionally render Name fields only for SignUp */}
            {state === "SignUp" && (
              <>
                <div className='flex flex-col gap-2 mb-2'>
                  <span className='text-sm text-gray-600'>First Name</span>
                  <input
                    className='bg-white py-2 px-3 border border-gray-300 rounded-md'
                    type="text"
                    onChange={(e) => setFName(e.target.value)}
                    value={Fname}
                    required
                  />
                </div>
                <div className='flex flex-col gap-2 mb-2'>
                  <span className='text-sm text-gray-600'>Last Name</span>
                  <input
                    className='bg-white py-2 px-3 border border-gray-300 rounded-md'
                    type="text"
                    onChange={(e) => setLName(e.target.value)}
                    value={Lname}
                    required
                  />
                </div>
              </>
            )}

            <div className='flex flex-col gap-2 mb-2'>
              <span className='text-sm text-gray-600'>Email</span>
              <input
                className='bg-white py-2 px-3 border border-gray-300 rounded-md'
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <div className='flex flex-col gap-2 mb-2'>
              <span className='text-sm text-gray-600'>Password</span>
              <input
                className='bg-white py-2 px-3 border border-gray-300 rounded-md'
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>

            {state === "SignUp" && (
              <div className='flex flex-col gap-2 mb-2'>
                <span className='text-sm text-gray-600'>Confirm Password</span>
                <input
                  className='bg-white py-2 px-3 border border-gray-300 rounded-md'
                  type="password"
                  onChange={(e) => setCPassword(e.target.value)}
                  value={Cpassword}
                  required
                />
              </div>
            )}

            <button type="submit" className='py-2 w-full bg-blue-600 rounded-lg text-white mt-4'>
              {state === "SignUp" ? "Create Account" : "Login"}
            </button>

            <p className='text-sm mt-4 text-center'>
              {state === "SignUp" ? "Already have an account? " : "Don't have an account? "}
              <span
                className='underline text-blue-700 cursor-pointer'
                onClick={() => setState(state === "SignUp" ? "Login" : "SignUp")}
              >
                {state === "SignUp" ? "Login here" : "Sign Up"}
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;


