import { defineStore } from 'pinia'

const STORAGE_KEY = 'hotel_booking_cart_v1'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { items: [] }
  } catch {
    return { items: [] }
  }
}

function saveCart(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const useBookingCartStore = defineStore('bookingCart', {
  state: () => loadCart(),
  getters: {
    count: (state) => state.items.length,
    total: (state) => state.items.reduce((sum, it) => sum + (it.price || 0), 0)
  },
  actions: {
    addRoom({ roomId, roomName, price, checkIn, checkOut, guests }) {
      const id = `${roomId}-${checkIn}-${checkOut}`
      if (this.items.some(i => i.id === id)) return

      this.items.push({ id, roomId, roomName, price, checkIn, checkOut, guests })
      saveCart(this.$state)
    },
    remove(id) {
      this.items = this.items.filter(i => i.id !== id)
      saveCart(this.$state)
    },
    clear() {
      this.items = []
      saveCart(this.$state)
    }
  }
})