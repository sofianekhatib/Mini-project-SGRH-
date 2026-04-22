import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import Register from './Pages/Register';
import Login from './Pages/Login';
import AdminDashboard from './Pages/AdminDashboard';
import ClientDashboard from './Pages/ClientDashboard';
import Chambres from './Pages/Chambres';
import CreateChambre from './Pages/CreateChambre';
import Services from './Pages/Services';
import Reservations from './Pages/Reservations';
import Contact from './Pages/Contact';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    if (token && role && username) {
      setUser({ username, role });
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, role) => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const username = payload.unique_name || payload.name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
    setUser({ username, role });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setUser(null);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/CreateChambre" element={<CreateChambre />} />
        <Route
          path="/AdminDashboard"
          element={
            user && user.role === 'Admin' ? (
              <AdminDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />        <Route path="/register" element={<Register />} />
        <Route path="/Chambres" element={<Chambres />} />
        <Route path="/Reservations" element={<Reservations />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/admin"
          element={
            user && user.role === 'Admin' ? (
              <AdminDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/client"
          element={
            user && user.role === 'Client' ? (
              <ClientDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;