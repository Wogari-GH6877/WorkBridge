import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../Service/Api';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        // This hits your backend to get only YOUR jobs
        const res = await API.get('/api/user/my-posted-jobs'); 
        if (res.data.success) setJobs(res.data.jobs);
      } catch (err) {
        console.error("Error loading jobs", err);
      }
    };
    fetchMyJobs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">Your Job Postings</h1>
      <div className="grid gap-6">
        {jobs.map(job => (
          <div key={job._id} className="p-6 border rounded-2xl flex justify-between items-center bg-white shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
              <p className="text-gray-500">{job.location} • {job.category}</p>
            </div>
            
            {/* THIS IS THE KEY: We pass the REAL job._id here */}
            <button 
              onClick={() => navigate(`/jobs/${job._id}/applications`)}
              className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-opacity-90"
            >
              View Applicants
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyJobs;