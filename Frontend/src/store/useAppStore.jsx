

// import { create } from 'zustand'
// import { supabase } from '../lib/supabaseClient'
// import { getAnomalies, updateAnomalyStatus as apiUpdateStatus, detectAnomalies as apiDetect } from '../lib/api'

// export const useAppStore = create((set, get) => ({
//   // --- Auth & Profile ---
//   user: null,
//   setUser: (user) => set({ user }),

//   // --- Upload Metadata ---
//   uploadId: null,
//   bankDetected: null,
//   totalTransactions: 0,
//   isProcessing: false,

//   // --- Transactions Data ---
//   transactions: [],
//   categoryData: [],

//   // --- Anomalies Data ---
//   anomalies: [],
//   isAnomaliesLoading: false,

//   // --- Actions ---
//   setUploadResult: (result) => set({
//     uploadId: result.upload_id,
//     bankDetected: result.bank_detected,
//     totalTransactions: result.total_transactions,
//   }),

//   setTransactions: (transactions) => {
//     const categoryMap = {}
//     transactions.forEach((txn) => {
//       if (txn.type !== 'debit') return
//       const cat = txn.category || 'Uncategorized'
//       if (!categoryMap[cat]) {
//         categoryMap[cat] = { name: cat, spend: 0, count: 0 }
//       }
//       categoryMap[cat].spend += Number(txn.amount)
//       categoryMap[cat].count += 1
//     })

//     set({
//       transactions,
//       categoryData: Object.values(categoryMap)
//     })
//   },
  
//   forecastData: {},
//   isForecastLoading: false,

//   // Add forecast action
//   fetchForecast: async () => {
//     set({ isForecastLoading: true });
//     try {
//       const token = localStorage.getItem('sb-access-token'); // Or however you get your token
//       const response = await fetch('http://127.0.0.1:8000/api/forecast', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
      
//       if (!response.ok) throw new Error("Failed to fetch forecast");
      
//       const data = await response.json();
//       set({ forecastData: data.forecast || {} });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       set({ isForecastLoading: false });
//     }
//   },



//   // --- Anomaly Actions ---
//   fetchAnomalies: async () => {
//     set({ isAnomaliesLoading: true });
//     try {
//       const data = await getAnomalies();
//       set({ anomalies: data.anomalies || [] });
//     } catch (err) {
//       console.error("Fetch anomalies failed:", err);
//     } finally {
//       set({ isAnomaliesLoading: false });
//     }
//   },

//   runDetection: async () => {
//     set({ isProcessing: true });
//     try {
//       await apiDetect();
//       const data = await getAnomalies();
//       set({ anomalies: data.anomalies || [] });
//     } finally {
//       set({ isProcessing: false });
//     }
//   },

//   updateAnomalyStatus: async (anomalyId, newStatus) => {
//     try {
//       await apiUpdateStatus(anomalyId, newStatus);
//       // Optimistic Update: Update local state immediately
//       set((state) => ({
//         anomalies: state.anomalies.map((a) => 
//           a.id === anomalyId ? { ...a, status: newStatus } : a
//         )
//       }));
//     } catch (err) {
//       console.error("Failed to update status in store:", err);
//     }
//   },

//   setIsProcessing: (val) => set({ isProcessing: val }),

//   logout: async () => {
//     await supabase.auth.signOut()
//     set({
//       user: null,
//       uploadId: null,
//       bankDetected: null,
//       totalTransactions: 0,
//       transactions: [],
//       categoryData: [],
//       anomalies: [],
//       isProcessing: false,
//     })
//   },

//   reset: () => set({
//     uploadId: null,
//     bankDetected: null,
//     totalTransactions: 0,
//     transactions: [],
//     categoryData: [],
//     anomalies: [],
//     isProcessing: false,
//   })
// }))




//useAppStore.js

import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'
import { getAnomalies, updateAnomalyStatus as apiUpdateStatus, detectAnomalies as apiDetect } from '../lib/api'

export const useAppStore = create((set, get) => ({
  // --- Auth & Profile ---
  user: null,
  setUser: (user) => set({ user }),

  // --- Upload Metadata ---
  uploadId: null,
  bankDetected: null,
  totalTransactions: 0,
  isProcessing: false,

  // --- Transactions Data ---
  transactions: [],
  categoryData: [],

  // --- Anomalies Data ---
  anomalies: [],
  isAnomaliesLoading: false,

  // --- Forecast Data ---
  forecastData: {},
  isForecastLoading: false,

  // --- Actions ---
  setUploadResult: (result) => set({
    uploadId: result.upload_id,
    bankDetected: result.bank_detected,
    totalTransactions: result.total_transactions,
  }),

  setTransactions: (transactions) => {
    const categoryMap = {}
    transactions.forEach((txn) => {
      if (txn.type !== 'debit') return
      const cat = txn.category || 'Uncategorized'
      if (!categoryMap[cat]) {
        categoryMap[cat] = { name: cat, spend: 0, count: 0 }
      }
      categoryMap[cat].spend += Number(txn.amount)
      categoryMap[cat].count += 1
    })

    set({
      transactions,
      categoryData: Object.values(categoryMap)
    })
  },
  
  // --- Forecast Actions ---
  fetchForecast: async () => {
    set({ isForecastLoading: true });
    try {
      // ✅ FIX 1: Safely get the token directly from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) throw new Error("No active session");

      // Note: Consider moving this URL to your import.meta.env variables later!
      const response = await fetch('http://127.0.0.1:8000/api/forecast', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error("Failed to fetch forecast");
      
      const data = await response.json();
      set({ forecastData: data.forecast || {} });
    } catch (err) {
      console.error(err);
    } finally {
      set({ isForecastLoading: false });
    }
  },

  // --- Anomaly Actions ---
  fetchAnomalies: async () => {
    set({ isAnomaliesLoading: true });
    try {
      const data = await getAnomalies();
      set({ anomalies: data.anomalies || [] });
    } catch (err) {
      console.error("Fetch anomalies failed:", err);
    } finally {
      set({ isAnomaliesLoading: false });
    }
  },

  runDetection: async () => {
    set({ isProcessing: true });
    try {
      await apiDetect();
      const data = await getAnomalies();
      set({ anomalies: data.anomalies || [] });
    } finally {
      set({ isProcessing: false });
    }
  },

  updateAnomalyStatus: async (anomalyId, newStatus) => {
    try {
      await apiUpdateStatus(anomalyId, newStatus);
      set((state) => ({
        anomalies: state.anomalies.map((a) => 
          a.id === anomalyId ? { ...a, status: newStatus } : a
        )
      }));
    } catch (err) {
      console.error("Failed to update status in store:", err);
    }
  },

  setIsProcessing: (val) => set({ isProcessing: val }),

  logout: async () => {
    await supabase.auth.signOut()
    set({
      user: null,
      uploadId: null,
      bankDetected: null,
      totalTransactions: 0,
      transactions: [],
      categoryData: [],
      anomalies: [],
      forecastData: {}, // ✅ FIX 2: Clear forecast data on logout
      isProcessing: false,
    })
  },

  reset: () => set({
    uploadId: null,
    bankDetected: null,
    totalTransactions: 0,
    transactions: [],
    categoryData: [],
    anomalies: [],
    forecastData: {}, // ✅ FIX 2: Clear forecast data on reset
    isProcessing: false,
  })
}))