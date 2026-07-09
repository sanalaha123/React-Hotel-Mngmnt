import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaSignOutAlt, FaHotel, FaUserShield } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();

    return (
        <motion.nav
            className="navbar"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-brand">
                        <FaHotel className="brand-icon" />
                        <span className="brand-text">LuxuryStay</span>
                    </Link>

                    <div className="navbar-menu">
                        {user ? (
                            isAdmin() ? (
                                <>
                                    <Link to="/admin/dashboard" className="nav-link admin-link-badge">
                                        Admin Panel
                                    </Link>
                                    <button onClick={logout} className="btn btn-ghost btn-sm">
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/rooms" className="nav-link">Rooms</Link>
                                    <Link to="/my-bookings" className="nav-link">
                                        My Bookings
                                    </Link>
                                    <Link to="/dashboard" className="nav-link">
                                        <FaUser /> Dashboard
                                    </Link>
                                    <button onClick={logout} className="btn btn-ghost btn-sm">
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </>
                            )
                        ) : (
                            <>
                                <Link to="/rooms" className="nav-link">Rooms</Link>
                                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
