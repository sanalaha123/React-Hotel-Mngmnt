import { Link, useLocation } from 'react-router-dom';
import { FaChartLine, FaBed, FaUsers, FaCalendarCheck, FaSignOutAlt, FaHotel } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';

const AdminSidebar = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <FaHotel className="text-2xl text-accent" />
                <span className="font-bold text-xl tracking-tight">LuxuryStay</span>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-group">
                    <p className="nav-label">Overview</p>
                    <Link to="/admin/dashboard" className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                        <FaChartLine /> Dashboard
                    </Link>
                </div>

                <div className="nav-group">
                    <p className="nav-label">Management</p>
                    <Link to="/admin/bookings" className={`nav-item ${isActive('/admin/bookings') ? 'active' : ''}`}>
                        <FaCalendarCheck /> Bookings
                    </Link>
                    <Link to="/admin/rooms" className={`nav-item ${isActive('/admin/rooms') ? 'active' : ''}`}>
                        <FaBed /> Rooms
                    </Link>
                    <Link to="/admin/users" className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}>
                        <FaUsers /> Users
                    </Link>
                </div>
            </nav>

            <div className="sidebar-footer">
                <button onClick={logout} className="logout-btn">
                    <FaSignOutAlt /> Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
