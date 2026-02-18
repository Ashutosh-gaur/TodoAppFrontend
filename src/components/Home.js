
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import Sidebar from './Sidebar';
import Records from './Records';
import Profile from './Profile';


const Home = () => {
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
       
      />
      <div className="flex-1 ml-0 md:ml-64">
        {/* Header with navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">TaskNexus</h1>
            <div className="flex space-x-4">
              <Link
                to="/home/profile"
                className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
              >
                <FaUser className="mr-2" /> Profile
              </Link>
            </div>
          </div>
        </header>
 
        <Routes>
          <Route path="/" element={<Records  />} />
          <Route path="/profile" element={<Profile />} />
        </Routes> 
      </div>
    </div>
  );
};

export default Home;
