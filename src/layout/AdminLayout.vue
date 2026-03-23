<template>
  <a-layout class="ad-root">
    <a-layout-sider
      collapsible
      v-model:collapsed="collapsed"
      :width="220"
      :collapsedWidth="80"
      class="ad-sider"
    >
      <div class="ad-logo" @click="go('/admin')">
        <span v-if="!collapsed">Hotel Admin</span>
        <span v-else>HA</span>
      </div>

      <a-menu
        theme="dark"
        mode="inline"
        :selectedKeys="[selectedKey]"
        class="ad-menu"
      >
        <a-menu-item key="dashboard" @click="go('/admin')">
          <template #icon><DashboardOutlined /></template>
          <span>Dashboard</span>
        </a-menu-item>

        <a-menu-item key="rooms" @click="go('/admin/rooms')">
          <template #icon><ShopOutlined /></template>
          <span>Phòng</span>
        </a-menu-item>

        <a-menu-item key="roomTypes" @click="go('/admin/room-types')">
          <template #icon><TagsOutlined /></template>
          <span>Loại phòng</span>
        </a-menu-item>

        <!-- NEW: Inventory -->
        <a-menu-item key="inventory" @click="go('/admin/inventory')">
          <template #icon><CalendarOutlined /></template>
          <span>Tồn kho</span>
        </a-menu-item>

        <a-menu-item key="bookings" @click="go('/admin/bookings')">
          <template #icon><ProfileOutlined /></template>
          <span>Đặt phòng</span>
        </a-menu-item>

        <a-menu-item key="customers" @click="go('/admin/customers')">
          <template #icon><TeamOutlined /></template>
          <span>Khách hàng</span>
        </a-menu-item>

        <a-menu-divider />

        <a-menu-item key="back" @click="go('/')">
          <template #icon><HomeOutlined /></template>
          <span>Về Client</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="ad-header">
        <div class="ad-title">Hotel Management</div>
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

import {
  DashboardOutlined,
  HomeOutlined,
  ShopOutlined,
  TagsOutlined,
  ProfileOutlined,
  TeamOutlined,
  CalendarOutlined // NEW
} from '@ant-design/icons-vue'

const collapsed = ref(false)
const router = useRouter()
const route = useRoute()

const selectedKey = computed(() => {
  if (route.path === '/admin') return 'dashboard'
  if (route.path.startsWith('/admin/rooms')) return 'rooms'
  if (route.path.startsWith('/admin/room-types')) return 'roomTypes'
  if (route.path.startsWith('/admin/inventory')) return 'inventory' // NEW
  if (route.path.startsWith('/admin/bookings')) return 'bookings'
  if (route.path.startsWith('/admin/customers')) return 'customers'
  return 'dashboard'
})

function go(path) {
  router.push(path)
}
</script>

<style scoped>
.ad-root{
  min-height: 100vh;
  background:#f5f7fb;
}

.ad-sider{
  box-shadow: 8px 0 18px rgba(16,24,40,.12);
}

/* Fix: tránh menu bị “lọt”/cắt trên mobile và khi collapse */
.ad-menu{
  padding-bottom: 10px;
}

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

  /* Fix: không cho chữ xuống dòng/cắt xấu */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.ad-title{
  font-weight: 800;
  color:#111827;
}

.ad-content{
  padding: 18px 16px;
}

.ad-card{
  background:#fff;
  border-radius: 14px;
  padding: 16px;
  min-height: calc(100vh - 140px);
}

/* Mobile: sidebar + content đỡ chật */
@media (max-width: 576px){
  .ad-content{
    padding: 12px 10px;
  }
  .ad-card{
    padding: 12px;
    border-radius: 12px;
  }
}
</style>