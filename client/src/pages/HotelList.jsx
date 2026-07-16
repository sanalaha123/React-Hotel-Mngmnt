import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaStar, FaWifi, FaSwimmingPool, FaConciergeBell, FaSearch } from 'react-icons/fa';
import api from '../utils/api';
import './HotelList.css';

const HotelList = () => {
    const [searchParams] = useSearchParams();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        minPrice: 0,
        maxPrice: 2000,
        rating: 0
    });

    const city = searchParams.get('city') || '';

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                // Construct query string
                const params = new URLSearchParams();
                if (city) params.append('city', city);

                const res = await api.get(`/hotels?${params.toString()}`);
                if (res.data.success) {
                    setHotels(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching hotels:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, [city]);

    const filteredHotels = hotels.filter(hotel =>
        hotel.rating >= filter.rating
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    if (loading) return <div className="loading-spinner">Loading hotels...</div>;

    return (
        <div className="hotel-list-page">
            <div className="container">
                <div className="list-header">
                    <h1>
                        {city ? `Hotels in ${city}` : 'All Hotels'}
                        <span className="result-count">{filteredHotels.length} properties found</span>
                    </h1>
                </div>

                <div className="list-layout">
                    {/* Filters Sidebar */}
                    <aside className="filters-sidebar">
                        <div className="filter-group">
                            <h3>Min Rating</h3>
                            <div className="rating-options">
                                {[4, 3, 2].map(rating => (
                                    <label key={rating} className="checkbox-label">
                                        <input
                                            type="radio"
                                            name="rating"
                                            checked={filter.rating === rating}
                                            onChange={() => setFilter({ ...filter, rating })}
                                        />
                                        <span>{rating}+ Stars</span>
                                    </label>
                                ))}
                                <label className="checkbox-label">
                                    <input
                                        type="radio"
                                        name="rating"
                                        checked={filter.rating === 0}
                                        onChange={() => setFilter({ ...filter, rating: 0 })}
                                    />
                                    <span>Any Rating</span>
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* Hotel Grid */}
                    <motion.div
                        className="hotels-grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                            {filteredHotels.length > 0 ? (
                                filteredHotels.map(hotel => (
                                    <motion.div
                                        key={hotel._id}
                                        className="hotel-card"
                                        variants={itemVariants}
                                        layout
                                    >
                                        <div className="hotel-image">
                                            <img src={hotel.images[0]} alt={hotel.name} />
                                            {hotel.featured && <span className="featured-badge">Featured</span>}
                                        </div>
                                        <div className="hotel-content">
                                            <div className="hotel-header">
                                                <div className="hotel-rating">
                                                    <FaStar className="star-icon" />
                                                    <span>{hotel.rating}</span>
                                                    <span className="review-count">(120 reviews)</span>
                                                </div>
                                                <h2 className="hotel-name">{hotel.name}</h2>
                                                <div className="hotel-location">
                                                    <FaMapMarkerAlt />
                                                    {hotel.address}
                                                </div>
                                            </div>

                                            <div className="hotel-amenities">
                                                {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                                                    <span key={idx} className="amenity-tag">
                                                        {amenity === 'Wifi' && <FaWifi />}
                                                        {amenity === 'Pool' && <FaSwimmingPool />}
                                                        {amenity}
                                                    </span>
                                                ))}
                                                {hotel.amenities.length > 3 && (
                                                    <span className="more-amenities">+{hotel.amenities.length - 3} more</span>
                                                )}
                                            </div>

                                            <div className="hotel-footer">
                                                <div className="price-info">
                                                    <span className="price-label">Starts from</span>
                                                    <span className="price-value">$299</span>
                                                    <span className="price-period">/night</span>
                                                </div>
                                                <Link to={`/hotels/${hotel._id}`} className="btn btn-primary">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="no-results">
                                    <FaSearch size={48} />
                                    <h3>No hotels found</h3>
                                    <p>Try adjusting your search criteria</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HotelList;
