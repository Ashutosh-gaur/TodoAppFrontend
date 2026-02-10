
import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import Home from "./components/Home";
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';

 import ProtectedRoute from './protected/ProtectedRoute.js';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home/*" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
        </Routes>
        <ToastContainer position="top-center" autoClose={3000} />
      </BrowserRouter>
    </div>
  );
}

export default App;
