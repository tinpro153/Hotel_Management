import { defineStore } from 'pinia'
import { rooms as seedRooms } from '@/mock/hotel'

const STORAGE_KEY = 'hotel_admin_rooms_v1'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const useAdminRoomsStore = defineStore('adminRooms', {
  state: () => ({
    rooms: load() || seedRooms.map(r => ({ ...r }))
  }),
  getters: {
    byId: (state) => (id) => state.rooms.find(r => r.id === Number(id))
  },
  actions: {
    resetSeed() {
      this.rooms = seedRooms.map(r => ({ ...r }))
      save(this.rooms)
    },
    create(room) {
      // require unique id
      if (this.rooms.some(r => r.id === Number(room.id))) {
        throw new Error('ID phòng đã tồn tại')
      }
      this.rooms.unshift({ ...room, id: Number(room.id) })
      save(this.rooms)
    },
    update(id, patch) {
      const idx = this.rooms.findIndex(r => r.id === Number(id))
      if (idx === -1) throw new Error('Không tìm thấy phòng')
      this.rooms[idx] = { ...this.rooms[idx], ...patch, id: Number(id) }
      save(this.rooms)
    },
    remove(id) {
      this.rooms = this.rooms.filter(r => r.id !== Number(id))
      save(this.rooms)
    }
  }
})