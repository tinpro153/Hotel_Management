<template>
  <a-row :gutter="[16,16]">
    <a-col :xs="24" :md="8">
      <a-card>
        <a-statistic title="Tổng đơn đặt (mock)" :value="bookingCount" />
      </a-card>
    </a-col>
    <a-col :xs="24" :md="8">
      <a-card>
        <a-statistic title="Doanh thu (mock)" :value="revenue" />
      </a-card>
    </a-col>
    <a-col :xs="24" :md="8">
      <a-card>
        <a-statistic title="Phòng sẵn sàng" :value="availableRooms" />
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { computed } from 'vue'
import { bookings, rooms } from '@/mock/hotel'

const bookingCount = computed(() => bookings.length)
const revenue = computed(() => bookings.reduce((s, b) => s + b.total, 0))
const availableRooms = computed(() => rooms.filter(r => r.status === 'available').length)
</script>