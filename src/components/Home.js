
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { FaUser, FaPlus } from 'react-icons/fa';
import Sidebar from './Sidebar';
import Records from './Records';
import Profile from './Profile';
import api from '../interceptor/authinterceptor';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  // Fetch categories and tasks
  useEffect(() => {


      fetchCategories();
      fetchTasks();
      // console.log("categories = ",categories)
    
  }, []);

  const fetchCategories = async () => {
    const response = await api.get('/category/getAll', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    // const data = await response.json();
    setCategories(response.data);
  };

  const fetchTasks = async () => {
    const response = await api.get(`/task/getTasks`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    // const data = await response.json();
    setTaskList(response.data);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };



  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        categories={categories}
        taskList={taskList}
        onCategoryChange={handleCategoryChange}
        onLogout={handleLogout}
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
          <Route path="/" element={<Records onCategoryChange={handleCategoryChange} />} />
          <Route path="/profile" element={<Profile />} />
        </Routes> 
      </div>
    </div>
  );
};

export default Home;
