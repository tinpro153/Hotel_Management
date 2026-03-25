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
import WriteReviewPage from '@/page/client/WriteReviewPage.vue'
import AdminLoginPage from '@/page/client/AdminLoginPage.vue'

// Admin pages
import AdminDashboardPage from '@/page/admin/AdminDashboardPage.vue'
import AdminRoomsPage from '@/page/admin/AdminRoomsPage.vue'
import AdminRoomTypesPage from '@/page/admin/AdminRoomTypesPage.vue'
import AdminBookingsPage from '@/page/admin/AdminBookingsPage.vue'
import AdminCustomersPage from '@/page/admin/AdminCustomersPage.vue'
import AdminInventoryPage from '@/page/admin/AdminInventoryPage.vue'

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
      { path: 'bookings', name: 'Bookings', component: BookingsPage },
      {path: '/write-review',name: 'WriteReview',component: WriteReviewPage}

    ]
  },
  { path: '/admin/login', name: 'AdminLogin', component: AdminLoginPage },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboardPage },
      { path: 'rooms', name: 'AdminRooms', component: AdminRoomsPage },
      { path: 'room-types', name: 'AdminRoomTypes', component: AdminRoomTypesPage },
      { path: 'bookings', name: 'AdminBookings', component: AdminBookingsPage },
      { path: 'customers', name: 'AdminCustomers', component: AdminCustomersPage },
      { path: 'inventory', name: 'AdminInventory', component: AdminInventoryPage }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ===== Route guard: protect admin routes =====
router.beforeEach((to, from, next) => {
  const { useAuthStore } = require('@/stores/auth')
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'AdminLogin', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router