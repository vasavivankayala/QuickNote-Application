const API_URL = '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.')
  }
  return data
}

export const notesApi = {
  getAll: () => request('/notes'),
  create: (note) => request('/notes', { method: 'POST', body: JSON.stringify(note) }),
  update: (id, note) => request(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(note) }),
  delete: (id) => request(`/notes/${id}`, { method: 'DELETE' }),
  health: () => request('/health'),
}
