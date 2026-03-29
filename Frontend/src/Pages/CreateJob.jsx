import React, { useState } from 'react';
import API from "../Service/Api" 
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    experienceLevel: '',
    worktime: 'Full-time', // Default value matching your enum
    skillsRequired: '',
    responsibilities: '', // We'll handle this as a newline-separated list
    deadline: '',
    applicantsCount: 0 // <--- Add this line
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        // Convert comma string to array
        skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s !== ""),
        // Convert newlines to array for the bullet points
        responsibilities: formData.responsibilities.split('\n').map(r => r.trim()).filter(r => r !== ""),
        applicantsCount: Number(formData.applicantsCount), // Ensure it's a number
      budget: Number(formData.budget),      };

      const res = await API.post("/api/user/post-job", payload);

      if (res.status === 201 || res.data.success) {
        toast.success("Job posted successfully!");
        navigate('/'); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 mb-10 p-8 bg-white border border-gray-200 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Post a New Job</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Job Title</label>
          <input name="title" required className="p-3 border rounded-lg outline-none focus:border-blue-500" placeholder="e.g. Senior Product Designer" onChange={handleChange} value={formData.title} />
        </div>

        {/* Row 2: Location & Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Location</label>
            <input name="location" required className="p-3 border rounded-lg outline-none" placeholder="Lagos (On-site)" onChange={handleChange} value={formData.location} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Experience Level</label>
            <input name="experienceLevel" className="p-3 border rounded-lg outline-none" placeholder="e.g. 5 Years" onChange={handleChange} value={formData.experienceLevel} />
          </div>
        </div>

        {/* Row 3: Budget & Job Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Budget ($)</label>
            <input name="budget" type="number" required className="p-3 border rounded-lg outline-none" placeholder="800" onChange={handleChange} value={formData.budget} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Job Type</label>
            <select name="worktime" className="p-3 border rounded-lg outline-none" onChange={handleChange} value={formData.worktime}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Job Description (Intro Paragraph)</label>
          <textarea name="description" required rows="3" className="p-3 border rounded-lg outline-none" placeholder="Tell us about the role..." onChange={handleChange} value={formData.description} />
        </div>

        {/* Key Responsibilities */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Key Responsibilities (One per line)</label>
          <textarea name="responsibilities" required rows="5" className="p-3 border border-blue-100 bg-blue-50/30 rounded-lg outline-none" placeholder="Design wireframes&#10;Conduct user research&#10;Collaborate with developers" onChange={handleChange} value={formData.responsibilities} />
          <p className="text-xs text-gray-400">Press Enter for each new bullet point.</p>
        </div>

        {/* Skills */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Skills Required (Comma separated)</label>
          <input name="skillsRequired" className="p-3 border rounded-lg outline-none" placeholder="Figma, React, UI/UX" onChange={handleChange} value={formData.skillsRequired} />
        </div>
{/* Number of Applicant */}
        <div className="flex flex-col gap-1">
     <label className="text-sm font-semibold text-gray-700">Initial Applicants (Optional)</label>
      <input
    name="applicantsCount"
    type="number"
    className="p-3 border rounded-lg outline-none focus:border-blue-500"
    placeholder="0"
    onChange={handleChange}
    value={formData.applicantsCount}
     />
  <p className="text-[10px] text-gray-400 italic">Usually starts at 0.</p>
</div>

        <button type="submit" disabled={loading} className={`w-full py-4 bg-primary text-white font-bold rounded-xl transition-all ${loading ? 'opacity-50' : 'hover:bg-blue-700'}`}>
          {loading ? "Creating Post..." : "Publish Job Post"}
        </button>
      </form>
    </div>
  );
};

export default CreateJob;