const STORAGE_USERS_KEY = 'wt_users'
const STORAGE_SESSION_KEY = 'wt_session'

function loadUsers(){
  try{
    let users = JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || '[]')
    if (users.length === 0) {
      users = [
        { id: 12, name: 'Alex Chen', email: 'alex.chen@example.com', password: 'password', role: 'student' },
        { id: 13, name: 'Ms. Nadia', email: 'admin@maxcv.com', password: 'password', role: 'admin' }
      ]
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users))
    }
    return users
  }catch{ return [] }
}
function saveUsers(users){ localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users)) }

function getSession(){
  try{
    let session = JSON.parse(localStorage.getItem(STORAGE_SESSION_KEY) || 'null')
    if (!session && localStorage.getItem('maxcv_logged_out') !== 'true') {
      // Seed initial session for demo, unless they explicitly logged out
      session = { userId: 12, token: 'fake-jwt-12' }
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session))
    }
    return session
  }catch{ return null }
}
function setSession(session){
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session))
  localStorage.removeItem('maxcv_logged_out')
}
function clearSession(){
  localStorage.removeItem(STORAGE_SESSION_KEY)
  localStorage.setItem('maxcv_logged_out', 'true')
}

export default {
  register({ name, email, password }){
    const users = loadUsers()
    if(users.find(u=>u.email===email)){
      throw new Error('Email already registered')
    }
    const id = Date.now()
    const user = { id, name, email, password }
    users.push(user)
    saveUsers(users)
    // auto-login after register
    const session = { userId:id, token: 'fake-jwt-'+id }
    setSession(session)
    window.dispatchEvent(new CustomEvent('auth-change'))
    return { user, session }
  },
  login({ email, password }){
    const users = loadUsers()
    const user = users.find(u=>u.email===email && u.password===password)
    if(!user) throw new Error('Invalid credentials')
    const session = { userId: user.id, token: 'fake-jwt-'+user.id }
    setSession(session)
    window.dispatchEvent(new CustomEvent('auth-change'))
    return { user, session }
  },
  logout(){ clearSession(); window.dispatchEvent(new CustomEvent('auth-change')) },
  getUser(){
    const session = getSession()
    if(!session) return null
    const users = loadUsers()
    return users.find(u=>u.id===session.userId) || null
  },
  updateProfile({ name, email, currentPassword, newPassword }){
    const session = getSession()
    if(!session) throw new Error('Not authenticated')
    const users = loadUsers()
    const user = users.find(u=>u.id===session.userId)
    if(!user) throw new Error('User not found')

    // if email changed, ensure uniqueness
    if(email && email !== user.email){
      if(users.find(u=>u.email===email && u.id!==user.id)){
        throw new Error('Email already in use')
      }
      user.email = email
    }

    if(name) user.name = name

    if(newPassword){
      if(!currentPassword || currentPassword !== user.password) throw new Error('Current password is incorrect')
      user.password = newPassword
    }

    saveUsers(users)
    window.dispatchEvent(new CustomEvent('auth-change'))
    return user
  },
  isAuthenticated(){ return !!getSession() },
  
  // Admin User CRUD
  getAllUsers() {
    return loadUsers()
  },
  createUser({ name, email, password, role }) {
    const users = loadUsers()
    if (users.find(u => u.email === email)) {
      throw new Error('Email already registered')
    }
    const id = Date.now()
    const newUser = { id, name, email, password, role: role || 'student' }
    users.push(newUser)
    saveUsers(users)
    return newUser
  },
  updateUser(id, updatedFields) {
    const users = loadUsers()
    const idx = users.findIndex(u => u.id === id)
    if (idx === -1) throw new Error('User not found')
    
    if (updatedFields.email && updatedFields.email !== users[idx].email) {
      if (users.find(u => u.email === updatedFields.email && u.id !== id)) {
        throw new Error('Email already in use')
      }
    }

    users[idx] = {
      ...users[idx],
      ...updatedFields
    }
    saveUsers(users)
    
    const session = getSession()
    if (session && session.userId === id) {
      window.dispatchEvent(new CustomEvent('auth-change'))
    }
    return users[idx]
  },
  deleteUser(id) {
    let users = loadUsers()
    const user = users.find(u => u.id === id)
    if (!user) throw new Error('User not found')
    
    users = users.filter(u => u.id !== id)
    saveUsers(users)

    const session = getSession()
    if (session && session.userId === id) {
      this.logout()
    }
  }
}
