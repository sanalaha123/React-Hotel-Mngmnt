import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { useToast } from '../../components/ui/Toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { FaTrash, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import './ManageBookings.css';

const ManageBookings = () => {
    const toast = useToast();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Delete Confirmation State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/admin/bookings');
            setBookings(data.data);
        } catch (error) {
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/bookings/${id}/status`, { status });
            toast.success(`Booking ${status} successfully`);
            fetchBookings();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteClick = (id) => {
        setBookingToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!bookingToDelete) return;
        try {
            await api.delete(`/admin/bookings/${bookingToDelete}`);
            toast.success('Booking deleted');
            fetchBookings();
        } catch (error) {
            toast.error('Failed to delete booking');
        } finally {
            setIsDeleteModalOpen(false);
            setBookingToDelete(null);
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.room?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking._id.includes(searchTerm);
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <LoadingSpinner size="lg" />;

    return (
        <div className="manage-bookings">
            <div className="container">
                <div className="manage-header">
                    <div>
                        <h1>Manage Bookings</h1>
                        <p>View and manage all hotel reservations</p>
                    </div>
                </div>

                <div className="bookings-filters">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by email, room or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="status-filter"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="bookings-table-container">
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>User</th>
                                <th>Room</th>
                                <th>Dates</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td className="font-mono text-sm">{booking._id.slice(-6)}</td>
                                    <td>
                                        <div className="user-cell">
                                            <span className="user-name">{booking.user?.name || 'Unknown'}</span>
                                            <span className="user-email">{booking.user?.email}</span>
                                        </div>
                                    </td>
                                    <td>{booking.room?.name || 'Unknown Room'}</td>
                                    <td>
                                        <div className="date-cell">
                                            <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                                            <span className="text-muted">-</span>
                                            <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="font-bold">${booking.totalPrice}</td>
                                    <td>
                                        <span className={`status-badge ${booking.status}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button
                                                        className="btn-icon text-success"
                                                        title="Confirm"
                                                        onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        className="btn-icon text-error"
                                                        title="Cancel"
                                                        onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                className="btn-icon"
                                                title="Delete"
                                                onClick={() => handleDeleteClick(booking._id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <ConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    title="Delete Booking"
                    message="Are you sure you want to delete this booking? This action cannot be undone."
                    confirmText="Delete"
                    type="danger"
                />
            </div>
        </div>
    );
};

export default ManageBookings;
