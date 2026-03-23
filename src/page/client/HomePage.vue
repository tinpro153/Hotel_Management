<template>
  <div>
    <!-- Hero -->
    <a-card class="ui-card hero" :bodyStyle="{ padding: '18px' }">
      <div class="hero-inner">
        <div class="hero-left">
          <div class="hero-title">Tìm phòng phù hợp cho chuyến đi của bạn</div>
          <div class="hero-sub ui-muted">
            Gợi ý theo địa điểm, giá và đánh giá — giao diện mô phỏng Booking.
          </div>

          <a-space style="margin-top:12px" wrap>
            <a-button type="primary" size="large" @click="go('/rooms')">Khám phá phòng</a-button>
            <a-button size="large" @click="go('/bookings')">Đơn đặt của bạn</a-button>
          </a-space>
        </div>

        <div class="hero-right">
          <img :src="logoImg" alt="logo" />
        </div>
      </div>
    </a-card>

    <!-- Suggestions -->
    <a-card class="ui-card" title="Gợi ý cho bạn" :bodyStyle="{ padding: '12px' }" style="margin-top:16px">
      <div class="ui-muted" style="margin-bottom:10px">
        Một vài phòng nổi bật (demo) — ưu tiên phòng available, giá tốt và có review cao.
      </div>

      <a-row :gutter="[12,12]">
        <a-col v-for="r in suggestedRooms" :key="r.id" :xs="24" :sm="12" :lg="8">
          <div class="sug-card ui-card" @click="goRoom(r.id)">
            <!-- ✅ đồng bộ ảnh với RoomsPage: dùng roomCover(r) -->
            <div class="sug-img" :style="{ backgroundImage: `url(${roomCover(r)})` }"></div>

            <div class="sug-body">
              <div class="sug-top">
                <div class="sug-name">{{ r.name }}</div>
                <a-tag :color="statusColor(r.status)">{{ r.status }}</a-tag>
              </div>

              <div class="sug-loc ui-muted">
                {{ (r.area ? r.area + ', ' : '') + (r.city || '') }}
              </div>

              <div class="sug-meta">
                <div class="sug-cap">👤 {{ r.capacity }} khách</div>
                <div class="sug-type">🏷 {{ typeName(r.typeId) }}</div>
              </div>

              <div class="sug-bottom">
                <div class="sug-price">
                  <span class="price">{{ formatMoney(r.price) }}₫</span>
                  <span class="ui-muted">/đêm</span>
                </div>

                <div class="sug-score" v-if="reviewInfo(r.id).count">
                  <div class="box">{{ reviewInfo(r.id).score }}</div>
                  <div>
                    <div class="lbl">{{ scoreLabel(reviewInfo(r.id).score) }}</div>
                    <div class="ui-muted">{{ reviewInfo(r.id).count }} đánh giá</div>
                  </div>
                </div>

                <a-button type="primary" block style="margin-top:10px" @click.stop="goRoom(r.id)">
                  Xem chi tiết
                </a-button>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>

      <div style="margin-top:12px; text-align:center">
        <a-button @click="go('/rooms')">Xem tất cả phòng</a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import logoImg from '@/assets/images/logo.png' 
import { rooms, roomTypes } from '@/mock/hotel'
import { useReviewsStore } from '@/stores/reviews.js'
import { roomCover } from '@/utils/roomImages.js' 

const router = useRouter()
const reviewsStore = useReviewsStore()

function go(path) {
  router.push(path)
}
function goRoom(id) {
  router.push({ name: 'RoomDetail', params: { id } })
}

function typeName(typeId) {
  return roomTypes.find(t => t.id === typeId)?.name || '—'
}

function formatMoney(v) {
  return new Intl.NumberFormat('vi-VN').format(Number(v || 0))
}

function statusColor(s) {
  if (s === 'available') return 'green'
  if (s === 'occupied') return 'volcano'
  if (s === 'maintenance') return 'gold'
  return 'blue'
}

function reviewInfo(roomId) {
  const list = reviewsStore.byRoomId(roomId) || []
  if (!list.length) return { score: 0, count: 0 }
  const avg = list.reduce((s, r) => s + Number(r.overall || 0), 0) / list.length
  return { score: Number(avg.toFixed(1)), count: list.length }
}

function scoreLabel(score) {
  if (score >= 9) return 'Tuyệt vời'
  if (score >= 8) return 'Rất tốt'
  if (score >= 7) return 'Tốt'
  if (score >= 6) return 'Khá'
  return 'Trung bình'
}

const suggestedRooms = computed(() => {
  const list = rooms.slice().map(r => {
    const ri = reviewInfo(r.id)
    return { ...r, _reviewScore: ri.score, _reviewCount: ri.count }
  })

  list.sort((a, b) => {
    const avA = a.status === 'available' ? 0 : 1
    const avB = b.status === 'available' ? 0 : 1
    if (avA !== avB) return avA - avB
    if ((b._reviewScore || 0) !== (a._reviewScore || 0)) return (b._reviewScore || 0) - (a._reviewScore || 0)
    return (a.price || 0) - (b.price || 0)
  })

  return list.slice(0, 6)
})
</script>

<style scoped>
.hero{
  background: linear-gradient(135deg, rgba(0,53,128,.10), rgba(254,187,2,.16));
}

.hero-inner{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 16px;
}

.hero-title{
  font-weight: 950;
  font-size: 22px;
  color:#0f172a;
}

.hero-sub{
  margin-top: 6px;
  max-width: 520px;
}

.hero-right img{
  width: 110px;
  height: 110px;
  object-fit: contain;
  border-radius: 18px;
  background: rgba(255,255,255,.55);
  border: 1px solid rgba(15,23,42,.08);
  padding: 12px;
}

/* suggestion cards */
.sug-card{
  cursor:pointer;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid rgba(15,23,42,.08);
  box-shadow: 0 10px 24px rgba(15,23,42,.06);
  background:#fff;
}

.sug-img{
  height: 150px;
  background-size: cover;
  background-position: center;
}

.sug-body{
  padding: 12px;
}

.sug-top{
  display:flex;
  justify-content:space-between;
  gap: 10px;
  align-items:flex-start;
}

.sug-name{
  font-weight: 950;
  line-height: 1.2;
}

.sug-loc{
  margin-top: 6px;
}

.sug-meta{
  display:flex;
  gap: 10px;
  flex-wrap:wrap;
  margin-top: 10px;
  color:#334155;
}

.sug-bottom{
  margin-top: 12px;
}

.sug-price .price{
  font-weight: 950;
  font-size: 18px;
}

.sug-score{
  display:flex;
  gap: 10px;
  align-items:center;
  margin-top: 10px;
}

.sug-score .box{
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--bk-blue, #003580);
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight: 950;
}

.sug-score .lbl{
  font-weight: 900;
}
@media (max-width: 768px){
  .hero-inner{ flex-direction: column; align-items:flex-start; }
  .hero-right{ display:none; }
}
</style>