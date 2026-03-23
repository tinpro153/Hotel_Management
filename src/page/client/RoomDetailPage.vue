<template>
  <div v-if="room">
    <!-- Title + Location -->
    <a-card class="ui-card" :bodyStyle="{ padding: '12px' }" style="margin-bottom:16px">
      <div class="rd-head">
        <div>
          <div class="rd-title">{{ room.name }}</div>
          <div class="rd-sub ui-muted">
            {{ room.address || ((room.area ? room.area + ', ' : '') + (room.city || '')) }}
          </div>
          <div class="rd-tags">
            <a-tag :color="statusColor(room.status)">{{ room.status }}</a-tag>
            <a-tag v-if="room.amenities?.includes('Wifi')" color="blue">Wifi</a-tag>
            <a-tag v-if="room.amenities?.includes('Gần biển') || room.amenities?.includes('View biển')" color="cyan">
              Gần biển
            </a-tag>
          </div>
        </div>

        <div class="rd-price-box">
          <div class="rd-price">{{ formatMoney(room.price) }}₫</div>
          <div class="ui-muted">/đêm</div>
        </div>
      </div>
    </a-card>

    <!-- Gallery (Booking-like) -->
    <a-card class="ui-card" :bodyStyle="{ padding: '12px' }" style="margin-bottom:16px">
      <div class="rd-gallery">
        <div class="rd-img rd-img-main" :style="{ backgroundImage: `url(${images[0]})` }" @click="openPreview(0)"></div>
        <div class="rd-img" :style="{ backgroundImage: `url(${images[1]})` }" @click="openPreview(1)"></div>
        <div class="rd-img" :style="{ backgroundImage: `url(${images[2]})` }" @click="openPreview(2)"></div>
        <div class="rd-img" :style="{ backgroundImage: `url(${images[3]})` }" @click="openPreview(3)"></div>
        <div class="rd-img rd-img-more" :style="{ backgroundImage: `url(${images[4]})` }" @click="openPreview(4)">
          <div class="rd-more-overlay">
            <div class="rd-more-text">Xem tất cả ảnh</div>
          </div>
        </div>
      </div>

      <a-modal v-model:open="previewOpen" title="Ảnh phòng" :footer="null" width="980px">
        <div class="rd-preview">
          <img :src="images[previewIndex]" alt="preview" class="rd-preview-img" />
          <div class="rd-preview-actions">
            <a-button @click="prevImg">←</a-button>
            <a-button @click="nextImg">→</a-button>
          </div>
          <div class="ui-muted" style="margin-top:10px">
            {{ previewIndex + 1 }} / {{ images.length }}
          </div>
        </div>
      </a-modal>
    </a-card>

    <!-- Content + Sticky booking box -->
    <a-row :gutter="[16,16]">
      <!-- Left content -->
      <a-col :xs="24" :lg="14">
        <a-card class="ui-card" title="Tổng quan" :bodyStyle="{ padding: '12px' }" style="margin-bottom:16px">
          <div class="rd-overview">
            <div class="rd-overview-item">
              <div class="rd-k">Sức chứa</div>
              <div class="rd-v">{{ room.capacity }} khách</div>
            </div>
            <div class="rd-overview-item">
              <div class="rd-k">Loại phòng</div>
              <div class="rd-v">{{ typeName(room.typeId) }}</div>
            </div>
            <div class="rd-overview-item">
              <div class="rd-k">Giá</div>
              <div class="rd-v">{{ formatMoney(room.price) }}₫ / đêm</div>
            </div>
          </div>
        </a-card>

        <a-card class="ui-card" title="Tiện nghi" :bodyStyle="{ padding: '12px' }" style="margin-bottom:16px">
          <div class="rd-amenities">
            <a-tag v-for="a in room.amenities" :key="a">{{ a }}</a-tag>
          </div>
        </a-card>

        <a-card class="ui-card" title="Chính sách" :bodyStyle="{ padding: '12px' }" style="margin-bottom:16px">
          <a-descriptions bordered :column="1" size="small">
            <a-descriptions-item label="Giờ nhận phòng">Từ 14:00</a-descriptions-item>
            <a-descriptions-item label="Giờ trả phòng">Trước 12:00</a-descriptions-item>
            <a-descriptions-item label="Hủy phòng (mock)">
              Miễn phí hủy trước 24 giờ (demo). Sau này nối rule thật theo booking.
            </a-descriptions-item>
            <a-descriptions-item label="Thanh toán (mock)">
              Thanh toán khi nhận phòng / hoặc thanh toán trước (tùy cấu hình).
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <a-card class="ui-card" title="Đánh giá" :bodyStyle="{ padding: '12px' }">
          <div v-if="reviewSummary.count > 0" class="rd-review">
            <div class="rd-review-score">
              <div class="score">{{ reviewSummary.overall.toFixed(1) }}</div>
              <div>
                <div class="label">{{ scoreLabel(reviewSummary.overall) }}</div>
                <div class="ui-muted">{{ reviewSummary.count }} đánh giá</div>
              </div>
            </div>

            <div class="rd-review-bars">
              <div class="bar" v-for="it in reviewSummary.breakdown" :key="it.key">
                <div class="k">{{ it.label }}</div>
                <a-progress :percent="Math.round((it.value / 10) * 100)" :showInfo="false" />
                <div class="v">{{ it.value.toFixed(1) }}</div>
              </div>
            </div>
          </div>

          <a-empty v-else description="Chưa có đánh giá (demo)" />
        </a-card>
      </a-col>

      <!-- Right sticky booking -->
      <a-col :xs="24" :lg="10">
        <div class="rd-sticky">
          <a-card class="ui-card" title="Đặt phòng" :bodyStyle="{ padding: '12px' }">
            <a-form layout="vertical">
              <a-form-item label="Ngày nhận/trả phòng">
                <a-range-picker v-model:value="range" style="width:100%" format="YYYY-MM-DD" />
                <div class="ui-muted" style="margin-top:6px">
                  Số đêm: <b>{{ nights }}</b>
                </div>
              </a-form-item>

              <a-form-item label="Số khách">
                <a-input-number v-model:value="guests" :min="1" :max="10" style="width:100%" />
                <div class="ui-muted" style="margin-top:6px">
                  (Tối đa {{ room.capacity }} khách)
                </div>
              </a-form-item>

              <a-alert
                v-if="room.status !== 'available'"
                type="warning"
                showIcon
                message="Phòng hiện không khả dụng để đặt."
                style="margin-bottom:12px"
              />

              <a-card class="rd-summary ui-card" size="small">
                <div class="row">
                  <span>Giá/đêm</span>
                  <b>{{ formatMoney(room.price) }}₫</b>
                </div>
                <div class="row">
                  <span>Số đêm</span>
                  <b>{{ nights }}</b>
                </div>
                <div class="row total">
                  <span>Tổng</span>
                  <b>{{ formatMoney(total) }}₫</b>
                </div>
              </a-card>

              <a-space style="margin-top:12px" wrap>
                <a-button @click="goRooms">Quay lại</a-button>
                <a-button type="primary" :disabled="!canAdd" @click="addToCart">
                  Thêm vào giỏ
                </a-button>
                <a-button type="default" @click="goCart">Tới giỏ</a-button>
              </a-space>
            </a-form>
          </a-card>
        </div>
      </a-col>
    </a-row>
  </div>

  <a-result v-else status="404" title="Không tìm thấy phòng" />
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'

import { rooms, roomTypes } from '@/mock/hotel'
import { useBookingCartStore } from '@/stores/bookingCart.js'
import { useReviewsStore } from '@/stores/reviews.js'

const route = useRoute()
const router = useRouter()
const cart = useBookingCartStore()
const reviewsStore = useReviewsStore()

const roomId = computed(() => Number(route.params.id))
const room = computed(() => rooms.find(r => r.id === roomId.value))

const images = computed(() => {
  const id = roomId.value || 0
  return [
    `https://picsum.photos/seed/room-${id}-1/1200/700`,
    `https://picsum.photos/seed/room-${id}-2/1200/700`,
    `https://picsum.photos/seed/room-${id}-3/1200/700`,
    `https://picsum.photos/seed/room-${id}-4/1200/700`,
    `https://picsum.photos/seed/room-${id}-5/1200/700`
  ]
})

const previewOpen = ref(false)
const previewIndex = ref(0)
function openPreview(i) {
  previewIndex.value = i
  previewOpen.value = true
}
function prevImg() {
  previewIndex.value = (previewIndex.value - 1 + images.value.length) % images.value.length
}
function nextImg() {
  previewIndex.value = (previewIndex.value + 1) % images.value.length
}

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
    guests.value >= 1 &&
    guests.value <= room.value.capacity
  )
})

function addToCart() {
  const checkIn = range.value[0].format('YYYY-MM-DD')
  const checkOut = range.value[1].format('YYYY-MM-DD')

  cart.addRoom({
    roomId: room.value.id,
    roomName: room.value.name,
    price: total.value,
    checkIn,
    checkOut,
    guests: guests.value
  })
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

function typeName(typeId) {
  return roomTypes.find(t => t.id === typeId)?.name || '—'
}

const reviewSummary = computed(() => {
  if (!room.value) return { count: 0, overall: 0, breakdown: [] }

  const list = reviewsStore.byRoomId(room.value.id) || []
  if (!list.length) return { count: 0, overall: 0, breakdown: [] }

  const avg = (key) => {
    const s = list.reduce((sum, r) => sum + Number(r[key] || 0), 0)
    return s / list.length
  }

  const overall = avg('overall')
  return {
    count: list.length,
    overall,
    breakdown: [
      { key: 'cleanliness', label: 'Sạch sẽ', value: avg('cleanliness') },
      { key: 'location', label: 'Vị trí', value: avg('location') },
      { key: 'staff', label: 'Nhân viên', value: avg('staff') },
      { key: 'comfort', label: 'Thoải mái', value: avg('comfort') }
    ]
  }
})

function scoreLabel(score) {
  if (score >= 9) return 'Tuyệt vời'
  if (score >= 8) return 'Rất tốt'
  if (score >= 7) return 'Tốt'
  if (score >= 6) return 'Khá'
  return 'Trung bình'
}
</script>

<style scoped>
.rd-head{ display:flex; justify-content:space-between; gap: 12px; align-items:flex-start; }
.rd-title{ font-weight: 950; font-size: 22px; color: #0f172a; line-height: 1.2; }
.rd-sub{ margin-top: 6px; }
.rd-tags{ margin-top: 10px; }
.rd-price-box{ text-align:right; min-width: 140px; }
.rd-price{ font-weight: 950; font-size: 22px; }

.rd-gallery{ display:grid; grid-template-columns: 2fr 1fr 1fr; grid-auto-rows: 160px; gap: 10px; }
.rd-img{ border-radius: 14px; background-size: cover; background-position: center; cursor: pointer; border: 1px solid rgba(15,23,42,.08); overflow: hidden; }
.rd-img-main{ grid-row: span 2; min-height: 330px; }
.rd-img-more{ position: relative; }
.rd-more-overlay{ position:absolute; inset: 0; background: linear-gradient(to top, rgba(2,6,23,.65), rgba(2,6,23,.10)); display:flex; align-items:flex-end; padding: 12px; }
.rd-more-text{ color:#fff; font-weight: 900; }

.rd-preview{ text-align:center; }
.rd-preview-img{ width: 100%; max-height: 520px; object-fit: cover; border-radius: 14px; border: 1px solid rgba(15,23,42,.10); }
.rd-preview-actions{ display:flex; justify-content:center; gap: 10px; margin-top: 12px; }

.rd-overview{ display:grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.rd-overview-item{ border: 1px solid rgba(15,23,42,.08); border-radius: 14px; padding: 12px; background: #fff; }
.rd-k{ font-size: 12px; color: #64748b; font-weight: 800; }
.rd-v{ margin-top: 6px; font-weight: 950; color:#0f172a; }

.rd-amenities :deep(.ant-tag){ margin-bottom: 8px; }

.rd-sticky{ position: sticky; top: 92px; }

.rd-summary{ margin-top: 6px; }
.rd-summary .row{ display:flex; justify-content:space-between; padding: 6px 0; }
.rd-summary .total{ border-top: 1px solid #f0f0f0; margin-top: 6px; padding-top: 10px; font-size: 16px; }

.rd-review-score{ display:flex; gap: 12px; align-items:center; margin-bottom: 12px; }
.rd-review-score .score{ width: 54px; height: 54px; border-radius: 14px; background: var(--bk-blue, #003580); color: #fff; display:flex; align-items:center; justify-content:center; font-weight: 950; font-size: 20px; }
.rd-review-score .label{ font-weight: 950; font-size: 16px; }

.rd-review-bars .bar{ display:grid; grid-template-columns: 90px 1fr 40px; gap: 10px; align-items:center; margin-bottom: 6px; }

@media (max-width: 992px){
  .rd-overview{ grid-template-columns: 1fr; }
  .rd-sticky{ position: static; top: auto; }
  .rd-gallery{ grid-template-columns: 1fr 1fr; grid-auto-rows: 140px; }
  .rd-img-main{ grid-column: span 2; min-height: 240px; }
}
</style>