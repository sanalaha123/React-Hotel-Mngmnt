import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../components/ui/Toast';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FaCalendar, FaHotel, FaMoneyBillWave, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import './MyBookings.css';

const MyBookings = () => {
    const { user } = useAuth();
    const toast = useToast();
    const socket = useSocket();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();

        if (socket) {
            socket.on('booking-updated', (updatedBooking) => {
                // If the updated booking belongs to the current user
                if (updatedBooking.user._id === user._id || updatedBooking.user === user._id) {
                    toast.info(`Your booking status changed to ${updatedBooking.status.toUpperCase()}`);
                    // Refresh bookings to reflect new status
                    fetchBookings();
                }
            });

            return () => {
                socket.off('booking-updated');
            };
        }
    }, [socket, user]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my-bookings');
            setBookings(data.data);
        } catch (error) {
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await api.put(`/bookings/${bookingId}/cancel`);
            toast.success('Booking cancelled successfully');
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'confirmed':
                return 'badge-success';
            case 'pending':
                return 'badge-warning';
            case 'cancelled':
                return 'badge-error';
            case 'completed':
                return 'badge-info';
            default:
                return '';
        }
    };

    if (loading) return <LoadingSpinner size="lg" />;

    return (
        <div className="my-bookings-page">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1>My Bookings</h1>
                    <p className="page-subtitle">View and manage your hotel reservations</p>
                </motion.div>

                {bookings.length === 0 ? (
                    <Card className="no-bookings">
                        <h3>No bookings yet</h3>
                        <p>You haven't made any reservations. Browse our rooms to book your stay!</p>
                    </Card>
                ) : (
                    <div className="bookings-grid">
                        {bookings.map((booking, index) => (
                            <motion.div
                                key={booking._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="booking-card">
                                    <div className="booking-header">
                                        <div className="booking-room-info">
                                            {booking.room?.images?.[0] && (
                                                <img
                                                    src={booking.room.images[0]}
                                                    alt={booking.room.name}
                                                    className="booking-room-image"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            )}
                                            <div>
                                                <h3>{booking.room?.name || 'Room'}</h3>
                                                <p className="room-type">{booking.room?.type}</p>
                                            </div>
                                        </div>
                                        <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="booking-details">
                                        <div className="detail-row">
                                            <FaCalendar className="detail-icon" />
                                            <div>
                                                <span className="detail-label">Check-in</span>
                                                <span className="detail-value">
                                                    {format(new Date(booking.checkIn), 'MMM dd, yyyy')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="detail-row">
                                            <FaCalendar className="detail-icon" />
                                            <div>
                                                <span className="detail-label">Check-out</span>
                                                <span className="detail-value">
                                                    {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="detail-row">
                                            <FaMoneyBillWave className="detail-icon" />
                                            <div>
                                                <span className="detail-label">Total Price</span>
                                                <span className="detail-value price">${booking.totalPrice}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {booking.specialRequests && (
                                        <div className="special-requests">
                                            <strong>Special Requests:</strong>
                                            <p>{booking.specialRequests}</p>
                                        </div>
                                    )}

                                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                        <button
                                            onClick={() => handleCancelBooking(booking._id)}
                                            className="btn btn-ghost btn-cancel"
                                        >
                                            <FaTimes /> Cancel Booking
                                        </button>
                                    )}
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
