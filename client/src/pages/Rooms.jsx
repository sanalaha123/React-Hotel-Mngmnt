import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FaStar, FaUsers, FaMoneyBillWave, FaSearch } from 'react-icons/fa';
import './Rooms.css';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        city: '',
        type: '',
        minPrice: '',
        maxPrice: '',
        search: ''
    });

    useEffect(() => {
        // Debounce the filter changes to avoid too many API calls
        const timer = setTimeout(() => {
            fetchRooms();
        }, 300);

        return () => clearTimeout(timer);
    }, [filters]);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();

            if (filters.city) queryParams.append('city', filters.city);
            if (filters.type) queryParams.append('type', filters.type);
            if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
            if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
            if (filters.search) queryParams.append('search', filters.search);

            const { data } = await api.get(`/rooms?${queryParams.toString()}`);
            setRooms(data.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="rooms-page">
            <div className="container">
                <motion.div
                    className="rooms-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1>Our Rooms</h1>
                    <p>Discover luxury and comfort in every room</p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    className="filters glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="filter-group">
                        <div className="input-wrapper">
                            <FaSearch className="input-icon-left" />
                            <input
                                type="text"
                                name="search"
                                placeholder="Search rooms..."
                                value={filters.search}
                                onChange={handleFilterChange}
                                className="input input-with-icon"
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <select
                            name="city"
                            value={filters.city}
                            onChange={handleFilterChange}
                            className="select"
                        >
                            <option value="">All Cities</option>
                            <option value="Paris">Paris</option>
                            <option value="London">London</option>
                            <option value="New York">New York</option>
                            <option value="Tokyo">Tokyo</option>
                            <option value="Dubai">Dubai</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <select
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            className="select"
                        >
                            <option value="">All Types</option>
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Suite">Suite</option>
                            <option value="Deluxe">Deluxe</option>
                            <option value="Presidential">Presidential</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <div className="input-wrapper">
                            <span className="input-icon-left" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>$</span>
                            <input
                                type="number"
                                name="minPrice"
                                placeholder="Min Price"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                                className="input input-with-icon"
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <div className="input-wrapper">
                            <span className="input-icon-left" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>$</span>
                            <input
                                type="number"
                                name="maxPrice"
                                placeholder="Max Price"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                className="input input-with-icon"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Rooms Grid */}
                {loading ? (
                    <LoadingSpinner size="lg" />
                ) : rooms.length === 0 ? (
                    <div className="no-results">
                        <h3>No rooms found</h3>
                        <p>Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="rooms-grid">
                        {rooms.map((room, index) => (
                            <motion.div
                                key={room._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link to={`/rooms/${room._id}`} className="room-card-link">
                                    <Card className="room-card">
                                        <div className="room-image">
                                            {room.images && room.images.length > 0 ? (
                                                <img
                                                    src={room.images[0]}
                                                    alt={room.name}
                                                    onError={(e) => {
                                                        e.target.src = `https://via.placeholder.com/400x300/667eea/ffffff?text=${encodeURIComponent(room.name)}`;
                                                    }}
                                                />
                                            ) : (
                                                <div className="room-image-placeholder">
                                                    <FaMoneyBillWave size={60} />
                                                </div>
                                            )}
                                            <div className="room-type-badge">{room.type}</div>
                                        </div>

                                        <div className="room-content">
                                            <h3 className="room-name">{room.name}</h3>
                                            <p className="room-description">{room.description.substring(0, 100)}...</p>

                                            <div className="room-meta">
                                                <div className="room-meta-item">
                                                    <FaStar className="icon" />
                                                    <span>{room.rating.toFixed(1)} ({room.numReviews})</span>
                                                </div>
                                                <div className="room-meta-item">
                                                    <FaUsers className="icon" />
                                                    <span>{room.capacity} guests</span>
                                                </div>
                                            </div>

                                            <div className="room-footer">
                                                <div className="room-price">
                                                    <span className="price-amount">${room.price}</span>
                                                    <span className="price-unit">/night</span>
                                                </div>
                                                <span className={`room-status ${room.isAvailable ? 'available' : 'unavailable'}`}>
                                                    {room.isAvailable ? 'Available' : 'Booked'}
                                                </span>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rooms;
