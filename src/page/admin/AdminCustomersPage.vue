<template>
  <a-card title="Quản lý khách hàng" :bodyStyle="{ padding: '12px' }">
    <a-space style="margin-bottom:12px" wrap>
      <a-input v-model:value="keyword" placeholder="Tìm theo tên/sđt/email..." allowClear style="width:260px" />
      <a-popconfirm title="Reset về dữ liệu mẫu?" @confirm="customersStore.resetSeed()">
        <a-button>Reset seed</a-button>
      </a-popconfirm>
    </a-space>

    <a-table :dataSource="filtered" :columns="columns" rowKey="id" :pagination="{ pageSize: 8 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'spent'">
          {{ formatMoney(record.spent) }}
        </template>

        <template v-else-if="column.key === 'action'">
          <a-button size="small" @click="openHistory(record)">Lịch sử</a-button>
        </template>
      </template>
    </a-table>

    <a-drawer v-model:open="drawerOpen" width="520" title="Lịch sử đặt phòng">
      <div v-if="selectedCustomer" style="margin-bottom:12px">
        <div><b>{{ selectedCustomer.name }}</b></div>
        <div class="ui-muted">{{ selectedCustomer.phone }} • {{ selectedCustomer.email }}</div>
      </div>

      <a-table
        :dataSource="customerBookings"
        :columns="historyColumns"
        rowKey="id"
        size="small"
        :pagination="{ pageSize: 6 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="statusColor(record.status)">{{ record.status }}</a-tag>
          </template>
          <template v-else-if="column.key === 'total'">
            {{ formatMoney(record.total) }}
          </template>
        </template>
      </a-table>
    </a-drawer>
  </a-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import { rooms } from '@/mock/hotel'
import { useAdminCustomersStore } from '@/stores/adminCustomers'
import { useAdminBookingsStore } from '@/stores/adminBookings'

const customersStore = useAdminCustomersStore()
const bookingsStore = useAdminBookingsStore()

const keyword = ref('')

const enriched = computed(() => {
  const bookings = bookingsStore.normalized
  return customersStore.customers.map(c => {
    const list = bookings.filter(b => b.customerId === c.id)
    const spent = list
      .filter(b => b.status === 'checked_out')
      .reduce((s, b) => s + (Number(b.total) || 0), 0)
    return { ...c, bookingCount: list.length, spent }
  })
})

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return enriched.value.filter(c => {
    if (!kw) return true
    return (
      String(c.id).includes(kw) ||
      (c.name || '').toLowerCase().includes(kw) ||
      (c.phone || '').toLowerCase().includes(kw) ||
      (c.email || '').toLowerCase().includes(kw)
    )
  })
})

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: 'Tên', dataIndex: 'name', key: 'name' },
  { title: 'SĐT', dataIndex: 'phone', key: 'phone', width: 140 },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Số booking', dataIndex: 'bookingCount', key: 'bookingCount', width: 110 },
  { title: 'Đã chi', dataIndex: 'spent', key: 'spent', width: 140 },
  { title: 'Thao tác', key: 'action', width: 110 }
]

const historyColumns = [
  { title: 'Mã', dataIndex: 'id', key: 'id', width: 90 },
  { title: 'Phòng', dataIndex: 'roomName', key: 'roomName' },
  { title: 'Check-in', dataIndex: 'checkIn', key: 'checkIn', width: 110 },
  { title: 'Check-out', dataIndex: 'checkOut', key: 'checkOut', width: 110 },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 120 },
  { title: 'Tổng', dataIndex: 'total', key: 'total', width: 120 }
]

const drawerOpen = ref(false)
const selectedCustomer = ref(null)

const customerBookings = computed(() => {
  if (!selectedCustomer.value) return []
  return bookingsStore.normalized
    .filter(b => b.customerId === selectedCustomer.value.id)
    .map(b => ({
      ...b,
      roomName: rooms.find(r => r.id === b.roomId)?.name || '—'
    }))
})

function openHistory(c) {
  selectedCustomer.value = c
  drawerOpen.value = true
}

function formatMoney(v) {
  return new Intl.NumberFormat('vi-VN').format(Number(v || 0))
}
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
</script>