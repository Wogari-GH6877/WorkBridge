import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../Context/Context'
import { useNavigate } from 'react-router-dom'

function JobList() {
    const navigate = useNavigate()
    const { JobsList } = useContext(AppContext)

    // Filter States
    const [filteredJobs, setFilteredJobs] = useState([])
    const [searchTitle, setSearchTitle] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [selectedTypes, setSelectedTypes] = useState([])

    // --- DEBOUNCE LOGIC ---
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTitle);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTitle]);

    // --- FILTERING LOGIC ---
    useEffect(() => {
        let tempJobs = [...JobsList];
        if (debouncedSearch) {
            tempJobs = tempJobs.filter(job => 
                job.title.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
        }
        if (selectedTypes.length > 0) {
            tempJobs = tempJobs.filter(job => 
                selectedTypes.includes(job.worktime)
            );
        }
        setFilteredJobs(tempJobs);
    }, [debouncedSearch, selectedTypes, JobsList]);

    const handleTypeChange = (e) => {
        const { value, checked } = e.target;
        setSelectedTypes(prev => 
            checked ? [...prev, value] : prev.filter(t => t !== value)
        );
    };

    return (
        /* Changed to flex-col for mobile and flex-row for large screens */
        <div className='flex flex-col lg:flex-row items-start px-4 md:px-7 lg:px-10 mt-10 lg:mt-20 w-full bg-surface gap-6 lg:gap-10'>
            
            {/* 1. THE FILTER SECTION (Left / Top on Mobile) */}
            <div className='w-full lg:min-w-80 lg:w-80 bg-white px-6 py-5 rounded-2xl shadow-lg'>
                <p className='font-bold text-xl mb-4 text-gray-800 border-b pb-2'>Filters</p>
                
                <div className='mb-6'>
                    <p className='text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider'>Job Type</p>
                    <div className='grid grid-cols-2 lg:grid-cols-1 gap-2'>
                        {["Full-time", "Part-time", "Remote", "Freelance"].map((type) => (
                            <label key={type} className="flex items-center gap-3 cursor-pointer hover:text-primary transition">
                                <input 
                                    type="checkbox" 
                                    value={type} 
                                    className="w-4 h-4 accent-primary"
                                    onChange={handleTypeChange}
                                />
                                <span className="text-gray-700 text-sm md:text-base">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button 
                    className='w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 transition shadow-md'
                    onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}
                >
                    Apply Filters
                </button>
            </div>

            {/* 2. MAIN SEARCH & RESULTS (Middle) */}
            <div className='flex-1 w-full flex flex-col'>
                {/* Responsive Search Bar */}
                <div className='w-full bg-white p-2 flex items-center rounded-2xl shadow-md border border-gray-100 mb-6'>
                    <input 
                        type="text" 
                        className='flex-1 outline-none px-2 md:px-4 py-2 text-base md:text-lg w-full' 
                        placeholder='Search jobs...'
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                    /> 
                    <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>
                    <button className='bg-primary text-white px-4 md:px-8 py-2 rounded-xl font-semibold text-sm md:text-base'>
                        Search
                    </button>
                </div>

                {/* Results List - Removed max-height on mobile to allow natural page scroll */}
                <div className='lg:overflow-y-auto lg:max-h-[85vh] flex-1 lg:pr-2 hide-scrollbar'>
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job, index) => (
                            <div 
                                key={index} 
                                onClick={() => navigate(`/job/${job._id}`)}
                                className='bg-white mb-4 p-4 md:p-5 rounded-2xl shadow-sm border border-transparent hover:border-primary/30 hover:shadow-md cursor-pointer transition'
                            >
                                <div className='flex justify-between items-start'>
                                    <div className='flex gap-3 md:gap-4'>
                                        <div className="h-10 w-10 md:h-12 md:w-12 bg-gray-50 rounded-xl flex items-center justify-center border shrink-0">
                                           <img src={assets.Ellipse} alt="" className="h-6 md:h-8"/>
                                        </div>
                                        <div>
                                            <h3 className='text-base md:text-lg font-bold text-gray-800 leading-tight'>{job.title}</h3>
                                            <p className='text-primary font-medium text-xs md:text-sm mt-1'>{job.worktime} • ${job.budget}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                                        <img src={assets.Vector1} alt="Save" className="h-4 w-4 md:h-5 md:w-5" />
                                    </button>
                                </div>
                                <p className='mt-3 text-gray-500 text-xs md:text-sm line-clamp-2 leading-relaxed'>
                                    {job.description}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 md:py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium text-sm">No jobs found.</p>
                        </div>
                    )}
                </div> 
            </div>

            {/* 3. SAVED JOBS (Right / Bottom on Mobile) */}
            <div className='w-full lg:min-w-[300px] lg:w-[300px] bg-white shadow-lg p-6 rounded-2xl lg:max-h-[70vh] flex flex-col mb-10 lg:mb-0'>
                <div className="flex items-center gap-2 mb-6">
                    <img src={assets.Vector1} alt="" className="h-4 md:h-5" />
                    <p className='text-lg md:text-xl font-bold text-gray-800'>Saved Jobs</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 lg:overflow-y-auto hide-scrollbar'>
                    {[1, 2].map((i) => (
                        <div key={i} className='p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-sm transition cursor-pointer'>
                            <p className='font-bold text-gray-800 text-sm'>Senior UI/UX Designer</p>
                            <p className='text-xs text-gray-500 mt-1'>Barone LLC • Remote</p>
                            <p className='text-xs font-bold text-primary mt-2'>$200 - $800</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default JobList