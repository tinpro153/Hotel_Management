<template>
  <a-card title="Quản lý loại phòng">
    <a-table :dataSource="roomTypes" :columns="columns" rowKey="id" />
  </a-card>
</template>

<script setup>
import { roomTypes } from '@/mock/hotel'

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Tên loại', dataIndex: 'name', key: 'name' },
  { title: 'Giá cơ bản', dataIndex: 'basePrice', key: 'basePrice' }
]
</script>