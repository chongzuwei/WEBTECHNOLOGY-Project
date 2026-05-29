const STORAGE_USERS_KEY = 'wt_users'
const STORAGE_SESSION_KEY = 'wt_session'

function loadUsers(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || '[]') }catch{ return [] }
}
function saveUsers(users){ localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users)) }

function getSession(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_SESSION_KEY) || 'null') }catch{ return null }
}
function setSession(session){ localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session)) }
function clearSession(){ localStorage.removeItem(STORAGE_SESSION_KEY) }

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
  isAuthenticated(){ return !!getSession() }
}
