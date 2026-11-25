const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed')
    err.fieldErrors = data.errors || {}
    throw err
  }
  return data
}

export const api = {
  options: () => request('/options'),
  list: (filters) => {
    const q = new URLSearchParams(Object.entries(filters).filter(([, v]) => v))
    return request(`/patients?${q}`)
  },
  create: (body) => request('/patients', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  discharge: (id) => request(`/patients/${id}/discharge`, { method: 'PATCH' }),
  remove: (id) => request(`/patients/${id}`, { method: 'DELETE' }),
}
