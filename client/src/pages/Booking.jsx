import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import api from '../utils/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { FaCalendar, FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import './Booking.css';

const Booking = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1,
        specialRequests: ''
    });

    useEffect(() => {
        fetchRoom();
    }, [id]);

    const fetchRoom = async () => {
        try {
            const { data } = await api.get(`/rooms/${id}`);
            setRoom(data.data);
        } catch (error) {
            toast.error('Failed to load room details');
            navigate('/rooms');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        if (!bookingData.checkIn || !bookingData.checkOut || !room) return 0;

        const checkIn = new Date(bookingData.checkIn);
        const checkOut = new Date(bookingData.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

        return nights > 0 ? nights * room.price : 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to book a room');
            navigate('/login');
            return;
        }

        const checkIn = new Date(bookingData.checkIn);
        const checkOut = new Date(bookingData.checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkIn < today) {
            toast.error('Check-in date cannot be in the past');
            return;
        }

        if (checkOut <= checkIn) {
            toast.error('Check-out date must be after check-in date');
            return;
        }

        if (bookingData.guests > room.capacity) {
            toast.error(`Maximum capacity is ${room.capacity} guests`);
            return;
        }

        setSubmitting(true);

        try {
            // Check availability first
            const availabilityCheck = await api.post('/bookings/check-availability', {
                roomId: id,
                checkIn: bookingData.checkIn,
                checkOut: bookingData.checkOut
            });

            if (!availabilityCheck.data.available) {
                toast.error('Room is not available for selected dates');
                setSubmitting(false);
                return;
            }

            // Create booking
            const response = await api.post('/bookings', {
                room: id,
                checkIn: bookingData.checkIn,
                checkOut: bookingData.checkOut,
                guests: bookingData.guests,
                totalPrice: calculateTotal(),
                specialRequests: bookingData.specialRequests
            });

            toast.success('Booking created successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create booking');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="container pt-3xl">Loading...</div>;
    if (!room) return <div className="container pt-3xl">Room not found</div>;

    const totalPrice = calculateTotal();
    const nights = bookingData.checkIn && bookingData.checkOut
        ? Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className="booking-page">
            <div className="container">
                <motion.div
                    className="booking-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="booking-content">
                        <h1>Complete Your Booking</h1>

                        <Card className="room-summary">
                            <h3>{room.name}</h3>
                            <p className="room-type">{room.type} Room</p>
                            <div className="price-info">
                                <span className="price">${room.price}</span>
                                <span className="price-unit">per night</span>
                            </div>
                        </Card>

                        <form onSubmit={handleSubmit} className="booking-form">
                            <div className="form-row">
                                <div className="input-group">
                                    <label className="input-label">
                                        <FaCalendar /> Check-in Date *
                                    </label>
                                    <input
                                        type="date"
                                        className="input"
                                        value={bookingData.checkIn}
                                        onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">
                                        <FaCalendar /> Check-out Date *
                                    </label>
                                    <input
                                        type="date"
                                        className="input"
                                        value={bookingData.checkOut}
                                        onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                                        min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">
                                    <FaUsers /> Number of Guests *
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    value={bookingData.guests}
                                    onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                                    min="1"
                                    max={room.capacity}
                                    required
                                />
                                <small className="input-hint">Maximum capacity: {room.capacity} guests</small>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Special Requests (Optional)</label>
                                <textarea
                                    className="input"
                                    value={bookingData.specialRequests}
                                    onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                                    rows="4"
                                    placeholder="Any special requests or requirements..."
                                />
                            </div>

                            {nights > 0 && (
                                <Card className="price-summary" glass>
                                    <h3>Price Summary</h3>
                                    <div className="summary-row">
                                        <span>${room.price} × {nights} night{nights > 1 ? 's' : ''}</span>
                                        <span>${room.price * nights}</span>
                                    </div>
                                    <div className="summary-row total">
                                        <span>Total</span>
                                        <span className="total-amount">${totalPrice}</span>
                                    </div>
                                </Card>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                loading={submitting}
                                disabled={!bookingData.checkIn || !bookingData.checkOut || submitting}
                            >
                                {submitting ? 'Processing...' : 'Confirm Booking'}
                            </Button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Booking;
