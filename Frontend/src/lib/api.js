// // src/lib/api.js
// const BASE_URL = 'http://127.0.0.1:8000/api'

// export const uploadBankStatement = async (file) => {
//   const formData = new FormData()
//   formData.append('file', file)

//   const response = await fetch(`${BASE_URL}/upload`, {
//     method: 'POST',
//     body: formData,
//   })

//   if (!response.ok) {
//     const error = await response.json()
//     throw new Error(error.detail || 'Upload failed')
//   }

//   return response.json()
// }

// export const getTransactions = async (uploadId) => {
//   const response = await fetch(`${BASE_URL}/transactions/${uploadId}`)
//   if (!response.ok) throw new Error('Failed to fetch transactions')
//   return response.json()
// }









// import { supabase } from './supabaseClient'

// const BASE_URL = 'http://127.0.0.1:8000/api'

// const getAuthHeader = async () => {
//   const { data } = await supabase.auth.getSession()
//   const token = data?.session?.access_token
//   if (!token) throw new Error('Not authenticated')
//   return { 'Authorization': `Bearer ${token}` }
// }

// export const uploadBankStatement = async (file) => {
//   const authHeader = await getAuthHeader()
//   const formData = new FormData()
//   formData.append('file', file)

//   const response = await fetch(`${BASE_URL}/upload`, {
//     method: 'POST',
//     headers: authHeader,
//     body: formData,
//   })

//   if (!response.ok) {
//     const error = await response.json()
//     throw new Error(error.detail || 'Upload failed')
//   }

//   return response.json()
// }

// export const getTransactions = async (uploadId) => {
//   const authHeader = await getAuthHeader()

//   const response = await fetch(`${BASE_URL}/transactions/${uploadId}`, {
//     headers: authHeader,
//   })

//   if (!response.ok) throw new Error('Failed to fetch transactions')
//   return response.json()
// }



// export const detectAnomalies = async () => {
//   const authHeader = await getAuthHeader()
//   const response = await fetch(`${BASE_URL}/anomalies/detect`, {
//     method: "POST",
//     headers: authHeader,
//   })
//   if (!response.ok) {
//     const error = await response.json()
//     throw new Error(error.detail || "Detection failed")
//   }
//   return response.json()
// }

// export const getAnomalies = async () => {
//   const authHeader = await getAuthHeader()
//   const response = await fetch(`${BASE_URL}/anomalies`, {
//     headers: authHeader,
//   })
//   if (!response.ok) throw new Error("Failed to fetch anomalies")
//   return response.json()
// }

// export const updateAnomalyStatus = async (anomalyId, status) => {
//   const authHeader = await getAuthHeader()
//   const response = await fetch(`${BASE_URL}/anomalies/${anomalyId}`, {
//     method: "PATCH",
//     headers: { ...authHeader, "Content-Type": "application/json" },
//     body: JSON.stringify({ status }),
//   })
//   if (!response.ok) throw new Error("Failed to update anomaly")
//   return response.json()
// }








import { supabase } from './supabaseClient'

const BASE_URL = 'http://127.0.0.1:8000/api'

const getAuthHeader = async () => {
  const { data } = await supabase.auth.getSession()
  const token = data?.session?.access_token
  if (!token) throw new Error('Not authenticated')
  return { 'Authorization': `Bearer ${token}` }
}

export const uploadBankStatement = async (file) => {
  const authHeader = await getAuthHeader()
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: authHeader,
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Upload failed')
  }

  return response.json()
}

export const getTransactions = async (uploadId) => {
  const authHeader = await getAuthHeader()

  const response = await fetch(`${BASE_URL}/transactions/${uploadId}`, {
    headers: authHeader,
  })

  if (!response.ok) throw new Error('Failed to fetch transactions')
  return response.json()
}

export const detectAnomalies = async () => {
  const authHeader = await getAuthHeader()
  const response = await fetch(`${BASE_URL}/anomalies/detect`, {
    method: "POST",
    headers: authHeader,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Detection failed")
  }
  return response.json()
}

export const getAnomalies = async () => {
  const authHeader = await getAuthHeader()
  const response = await fetch(`${BASE_URL}/anomalies`, {
    headers: authHeader,
  })
  if (!response.ok) throw new Error("Failed to fetch anomalies")
  return response.json()
}

export const updateAnomalyStatus = async (anomalyId, status) => {
  const authHeader = await getAuthHeader()
  const response = await fetch(`${BASE_URL}/anomalies/${anomalyId}`, {
    method: "PATCH",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  if (!response.ok) throw new Error("Failed to update anomaly")
  return response.json()
}

// --- NEW FORECAST ENDPOINT ---
export const getForecast = async () => {
  const authHeader = await getAuthHeader()
  const response = await fetch(`${BASE_URL}/forecast`, {
    headers: authHeader,
  })
  if (!response.ok) throw new Error("Failed to fetch forecast")
  return response.json()
}