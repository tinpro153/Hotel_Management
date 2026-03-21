# Hotel Management (UI)

Giao diện quản lý khách sạn xây bằng **Vue 3**, **Vue Router**, **Pinia** và **Ant Design Vue**.

## Tính năng
### Client
- Trang Home (hero + tìm phòng nhanh)
- Danh sách phòng (lọc theo giá, trạng thái, sức chứa; sắp xếp)
- Chi tiết phòng (chọn ngày, số đêm, tính tổng tiền)
- Giỏ đặt phòng (Pinia store)

### Admin
- Layout sidebar responsive (collapsed)
- CRUD phòng (mock data + lưu LocalStorage)

> Lưu ý: Hiện tại dự án sử dụng dữ liệu mock, chưa kết nối backend.

## Công nghệ
- Vue 3
- Vue Router
- Pinia
- Ant Design Vue
- dayjs (cho DatePicker/RangePicker)

## Cấu trúc thư mục
- `src/page/client/*`: các trang client
- `src/page/admin/*`: các trang admin
- `src/layout/*`: layout client/admin
- `src/stores/*`: Pinia stores (cart, admin CRUD)
- `src/mock/*`: dữ liệu mock
- `src/assets/*`: ảnh/logo

## Cài đặt & chạy dự án
### 1) Cài dependency
```bash
npm install
```

### 2) Chạy local
```bash
npm run serve
```

Mở: `http://localhost:8080`

### 3) Build production
```bash
npm run build
```

## Ghi chú
- Dữ liệu CRUD Admin được lưu ở **LocalStorage** (key: `hotel_admin_rooms_v1`).
- Nếu muốn reset dữ liệu mẫu, dùng nút **Reset seed** ở trang Admin Rooms.

## Roadmap
- CRUD Room Types / Bookings / Customers
- Kết nối API thật (axios) + auth admin
- Upload ảnh phòng + gallery
- Validate form (Ant Form rules)
- Deploy (Vercel/Netlify)

