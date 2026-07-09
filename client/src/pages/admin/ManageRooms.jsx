import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './ManageRooms.css';

const ManageRooms = () => {
    const toast = useToast();
    const [rooms, setRooms] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Delete Confirmation State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        hotel: '',
        description: '',
        type: 'Single',
        price: '',
        capacity: '',
        amenities: '',
        images: '',
        isAvailable: true
    });

    useEffect(() => {
        fetchRooms();
        fetchHotels();
    }, []);

    const fetchRooms = async () => {
        try {
            const { data } = await api.get('/rooms');
            setRooms(data.data);
        } catch (error) {
            toast.error('Failed to fetch rooms');
        } finally {
            setLoading(false);
        }
    };

    const fetchHotels = async () => {
        try {
            const { data } = await api.get('/hotels');
            setHotels(data.data);
        } catch (error) {
            console.error('Failed to fetch hotels', error);
        }
    };

    const [editingRoom, setEditingRoom] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate Hotel selection
        if (!formData.hotel) {
            toast.error('Please select a hotel');
            return;
        }

        const roomData = {
            ...formData,
            price: Number(formData.price),
            capacity: Number(formData.capacity),
            amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
            images: formData.images.split(',').map(i => i.trim()).filter(Boolean)
        };

        try {
            if (editingRoom) {
                await api.put(`/rooms/${editingRoom._id}`, roomData);
                toast.success('Room updated successfully!');
            } else {
                await api.post('/rooms', roomData);
                toast.success('Room created successfully!');
            }
            setIsModalOpen(false);
            setEditingRoom(null);
            fetchRooms();
            resetForm();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${editingRoom ? 'update' : 'create'} room`);
        }
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setFormData({
            name: room.name,
            hotel: room.hotel?._id || room.hotel || '', // Handle populated or unpopulated
            description: room.description,
            type: room.type,
            price: room.price,
            capacity: room.capacity,
            amenities: room.amenities.join(', '),
            images: room.images.join(', '),
            isAvailable: room.isAvailable
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        setRoomToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!roomToDelete) return;
        try {
            await api.delete(`/rooms/${roomToDelete}`);
            toast.success('Room deleted successfully!');
            fetchRooms();
        } catch (error) {
            toast.error('Failed to delete room');
        } finally {
            setIsDeleteModalOpen(false);
            setRoomToDelete(null);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            hotel: '',
            description: '',
            type: 'Single',
            price: '',
            capacity: '',
            amenities: '',
            images: '',
            isAvailable: true
        });
    };

    if (loading) return <LoadingSpinner size="lg" />;

    return (
        <div className="manage-rooms">
            <div className="container">
                <div className="manage-header">
                    <div>
                        <h1>Manage Rooms</h1>
                        <p>Create, edit, and delete hotel rooms</p>
                    </div>
                    <Button
                        variant="primary"
                        icon={<FaPlus />}
                        onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                        }}
                    >
                        Add Room
                    </Button>
                </div>

                <div className="rooms-table-container">
                    <table className="rooms-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Hotel</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Capacity</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room) => (
                                <tr key={room._id}>
                                    <td>{room.name}</td>
                                    <td>{room.hotel?.name || 'Unknown Hotel'}</td>
                                    <td>{room.type}</td>
                                    <td>${room.price}/night</td>
                                    <td>{room.capacity} guests</td>
                                    <td>
                                        <span className={`status-badge ${room.isAvailable ? 'available' : 'unavailable'}`}>
                                            {room.isAvailable ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon" title="Edit">
                                                <FaEdit onClick={() => handleEdit(room)} />
                                            </button>
                                            <button className="btn-icon" title="Delete">
                                                <FaTrash onClick={() => handleDeleteClick(room._id)} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingRoom(null);
                        resetForm();
                    }}
                    title={editingRoom ? "Edit Room" : "Add New Room"}
                    size="lg"
                >
                    <form onSubmit={handleSubmit} className="room-form">
                        <Input
                            label="Room Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <div className="input-group">
                            <label className="input-label">Hotel</label>
                            <select
                                value={formData.hotel}
                                onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
                                className="select"
                                required
                            >
                                <option value="">Select a Hotel</option>
                                {hotels.map(hotel => (
                                    <option key={hotel._id} value={hotel._id}>
                                        {hotel.name} ({hotel.city})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Room Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="select"
                            >
                                <option value="Single">Single</option>
                                <option value="Double">Double</option>
                                <option value="Suite">Suite</option>
                                <option value="Deluxe">Deluxe</option>
                                <option value="Presidential">Presidential</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <Input
                                label="Price (per night)"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                            <Input
                                label="Capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Description</label>
                            <textarea
                                className="input"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="4"
                                required
                            />
                        </div>

                        <Input
                            label="Amenities (comma-separated)"
                            value={formData.amenities}
                            onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                            placeholder="WiFi, TV, AC, Mini Bar"
                        />

                        <Input
                            label="Image URLs (comma-separated)"
                            value={formData.images}
                            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        />

                        <Button type="submit" variant="primary">
                            {editingRoom ? 'Update Room' : 'Create Room'}
                        </Button>
                    </form>
                </Modal>

                <ConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    title="Delete Room"
                    message="Are you sure you want to delete this room? This action cannot be undone."
                    confirmText="Delete"
                    type="danger"
                />
            </div>
        </div>
    );
};

export default ManageRooms;
