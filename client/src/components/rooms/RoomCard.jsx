import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import Card from '../ui/Card';
import './RoomCard.css';

const RoomCard = ({ room }) => {
    return (
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
                            <span>{room.rating?.toFixed(1) || '0.0'} ({room.numReviews || 0})</span>
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
    );
};

export default RoomCard;
