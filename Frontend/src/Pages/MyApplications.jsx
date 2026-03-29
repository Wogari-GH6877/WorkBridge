import React, { useEffect, useState, useContext } from 'react';
import API from '../Service/Api';
import { AppContext } from '../Context/Context';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currencySymbol } = useContext(AppContext);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await API.get(`/api/user/jobs/my-applications`);
        if (res.data.success) {
          setApplications(res.data.applications);
        }
      } catch (err) {
        toast.error("Could not load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) return <div className="text-center mt-20">Loading your applications...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Applied Jobs</h1>

      {applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">You haven't applied to any jobs yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Job Details</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Proposed Price</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-primary font-bold">
                        {app.jobId?.title?.substring(0, 1)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{app.jobId?.title || "Deleted Job"}</p>
                        <p className="text-xs text-gray-500">{app.jobId?.location || 'Remote'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium text-gray-700">
                    {currencySymbol}{app.proposedPrice}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      app.status === 'accepted' ? 'bg-green-100 text-green-600' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyApplications;