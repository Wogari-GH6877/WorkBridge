import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import API from '../Service/Api';
import { toast } from 'react-toastify';

const JobApplicants = () => {
  const { jobId } = useParams(); // This grabs the ID from the URL
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currencySymbol, JobsList } = useContext(AppContext);
  

  // 1. Fetch Applicants (Aligned with your GET /jobs/:jobId/applications)
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await API.get(`/api/user/jobs/${jobId}/applications`);
        if (res.data.success) {
          setApplicants(res.data.applications);
        }
      } catch (err) {
        // This handles your backend's 403 "Not authorized" and 404 "Job not found"
        const errorMsg = err.response?.data?.message || "Error loading applicants";
        toast.error(errorMsg);
        
        if (err.response?.status === 403 || err.response?.status === 404) {
          navigate('/dashboard'); 
        }
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchApplicants();
  }, [jobId, navigate]);

  // 2. Handle Status Update (Accepted/Rejected)
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await API.patch(`/api/user/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Application ${newStatus}!`);
        // Update UI locally
        setApplicants(prev => 
          prev.map(app => app._id === appId ? { ...app, status: newStatus } : app)
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading talent pool...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Job Applicants</h1>
        <div className="bg-primary/10 text-primary px-4 py-1 rounded-full font-bold text-sm">
          {applicants.length} Total Applications
        </div>
      </div>

      <div className="space-y-6">
        {applicants.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-400">No one has applied to this job yet.</p>
          </div>
        ) : (
          applicants.map((app) => (
            <div key={app._id} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                {/* Applicant Profile Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 bg-gray-100 text-primary rounded-full flex items-center justify-center font-bold text-xl">
                      {app.applicantId?.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{app.applicantId?.name}</h3>
                      <p className="text-sm text-gray-500">{app.applicantId?.email}</p>
                    </div>
                  </div>

                  {/* Skills (from your .populate("applicantId", "skills")) */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {app.applicantId?.skills?.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded border">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                    <p className="text-xs font-bold text-blue-400 uppercase mb-1">Cover Letter</p>
                    <p className="text-gray-700 text-sm leading-relaxed">{app.coverLetter}</p>
                  </div>
                </div>

                {/* Pricing & Decision Section */}
                <div className="flex flex-col justify-between items-end min-w-[160px]">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase">Bid Amount</p>
                    <p className="text-2xl font-black text-gray-800">${app.proposedPrice}</p>
                  </div>

                  <div className="flex flex-col w-full gap-2 mt-4">
                    {app.status === 'pending' ? (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(app._id, 'accepted')}
                          className="w-full py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(app._id, 'rejected')}
                          className="w-full py-2 border border-red-200 text-red-500 rounded-lg font-bold hover:bg-red-50 transition"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <div className={`text-center py-2 rounded-lg font-black text-xs uppercase tracking-widest ${
                        app.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {app.status}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobApplicants;


// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import API from '../Service/Api';
// import { toast } from 'react-toastify';
// import { assets } from '../assets/assets';

// const JobApplicants = () => {
//   const { jobId } = useParams();
//   const navigate = useNavigate();
//   const [applicants, setApplicants] = useState([]);
//   const [loading, setLoading] = useState(true);

//   console.log("Raw Job ID from URL:", jobId);

//   // 1. Fetch Applicants on Load
//   useEffect(() => {
//     const fetchApplicants = async () => {
//       try {
//         const res = await API.get(`/api/user/jobs/${jobId}/applications`);
//         if (res.data.success) {
//           setApplicants(res.data.applications);
//         }
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Failed to load applicants");
//         if (err.response?.status === 403) navigate('/'); // Security redirect
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchApplicants();
//   }, [jobId, navigate]);

//   // 2. Handle Accept/Reject (Triggers your updateApplicationStatus)
//   const updateStatus = async (appId, newStatus) => {
//     try {
//       const res = await API.put(`/api/user/applications/${appId}/status`, { status: newStatus });
//       if (res.data.success) {
//         toast.success(`Application ${newStatus}!`);
//         // Update the list locally so the UI changes immediately
//         setApplicants(prev => 
//           prev.map(app => app._id === appId ? { ...app, status: newStatus } : app)
//         );
//       }
//     } catch (err) {
//       toast.error("Failed to update status");
//     }
//   };

//   if (loading) return <div className='text-center mt-20 font-medium text-gray-500'>Loading applications...</div>;

//   return (
//     <div className='max-w-6xl mx-auto px-6 py-10'>
//       <div className='flex items-center justify-between mb-8'>
//         <div>
//           <button onClick={() => navigate(-1)} className='text-sm text-gray-500 flex items-center gap-1 mb-2 hover:text-primary'>
//              ← Back to Dashboard
//           </button>
//           <h1 className='text-3xl font-bold text-gray-800'>Review Applicants</h1>
//         </div>
//         <div className='bg-blue-50 text-primary px-4 py-2 rounded-lg font-bold'>
//           {applicants.length} Total
//         </div>
//       </div>

//       <div className='grid grid-cols-1 gap-6'>
//         {applicants.length === 0 ? (
//           <div className='text-center py-20 bg-white border-2 border-dashed rounded-2xl'>
//             <p className='text-gray-400'>No applications received for this job yet.</p>
//           </div>
//         ) : (
//           applicants.map((app) => (
//             <div key={app._id} className='bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition'>
//               <div className='flex flex-col md:flex-row justify-between gap-6'>
                
//                 {/* Left: Applicant Identity & Content */}
//                 <div className='flex-1'>
//                   <div className='flex items-center gap-4 mb-4'>
//                     <div className='h-12 w-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg'>
//                       {app.applicantId?.name?.charAt(0)}
//                     </div>
//                     <div>
//                       <h3 className='font-bold text-gray-800 text-lg'>{app.applicantId?.name}</h3>
//                       <p className='text-sm text-gray-500'>{app.applicantId?.email}</p>
//                     </div>
//                   </div>

//                   <div className='bg-gray-50 p-4 rounded-xl mb-4'>
//                     <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-2'>Cover Letter</p>
//                     <p className='text-gray-700 leading-relaxed text-sm'>{app.coverLetter}</p>
//                   </div>

//                   {/* Displaying Skills if available */}
//                   <div className='flex flex-wrap gap-2'>
//                     {app.applicantId?.skills?.map((skill, idx) => (
//                       <span key={idx} className='bg-white border text-gray-500 px-3 py-1 rounded-md text-xs'>
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Right: Pricing & Actions */}
//                 <div className='flex flex-col justify-between items-end min-w-[180px]'>
//                   <div className='text-right'>
//                     <p className='text-xs font-bold text-gray-400 uppercase'>Proposed Price</p>
//                     <p className='text-2xl font-black text-primary'>${app.proposedPrice}</p>
//                   </div>

//                   <div className='flex flex-col w-full gap-2 mt-4'>
//                     {app.status === 'pending' ? (
//                       <>
//                         <button 
//                           onClick={() => updateStatus(app._id, 'accepted')}
//                           className='w-full py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition'
//                         >
//                           Accept
//                         </button>
//                         <button 
//                           onClick={() => updateStatus(app._id, 'rejected')}
//                           className='w-full py-2 border border-red-100 text-red-500 rounded-lg font-bold hover:bg-red-50 transition'
//                         >
//                           Reject
//                         </button>
//                       </>
//                     ) : (
//                       <div className={`text-center py-2 rounded-lg font-black uppercase text-xs tracking-tighter ${
//                         app.status === 'accepted' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
//                       }`}>
//                         {app.status}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default JobApplicants;