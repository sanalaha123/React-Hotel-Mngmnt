import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { useToast } from '../../components/ui/Toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { FaUserShield, FaTrash } from 'react-icons/fa';
import './ManageUsers.css';

const ManageUsers = () => {
    const toast = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        type: 'info'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data.data);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = (userId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete User',
            message: 'Are you sure you want to delete this user? This action cannot be undone.',
            type: 'danger',
            confirmText: 'Delete',
            onConfirm: async () => {
                try {
                    await api.delete(`/admin/users/${userId}`);
                    toast.success('User deleted successfully');
                    fetchUsers();
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Failed to delete user');
                }
            }
        });
    };

    const handleToggleRole = (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';

        setConfirmModal({
            isOpen: true,
            title: 'Change User Role',
            message: `Are you sure you want to change this user's role to ${newRole}?`,
            type: 'info',
            confirmText: 'Update Role',
            onConfirm: async () => {
                try {
                    await api.put(`/admin/users/${userId}/role`, { role: newRole });
                    toast.success('User role updated successfully');
                    fetchUsers();
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Failed to update role');
                }
            }
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    };

    if (loading) return <LoadingSpinner size="lg" />;

    return (
        <div className="manage-users">
            <div className="container">
                <motion.div
                    className="manage-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h1>Manage Users</h1>
                        <p>View and manage user accounts and permissions</p>
                    </div>
                </motion.div>

                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div className="role-cell">
                                            <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                                                {user.role === 'admin' && <FaUserShield />}
                                                {user.role}
                                            </span>
                                            <button
                                                onClick={() => handleToggleRole(user._id, user.role)}
                                                className="btn-toggle-role"
                                                title={`Change to ${user.role === 'admin' ? 'user' : 'admin'}`}
                                            >
                                                Toggle
                                            </button>
                                        </div>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="btn-icon btn-delete"
                                            disabled={user.role === 'admin'}
                                            title={user.role === 'admin' ? 'Cannot delete admin users' : 'Delete user'}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>

                    {users.length === 0 && (
                        <div className="no-users">
                            <p>No users found</p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                confirmText={confirmModal.confirmText}
            />
        </div>
    );
};

export default ManageUsers;
