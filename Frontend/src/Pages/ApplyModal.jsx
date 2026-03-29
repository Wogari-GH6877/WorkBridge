import React, { useState } from 'react';

const ApplyModal = ({ isOpen, onClose, onSubmit, jobTitle }) => {
  const [formData, setFormData] = useState({ proposedPrice: '', coverLetter: '' });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-1">Apply for {jobTitle}</h2>
        <p className="text-gray-500 text-sm mb-6">Fill in your details to submit your application.</p>
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Your Proposed Price ($)</label>
              <input 
                type="number" required 
                className="w-full p-3 border rounded-xl outline-none focus:border-primary"
                placeholder="e.g. 500"
                onChange={(e) => setFormData({...formData, proposedPrice: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Cover Letter / Why you?</label>
              <textarea 
                required rows="4"
                className="w-full p-3 border rounded-xl outline-none focus:border-primary"
                placeholder="Briefly describe your experience..."
                onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 py-3 border rounded-xl font-semibold">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-blue-700">Submit Application</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal