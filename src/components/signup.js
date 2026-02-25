import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../interceptor/authinterceptor";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData,setFormData]=useState({username:"",email:"",password:""})


  const handleChange=(e)=>{

    setFormData({...formData,[e.target.name]:e.target.value})



  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    const response =api.post("/user/register_user",formData,
      {
        headers:{
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"

        }

    })

    console.log(response.data);

    setError("");
    toast.success("Signup successful! Please login.");
  
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-sm">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            type="text"
             value={formData.username}
             onChange={handleChange}
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-blue-600 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer ml-1"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
