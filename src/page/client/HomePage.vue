<template>
  <a-card class="hero" :bodyStyle="{ padding: 0 }" style="margin-bottom:16px">
    <div class="hero-bg">
      <div class="hero-overlay">
        <div class="hero-title-row">
          <img :src="logoImg" alt="Logo" class="hero-logo" />
          <div class="hero-title">Hotel Management</div>
        </div>

        <div class="hero-sub">Quản lý phòng • đặt phòng • khách hàng</div>

        <a-space style="margin-top:12px">
          <a-button type="primary" @click="goRooms">Xem phòng</a-button>
        </a-space>
      </div>
    </div>
  </a-card>

  <!-- phần tìm phòng nhanh + tổng quan -->
  <a-row :gutter="[16,16]">
    <a-col :xs="24" :lg="14">
      <a-card title="Tìm phòng nhanh">
        <a-row :gutter="12">
          <a-col :span="12">
            <div class="label">Ngày nhận phòng</div>
            <a-input v-model:value="checkIn" placeholder="YYYY-MM-DD" />
          </a-col>
          <a-col :span="12">
            <div class="label">Ngày trả phòng</div>
            <a-input v-model:value="checkOut" placeholder="YYYY-MM-DD" />
          </a-col>
        </a-row>

        <div style="margin-top:12px">
          <div class="label">Số khách</div>
          <a-input-number v-model:value="guests" :min="1" :max="10" style="width: 220px" />
        </div>

        <a-space style="margin-top:14px">
          <a-button type="primary" @click="goRooms">Tìm phòng</a-button>
          <a-button @click="goAdmin">Vào Admin</a-button>
        </a-space>
      </a-card>
    </a-col>

    <a-col :xs="24" :lg="10">
      <a-card title="Tổng quan">
        <div class="stat">
          <div class="muted">Phòng sẵn sàng (mock)</div>
          <div class="stat-value">{{ availableCount }}</div>
        </div>
        <a-divider />
        <div class="stat">
          <div class="muted">Phòng đang có khách (mock)</div>
          <div class="stat-value">{{ occupiedCount }}</div>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { rooms } from '@/mock/hotel'

// logo nằm ở src/assets/logo.png (đúng theo ảnh bạn gửi)
import logoImg from '@/assets/images/logo.png'

const router = useRouter()
const checkIn = ref('2026-03-22')
const checkOut = ref('2026-03-23')
const guests = ref(2)

const availableCount = computed(() => rooms.filter(r => r.status === 'available').length)
const occupiedCount = computed(() => rooms.filter(r => r.status === 'occupied').length)

function goRooms() {
  router.push({
    name: 'Rooms',
    query: { checkIn: checkIn.value, checkOut: checkOut.value, guests: guests.value }
  })
}


</script>

<style scoped>
.label{
  font-weight: 600;
  margin-bottom: 6px;
}

.hero{
  border-radius: 16px;
  overflow: hidden;
}

/* không dùng ảnh nền nữa -> dùng gradient cho gọn */
.hero-bg{
  height: 220px;
  background: radial-gradient(1000px 320px at 10% 20%, #2563eb 0%, #0b1220 55%, #020617 100%);
}

.hero-overlay{
  height: 100%;
  padding: 18px;
  display:flex;
  flex-direction:column;
  justify-content:flex-end;
}

.hero-title-row{
  display:flex;
  align-items:center;
  gap: 10px;
}

.hero-logo{
  width: 44px;
  height: 44px;
  object-fit: contain;
  border-radius: 12px;
  background: rgba(255,255,255,.10);
  padding: 6px;
}

.hero-title{
  color: #fff;
  font-weight: 900;
  font-size: 28px;
  letter-spacing: .3px;
}

.hero-sub{
  color: rgba(255,255,255,.88);
  margin-top: 6px;
}

.muted{
  color:#6b7280;
  font-size: 12px;
}

.stat-value{
  font-size: 28px;
  font-weight: 900;
  color:#111827;
  margin-top: 6px;
}
</style>