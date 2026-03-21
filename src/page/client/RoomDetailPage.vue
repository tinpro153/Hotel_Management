<template>
  <div v-if="room">
    <a-card :bodyStyle="{ padding: '12px' }" style="margin-bottom:16px">
      <div class="cover" :style="{ backgroundImage: `url(${roomImage(room.id)})` }">
        <div class="cover-inner">
          <div class="title">{{ room.name }}</div>
          <a-tag :color="statusColor(room.status)">{{ room.status }}</a-tag>
        </div>
      </div>
    </a-card>

    <a-row :gutter="[16,16]">
      <a-col :xs="24" :lg="14">
        <a-card title="Thông tin phòng">
          <a-descriptions bordered :column="1">
            <a-descriptions-item label="Giá/đêm">
              {{ formatMoney(room.price) }} VNĐ
            </a-descriptions-item>
            <a-descriptions-item label="Sức chứa">{{ room.capacity }} khách</a-descriptions-item>
            <a-descriptions-item label="Tiện nghi">
              <a-tag v-for="a in room.amenities" :key="a">{{ a }}</a-tag>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="10">
        <a-card title="Đặt phòng">
          <a-form layout="vertical">
            <a-form-item label="Ngày nhận/trả phòng">
              <a-range-picker
                v-model:value="range"
                style="width:100%"
                format="YYYY-MM-DD"
              />
              <div class="muted" style="margin-top:6px">
                Số đêm: <b>{{ nights }}</b>
              </div>
            </a-form-item>

            <a-form-item label="Số khách">
              <a-input-number v-model:value="guests" :min="1" :max="10" style="width:100%" />
              <div class="muted" style="margin-top:6px">
                (Phòng tối đa {{ room.capacity }} khách)
              </div>
            </a-form-item>

            <a-alert
              v-if="room.status !== 'available'"
              type="warning"
              showIcon
              message="Phòng hiện không khả dụng để đặt."
              style="margin-bottom:12px"
            />

            <a-card class="summary" size="small">
              <div class="row">
                <span>Giá/đêm</span>
                <b>{{ formatMoney(room.price) }}</b>
              </div>
              <div class="row">
                <span>Số đêm</span>
                <b>{{ nights }}</b>
              </div>
              <div class="row total">
                <span>Tổng</span>
                <b>{{ formatMoney(total) }}</b>
              </div>
            </a-card>

            <a-space style="margin-top:12px">
              <a-button @click="goRooms">Quay lại</a-button>
              <a-button type="primary" :disabled="!canAdd" @click="addToCart">
                Thêm vào giỏ
              </a-button>
              <a-button type="default" @click="goCart">Tới giỏ</a-button>
            </a-space>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>

  <a-result v-else status="404" title="Không tìm thấy phòng" />
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

import { rooms } from '@/mock/hotel'
import { useBookingCartStore } from '@/stores/bookingCart.js'

const route = useRoute()
const router = useRouter()
const cart = useBookingCartStore()

const roomId = computed(() => Number(route.params.id))
const room = computed(() => rooms.find(r => r.id === roomId.value))

// default range
const range = ref([dayjs('2026-03-22', 'YYYY-MM-DD'), dayjs('2026-03-23', 'YYYY-MM-DD')])
const guests = ref(2)

const nights = computed(() => {
  if (!range.value?.[0] || !range.value?.[1]) return 0
  const n = range.value[1].startOf('day').diff(range.value[0].startOf('day'), 'day')
  return Math.max(0, n)
})

const total = computed(() => {
  if (!room.value) return 0
  return room.value.price * (nights.value || 0)
})

const canAdd = computed(() => {
  return (
    room.value &&
    room.value.status === 'available' &&
    nights.value > 0 &&
    guests.value >= 1
  )
})

function addToCart() {
  const checkIn = range.value[0].format('YYYY-MM-DD')
  const checkOut = range.value[1].format('YYYY-MM-DD')

  cart.addRoom({
    roomId: room.value.id,
    roomName: room.value.name,
    price: total.value, // lưu tổng theo số đêm
    checkIn,
    checkOut,
    guests: guests.value
  })

  message.success('Đã thêm vào giỏ đặt phòng')
}

function goCart() {
  router.push('/cart')
}
function goRooms() {
  router.push('/rooms')
}

function statusColor(s) {
  if (s === 'available') return 'green'
  if (s === 'occupied') return 'volcano'
  if (s === 'maintenance') return 'gold'
  return 'blue'
}

function formatMoney(v) {
  return new Intl.NumberFormat('vi-VN').format(v)
}

function roomImage(id) {
  return `https://picsum.photos/seed/room-${id}/1200/520`
}
</script>

<style scoped>
.cover{
  height: 240px;
  border-radius: 14px;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}
.cover-inner{
  height: 100%;
  padding: 14px;
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
  background: linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,.12));
}
.title{
  color:#fff;
  font-weight: 900;
  font-size: 22px;
}
.muted{ color:#6b7280; font-size: 12px; }
.summary{
  margin-top: 4px;
  border-radius: 12px;
}
.row{
  display:flex;
  justify-content:space-between;
  padding: 6px 0;
}
.total{
  border-top: 1px solid #f0f0f0;
  margin-top: 6px;
  padding-top: 10px;
  font-size: 16px;
}
</style>