import { supabase } from './supabaseClient'

// Base API configuration
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
const trimmedBase = rawBaseUrl.replace(/\/+$/, '')
export const BASE_URL = trimmedBase.endsWith('/api') ? trimmedBase : `${trimmedBase}/api`

export const getAuthHeader = async () => {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error || !data?.session?.access_token) {
      if (error && (error.message?.includes('Refresh Token') || error.message?.includes('refresh_token_not_found'))) {
        await supabase.auth.signOut().catch(() => {})
      }
      throw new Error('Not authenticated. Please log in.')
    }
    return { 'Authorization': `Bearer ${data.session.access_token}` }
  } catch (err) {
    throw new Error(err.message || 'Authentication error')
  }
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
    const error = await response.json().catch(() => ({}))
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
    const error = await response.json().catch(() => ({}))
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

// --- FORECAST ENDPOINT ---
export const getForecast = async () => {
  const authHeader = await getAuthHeader()
  const response = await fetch(`${BASE_URL}/forecast`, {
    headers: authHeader,
  })
  if (!response.ok) throw new Error("Failed to fetch forecast")
  return response.json()
}

// --- COPILOT AGENT ENDPOINTS ---
export const sendCopilotMessage = async (message, history = []) => {
  const authHeader = await getAuthHeader()
  const response = await fetch(`${BASE_URL}/copilot/chat`, {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || "Failed to communicate with Financial Copilot")
  }
  return response.json()
}

export const runWhatIfSimulation = async (adjustments, monthlyInvestment = 0, expectedRoi = 8.0, months = 6) => {
  const authHeader = await getAuthHeader()
  const response = await fetch(`${BASE_URL}/copilot/what-if`, {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({
      adjustments,
      monthly_investment: monthlyInvestment,
      expected_annual_return_pct: expectedRoi,
      projection_months: months,
    }),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || "Failed to run What-If simulation")
  }
  return response.json()
}

export const runNaturalWhatIfSimulation = async (query) => {
  const authHeader = await getAuthHeader()
  const response = await fetch(`${BASE_URL}/copilot/what-if/natural`, {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || "Failed to run Natural What-If simulation")
  }
  return response.json()
}

export const getProactiveInsights = async () => {
  const authHeader = await getAuthHeader()
  const response = await fetch(`${BASE_URL}/copilot/proactive-insights`, {
    headers: authHeader,
  })
  if (!response.ok) throw new Error("Failed to fetch AI proactive insights")
  return response.json()
}

export const explainAnomaly = async (anomalyId) => {
  const authHeader = await getAuthHeader()
  const response = await fetch(`${BASE_URL}/copilot/explain-anomaly`, {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({ anomaly_id: anomalyId }),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || "Failed to generate anomaly explanation")
  }
  return response.json()
}
