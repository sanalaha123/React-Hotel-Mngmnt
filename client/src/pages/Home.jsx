import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaStar, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import './Home.css';

const Home = () => {


    const features = [
        {
            title: 'Luxury Rooms',
            description: 'Premium rooms with world-class amenities',
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop'
        },
        {
            title: 'Top Rated',
            description: '5-star service guaranteed',
            image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=400&fit=crop'
        },
        {
            title: 'Best Prices',
            description: 'Competitive rates for luxury stays',
            image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop'
        },
        {
            title: 'Easy Booking',
            description: 'Simple and secure booking process',
            image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop'
        }
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-layout">
                        <motion.div
                            className="hero-content"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="hero-title">
                                Welcome to <span className="gradient-text">LuxuryStay</span>
                            </h1>
                            <p className="hero-subtitle">
                                Experience world-class hospitality in our premium hotel rooms.
                                Book your perfect stay today.
                            </p>
                            <div className="hero-cta">
                                <Link to="/rooms" className="btn btn-primary btn-lg">
                                    Explore Rooms <FaArrowRight style={{ marginLeft: '8px' }} />
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            className="hero-image-wrapper"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1, y: [0, -20, 0] }}
                            transition={{
                                opacity: { duration: 0.5 },
                                scale: { type: "spring", stiffness: 100, delay: 0.2 },
                                y: {
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 1
                                }
                            }}
                        >
                            <div className="hero-image-card">
                                <img
                                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=800&fit=crop"
                                    alt="Luxury Hotel"
                                    className="hero-image"
                                />
                            </div>
                            <div className="hero-decorative-circle"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section features-section">
                <div className="container">
                    <motion.h2
                        className="section-title text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Why Choose Us
                    </motion.h2>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="feature-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                            >
                                <div className="feature-image">
                                    <img src={feature.image} alt={feature.title} />
                                </div>
                                <div className="feature-content">
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-description">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <motion.div
                        className="cta-content"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>Ready to Book Your Stay?</h2>
                        <p>Join thousands of satisfied customers who trust LuxuryStay</p>
                        <Link to="/rooms" className="btn btn-primary btn-lg">
                            View Available Rooms
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
 
 
