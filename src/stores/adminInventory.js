import { defineStore } from 'pinia'

const STORAGE_KEY = 'hotel_admin_inventory_v1'

// inventory[roomId][YYYY-MM-DD] = { status: 'available'|'occupied'|'maintenance'|'closed', note?: '' }
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const useAdminInventoryStore = defineStore('adminInventory', {
  state: () => ({
    inventory: load()
  }),
  actions: {
    setCell(roomId, date, patch) {
      const rid = String(roomId)
      if (!this.inventory[rid]) this.inventory[rid] = {}
      const cur = this.inventory[rid][date] || {}
      this.inventory[rid][date] = { ...cur, ...patch }
      save(this.inventory)
    },
    clearCell(roomId, date) {
      const rid = String(roomId)
      if (!this.inventory[rid]) return
      delete this.inventory[rid][date]
      save(this.inventory)
    },
    resetAll() {
      this.inventory = {}
      save(this.inventory)
    }
  }
})