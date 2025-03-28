import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import UsersList from '@/components/UsersList';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} /> 
          <Route path="/signup" element={<SignUp />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="*" element={<Navigate to="/login" replace />} /> {/* This is fine as is */}
        </Routes>
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </Router>
  );
}

export default App;