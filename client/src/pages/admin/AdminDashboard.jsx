import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import RevenueChart from '../../components/admin/RevenueChart';
import {
    FaUsers, FaBed, FaMoneyBillWave, FaCalendarCheck,
    FaArrowUp, FaArrowDown, FaChartLine
} from 'react-icons/fa';
import './AdminDashboard.css';

const StatCard = ({ title, value, icon, trend, trendValue, color }) => (
    <Card className="stat-card">
        <div className="stat-icon-wrapper" style={{ backgroundColor: `${color}20`, color: color }}>
            {icon}
        </div>
        <div className="stat-content">
            <h3 className="stat-title">{title}</h3>
            <div className="stat-value">{value}</div>
            {trend && (
                <div className={`stat-trend ${trend === 'up' ? 'text-success' : 'text-error'}`}>
                    {trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                    <span>{trendValue} month</span>
                </div>
            )}
        </div>
    </Card>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        totalUsers: 0,
        totalRooms: 0,
        recentBookings: []
    });
    const [analytics, setAnalytics] = useState({
        dailyRevenue: [],
        bookingsByType: []
    });
    const [loading, setLoading] = useState(true);
    const socket = useSocket();

    useEffect(() => {
        fetchStats();

        if (socket) {
            socket.on('new-booking', (booking) => {
                toast.success(`New booking by ${booking.user.name} for ${booking.room.name}`, {
                    duration: 5000,
                    icon: '🎉'
                });
                // Refresh stats to show new booking immediately
                fetchStats();
            });

            return () => {
                socket.off('new-booking');
            };
        }
    }, [socket]);

    const fetchStats = async () => {
        try {
            const [statsRes, analyticsRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/analytics')
            ]);

            setStats(statsRes.data.data);
            setAnalytics(analyticsRes.data.data);
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner size="lg" />;

    return (
        <div className="admin-dashboard-grid">
            {/* Header Section */}
            <header className="dashboard-header-section">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
                    <p className="text-gray-400 text-sm">Welcome back, Admin</p>
                </div>
                <div className="header-actions">
                    {/* Add date filter or export button here if needed */}
                </div>
            </header>

            {/* Stats Overview */}
            <section className="stats-overview">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.totalRevenue.toLocaleString()}`}
                        icon={<FaMoneyBillWave />}
                        color="#10b981"
                        trend="up"
                        trendValue="12%"
                    />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <StatCard
                        title="Total Bookings"
                        value={stats.totalBookings}
                        icon={<FaCalendarCheck />}
                        color="#3b82f6"
                        trend="up"
                        trendValue="5%"
                    />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <StatCard
                        title="Active Users"
                        value={stats.totalUsers}
                        icon={<FaUsers />}
                        color="#f59e0b"
                        trend="up"
                        trendValue="8%"
                    />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <StatCard
                        title="Total Rooms"
                        value={stats.totalRooms}
                        icon={<FaBed />}
                        color="#8b5cf6"
                    />
                </motion.div>
            </section>

            {/* Main Content Grid: Chart + Recent Activity */}
            <section className="main-grid">
                <div className="chart-container">
                    <RevenueChart data={analytics.dailyRevenue} />
                </div>

                <div className="recent-activity-container">
                    <Card className="h-full">
                        <div className="section-header mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <FaChartLine className="text-accent" /> Recent Activity
                            </h3>
                        </div>
                        <div className="activity-list">
                            {stats.recentBookings.length > 0 ? (
                                stats.recentBookings.map((booking, index) => (
                                    <div key={index} className="activity-item">
                                        <div className="activity-icon-wrapper">
                                            <FaCalendarCheck />
                                        </div>
                                        <div className="activity-info">
                                            <span className="activity-title">New Booking</span>
                                            <span className="activity-desc">
                                                {booking.user?.name} &bull; {booking.room?.name}
                                            </span>
                                        </div>
                                        <div className="activity-time">
                                            {new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">No recent bookings</p>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-800">
                            <Link to="/admin/bookings" className="text-sm text-accent hover:text-accent-hover block text-center">
                                View All Bookings
                            </Link>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
