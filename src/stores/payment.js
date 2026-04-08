import { defineStore } from 'pinia'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    bankName: 'VBA',            // 
    bankAccount: '4800205276416',  // số tài khoản của bạn
    accountHolder: 'LE MINH DUC TIN'
  })
})