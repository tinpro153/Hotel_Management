import { createRouter, createWebHistory } from 'vue-router'

import ClientLayout from '@/layout/ClientLayout.vue'
import AdminLayout from '@/layout/AdminLayout.vue'

// Client pages
import HomePage from '@/page/client/HomePage.vue'
import RoomsPage from '@/page/client/RoomsPage.vue'
import RoomDetailPage from '@/page/client/RoomDetailPage.vue'
import CartPage from '@/page/client/CartPage.vue'
import CheckoutPage from '@/page/client/CheckoutPage.vue'
import BookingsPage from '@/page/client/BookingsPage.vue'

// Admin pages
// import AdminLoginPage from '@/page/admin/AdminLoginPage.vue'
import AdminDashboardPage from '@/page/admin/AdminDashboardPage.vue'
import AdminRoomsPage from '@/page/admin/AdminRoomsPage.vue'
import AdminRoomTypesPage from '@/page/admin/AdminRoomTypesPage.vue'
import AdminBookingsPage from '@/page/admin/AdminBookingsPage.vue'
import AdminCustomersPage from '@/page/admin/AdminCustomersPage.vue'

const routes = [
  {
    path: '/',
    component: ClientLayout,
    children: [
      { path: '', name: 'Home', component: HomePage },
      { path: 'rooms', name: 'Rooms', component: RoomsPage },
      { path: 'rooms/:id', name: 'RoomDetail', component: RoomDetailPage, props: true },
      { path: 'cart', name: 'Cart', component: CartPage },
      { path: 'checkout', name: 'Checkout', component: CheckoutPage },
      { path: 'bookings', name: 'Bookings', component: BookingsPage }
    ]
  },
  // { path: '/admin/login', name: 'AdminLogin', component: AdminLoginPage },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboardPage },
      { path: 'rooms', name: 'AdminRooms', component: AdminRoomsPage },
      { path: 'room-types', name: 'AdminRoomTypes', component: AdminRoomTypesPage },
      { path: 'bookings', name: 'AdminBookings', component: AdminBookingsPage },
      { path: 'customers', name: 'AdminCustomers', component: AdminCustomersPage }
    ]
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})