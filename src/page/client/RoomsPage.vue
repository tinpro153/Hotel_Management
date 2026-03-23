<template>
  <a-row :gutter="[16,16]">
    <!-- Filters -->
    <a-col :xs="24" :lg="7">
      <a-card class="ui-card bk-filter" title="Bộ lọc" :bodyStyle="{ padding: '12px' }">
        <a-space direction="vertical" style="width:100%" size="middle">
          <div>
            <div class="label">Tìm theo địa điểm / tên phòng</div>
            <a-input v-model:value="keyword" placeholder="Ví dụ: Đà Nẵng, Sơn Trà, 101..." allowClear />
            <div class="ui-muted" style="margin-top:6px" v-if="fromSearchBar">
              Đang lọc theo: <b>{{ fromSearchBar }}</b>
            </div>
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
            <div class="ui-muted">{{ formatMoney(priceRange[0]) }} — {{ formatMoney(priceRange[1]) }}</div>
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

          <a-space wrap>
            <a-button @click="reset">Reset</a-button>
            <a-button type="primary" @click="goCart">Giỏ đặt</a-button>
          </a-space>
        </a-space>
      </a-card>
    </a-col>

    <!-- List -->
    <a-col :xs="24" :lg="17">
      <a-card class="ui-card" :bodyStyle="{ padding: '12px' }">
        <div class="list-head">
          <div class="list-title">Chỗ ở phù hợp</div>
          <div class="ui-muted">{{ filtered.length }} phòng</div>
        </div>

        <a-space direction="vertical" style="width:100%" size="middle">
          <div v-for="r in filtered" :key="r.id" class="bk-room ui-card">
            <!-- ✅ đồng bộ ảnh (Home + Rooms) -->
            <div class="bk-room-img" :style="{ backgroundImage: `url(${roomCover(r)})` }"></div>

            <div class="bk-room-body">
              <div class="bk-room-top">
                <div>
                  <div class="bk-room-name">{{ r.name }}</div>

                  <div class="bk-room-location ui-muted">
                    {{ (r.area ? r.area + ', ' : '') + (r.city || '') }}
                  </div>

                  <div class="bk-room-meta">
                    <a-tag :color="statusColor(r.status)">{{ r.status }}</a-tag>
                    <span class="dot">•</span>
                    <span><b>Sức chứa:</b> {{ r.capacity }}</span>
                    <span class="dot">•</span>
                    <span><b>Loại:</b> {{ typeName(r.typeId) }}</span>
                  </div>
                </div>

                <div class="bk-price-box">
                  <div class="bk-price">{{ formatMoney(r.price) }}₫</div>
                  <div class="ui-muted">/đêm</div>
                </div>
              </div>

              <div class="bk-amenities">
                <a-tag v-for="a in r.amenities.slice(0, 4)" :key="a">{{ a }}</a-tag>
                <a-tag v-if="r.amenities.length > 4">+{{ r.amenities.length - 4 }}</a-tag>
              </div>

              <div class="bk-actions">
                <a-button type="primary" @click="goDetail(r.id)">Xem phòng</a-button>
                <a-button :disabled="r.status !== 'available'" @click="quickBook(r)">Đặt nhanh</a-button>
              </div>
            </div>
          </div>

          <a-empty v-if="filtered.length === 0" description="Không có phòng phù hợp" />
        </a-space>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { rooms, roomTypes } from '@/mock/hotel'
import { useBookingCartStore } from '@/stores/bookingCart.js'
import { roomCover } from '@/utils/roomImages.js' // ✅ NEW

const router = useRouter()
const route = useRoute()
const cart = useBookingCartStore()

const keyword = ref('')
const fromSearchBar = ref('')
const status = ref(undefined)
const minCapacity = ref(1)
const sort = ref('price_asc')

const prices = rooms.map(r => r.price)
const minPrice = Math.min(...prices)
const maxPrice = Math.max(...prices)
const priceRange = ref([minPrice, maxPrice])

// Đồng bộ từ search bar (query)
watch(
  () => route.query,
  (q) => {
    const kw = (q.q || '').toString()
    keyword.value = kw
    fromSearchBar.value = kw

    const g = Number(q.guests || 1)
    minCapacity.value = Number.isFinite(g) ? Math.max(1, g) : 1
  },
  { immediate: true }
)

const filtered = computed(() => {
  const kw = (keyword.value || '').trim().toLowerCase()

  const list = rooms
    .filter(r => {
      const okKeyword =
        !kw ||
        r.name?.toLowerCase().includes(kw) ||
        String(r.id).includes(kw) ||
        (r.city || '').toLowerCase().includes(kw) ||
        (r.area || '').toLowerCase().includes(kw) ||
        (r.address || '').toLowerCase().includes(kw)

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
  fromSearchBar.value = ''
  status.value = undefined
  minCapacity.value = 1
  sort.value = 'price_asc'
  priceRange.value = [minPrice, maxPrice]
}

function quickBook(r) {
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
</script>

<style scoped>
.label{ font-weight: 800; margin-bottom: 6px; }
.dot{ margin: 0 8px; color:#9ca3af; }

.bk-filter{
  position: sticky;
  top: 88px;
}

.list-head{
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
  margin-bottom: 10px;
}
.list-title{
  font-weight: 950;
  font-size: 16px;
}

.bk-room{
  display:grid;
  grid-template-columns: 260px 1fr;
  gap: 12px;
  padding: 12px;
  overflow: hidden;
}

.bk-room-img{
  border-radius: 12px;
  height: 180px;
  background-size: cover;
  background-position: center;
}

.bk-room-body{
  display:flex;
  flex-direction:column;
  gap: 10px;
}

.bk-room-top{
  display:flex;
  justify-content:space-between;
  gap: 12px;
}

.bk-room-name{
  font-weight: 950;
  font-size: 18px;
  line-height: 1.2;
}

.bk-room-location{
  margin-top: 6px;
}

.bk-room-meta{
  margin-top: 6px;
  color:#334155;
  display:flex;
  align-items:center;
  flex-wrap:wrap;
  gap: 6px;
}

.bk-price-box{
  text-align:right;
  min-width: 120px;
}
.bk-price{
  font-weight: 950;
  font-size: 20px;
  color:#0f172a;
}

.bk-amenities :deep(.ant-tag){
  margin-bottom: 6px;
}

.bk-actions{
  display:flex;
  gap: 10px;
  flex-wrap:wrap;
  margin-top: auto;
}

@media (max-width: 768px){
  .bk-filter{ position: static; top: auto; }
  .bk-room{
    grid-template-columns: 1fr;
  }
  .bk-room-img{
    height: 200px;
  }
  .bk-price-box{
    text-align:left;
  }
}
</style>