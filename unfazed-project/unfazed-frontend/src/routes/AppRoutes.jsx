import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Loader from '../components/common/Loader';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/therapist/Dashboard';
import Clients from '../pages/therapist/Clients';
import ClientProfile from '../pages/therapist/ClientProfile';
import Schedule from '../pages/therapist/Schedule';
import Notes from '../pages/therapist/Notes';
import Analytics from '../pages/therapist/Analytics';
import BookingPage from '../pages/client/BookingPage';
import ClientPortal from '../pages/client/ClientPortal';
import Payment from '../pages/client/Payment';

function ProtectedRoute({ children }) {
  const { therapist, loading } = useAuth();
  if (loading) return <Loader label="Checking session…" />;
  if (!therapist) return <Navigate to="/login" replace />;
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/therapist/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/therapist/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
      <Route path="/therapist/clients/:id" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />
      <Route path="/therapist/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
      <Route path="/therapist/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
      <Route path="/therapist/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

      {/* Public client-facing routes, keyed by the therapist's branded slug */}
      <Route path="/:slug/portal/:clientId" element={<ClientPortal />} />
      <Route path="/:slug/pay" element={<Payment />} />
      <Route path="/:slug" element={<BookingPage />} />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
