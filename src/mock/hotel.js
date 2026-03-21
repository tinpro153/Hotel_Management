export const roomTypes = [
  { id: 1, name: 'Standard', basePrice: 450000 },
  { id: 2, name: 'Deluxe', basePrice: 650000 },
  { id: 3, name: 'Suite', basePrice: 1200000 }
]

export const rooms = [
  { id: 101, name: 'Phòng 101', typeId: 1, capacity: 2, price: 450000, status: 'available', amenities: ['Wifi', 'TV', 'Điều hòa'] },
  { id: 102, name: 'Phòng 102', typeId: 1, capacity: 2, price: 450000, status: 'occupied', amenities: ['Wifi', 'TV'] },
  { id: 201, name: 'Phòng 201', typeId: 2, capacity: 3, price: 650000, status: 'available', amenities: ['Wifi', 'TV', 'Bồn tắm'] },
  { id: 301, name: 'Suite 301', typeId: 3, capacity: 4, price: 1200000, status: 'maintenance', amenities: ['Wifi', 'TV', 'Bồn tắm', 'Ban công'] }
]

export const customers = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0900000001', email: 'a@gmail.com' },
  { id: 2, name: 'Trần Thị B', phone: '0900000002', email: 'b@gmail.com' }
]

export const bookings = [
  { id: 1, customerId: 1, roomId: 101, checkIn: '2026-03-22', checkOut: '2026-03-24', status: 'confirmed', total: 900000 },
  { id: 2, customerId: 2, roomId: 201, checkIn: '2026-03-25', checkOut: '2026-03-26', status: 'pending', total: 650000 }
]