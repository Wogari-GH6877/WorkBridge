import React from 'react'
import Navbar from '../Components/Navbar'
import { assets } from '../assets/assets'
import JobList from '../Components/JobList'

function Home() {
  return (
    <div className='overflow-x-hidden'> {/* Prevents horizontal scroll from absolute images */}
        <div className='relative w-full h-[200px] md:h-[350px] lg:h-[450px] overflow-hidden'>
            {/* Background Frame */}
            <img 
                src={assets.frame2} 
                alt="Background" 
                className='w-full h-full object-cover'
            />
            
            {/* Floating Decorative Frame */}
            <img 
                className='absolute right-0 top-0 h-full w-auto object-contain max-w-[50%] md:max-w-full transition-all duration-300' 
                src={assets.frame1} 
                alt="Decoration" 
            />
            
            
        </div>

        {/* Main Content Area */}
        <div className='max-w-[1440px] mx-auto'>
            <JobList />
        </div>
    </div>
  )
}

export default Home