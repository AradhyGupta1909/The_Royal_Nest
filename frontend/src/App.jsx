import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import HomePage from "./pages/user/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GoogleCallback from "./pages/GoogleCallback";
import RoomsPage from "./pages/user/RoomsPage";
import RoomDetailPage from "./pages/user/RoomDetailPage";
import BookingPage from "./pages/user/BookingPage";
import MyBookingsPage from "./pages/user/MyBookingsPage";
import ContactPage from "./pages/user/ContactPage";
import AboutPage from "./pages/user/AboutPage";

// Admin Pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminQueries from "./pages/admin/AdminQueries";
import AdminStats from "./pages/admin/AdminStats";
import AdminRooms from "./pages/admin/AdminRooms";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#1a1a26", color: "#e8e0d0", border: "1px solid rgba(212,160,23,0.3)" },
            success: { iconTheme: { primary: "#d4a017", secondary: "#0a0a0f" } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* User Protected */}
          <Route path="/booking/:roomId" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
          <Route path="/my-bookings" element={<PrivateRoute><MyBookingsPage /></PrivateRoute>} />

          {/* Admin Protected */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="queries" element={<AdminQueries />} />
            <Route path="stats" element={<AdminStats />} />
            <Route path="rooms" element={<AdminRooms />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
