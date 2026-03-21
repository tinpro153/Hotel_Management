<template>
  <a-card title="Quản lý khách hàng">
    <a-table :dataSource="customers" :columns="columns" rowKey="id" />
  </a-card>
</template>

<script setup>
import { customers } from '@/mock/hotel'

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Tên', dataIndex: 'name', key: 'name' },
  { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
  { title: 'Email', dataIndex: 'email', key: 'email' }
]
</script>