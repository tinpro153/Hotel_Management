import { defineStore } from 'pinia'

const STORAGE_KEY = 'hotel_admin_invoices_v1'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const useAdminInvoicesStore = defineStore('adminInvoices', {
  state: () => ({
    invoices: load()
  }),
  getters: {
    byNo: (state) => (invoiceNo) => state.invoices.find((i) => i.invoiceNo === invoiceNo),
    sorted: (state) =>
      state.invoices
        .slice()
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  },
  actions: {
    create(invoice) {
      if (!invoice || !invoice.invoiceNo) throw new Error('Thiếu invoiceNo')

      // nếu trùng mã thì tự thay mã khác để khỏi crash demo
      if (this.invoices.some((i) => i.invoiceNo === invoice.invoiceNo)) {
        invoice = { ...invoice, invoiceNo: `${invoice.invoiceNo}-${Date.now()}` }
      }

      this.invoices.unshift({ ...invoice })
      save(this.invoices)
    },
    remove(invoiceNo) {
      this.invoices = this.invoices.filter((i) => i.invoiceNo !== invoiceNo)
      save(this.invoices)
    },
    clearAll() {
      this.invoices = []
      save(this.invoices)
    }
  }
})