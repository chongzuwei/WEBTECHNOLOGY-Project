const STORAGE_USERS_KEY = 'wt_users_cache'
const STORAGE_SESSION_KEY = 'wt_session'
const STORAGE_LOGGED_OUT_KEY = 'maxcv_logged_out'
const API_BASE = '/api'

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users))
}

function upsertUserInCache(user) {
  const users = loadUsers()
  const idx = users.findIndex(entry => entry.id === user.id)
  if (idx === -1) {
    users.push(user)
  } else {
    users[idx] = { ...users[idx], ...user }
  }
  saveUsers(users)
  return user
}

function removeUserFromCache(id) {
  saveUsers(loadUsers().filter(user => user.id !== id))
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

function setSession(session) {
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session))
  localStorage.removeItem(STORAGE_LOGGED_OUT_KEY)
}

function clearSession() {
  localStorage.removeItem(STORAGE_SESSION_KEY)
  localStorage.setItem(STORAGE_LOGGED_OUT_KEY, 'true')
}

function getAuthToken() {
  return getSession()?.token || null
}

// DEV HELPERS: sometimes localStorage session gets out of sync.
// This makes auth failures easier to debug.
function debugAuthState() {
  try {
    const session = getSession()
    return {
      hasSession: !!session,
      tokenPresent: !!session?.token,
      session
    }
  } catch {
    return { hasSession: false }
  }
}


async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }
  const token = getAuthToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  })

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new Error(payload?.error || 'Request failed')
  }

  return payload
}

function setCachedSession(session, user = null) {
  setSession(session)
  if (user) {
    upsertUserInCache(user)
  }
}

export { apiRequest, getSession }

export default {
  async register({ name, email, password }) {
    const payload = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    })
    const session = { userId: payload.user.id, token: payload.token }
    setCachedSession(session, payload.user)
    window.dispatchEvent(new CustomEvent('auth-change'))
    return { user: payload.user, session }
  },

  async login({ email, password }) {
    const payload = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    const session = { userId: payload.user.id, token: payload.token }
    setCachedSession(session, payload.user)
    window.dispatchEvent(new CustomEvent('auth-change'))
    return { user: payload.user, session }
  },

  async logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' })
    } catch {
      // Local session must still be cleared if the API is already down.
    }
    clearSession()
    window.dispatchEvent(new CustomEvent('auth-change'))
  },

  getUser() {
    const session = getSession()
    if (!session) return null
    return loadUsers().find(user => user.id === session.userId) || null
  },

  async refreshCurrentUser() {
    const payload = await apiRequest('/me')
    upsertUserInCache(payload.user)
    window.dispatchEvent(new CustomEvent('auth-change'))
    return payload.user
  },

  async updateProfile({ name, email, currentPassword, newPassword }) {
    const session = getSession()
    if (!session) throw new Error('Not authenticated')

    const payload = await apiRequest(`/users/${session.userId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name,
        email,
        password: newPassword,
        currentPassword
      })
    })
    upsertUserInCache(payload.user)
    window.dispatchEvent(new CustomEvent('auth-change'))
    return payload.user
  },

  isAuthenticated() {
    return !!getSession()
  },

  async getAllUsers() {
    const payload = await apiRequest('/users')
    const users = payload.users || []
    saveUsers(users)
    return users
  },

  async createUser({ name, email, password, role }) {
    const payload = await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    })
    upsertUserInCache(payload.user)
    return payload.user
  },

  async updateUser(id, updatedFields) {
    const payload = await apiRequest(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedFields)
    })
    upsertUserInCache(payload.user)
    const session = getSession()
    if (session && session.userId === id) {
      window.dispatchEvent(new CustomEvent('auth-change'))
    }
    return payload.user
  },

  async deleteUser(id) {
    await apiRequest(`/users/${id}`, { method: 'DELETE' })
    removeUserFromCache(id)
    const session = getSession()
    if (session && session.userId === id) {
      await this.logout()
    }
  }
}
