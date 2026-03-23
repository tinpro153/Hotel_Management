import { defineStore } from 'pinia'

const STORAGE_KEY = 'hotel_reviews_v1'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const useReviewsStore = defineStore('reviews', {
  state: () => ({
    reviews: load()
  }),
  getters: {
    byRoomId: (state) => (roomId) => state.reviews.filter(r => r.roomId === Number(roomId)),
    byBookingId: (state) => (bookingId) => state.reviews.find(r => r.bookingId === Number(bookingId))
  },
  actions: {
    create(review) {
      if (this.reviews.some(r => r.bookingId === Number(review.bookingId))) {
        throw new Error('Booking này đã có review')
      }
      this.reviews.unshift({
        ...review,
        id: Date.now(),
        roomId: Number(review.roomId),
        bookingId: Number(review.bookingId),
        createdAt: new Date().toISOString()
      })
      save(this.reviews)
    }
  }
})