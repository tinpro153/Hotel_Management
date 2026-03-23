<template>
  <a-layout style="min-height: 100vh; background: var(--bg)">
    <!-- Header -->
    <a-layout-header class="bk-header">
      <div class="bk-header-inner">
        <div class="bk-brand" @click="go('/')">
          <img :src="logoImg" alt="logo" class="bk-logo" />
          <span class="bk-brand-text">Hotel Manager</span>
        </div>

        <div class="bk-nav">
          <a-menu theme="dark" mode="horizontal" :selectedKeys="[selectedKey]" class="bk-menu">
            <a-menu-item key="home" @click="go('/')">Trang chủ</a-menu-item>
            <a-menu-item key="rooms" @click="go('/rooms')">Phòng</a-menu-item>
            <a-menu-item key="bookings" @click="go('/bookings')">Đơn đặt</a-menu-item>
          </a-menu>

          <a-space>
            <a-button class="bk-admin-btn" @click="go('/admin')">Admin</a-button>
            <a-button type="primary" @click="go('/cart')">
              Giỏ đặt <span v-if="cart.count">({{ cart.count }})</span>
            </a-button>
          </a-space>
        </div>
      </div>
    </a-layout-header>

    <!-- Search bar -->
    <div class="bk-search-wrap">
      <div class="app-container">
        <div class="bk-search ui-card">
          <a-row :gutter="[10,10]" align="middle">
            <!-- WHERE -->
            <a-col :xs="24" :md="16">
              <div class="bk-field">
                <div class="bk-label">Bạn muốn ở đâu?</div>
                <a-auto-complete
                  v-model:value="q"
                  :options="placeOptions"
                  style="width:100%"
                  placeholder="Ví dụ: Đà Nẵng, Sơn Trà, Quận 1, 101, Suite..."
                  allowClear
                />
              </div>
            </a-col>

            <!-- GUESTS -->
            <a-col :xs="12" :md="4">
              <div class="bk-field">
                <div class="bk-label">Khách</div>
                <a-input-number v-model:value="guests" :min="1" :max="10" style="width:100%" />
              </div>
            </a-col>

            <!-- BUTTON -->
            <a-col :xs="12" :md="4">
              <a-button type="primary" block class="bk-search-btn" @click="goRooms">
                Tìm
              </a-button>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>

    <a-layout-content>
      <div class="app-container">
        <router-view />
      </div>
    </a-layout-content>

    <a-layout-footer class="bk-footer">
      Hotel Manager UI — Vue 3 + Ant Design Vue
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingCartStore } from '@/stores/bookingCart.js'
import { rooms } from '@/mock/hotel'
import logoImg from '@/assets//images/logo.png'

const router = useRouter()
const route = useRoute()
const cart = useBookingCartStore()

const q = ref('')
const guests = ref(2)

const selectedKey = computed(() => {
  if (route.path.startsWith('/rooms')) return 'rooms'
  if (route.path.startsWith('/bookings')) return 'bookings'
  if (route.path.startsWith('/admin')) return 'admin'
  return 'home'
})

const placeOptions = computed(() => {
  const set = new Set()
  rooms.forEach(r => {
    if (r.city) set.add(r.city)
    if (r.area && r.city) set.add(`${r.area}, ${r.city}`)
    if (r.address) set.add(r.address)
    if (r.name) set.add(r.name)
    if (r.id != null) set.add(String(r.id))
  })

  return Array.from(set)
    .filter(Boolean)
    .slice(0, 30)
    .map(v => ({ value: v }))
})

function go(path) {
  router.push(path)
}

function goRooms() {
  router.push({
    name: 'Rooms',
    query: { q: q.value || '', guests: guests.value || 1 }
  })
}
</script>

<style scoped>
.bk-header{
  height: 64px;
  padding: 0;
  background: linear-gradient(180deg, var(--bk-blue) 0%, var(--bk-blue-2) 100%);
  display:flex;
  align-items:center;
  box-shadow: 0 8px 18px rgba(2,6,23,.18);
}

.bk-header-inner{
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
  margin: 0 auto;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
}

.bk-brand{
  display:flex;
  align-items:center;
  gap: 10px;
  cursor:pointer;
  user-select:none;
  color:#fff;
  font-weight: 900;
  white-space: nowrap;
}

.bk-logo{
  width: 34px;
  height: 34px;
  object-fit: contain;
  border-radius: 10px;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.14);
  padding: 6px;
}

.bk-nav{
  display:flex;
  align-items:center;
  gap: 12px;
  flex: 1;
  justify-content:flex-end;
}

.bk-menu{
  background: transparent;
  flex: 1;
  min-width: 320px;
}

.bk-admin-btn{
  color:#fff;
  border-color: rgba(255,255,255,.45);
  background: transparent;
}

.bk-search-wrap{
  background: linear-gradient(180deg, var(--bk-blue-2) 0%, rgba(0,0,0,0) 100%);
  padding: 14px 0 0;
}

.bk-search{
  background: var(--bk-yellow);
  padding: 10px;
}

.bk-field{
  background: #fff;
  border-radius: 12px;
  padding: 10px;
  border: 1px solid rgba(15,23,42,.10);
}

.bk-label{
  font-size: 12px;
  font-weight: 800;
  color:#0f172a;
  margin-bottom: 6px;
}

.bk-search-btn{
  height: 52px;
  font-weight: 900;
}

.bk-footer{
  text-align:center;
  color: rgba(15,23,42,.65);
  background: transparent;
  padding: 18px 16px;
}

@media (max-width: 768px){
  .bk-menu{ display:none; }
}
</style>