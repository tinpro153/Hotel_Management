<template>
  <a-row :gutter="[16,16]">
    <!-- Filters -->
    <a-col :xs="24" :lg="7">
      <a-card title="Bộ lọc" :bodyStyle="{ padding: '12px' }">
        <a-space direction="vertical" style="width:100%" size="middle">
          <div>
            <div class="label">Tìm theo tên</div>
            <a-input v-model:value="keyword" placeholder="Ví dụ: 101, Suite..." allowClear />
          </div>

          <div>
            <div class="label">Trạng thái</div>
            <a-select v-model:value="status" style="width:100%" allowClear placeholder="Chọn trạng thái">
              <a-select-option value="available">Available</a-select-option>
              <a-select-option value="occupied">Occupied</a-select-option>
              <a-select-option value="maintenance">Maintenance</a-select-option>
            </a-select>
          </div>

          <div>
            <div class="label">Sức chứa tối thiểu</div>
            <a-input-number v-model:value="minCapacity" :min="1" :max="10" style="width:100%" />
          </div>

          <div>
            <div class="label">Khoảng giá / đêm</div>
            <a-slider
  v-model:value="priceRange"
  range
  :min="minPrice"
  :max="maxPrice"
  :step="50000"
  :tooltip="{ formatter: formatMoney }"
/>
            <div class="muted">
              {{ formatMoney(priceRange[0]) }} — {{ formatMoney(priceRange[1]) }}
            </div>
          </div>

          <div>
            <div class="label">Sắp xếp</div>
            <a-select v-model:value="sort" style="width:100%">
              <a-select-option value="price_asc">Giá tăng dần</a-select-option>
              <a-select-option value="price_desc">Giá giảm dần</a-select-option>
              <a-select-option value="capacity_desc">Sức chứa giảm dần</a-select-option>
              <a-select-option value="name_asc">Tên A → Z</a-select-option>
            </a-select>
          </div>

          <a-space>
            <a-button @click="reset">Reset</a-button>
            <a-button type="primary" @click="goCart">Giỏ đặt</a-button>
          </a-space>
        </a-space>
      </a-card>
    </a-col>

    <!-- List -->
    <a-col :xs="24" :lg="17">
      <a-card :title="`Phòng (${filtered.length})`" :bodyStyle="{ padding: '12px' }">
        <a-row :gutter="[16,16]">
          <a-col v-for="r in filtered" :key="r.id" :xs="24" :md="12">
            <a-card class="room-card" hoverable>
              <template #cover>
                <div class="room-cover" :style="{ backgroundImage: `url(${roomImage(r.id)})` }">
                  <div class="room-cover-overlay">
                    <a-tag :color="statusColor(r.status)">{{ r.status }}</a-tag>
                  </div>
                </div>
              </template>

              <div class="room-title">
                <div class="name">{{ r.name }}</div>
                <div class="price">{{ formatMoney(r.price) }} <span class="muted">/ đêm</span></div>
              </div>

              <div class="meta">
                <span><b>Sức chứa:</b> {{ r.capacity }}</span>
                <span class="dot">•</span>
                <span><b>Loại:</b> {{ typeName(r.typeId) }}</span>
              </div>

              <div class="amenities">
                <a-tag v-for="a in r.amenities.slice(0, 3)" :key="a">{{ a }}</a-tag>
                <a-tag v-if="r.amenities.length > 3">+{{ r.amenities.length - 3 }}</a-tag>
              </div>

              <a-space>
                <a-button type="primary" @click="goDetail(r.id)">Xem chi tiết</a-button>
                <a-button :disabled="r.status !== 'available'" @click="quickBook(r)">
                  Đặt nhanh
                </a-button>
              </a-space>
            </a-card>
          </a-col>
        </a-row>

        <a-empty v-if="filtered.length === 0" description="Không có phòng phù hợp" />
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { rooms, roomTypes } from '@/mock/hotel'
import { useBookingCartStore } from '@/stores/bookingCart.js'

const router = useRouter()
const cart = useBookingCartStore()

const keyword = ref('')
const status = ref(undefined)
const minCapacity = ref(1)
const sort = ref('price_asc')

const prices = rooms.map(r => r.price)
const minPrice = Math.min(...prices)
const maxPrice = Math.max(...prices)
const priceRange = ref([minPrice, maxPrice])

const filtered = computed(() => {
  const list = rooms
    .filter(r => {
      const okKeyword = !keyword.value || r.name.toLowerCase().includes(keyword.value.toLowerCase())
      const okStatus = !status.value || r.status === status.value
      const okCap = r.capacity >= (minCapacity.value || 1)
      const okPrice = r.price >= priceRange.value[0] && r.price <= priceRange.value[1]
      return okKeyword && okStatus && okCap && okPrice
    })
    .slice()

  switch (sort.value) {
    case 'price_desc':
      list.sort((a, b) => b.price - a.price); break
    case 'capacity_desc':
      list.sort((a, b) => b.capacity - a.capacity); break
    case 'name_asc':
      list.sort((a, b) => a.name.localeCompare(b.name)); break
    default:
      list.sort((a, b) => a.price - b.price)
  }
  return list
})

function goDetail(id) {
  router.push({ name: 'RoomDetail', params: { id } })
}

function goCart() {
  router.push('/cart')
}

function reset() {
  keyword.value = ''
  status.value = undefined
  minCapacity.value = 1
  sort.value = 'price_asc'
  priceRange.value = [minPrice, maxPrice]
}

function quickBook(r) {
  // mock quick booking: add 1-night from today->tomorrow style value
  const checkIn = '2026-03-22'
  const checkOut = '2026-03-23'
  cart.addRoom({
    roomId: r.id,
    roomName: r.name,
    price: r.price,
    checkIn,
    checkOut,
    guests: 2
  })
  message.success('Đã thêm vào giỏ (đặt nhanh)')
}

function typeName(typeId) {
  return roomTypes.find(t => t.id === typeId)?.name || '—'
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

// Ảnh placeholder theo id (không cần tải ảnh thật)
function roomImage(id) {
  // picsum có thể đổi ảnh theo seed
  return `https://picsum.photos/seed/room-${id}/800/420`
}
</script>

<style scoped>
.label{ font-weight: 600; margin-bottom: 6px; }
.muted{ color:#6b7280; font-size: 12px; }
.room-card :deep(.ant-card-body){ padding: 12px; }
.room-cover{
  height: 170px;
  background-size: cover;
  background-position: center;
}
.room-cover-overlay{
  display:flex;
  justify-content:flex-end;
  padding: 10px;
  background: linear-gradient(to bottom, rgba(0,0,0,.35), rgba(0,0,0,0));
}
.room-title{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap: 8px;
  margin-top: 4px;
}
.room-title .name{ font-weight: 700; }
.room-title .price{ font-weight: 800; color:#0f172a; }
.meta{ color:#374151; margin: 6px 0 8px; }
.dot{ margin: 0 6px; color:#9ca3af; }
.amenities{ margin-bottom: 10px; }
</style>