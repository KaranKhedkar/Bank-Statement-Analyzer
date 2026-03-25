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