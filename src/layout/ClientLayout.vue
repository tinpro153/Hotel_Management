<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header style="display:flex;align-items:center;justify-content:space-between">
      <div
  style="color:#fff;font-weight:700;cursor:pointer"
  @click="go('/')"
>
  Hotel Manager
</div>

      <a-menu theme="dark" mode="horizontal" :selectedKeys="[selectedKey]" style="flex:1;margin-left:16px">
        <a-menu-item key="home" @click="go('/')">Trang chủ</a-menu-item>
        <a-menu-item key="rooms" @click="go('/rooms')">Phòng</a-menu-item>
        <a-menu-item key="bookings" @click="go('/bookings')">Đơn đặt</a-menu-item>
        <a-menu-item key="admin" @click="go('/admin')">Admin</a-menu-item>
      </a-menu>

      <a-button type="primary" @click="go('/cart')">
        Giỏ đặt <span v-if="cart.count">({{ cart.count }})</span>
      </a-button>
    </a-layout-header>

    <a-layout-content style="padding: 16px; max-width: 1200px; margin: 0 auto; width: 100%">
      <router-view />
    </a-layout-content>

    <a-layout-footer style="text-align:center">
      Hotel Manager UI — Vue 3 + Ant Design Vue
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingCartStore } from '@/stores/bookingCart.js'

const router = useRouter()
const route = useRoute()
const cart = useBookingCartStore()

const selectedKey = computed(() => {
  if (route.path.startsWith('/rooms')) return 'rooms'
  if (route.path.startsWith('/bookings')) return 'bookings'
  if (route.path.startsWith('/admin')) return 'admin'
  return 'home'
})

function go(path) {
  router.push(path)
}
</script>