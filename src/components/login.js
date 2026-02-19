import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import api from "../interceptor/authinterceptor";
const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();

    let username=e.target.username.value
    let password=e.target.password.value

    try {
      
         const res= await api.post("/user/login", {
            username,
            password
          })
      
          localStorage.setItem("token", res.data.token)
          navigate("/home");
      

    } catch (error) {

      console.log(error.response?.data); // REAL ERROR HERE
      toast.error(error.response?.data?.message || "Invalid username or password");
      
    }
      


  };

  useEffect(()=>{


    const token = localStorage.getItem("token");
    if (token) {
      // If token exists, navigate to home
      navigate("/home");
    }

  },[navigate])




  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-sm">
            ❌ {error}
          </div>
        )} */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-indigo-600 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?
          <span
            onClick={() => navigate("/signup")}
            className="text-indigo-600 cursor-pointer ml-1"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
