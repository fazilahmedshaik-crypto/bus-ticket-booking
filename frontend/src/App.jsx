import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Bookings from './pages/Bookings';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './components/AdminLayout';
import BusManagement from './pages/admin/BusManagement';
import RouteManagement from './pages/admin/RouteManagement';
import ScheduleManagement from './pages/admin/ScheduleManagement';
import UserManagement from './pages/admin/UserManagement';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" />;
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#1c1c1c', color: '#f5f0e8', border: '1px solid rgba(201,169,110,0.25)', fontFamily: 'Inter, sans-serif', fontSize: '0.88rem' },
          duration: 3500,
        }}
      />
      {user && !window.location.pathname.startsWith('/admin') && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
        
        {/* Admin Command Center (Nested) */}
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="buses" element={<BusManagement />} />
          <Route path="routes" element={<RouteManagement />} />
          <Route path="schedules" element={<ScheduleManagement />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
