import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import api from '../utils/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';
import { FaStar, FaUsers, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';
import './RoomDetails.css';

const RoomDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookedDates, setBookedDates] = useState([]);
    const [bookingUpdateTrigger, setBookingUpdateTrigger] = useState(0);
    const socket = useSocket();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [roomRes, datesRes] = await Promise.all([
                    api.get(`/rooms/${id}`),
                    api.get(`/rooms/${id}/booked-dates`)
                ]);

                setRoom(roomRes.data.data);

                // Process booked dates for calendar
                const dates = [];
                if (datesRes.data.data) {
                    datesRes.data.data.forEach(booking => {
                        let currentDate = new Date(booking.checkIn);
                        const end = new Date(booking.checkOut);

                        while (currentDate < end) {
                            dates.push(new Date(currentDate));
                            currentDate.setDate(currentDate.getDate() + 1);
                        }
                    });
                }
                setBookedDates(dates);

            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load room details');
            } finally {
                setLoading(false);
            }
        };
        loadData();

        // Socket listener for real-time availability updates
        if (socket) {
            const handleAvailabilityUpdate = (data) => {
                if (data.roomId === id) {
                    // Re-trigger loadData by updating state or calling it directly if feasible.
                    // Since loadData is inside effect, we can use a dependency trigger or refactor.
                    // Refactoring loadData out of useEffect is cleaner, but for now we can rely on a trigger state.
                    // Or simply re-fetch the dates here.
                    loadData(); // This works if loadData is stable or inside the same scope
                    toast.success('Room availability updated!');
                }
            };

            socket.on('room-availability-update', handleAvailabilityUpdate);

            return () => {
                socket.off('room-availability-update', handleAvailabilityUpdate);
            };
        }
    }, [id, socket, bookingUpdateTrigger]);

    const handleBookNow = () => {
        if (!user) {
            toast.info('Please login to book a room');
            navigate('/login');
            return;
        }

        navigate(`/booking/${id}`);
    };

    if (loading) return <LoadingSpinner size="lg" />;
    if (!room) return <div className="container pt-3xl"><h2>Room not found</h2></div>;

    return (
        <div className="room-details-page">
            <div className="container-wide">
                <motion.div
                    className="room-details"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="room-gallery">
                        {room.images && room.images.length > 0 ? (
                            <img
                                src={room.images[0]}
                                alt={room.name}
                                className="room-main-image"
                                onError={(e) => {
                                    e.target.src = `https://via.placeholder.com/800x600/667eea/ffffff?text=${encodeURIComponent(room.name)}`;
                                }}
                            />
                        ) : (
                            <div className="room-image-placeholder-large">
                                No Image Available
                            </div>
                        )}

                        <div className="availability-calendar-section glass-card mt-6 p-6">
                            <h3 className="mb-4 flex items-center gap-2"><FaCalendarAlt /> Availability</h3>
                            <div className="flex justify-center">
                                <DatePicker
                                    inline
                                    excludeDates={bookedDates}
                                    minDate={new Date()}
                                    disabledKeyboardNavigation
                                    readOnly
                                    monthsShown={1}
                                />
                            </div>
                            <p className="text-center text-sm text-gray-500 mt-2">
                                Dates grayed out are unavailable.
                            </p>
                        </div>
                    </div>

                    <div className="room-info">
                        <div className="room-header">
                            <div>
                                <div className="room-type-label">{room.type}</div>
                                <h1>{room.name}</h1>
                                <div className="room-rating">
                                    <FaStar className="star-icon" />
                                    <span>{room.rating ? room.rating.toFixed(1) : 'New'}</span>
                                    <span className="reviews-count">({room.numReviews || 0} reviews)</span>
                                </div>
                            </div>
                            <div className="room-price-box glass-card">
                                <div className="price-large">${room.price}</div>
                                <div className="price-label">per night</div>
                            </div>
                        </div>

                        <div className="room-description-section">
                            <h3>About this room</h3>
                            <p>{room.description || 'No description available.'}</p>
                        </div>

                        <div className="room-features">
                            <div className="feature-item">
                                <FaUsers className="feature-icon" />
                                <div>
                                    <div className="feature-label">Capacity</div>
                                    <div className="feature-value">{room.capacity} guests</div>
                                </div>
                            </div>
                            <div className="feature-item">
                                <FaCheckCircle className="feature-icon" />
                                <div>
                                    <div className="feature-label">Status</div>
                                    <div className={`feature-value ${room.isAvailable ? 'text-success' : 'text-error'}`}>
                                        {room.isAvailable ? 'Available' : 'Unavailable'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {room.amenities && room.amenities.length > 0 && (
                            <div className="room-amenities">
                                <h3>Amenities</h3>
                                <div className="amenities-grid">
                                    {room.amenities.map((amenity, index) => (
                                        <div key={index} className="amenity-item">
                                            <FaCheckCircle className="amenity-icon" />
                                            <span>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="room-actions">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleBookNow}
                                disabled={!room.isAvailable}
                            >
                                {room.isAvailable ? 'Book Now' : 'Not Available'}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RoomDetails;
