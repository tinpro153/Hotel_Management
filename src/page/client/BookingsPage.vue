<template>
  <a-card title="Đơn đặt phòng (mock)" :bodyStyle="{ padding: '12px' }">
    <a-alert
      type="info"
      showIcon
      message="Demo: nút 'Đánh giá' chỉ hiện khi booking đã checked_out và chưa có review."
      style="margin-bottom:12px"
    />

    <a-table :dataSource="data" :columns="columns" rowKey="id" :pagination="{ pageSize: 8 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="statusColor(record.status)">{{ record.status }}</a-tag>
        </template>

        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button
              size="small"
              type="primary"
              :disabled="!canReview(record)"
              @click="goReview(record)"
            >
              Đánh giá
            </a-button>

            <a-tag v-if="hasReview(record.id)" color="green">Đã đánh giá</a-tag>
          </a-space>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { rooms } from '@/mock/hotel'
import { useReviewsStore } from '@/stores/reviews.js'
import { useAdminBookingsStore } from '@/stores/adminBookings'
import { useAdminCustomersStore } from '@/stores/adminCustomers'

const router = useRouter()
const reviewsStore = useReviewsStore()

// đồng bộ với admin stores
const bookingsStore = useAdminBookingsStore()
const customersStore = useAdminCustomersStore()

const data = computed(() => {
  return bookingsStore.normalized.map(b => ({
    ...b,
    customerName: customersStore.byId(b.customerId)?.name || '—',
    roomName: rooms.find(r => r.id === b.roomId)?.name || '—'
  }))
})

const columns = [
  { title: 'Mã', dataIndex: 'id', key: 'id', width: 90 },
  { title: 'Khách', dataIndex: 'customerName', key: 'customerName' },
  { title: 'Phòng', dataIndex: 'roomName', key: 'roomName' },
  { title: 'Check-in', dataIndex: 'checkIn', key: 'checkIn', width: 120 },
  { title: 'Check-out', dataIndex: 'checkOut', key: 'checkOut', width: 120 },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 130 },
  { title: 'Thao tác', key: 'action', width: 220 }
]

function statusColor(s) {
  if (s === 'pending') return 'gold'
  if (s === 'confirmed') return 'blue'
  if (s === 'checked_in') return 'green'
  if (s === 'checked_out') return 'cyan'
  if (s === 'cancelled') return 'red'
  if (s === 'no_show') return 'volcano'
  if (s === 'refunded') return 'purple'
  return 'default'
}

function hasReview(bookingId) {
  return !!reviewsStore.byBookingId(bookingId)
}

function canReview(record) {
  return record.status === 'checked_out' && !hasReview(record.id)
}

function goReview(record) {
  router.push({
    name: 'WriteReview',
    query: {
      bookingId: record.id,
      roomId: record.roomId
    }
  })
}
</script>