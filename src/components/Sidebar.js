import React, { useState } from 'react';
import { FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../interceptor/authinterceptor';
import { useEffect } from 'react';


const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [taskList, setTaskList] = useState([]);


  // Fetch categories and tasks
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
    setTaskList(response.data);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {

    fetchCategories();
    fetchTasks();

  }, []);


  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return taskList.length;
    return taskList.filter(task => task.category?.id === categoryId).length;
  };

  const handleCategoryClick = (categoryId) => {

    // Update URL params
    const params = new URLSearchParams(location.search);
    params.set('category', categoryId === 'all' ? 'all' : categoryId);
    navigate({ search: params.toString() });
  };

  const isActive = (categoryId) => {
    const params = new URLSearchParams(location.search);
    const currentCategory = params.get('category') || 'all';
    return currentCategory === categoryId.toString();
  };

  return (
    <div className={`bg-gray-800 text-white h-screen transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} fixed left-0 top-0 z-10`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && <h2 className="text-lg font-semibold">Categories</h2>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white hover:text-gray-300">
          {isCollapsed ? <FaBars /> : <FaTimes />}
        </button>
      </div>

      <nav className="mt-4">
        <ul>
          <li>
            <button
              onClick={() => handleCategoryClick('all')}
              className={`w-full text-left p-3 hover:bg-gray-700 transition-colors flex items-center ${isActive('all') ? 'bg-gray-700 border-l-4 border-indigo-500' : ''}`}
            >
              <span className="mr-3">{isCollapsed ? 'A' : 'All Records'}</span>
              {!isCollapsed && <span className="ml-auto bg-indigo-500 text-xs px-2 py-1 rounded-full">{getCategoryCount('all')}</span>}
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full text-left p-3 hover:bg-gray-700 transition-colors flex items-center ${isActive(cat.id) ? 'bg-gray-700 border-l-4 border-indigo-500' : ''}`}
              >
                <span className="mr-3"> {cat.name}</span>
                {!isCollapsed && <span className="ml-auto bg-indigo-500 text-xs px-2 py-1 rounded-full">{getCategoryCount(cat.id)}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-0 right-0 p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center"
        >
          {isCollapsed ? <FaSignOutAlt /> : <>
            <FaSignOutAlt className="mr-2" />
            <p>

              Logout
            </p>
          </>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
