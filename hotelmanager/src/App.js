import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/System/Home';
import Register from './Pages/System/Register';
import Login from './Pages/System/Login';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import ClientDashboard from './Pages/Client/ClientDashboard';
import Services from './Pages/System/Services';
import Reservations from './Pages/System/Reservations';
import Contact from './Pages/System/Contact';
import GestionUtilisateurs from './Pages/Admin/GestionUtilisateurs';
import RapportsFinanciers from './Pages/Admin/RapportFinanciers';
import ReservationsClient from './Pages/Client/ReservationsClient';
import Profile from './Pages/Client/Profile';
import DemandeReservation from './Pages/Client/DemandeReservation';
import Factures from './Pages/Client/Factures';
import SystemConfiguration from './Pages/Admin/SystemConfiguration';
import CheckIn from './Pages/Receptionist/CheckIn'
import CheckOut from './Pages/Receptionist/CheckOut'
import ClientManagement from './Pages/Receptionist/ClientManagement'
import GenerateInvoice from './Pages/Receptionist/GenerateInvoice'
import ReceptionistDashboard from './Pages/Receptionist/ReceptionistDashboard'
import ReceptionistReservations from './Pages/Receptionist/ReceptionistReservations'

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
        <Route
          path="/AdminDashboard"
          element={
            user && user.role === 'Admin' ? (
              <AdminDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />        
        <Route path="/register" element={<Register />} />
        <Route path="/SystemConfiguration" element={<SystemConfiguration />} />
        <Route path="/Profile" element={<Profile/>}/>
        <Route path="/RapportsFinanciers" element={<RapportsFinanciers />} />
        <Route path="/DemandeReservation" element={<DemandeReservation />} />
        <Route path="/Factures" element={<Factures />} />
        <Route path="/Reservations" element={<Reservations />} />
        <Route path="/ReservationsClient" element={<ReservationsClient/>} />
        <Route path="/Services" element={<Services />} />
        <Route path="/GestionUtilisateurs" element={<GestionUtilisateurs/>}></Route>
        <Route path="/Contact" element={<Contact />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/CheckIn" element={<CheckIn />} />
        <Route path="/CheckOut" element={<CheckOut />} />
        <Route path="/ClientManagement" element={<ClientManagement />} />
        <Route path="/GenerateInvoice" element={<GenerateInvoice />} />
        <Route path="/ReceptionistDashboard" element={<ReceptionistDashboard />} />
        <Route path="/ReceptionistReservations" element={<ReceptionistReservations />} />

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
        <Route
    path="/receptionist"
    element={
        user && user.role === 'Receptionniste' ? (
            <ReceptionistDashboard user={user} onLogout={handleLogout} />
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