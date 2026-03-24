// src/store/useAppStore.js
import { create } from 'zustand'

export const useAppStore = create((set) => ({
  // Upload state
  uploadId: null,
  bankDetected: null,
  totalTransactions: 0,
  isProcessing: false,

  // Transactions data
  transactions: [],
  categoryData: [],

  // Actions
  setUploadResult: (result) => set({
    uploadId: result.upload_id,
    bankDetected: result.bank_detected,
    totalTransactions: result.total_transactions,
  }),

setTransactions: (transactions) => {
    const categoryMap = {}
    
    transactions.forEach((txn) => {
      // ONLY count debits as spend, skip credits
      if (txn.type !== 'debit') return
      
      // ALSO skip transfers — they distort real spending
      // because UPI sends/receives cancel each other out
      const cat = txn.category || 'Uncategorized'
      
      if (!categoryMap[cat]) {
        categoryMap[cat] = { 
          name: cat, 
          spend: 0, 
          count: 0 
        }
      }
      categoryMap[cat].spend += Number(txn.amount)
      categoryMap[cat].count += 1
    })

    set({
      transactions,
      categoryData: Object.values(categoryMap)
    })
  },

  setIsProcessing: (val) => set({ isProcessing: val }),
  reset: () => set({
    uploadId: null,
    bankDetected: null,
    totalTransactions: 0,
    transactions: [],
    categoryData: [],
    isProcessing: false,
  })
}))