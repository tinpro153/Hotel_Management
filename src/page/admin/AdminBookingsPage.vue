<template>
  <a-card title="Quản lý đặt phòng">
    <a-table :dataSource="data" :columns="columns" rowKey="id" />
  </a-card>
</template>

<script setup>
import { bookings, customers, rooms } from '@/mock/hotel'

const data = bookings.map(b => ({
  ...b,
  customerName: customers.find(c => c.id === b.customerId)?.name,
  roomName: rooms.find(r => r.id === b.roomId)?.name
}))

const columns = [
  { title: 'Mã', dataIndex: 'id', key: 'id' },
  { title: 'Khách', dataIndex: 'customerName', key: 'customerName' },
  { title: 'Phòng', dataIndex: 'roomName', key: 'roomName' },
  { title: 'Check-in', dataIndex: 'checkIn', key: 'checkIn' },
  { title: 'Check-out', dataIndex: 'checkOut', key: 'checkOut' },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
  { title: 'Tổng', dataIndex: 'total', key: 'total' }
]
</script>