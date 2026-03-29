import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/Context';
import { assets } from '../assets/assets';
import ApplyModal from './ApplyModal'; 
import API from '../Service/Api';
import { toast } from 'react-toastify';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currencySymbol, JobsList } = useContext(AppContext);
  
  const [job, setJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle the backend application call
  const handleApplySubmit = async (formData) => {
    try {
      // formData contains { proposedPrice, coverLetter } from the Modal
      const res = await API.post(`/api/user/jobs/${id}/apply`, formData);
      
      if (res.data.success) {
        toast.success("Application submitted successfully!");
        setIsModalOpen(false);
        // Update the UI count immediately
        setJob(prev => ({ ...prev, applicantsCount: (prev.applicantsCount || 0) + 1 }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    }
  };

  useEffect(() => {
    // 1. Try to find in context first for speed
    const selectedJob = JobsList?.find(j => j._id === id);
    if (selectedJob) {
      setJob(selectedJob);
    } else {
      // 2. Fallback: Fetch from API if user refreshed the page
      const fetchJob = async () => {
        try {
          const res = await API.get(`/api/user/jobs/${id}`);
          setJob(res.data.job);
        } catch (err) {
          toast.error("Job details not found");
        }
      };
      fetchJob();
    }
  }, [id, JobsList]);

  if (!job) return <div className='mt-20 text-center'>Loading Job Details...</div>;

  return (
    <div className='bg-gray-50 min-h-screen pb-10'>
      
      {/* --- TOP SEARCH BAR (Added Back) --- */}
      <div className='flex justify-center py-6 bg-white shadow-sm'>
        <div className='flex gap-2 w-full max-w-2xl px-4'>
           <button onClick={() => navigate(-1)} className='text-gray-600 flex items-center gap-1 hover:text-primary transition'>
             <img src={assets.back_icon} className='h-4' alt=""/> Back
           </button>
           <div className='flex flex-1 border rounded-lg px-3 py-2 items-center gap-2 bg-gray-50'>
              <img src={assets.search_icon} className='h-4' alt=""/>
              <input type="text" placeholder='Job title, Keywords, or Company...' className='bg-transparent outline-none w-full text-sm'/>
           </div>
           <button className='bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition'>Search</button>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 mt-8 flex flex-col lg:flex-row gap-8'>
        
        {/* --- LEFT SECTION: MAIN CONTENT --- */}
        <div className='flex-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100'>
          
          {/* Company Header */}
          <div className='flex justify-between items-start'>
            <div className='flex gap-4'>
              <img src={assets.Ellipse || assets.company_icon} alt="Company" className='h-16 w-16 rounded-lg' />
              <div>
                <h1 className='text-3xl font-bold text-gray-800'>{job.title}</h1>
                <p className='text-gray-500 text-lg font-medium'>Amazon ⭐⭐⭐⭐⭐</p>
              </div>
            </div>
            <div className='flex gap-4'>
              <button className='p-2 border rounded-lg hover:bg-gray-50'><img src={assets.Vector2} className='h-5' alt="Save"/></button>
              <button className='p-2 border rounded-lg hover:bg-gray-50'><img src={assets.Vector1} className='h-5' alt="Share"/></button>
            </div>
          </div>

          {/* Job Stats Grid */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 py-6 border-y border-gray-100'>
            <div>
              <p className='font-semibold text-gray-800 text-sm'>Job type:</p>
              <p className='text-gray-600'>{job.worktime || 'Full-time'}</p>
            </div>
            <div>
              <p className='font-semibold text-gray-800 text-sm'>Location:</p>
              <p className='text-gray-600'>{job.location || 'Remote'}</p>
            </div>
            <div>
              <p className='font-semibold text-gray-800 text-sm'>Experience:</p>
              <p className='text-gray-600'>{job.experienceLevel || 'Not set'}</p>
            </div>
            <div>
              <p className='font-semibold text-gray-800 text-sm'>Applicants:</p>
              <p className='text-gray-600'>{job.applicantsCount || 0}</p>
            </div>
          </div>

          {/* Description & Apply Button */}
          <div className='mt-8'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold text-gray-800'>Job description</h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className='bg-primary text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md transition'
              >
                Apply now
              </button>
            </div>
            <p className='text-gray-600 leading-relaxed mb-8'>
              {job.description}
            </p>

            {/* Key Responsibilities List (Added Back) */}
            <h2 className='text-xl font-bold mb-4 text-gray-800'>Key Responsibilities</h2>
            <ul className='list-disc list-inside text-gray-600 space-y-3 pl-2'>
              {job.responsibilities?.length > 0 ? (
                job.responsibilities.map((item, index) => (
                  <li key={index} className='pl-2'>{item}</li>
                ))
              ) : (
                <p className='text-sm italic text-gray-400'>No specific responsibilities listed.</p>
              )}
            </ul>
          </div>
        </div>

        {/* --- RIGHT SECTION: RELATED JOBS (Added Back) --- */}
        <div className='w-full lg:w-80 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit'>
          <h2 className='text-xl font-bold mb-6 text-center text-gray-800'>Related Jobs</h2>
          <div className='flex flex-col gap-4'>
            {JobsList?.slice(0, 4).map((item, i) => (
              <div 
                key={i} 
                onClick={() => navigate(`/job/${item._id}`)}
                className='border border-gray-100 rounded-xl p-4 hover:shadow-md transition cursor-pointer relative group'
              >
                <button className='absolute top-2 right-2 text-gray-300 group-hover:text-red-400'>×</button>
                <div className='flex gap-3 items-center mb-2'>
                  <div className='h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-primary font-bold text-xs'>
                    {item.title.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className='font-bold text-sm text-gray-800 line-clamp-1'>{item.title}</p>
                    <p className='text-xs text-gray-500'>Company Name</p>
                  </div>
                </div>
                <div className='flex justify-between text-[10px] text-gray-400 mt-2'>
                  <span className='bg-gray-100 px-2 py-0.5 rounded'>{item.location || 'Remote'}</span>
                  <span className='font-medium text-gray-600'>{currencySymbol}{item.budget}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* --- APPLICATION MODAL --- */}
      <ApplyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleApplySubmit} 
        jobTitle={job.title}
      />
    </div>
  );
};

export default JobDetails;
// import React from 'react'

// function JobDetails() {
//   return (
//     <div>
        
//                 <div className='w-1/2 mt-4 '>
//                      {/* Search Bar */}
//                     <div className='w-full bg-white  py-2 flex justify-between px-2 rounded-xl gap-2 shadow-5'>
//                       <input type="text" className='flex-1 outline-none px-2' placeholder='Job title, Keywords, or Company name'/> 
//                       <button className='py-1  bg-primary text-white px-4'>Search</button>
//                     </div>
        
//                     {/* job list */}
        
//                     <div className='bg-white mt-6 shadow-lg p-4 rounded-xl mt-2 '>
//                         <div className='flex justify-between'>
                            
//                         <div className='flex'>
//                             <img className="h-10"src={assets.Ellipse} alt="" />
        
//                         <div>
//                             <p className='text-xl mb-2'>Product Design </p>
//                             <p>Remote Full-time</p>
//                             <p>$200- $1,200</p>
//                         </div>
        
                        
//                         </div>
//                             <div className='flex gap-3'>
//                             <img className="h-5 w-5"src={assets.Vector2} alt="" />
//                             <img className="h-5 w-5" src={assets.Vector1} alt="" />
//                         </div>
//                         </div>
                       
        
                        
        
//                         {/* discription */}
        
//                         <div className='ml-10'>
//                             <p className='text-xs '>
//                                 Design intuitive and visually appealing user <br />
//                                 interfacesfor web and mobile applications. <br />
//                                  Conduct user research and create wireframes, <br />
//                                 prototypes, and mockups to improve user experience.<br/>
//                                  Work closely with developers to implement designs.
//                             </p>
//                         </div>
//                     </div>
        
//                     <div className='bg-white mt-6 shadow-lg p-4 rounded-xl mt-2 '>
//                         <div className='flex justify-between'>
                            
//                         <div className='flex'>
//                             <img className="h-10"src={assets.Ellipse} alt="" />
        
//                         <div>
//                             <p className='text-xl mb-2'>Product Design </p>
//                             <p>Remote Full-time</p>
//                             <p>$200- $1,200</p>
//                         </div>
        
                        
//                         </div>
//                             <div className='flex gap-3'>
//                             <img className="h-5 w-5"src={assets.Vector2} alt="" />
//                             <img className="h-5 w-5" src={assets.Vector1} alt="" />
//                         </div>
//                         </div>
                       
        
                        
        
//                         {/* discription */}
        
//                         <div className='ml-10'>
//                             <p className='text-xs '>
//                                 Design intuitive and visually appealing user <br />
//                                 interfacesfor web and mobile applications. <br />
//                                  Conduct user research and create wireframes, <br />
//                                 prototypes, and mockups to improve user experience.<br/>
//                                  Work closely with developers to implement designs.
//                             </p>
//                         </div>
//                     </div>
        
//                     <div className='bg-white mt-6 shadow-lg p-4 rounded-xl mt-2 '>
//                         <div className='flex justify-between'>
                            
//                         <div className='flex'>
//                             <img className="h-10"src={assets.Ellipse} alt="" />
        
//                         <div>
//                             <p className='text-xl mb-2'>Product Design </p>
//                             <p>Remote Full-time</p>
//                             <p>$200- $1,200</p>
//                         </div>
        
                        
//                         </div>
//                             <div className='flex gap-3'>
//                             <img className="h-5 w-5"src={assets.Vector2} alt="" />
//                             <img className="h-5 w-5" src={assets.Vector1} alt="" />
//                         </div>
//                         </div>
                       
        
                        
        
//                         {/* discription */}
        
//                         <div className='ml-10'>
//                             <p className='text-xs '>
//                                 Design intuitive and visually appealing user <br />
//                                 interfacesfor web and mobile applications. <br />
//                                  Conduct user research and create wireframes, <br />
//                                 prototypes, and mockups to improve user experience.<br/>
//                                  Work closely with developers to implement designs.
//                             </p>
//                         </div>
//                     </div>
        
//                 </div>
        
//                 {/* Right part */}
        
//                 <div className='  bg-white shadow-lg flex flex-col items-center pt-10 px-5 '>
//                     <p className='text-2xl center'>Saved Jobs</p>
        
//                     <div className='border border-gray-300 px-10 py-2 shadow-lg rounded-xl mt-5'>
//                         <img src="" alt="" />
//                         <p>UI/UX Designer <br /><span>Barone LLC.</span></p>
//                         <p>Remote : $200 -$800</p>
//                     </div>
        
        
//                      <div className='border border-gray-300 px-10 py-2 shadow-lg rounded-xl mt-5'>
//                         <img src="" alt="" />
//                         <p>UI/UX Designer <br /><span>Barone LLC.</span></p>
//                         <p>Remote : $200 -$800</p>
//                     </div>
        
//                      <div className='border border-gray-300 px-10 py-2 shadow-lg rounded-xl mt-5'>
//                         <img src="" alt="" />
//                         <p>UI/UX Designer <br /><span>Barone LLC.</span></p>
//                         <p>Remote : $200 -$800</p>
//                     </div>
        
//     </div>
//     </div>
//   )
// }

// export default JobDetails