import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Button from '../components/ui/Button';
import EditProfileModal from '../components/profile/EditProfileModal';
import { FaUser, FaEnvelope, FaCalendar, FaEdit, FaBed } from 'react-icons/fa';
import './UserDashboard.css';

const UserDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my-bookings');
            setBookings(data.data);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-page">
            <div className="container">
                <motion.div
                    className="dashboard-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1>Welcome back, {user?.name}!</h1>
                    <p>Manage your bookings and profile</p>
                </motion.div>

                <div className="dashboard-grid">
                    <motion.div
                        className="profile-card glass-card"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2>Your Profile</h2>
                            <Button
                                variant="outline"
                                size="sm"
                                icon={<FaEdit />}
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                Edit
                            </Button>
                        </div>

                        <div className="profile-info">
                            <div className="info-item">
                                <FaUser className="info-icon" />
                                <div>
                                    <div className="info-label">Name</div>
                                    <div className="info-value">{user?.name}</div>
                                </div>
                            </div>
                            <div className="info-item">
                                <FaEnvelope className="info-icon" />
                                <div>
                                    <div className="info-label">Email</div>
                                    <div className="info-value">{user?.email}</div>
                                </div>
                            </div>
                            <div className="info-item">
                                <FaCalendar className="info-icon" />
                                <div>
                                    <div className="info-label">Member Since</div>
                                    <div className="info-value">
                                        {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bookings-card glass-card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2>Recent Bookings</h2>
                            <Link to="/my-bookings" className="text-primary text-sm hover:underline">
                                View All
                            </Link>
                        </div>

                        {bookings.length > 0 ? (
                            <div className="dashboard-bookings-list">
                                {bookings.slice(0, 3).map(booking => (
                                    <div key={booking._id} className="mini-booking-item">
                                        <div className="mini-booking-icon">
                                            <FaBed />
                                        </div>
                                        <div className="mini-booking-info">
                                            <h4>{booking.room?.name || 'Room'}</h4>
                                            <p>{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`status-badge sm ${booking.status}`}>
                                            {booking.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted mb-4">You haven't made any bookings yet.</p>
                                <Link to="/rooms">
                                    <Button variant="primary" size="sm">Browse Rooms</Button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    );
};

export default UserDashboard;
