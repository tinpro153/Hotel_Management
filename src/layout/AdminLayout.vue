<template>
  <a-layout style="min-height:100vh; background:#f5f7fb">
    <a-layout-sider collapsible v-model:collapsed="collapsed" :width="220" :collapsedWidth="80" class="ad-sider">
      <div class="ad-logo" @click="go('/admin')">
        <span v-if="!collapsed">Hotel Admin</span>
        <span v-else>HA</span>
      </div>
      

      <a-menu theme="dark" mode="inline" :inline-collapsed="collapsed" :selected-keys="[selectedKey]">
        <a-menu-item key="dashboard" @click="go('/admin')">Dashboard</a-menu-item>
        <a-menu-item key="rooms" @click="go('/admin/rooms')">Phòng</a-menu-item>
        <a-menu-item key="roomTypes" @click="go('/admin/room-types')">Loại phòng</a-menu-item>
        <a-menu-item key="bookings" @click="go('/admin/bookings')">Đặt phòng</a-menu-item>
        <a-menu-item key="customers" @click="go('/admin/customers')">Khách hàng</a-menu-item>
        <a-menu-divider />
        <a-menu-item key="back" @click="go('/')">Về Client</a-menu-item>
      </a-menu>
    </a-layout-sider>
    

    <a-layout>
      <a-layout-header class="ad-header">
        <div class="ad-title">Hotel Management</div>
        <a-space>
          <a-button @click="go('/admin/login')">Login</a-button>
        </a-space>
      </a-layout-header>

      <a-layout-content class="ad-content">
        <div class="ad-card">
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'



const collapsed = ref(false)
const router = useRouter()
const route = useRoute()

const selectedKey = computed(() => {
  if (route.path === '/admin') return 'dashboard'
  if (route.path.startsWith('/admin/rooms')) return 'rooms'
  if (route.path.startsWith('/admin/room-types')) return 'roomTypes'
  if (route.path.startsWith('/admin/bookings')) return 'bookings'
  if (route.path.startsWith('/admin/customers')) return 'customers'
  return 'dashboard'
})

function go(path) {
  router.push(path)
}
</script>

<style scoped>
.ad-sider{ box-shadow: 8px 0 18px rgba(16,24,40,.12); }
.ad-logo{
  height: 44px;
  margin: 12px;
  border-radius: 12px;
  background: rgba(255,255,255,.10);
  color: #fff;
  font-weight: 800;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  user-select:none;
}
.ad-header{
  position: sticky;
  top: 0;
  z-index: 9;
  background:#fff;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding: 0 16px;
  box-shadow: 0 6px 18px rgba(16,24,40,.08);
}
.ad-title{ font-weight: 700; color:#111827; }
.ad-content{ padding: 18px 16px; }
.ad-card{
  background:#fff;
  border-radius: 14px;
  padding: 16px;
  min-height: calc(100vh - 140px);
}
</style>