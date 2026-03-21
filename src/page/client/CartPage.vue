<template>
  <a-card title="Giỏ đặt phòng">
    <a-table :dataSource="cart.items" :columns="columns" rowKey="id" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'price'">
          {{ formatMoney(record.price) }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button danger @click="cart.remove(record.id)">Xóa</a-button>
        </template>
      </template>
    </a-table>

    <a-divider />

    <div style="display:flex;justify-content:space-between;align-items:center">
      <div><b>Tổng:</b> {{ formatMoney(cart.total) }}</div>
      <a-space>
        <a-button @click="cart.clear" :disabled="!cart.count">Xóa hết</a-button>
        <a-button type="primary" @click="goCheckout" :disabled="!cart.count">Thanh toán</a-button>
      </a-space>
    </div>
  </a-card>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useBookingCartStore } from '@/stores/bookingCart'

const router = useRouter()
const cart = useBookingCartStore()

const columns = [
  { title: 'Phòng', dataIndex: 'roomName', key: 'roomName' },
  { title: 'Check-in', dataIndex: 'checkIn', key: 'checkIn' },
  { title: 'Check-out', dataIndex: 'checkOut', key: 'checkOut' },
  { title: 'Khách', dataIndex: 'guests', key: 'guests' },
  { title: 'Giá', dataIndex: 'price', key: 'price' },
  { title: 'Thao tác', key: 'action' }
]

function goCheckout() {
  router.push('/checkout')
}

function formatMoney(v) {
  return new Intl.NumberFormat('vi-VN').format(v)
}
</script>