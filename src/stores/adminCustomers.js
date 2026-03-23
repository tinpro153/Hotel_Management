import { defineStore } from 'pinia'
import { customers as seedCustomers } from '@/mock/hotel'

const STORAGE_KEY = 'hotel_admin_customers_v1'

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

export const useAdminCustomersStore = defineStore('adminCustomers', {
  state: () => ({
    customers: (load() || seedCustomers || []).map(c => ({ ...c }))
  }),
  getters: {
    byId: (state) => (id) => state.customers.find(c => c.id === Number(id))
  },
  actions: {
    resetSeed() {
      this.customers = (seedCustomers || []).map(c => ({ ...c }))
      save(this.customers)
    },
    create(customer) {
      if (this.customers.some(c => c.id === Number(customer.id))) {
        throw new Error('Customer ID đã tồn tại')
      }
      this.customers.unshift({ ...customer, id: Number(customer.id) })
      save(this.customers)
    },
    update(id, patch) {
      const idx = this.customers.findIndex(c => c.id === Number(id))
      if (idx === -1) throw new Error('Không tìm thấy khách hàng')
      this.customers[idx] = { ...this.customers[idx], ...patch, id: Number(id) }
      save(this.customers)
    },
    remove(id) {
      this.customers = this.customers.filter(c => c.id !== Number(id))
      save(this.customers)
    }
  }
})