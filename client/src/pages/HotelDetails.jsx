import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaStar, FaWifi, FaSwimmingPool, FaConciergeBell, FaCheck, FaParking, FaUtensils, FaDumbbell } from 'react-icons/fa';
import RoomCard from '../components/rooms/RoomCard'; // Assuming existing RoomCard component
import './HotelList.css'; // Reuse some list styles or create specific ones

const HotelDetails = () => {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotelAndRooms = async () => {
            try {
                const [hotelRes, roomsRes] = await Promise.all([
                    axios.get(`http://localhost:5001/api/hotels/${id}`),
                    axios.get(`http://localhost:5001/api/hotels/${id}/rooms`)
                ]);

                if (hotelRes.data.success) setHotel(hotelRes.data.data);
                if (roomsRes.data.success) setRooms(roomsRes.data.data);
            } catch (error) {
                console.error('Error fetching hotel details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotelAndRooms();
    }, [id]);

    if (loading || !hotel) return <div className="loading-spinner">Loading...</div>;

    return (
        <div className="hotel-details-page">
            <div className="hotel-hero" style={{ backgroundImage: `url(${hotel.images[0]})` }}>
                <div className="hotel-hero-overlay">
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="hotel-hero-content"
                        >
                            <div className="hotel-hero-rating">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < hotel.rating ? "star-filled" : "star-empty"} />
                                ))}
                            </div>
                            <h1>{hotel.name}</h1>
                            <p className="hotel-hero-location">
                                <FaMapMarkerAlt /> {hotel.address}, {hotel.city}, {hotel.country}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="container hotel-content-section">
                <div className="grid-layout">
                    <div className="main-content">
                        <section className="description-section">
                            <h2>About this Hotel</h2>
                            <p>{hotel.description}</p>
                        </section>

                        <section className="amenities-section">
                            <h2>Amenities</h2>
                            <div className="amenities-grid">
                                {hotel.amenities.map((amenity, index) => (
                                    <div key={index} className="amenity-item">
                                        <FaCheck className="check-icon" />
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rooms-section">
                            <h2>Available Rooms</h2>
                            <div className="rooms-grid">
                                {rooms.length > 0 ? (
                                    rooms.map(room => (
                                        <div key={room._id} className="room-wrapper">
                                            {/* Reuse existing RoomCard but maybe adjust styling via wrapper */}
                                            <RoomCard room={room} />
                                        </div>
                                    ))
                                ) : (
                                    <p>No rooms available at the moment.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;
