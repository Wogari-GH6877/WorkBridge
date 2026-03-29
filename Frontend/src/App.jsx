import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import MyApplications from './Pages/MyApplications';
import Contact from './Pages/Contact';
import Navbar from './Components/Navbar';
// import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import CreateJob from './Pages/CreateJob';
import ProtectedRoute from './Components/ProtectedRoute'; // Import the wrapper
import JobDetails from './Pages/JobDetails';
import JobApplicants from './Pages/JobApplicants';
import MyJobs from './Pages/My Jobs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />

        
       {/* Redirect if already logged in */}
        <Route path="/login" element={token ? <Navigate to="/" /> : <SignUp isLogin={true} />} />
        <Route path="/sign-up" element={token ? <Navigate to="/" /> : <SignUp isLogin={false} />} />

        {/* Protected Routes - Only accessible if token exists */}
        <Route 
          path="/my-application" 
          element={<ProtectedRoute><MyApplications /></ProtectedRoute>} 
        />
        <Route 
          path="/create-job" 
          element={<ProtectedRoute><CreateJob /></ProtectedRoute>} 
        />

        <Route path="/my-jobs" element={<ProtectedRoute><MyJobs /></ProtectedRoute>} />

        <Route path="/job/:id" element={<JobDetails />} />
        // App.js
        <Route path="/jobs/:jobId/applications" element={<JobApplicants />} />
      </Routes>
    </div>
  );
}

export default App;


