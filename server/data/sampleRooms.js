import mongoose from 'mongoose';

// Sample room data with prices
const sampleRooms = [
  {
    name: 'Deluxe Ocean View Suite',
    description: 'Luxurious suite with breathtaking ocean views, king-size bed, and private balcony. Perfect for a romantic getaway.',
    type: 'Deluxe',
    price: 299,
    capacity: 2,
    amenities: ['WiFi', 'Ocean View', 'King Bed', 'Mini Bar', 'Balcony', 'Room Service'],
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'
    ],
    isAvailable: true
  },
  {
    name: 'Presidential Suite',
    description: 'Ultimate luxury with separate living room, dining area, and panoramic city views. Includes butler service.',
    type: 'Presidential',
    price: 599,
    capacity: 4,
    amenities: ['WiFi', 'City View', '2 Bedrooms', 'Living Room', 'Butler Service', 'Jacuzzi', 'Kitchen'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'
    ],
    isAvailable: true
  },
  {
    name: 'Standard Double Room',
    description: 'Comfortable room with modern amenities and two double beds. Ideal for families or friends.',
    type: 'Double',
    price: 149,
    capacity: 4,
    amenities: ['WiFi', '2 Double Beds', 'TV', 'Coffee Maker', 'Desk'],
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'
    ],
    isAvailable: true
  },
  {
    name: 'Cozy Single Room',
    description: 'Perfect for solo travelers. Compact yet comfortable with all essential amenities.',
    type: 'Single',
    price: 99,
    capacity: 1,
    amenities: ['WiFi', 'Single Bed', 'TV', 'Work Desk', 'Shower'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
    ],
    isAvailable: true
  },
  {
    name: 'Executive Suite',
    description: 'Spacious suite designed for business travelers with work area, high-speed internet, and premium bedding.',
    type: 'Suite',
    price: 349,
    capacity: 2,
    amenities: ['WiFi', 'King Bed', 'Work Area', 'Coffee Machine', 'City View', 'Bathtub'],
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'
    ],
    isAvailable: true
  },
  {
    name: 'Garden View Double',
    description: 'Peaceful room overlooking lush gardens with two queen beds and natural lighting.',
    type: 'Double',
    price: 179,
    capacity: 3,
    amenities: ['WiFi', 'Garden View', '2 Queen Beds', 'Patio', 'TV', 'Mini Fridge'],
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800'
    ],
    isAvailable: true
  }
];

export default sampleRooms;
