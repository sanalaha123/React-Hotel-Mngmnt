import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageRooms from './pages/admin/ManageRooms';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBookings from './pages/admin/ManageBookings';
import HotelList from './pages/HotelList';
import HotelDetails from './pages/HotelDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Admin Routes - Checked first to match specific paths */}
            <Route
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/rooms" element={<ManageRooms />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/bookings" element={<ManageBookings />} />
            </Route>

            {/* User Routes - Wrapped in UserLayout */}
            <Route element={<UserLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/hotels" element={<HotelList />} />
              <Route path="/hotels/:id" element={<HotelDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/rooms/:id" element={<RoomDetails />} />

              {/* Protected User Routes */}
              <Route
                path="/booking/:id"
                element={
                  <ProtectedRoute>
                    <Booking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

