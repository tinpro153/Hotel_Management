export const roomTypes = [
  { id: 1, name: 'Standard', description: 'Phòng tiêu chuẩn, phù hợp 1–2 khách.', priceBase: 550000, suggestedCapacity: 2 },
  { id: 2, name: 'Deluxe', description: 'Phòng rộng hơn, view đẹp, tiện nghi đầy đủ.', priceBase: 850000, suggestedCapacity: 2 },
  { id: 3, name: 'Suite', description: 'Hạng cao cấp, có phòng khách, trải nghiệm sang trọng.', priceBase: 1450000, suggestedCapacity: 3 },
  { id: 4, name: 'Family', description: 'Phòng gia đình, phù hợp nhóm 3–5 khách.', priceBase: 1200000, suggestedCapacity: 4 }
]

export const rooms = [
  // Đà Nẵng
  {
    id: 101,
    name: 'Deluxe 101 - Sea View',
    typeId: 2,
    price: 950000,
    capacity: 2,
    status: 'available',
    amenities: ['Wifi', 'TV', 'Điều hòa', 'Ban công', 'View biển'],
    city: 'Đà Nẵng',
    area: 'Sơn Trà',
    address: '123 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng'
  },
  {
    id: 102,
    name: 'Standard 102 - City View',
    typeId: 1,
    price: 590000,
    capacity: 2,
    status: 'available',
    amenities: ['Wifi', 'TV', 'Điều hòa'],
    city: 'Đà Nẵng',
    area: 'Hải Châu',
    address: '45 Bạch Đằng, Hải Châu, Đà Nẵng'
  },
  {
    id: 103,
    name: 'Suite 103 - Premium',
    typeId: 3,
    price: 1650000,
    capacity: 3,
    status: 'occupied',
    amenities: ['Wifi', 'TV', 'Bồn tắm', 'Ban công', 'Mini bar'],
    city: 'Đà Nẵng',
    area: 'Ngũ Hành Sơn',
    address: '09 Trần Bạch Đằng, Ngũ Hành Sơn, Đà Nẵng'
  },
  {
    id: 104,
    name: 'Family 104 - Beachside',
    typeId: 4,
    price: 1350000,
    capacity: 4,
    status: 'available',
    amenities: ['Wifi', 'TV', '2 Giường', 'Điều hòa', 'Gần biển'],
    city: 'Đà Nẵng',
    area: 'Ngũ Hành Sơn',
    address: '88 Nguyễn Văn Thoại, Ngũ Hành Sơn, Đà Nẵng'
  },

  // Hà Nội
  {
    id: 201,
    name: 'Standard 201 - Old Quarter',
    typeId: 1,
    price: 650000,
    capacity: 2,
    status: 'available',
    amenities: ['Wifi', 'TV', 'Điều hòa', 'Gần phố cổ'],
    city: 'Hà Nội',
    area: 'Hoàn Kiếm',
    address: '12 Hàng Bè, Hoàn Kiếm, Hà Nội'
  },
  {
    id: 202,
    name: 'Deluxe 202 - Lake View',
    typeId: 2,
    price: 980000,
    capacity: 2,
    status: 'maintenance',
    amenities: ['Wifi', 'TV', 'Bồn tắm', 'View hồ'],
    city: 'Hà Nội',
    area: 'Tây Hồ',
    address: '18 Xuân Diệu, Tây Hồ, Hà Nội'
  },
  {
    id: 203,
    name: 'Suite 203 - Executive',
    typeId: 3,
    price: 1850000,
    capacity: 3,
    status: 'available',
    amenities: ['Wifi', 'TV', 'Bàn làm việc', 'Phòng khách'],
    city: 'Hà Nội',
    area: 'Ba Đình',
    address: '30 Liễu Giai, Ba Đình, Hà Nội'
  },{
  id: 204,
  name: 'Family 204 - West Lake',
  typeId: 4,
  price: 1350000,
  capacity: 4,
  status: 'available',
  amenities: ['Wifi', 'TV', 'Bồn tắm', 'Bếp nhỏ', 'View hồ'],
  city: 'Hà Nội',
  area: 'Tây Hồ',
  address: '09 Trích Sài, Tây Hồ, Hà Nội'
},
{
  id: 205,
  name: 'Deluxe 205 - Business',
  typeId: 2,
  price: 920000,
  capacity: 2,
  status: 'available',
  amenities: ['Wifi', 'TV', 'Bàn làm việc', 'Gần trung tâm'],
  city: 'Hà Nội',
  area: 'Cầu Giấy',
  address: '36 Duy Tân, Cầu Giấy, Hà Nội'
},
{
  id: 206,
  name: 'Suite 206 - Landmark',
  typeId: 3,
  price: 1950000,
  capacity: 3,
  status: 'occupied',
  amenities: ['Wifi', 'TV', 'Phòng khách', 'Bồn tắm', 'View thành phố'],
  city: 'Hà Nội',
  area: 'Ba Đình',
  address: '02 Liễu Giai, Ba Đình, Hà Nội'
},

  // TP.HCM
  {
    id: 301,
    name: 'Deluxe 301 - Downtown',
    typeId: 2,
    price: 1100000,
    capacity: 2,
    status: 'available',
    amenities: ['Wifi', 'TV', 'Điều hòa', 'Gần trung tâm'],
    city: 'TP. Hồ Chí Minh',
    area: 'Quận 1',
    address: '98 Nguyễn Huệ, Quận 1, TP.HCM'
  },
  {
    id: 302,
    name: 'Suite 302 - Skyline',
    typeId: 3,
    price: 2100000,
    capacity: 3,
    status: 'occupied',
    amenities: ['Wifi', 'TV', 'View thành phố', 'Mini bar'],
    city: 'TP. Hồ Chí Minh',
    area: 'Quận 1',
    address: '15 Đồng Khởi, Quận 1, TP.HCM'
  },
  {
    id: 303,
    name: 'Family 303 - Riverside',
    typeId: 4,
    price: 1550000,
    capacity: 4,
    status: 'available',
    amenities: ['Wifi', 'TV', '2 Giường', 'Gần sông', 'Bếp nhỏ'],
    city: 'TP. Hồ Chí Minh',
    area: 'Thủ Đức',
    address: '22 Xa lộ Hà Nội, Thủ Đức, TP.HCM'
  },
  {
  id: 304,
  name: 'Standard 304 - Cozy Corner',
  typeId: 1,
  price: 520000,
  capacity: 2,
  status: 'available',
  amenities: ['Wifi', 'TV', 'Điều hòa', 'Gần trung tâm'],
  city: 'TP. Hồ Chí Minh',
  area: 'Quận 3',
  address: '120 Võ Văn Tần, Quận 3, TP.HCM'
},
{
  id: 305,
  name: 'Deluxe 305 - Saigon River',
  typeId: 2,
  price: 1200000,
  capacity: 2,
  status: 'available',
  amenities: ['Wifi', 'TV', 'View sông', 'Mini bar'],
  city: 'TP. Hồ Chí Minh',
  area: 'Bình Thạnh',
  address: '05 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM'
},
{
  id: 306,
  name: 'Suite 306 - Premium City',
  typeId: 3,
  price: 2350000,
  capacity: 3,
  status: 'available',
  amenities: ['Wifi', 'TV', 'Phòng khách', 'Bồn tắm', 'View thành phố'],
  city: 'TP. Hồ Chí Minh',
  area: 'Quận 1',
  address: '25 Lê Lợi, Quận 1, TP.HCM'
},

  // Đà Lạt
  {
    id: 401,
    name: 'Standard 401 - Cozy',
    typeId: 1,
    price: 520000,
    capacity: 2,
    status: 'available',
    amenities: ['Wifi', 'TV', 'Sưởi', 'View đồi'],
    city: 'Đà Lạt',
    area: 'Phường 1',
    address: '10 Bùi Thị Xuân, Phường 1, Đà Lạt'
  },
  {
    id: 402,
    name: 'Deluxe 402 - Pine View',
    typeId: 2,
    price: 820000,
    capacity: 2,
    status: 'available',
    amenities: ['Wifi', 'TV', 'Sưởi', 'Ban công'],
    city: 'Đà Lạt',
    area: 'Phường 8',
    address: '55 Phù Đổng Thiên Vương, Phường 8, Đà Lạt'
  },
  {
  id: 403,
  name: 'Suite 403 - Valley View',
  typeId: 3,
  price: 1450000,
  capacity: 3,
  status: 'available',
  amenities: ['Wifi', 'TV', 'Sưởi', 'Ban công', 'View thung lũng'],
  city: 'Đà Lạt',
  area: 'Phường 10',
  address: '20 Đường 3/4, Phường 10, Đà Lạt'
},
{
  id: 404,
  name: 'Family 404 - Garden House',
  typeId: 4,
  price: 1250000,
  capacity: 4,
  status: 'available',
  amenities: ['Wifi', 'TV', 'Sưởi', 'Bếp nhỏ', 'Sân vườn'],
  city: 'Đà Lạt',
  area: 'Phường 3',
  address: '07 Nguyễn Thị Minh Khai, Phường 3, Đà Lạt'
},
{
  id: 405,
  name: 'Deluxe 405 - Central',
  typeId: 2,
  price: 890000,
  capacity: 2,
  status: 'maintenance',
  amenities: ['Wifi', 'TV', 'Sưởi', 'Gần chợ'],
  city: 'Đà Lạt',
  area: 'Phường 1',
  address: '11 Nguyễn Chí Thanh, Phường 1, Đà Lạt'
}
  
]

/**
 * NEW: customers + bookings để AdminBookingsPage/AdminCustomersPage không warning
 * Đây là mock data tối thiểu.
 */
export const customers = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0901000001', email: 'a@example.com' },
  { id: 2, name: 'Trần Thị B', phone: '0901000002', email: 'b@example.com' },
  { id: 3, name: 'Lê Văn C', phone: '0901000003', email: 'c@example.com' }
]

// booking: liên kết customerId + roomId
export const bookings = [
  {
    id: 1001,
    roomId: 103,
    customerId: 1,
    checkIn: '2026-03-22',
    checkOut: '2026-03-24',
    guests: 2,
    status: 'confirmed',
    note: 'Nhận phòng sau 14:00'
  },
  {
    id: 1002,
    roomId: 302,
    customerId: 2,
    checkIn: '2026-03-25',
    checkOut: '2026-03-27',
    guests: 2,
    status: 'confirmed',
    note: ''
  },
  {
    id: 1003,
    roomId: 201,
    customerId: 3,
    checkIn: '2026-03-28',
    checkOut: '2026-03-29',
    guests: 1,
    status: 'pending',
    note: ''
  }
]