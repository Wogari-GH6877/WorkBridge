import React, { Children, createContext, useContext, useState,useEffect, use } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
export const AppContext=createContext()

function AppContextProvider(props) {
     

  const backendUrl="http://localhost:5000"
   const currencySymbol='$';
  const [token,setToken]=useState(localStorage.getItem("token") ? localStorage.getItem("token") : false);
  const [userData,setUserData]=useState(false);
  const [JobsList,setJobsList]=useState([])

  // console.log("Backend URL:", backendUrl);

  const getJobData= async()=>{
          
  
          try {
              const {data}=await axios.get(backendUrl + "/api/user/jobs");
              if(data.success){
                  setJobsList(data.jobs);
                  console.log(data)
              }else{
                  toast.error(data.message);
              }
          } catch (error) {
              console.log(error);
              // toast.error(error.message);
          }
      }




      
const value={currencySymbol,
  backendUrl,token,setToken,userData,setUserData,setJobsList,JobsList}

  useEffect(()=>{
          getJobData();
      },[])

    


  return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider