import React, { useState, useEffect } from 'react';
import {FaEnvelope, FaLock, FaCamera } from 'react-icons/fa';
import { RiCloseCircleFill } from "react-icons/ri";
import { toast } from 'react-toastify';
import api from '../interceptor/authinterceptor';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import user_avtaar from "../images/user_avtaar.jpg";
const Profile = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    email: '',

  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''

  });

  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const profileRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    // Fetch user profile data
    fetchUserProfile();
  }, []);


  useEffect(() => {


    const clickHandlerOutside = (event) => {
    
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        navigate('/home');
        return;
      }
    };


    document.addEventListener("mousedown", clickHandlerOutside);

    return () => {
      document.removeEventListener("mousedown", clickHandlerOutside);
    };
  }, [navigate]);


  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/getLoginUser', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      setUser(response.data);
      // console.log(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleUpdateProfile = async (e) => {


    e.preventDefault();
    
    try {
      const response = await api.put('/user/updateProfile', {email:user.email}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },

      });
      if (response.status === 200) {
        

        setUser(response.data)
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
      else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
        await api.put("/user/updatePassword",
        {
          oldPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword

        },
         {
           headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
      });
        toast.success('Password changed successfully');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsChangingPassword(false);
    } catch (error) {
      console.log(error.response?.data); 
       toast.error(error.response?.data?.message || "Failed");
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div ref={profileRef} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10"

    >

      <div className=' relative flex  justify-center '>
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">{user.username}</h1>

        <RiCloseCircleFill ref={closeRef} onClick={(e) => navigate('/home')}
          className="
    text-[34px]
    cursor-pointer

    text-gray-500
    bg-gray-100
    rounded-full
    p-1

    outline-none focus:outline-none
    bordedr-none
    bg-transparent


    transition-all
    duration-300
    ease-out

    hover:text-white
    hover:bg-green-500
    hover:shadow-lg
    hover:shadow-red-400/50
    hover:rotate-90
    hover:scale-110

    active:scale-90
    absolute
    top-3
    right-4
  "
        />


      </div>


      {/* Profile Picture */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <img
            src={user_avtaar}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
          />
          <label className="absolute bottom-0 right-0 bg-indigo-500 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-600">
            <FaCamera />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Profile Information */}
      <form onSubmit={handleUpdateProfile} className="space-y-6" >
       

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaEnvelope className="inline mr-2" /> Email
          </label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          {isEditing && (
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Save Changes
            </button>
          )}
        </div>
      </form>

      {/* Change Password Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          <FaLock className="inline mr-2" /> Change Password
        </h2>
        <button
          onClick={() => setIsChangingPassword(!isChangingPassword)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md mb-4"
        >
          {isChangingPassword ? 'Cancel' : 'Change Password'}
        </button>

        {isChangingPassword && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                
              />
              
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

              
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
             <span
              onClick={() => setShowPassword(!showPassword)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md mx-4 cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Change Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
