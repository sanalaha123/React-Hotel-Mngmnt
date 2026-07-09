import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const EditProfileModal = ({ isOpen, onClose }) => {
    const { user, login } = useAuth(); // login is essentially setUser if we structure it right, or we need a way to update local user state
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await api.put('/auth/profile', formData);

            // We need to update the global auth state. 
            // If AuthContext doesn't export a separate updater, we might need to reload or hack it.
            // Ideally AuthContext should have an updateUser method.
            // For now, assuming we might need to refresh or if login() can just accept the user object (unlikely).
            // Let's check AuthContext if needed, but usually we can just reload window or maybe we have a check user function.
            // Or we can manually update localStorage if AuthContext reads from it on mount/update.

            const updatedUser = { ...user, ...data.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            // Force reload to update context if we don't have a setter exposed. 
            // Cleaner way: expose `updateUser` in AuthContext. I'll stick to simple reload for now or check AuthContext next.

            window.location.reload();

            toast.success('Profile updated successfully');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Profile"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <Input
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Optional"
                />

                <div className="flex justify-end gap-3 mt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={loading}>
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditProfileModal;
