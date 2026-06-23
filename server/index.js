const http = require('http')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

const PORT = process.env.PORT || 3000
const DATA_DIR = path.join(__dirname, 'data')
const USERS_PATH = path.join(DATA_DIR, 'users.json')
const TEMPLATES_PATH = path.join(DATA_DIR, 'templates.json')
const RESUMES_PATH = path.join(DATA_DIR, 'resumes.json')

const sessions = new Map()

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readJson(filePath, fallback = []) {
  ensureDataDir()
  if (!fs.existsSync(filePath)) {
    writeJson(filePath, fallback)
    return fallback
  }
  const raw = fs.readFileSync(filePath, 'utf8')
  return raw ? JSON.parse(raw) : fallback
}

function writeJson(filePath, data) {
  ensureDataDir()
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`)
}

function nowIso() {
  return new Date().toISOString()
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false
  const [salt, hash] = storedHash.split(':')
  const derived = crypto.scryptSync(String(password), salt, 64).toString('hex')
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'))
}

function nextId(records) {
  return records.length ? Math.max(...records.map(record => Number(record.id) || 0)) + 1 : 1
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  })
  res.end(JSON.stringify(payload))
}

function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { error: message })
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', chunk => {
      raw += chunk
      if (raw.length > 1e6) {
        reject(new Error('Request body too large'))
        req.destroy()
      }
    })
    req.on('end', () => {
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

function publicUser(user) {
  if (!user) return null
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar_url: user.avatar_url || null,
    created_at: user.created_at,
    updated_at: user.updated_at
  }
}

function publicTemplate(template) {
  if (!template) return null
  return {
    id: template.id,
    name: template.name,
    description: template.description || '',
    rating: Number(template.rating) || 5,
    uses: String(template.uses ?? '0'),
    layout_type: template.layout_type || 'single-column',
    is_active: template.is_active === 0 ? 0 : 1,
    popular: Boolean(template.popular),
    new: Boolean(template.new),
    tag: template.tag || 'Modern',
    atsReady: Boolean(template.atsReady),
    created_at: template.created_at,
    updated_at: template.updated_at
  }
}

function publicResume(resume) {
  return {
    id: resume.id,
    user_id: resume.user_id,
    title: resume.title,
    summary: resume.summary || null,
    selected_template_id: resume.selected_template_id || null,
    created_at: resume.created_at,
    updated_at: resume.updated_at
  }
}

function seedData() {
  ensureDataDir()
  if (fs.existsSync(USERS_PATH) && fs.existsSync(TEMPLATES_PATH) && fs.existsSync(RESUMES_PATH)) return

  const timestamp = '2026-05-01T08:00:00.000Z'
  const seedPassword = hashPassword('password', 'seed-salt')

  const users = [
    { id: 103, name: 'Sarah Reid', email: 'admin@maxcv.com', role: 'admin' },
    { id: 124, name: 'Alex Chen', email: 'alex.chen@example.com', role: 'student' },
    { id: 125, name: 'Jamie Liu', email: 'jamie.liu@school.edu', role: 'student' },
    { id: 126, name: 'Kevin Wang', email: 'kevin.w@university.edu', role: 'student' },
    { id: 127, name: 'Maya Lee', email: 'maya.lee@gmail.com', role: 'student' },
    { id: 128, name: 'David Kim', email: 'd.kim@techuni.edu', role: 'student' },
    { id: 129, name: 'Lily Park', email: 'lily.park@design.edu', role: 'student' }
  ].map(user => ({
    ...user,
    password_hash: seedPassword,
    avatar_url: null,
    created_at: timestamp,
    updated_at: timestamp
  }))

  const templates = [
    { id: 1, name: 'Modern Blue', description: 'Clean 2-column layout with a bold blue header. Perfect for tech roles and modern companies.', rating: 4.9, uses: '2,300', layout_type: '2-column', is_active: 1, popular: true, new: false, tag: 'Modern', atsReady: true },
    { id: 2, name: 'Elegant Classic', description: 'Serif-based single-column template focusing on standard typography and readable margins.', rating: 4.7, uses: '1,800', layout_type: 'single-column', is_active: 1, popular: false, new: false, tag: 'Classic', atsReady: true },
    { id: 3, name: 'Simple Dark', description: 'Modern dark theme design with high-contrast sections and left sidebar layout.', rating: 4.8, uses: '987', layout_type: 'sidebar', is_active: 1, popular: false, new: true, tag: 'Minimal', atsReady: false },
    { id: 4, name: 'Creative Teal', description: 'Vibrant teal accents and unique timeline layout, perfect for UI/UX and product designers.', rating: 4.9, uses: '1,100', layout_type: '2-column', is_active: 1, popular: false, new: false, tag: 'Creative', atsReady: false },
    { id: 5, name: 'Clean Green', description: 'Minimalist layout accented with soft forest green elements and sans-serif typography.', rating: 4.6, uses: '654', layout_type: 'single-column', is_active: 1, popular: false, new: false, tag: 'Modern', atsReady: true },
    { id: 6, name: 'Warm Amber', description: 'Card-based content grouping with a warm amber palette for business and creative jobs.', rating: 4.5, uses: '432', layout_type: 'card-layout', is_active: 1, popular: false, new: false, tag: 'Creative', atsReady: true }
  ].map(template => ({ ...template, created_at: timestamp, updated_at: timestamp }))

  const resumes = [
    { id: 1, user_id: 124, title: 'Frontend Developer v1', summary: 'Passionate frontend developer focused on React, Vue, and modern CSS.', selected_template_id: 1 },
    { id: 2, user_id: 124, title: 'Frontend Developer v2', summary: 'A second draft with tighter experience and stronger project framing.', selected_template_id: 2 },
    { id: 3, user_id: 125, title: 'Internship Resume', summary: 'Resume draft for internship applications with coursework and project focus.', selected_template_id: 1 }
  ].map(resume => ({ ...resume, created_at: timestamp, updated_at: timestamp }))

  if (!fs.existsSync(USERS_PATH)) writeJson(USERS_PATH, users)
  if (!fs.existsSync(TEMPLATES_PATH)) writeJson(TEMPLATES_PATH, templates)
  if (!fs.existsSync(RESUMES_PATH)) writeJson(RESUMES_PATH, resumes)
}

function getUsers() {
  return readJson(USERS_PATH)
}

function saveUsers(users) {
  writeJson(USERS_PATH, users)
}

function getTemplates() {
  return readJson(TEMPLATES_PATH)
}

function saveTemplates(templates) {
  writeJson(TEMPLATES_PATH, templates)
}

function getResumes() {
  return readJson(RESUMES_PATH)
}

function saveResumes(resumes) {
  writeJson(RESUMES_PATH, resumes)
}

function getUserByEmail(email) {
  const normalized = String(email || '').trim().toLowerCase()
  return getUsers().find(user => user.email.toLowerCase() === normalized) || null
}

function getUserById(id) {
  return getUsers().find(user => user.id === Number(id)) || null
}

function getTemplateById(id) {
  return getTemplates().find(template => template.id === Number(id)) || null
}

function getResumeById(id) {
  return getResumes().find(resume => resume.id === Number(id)) || null
}

function createSession(userId) {
  const token = crypto.randomBytes(24).toString('hex')
  sessions.set(token, Number(userId))
  return token
}

function removeSession(token) {
  if (token) sessions.delete(token)
}

function getAuthenticatedUser(req) {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) return null
  const token = header.slice(7).trim()
  const userId = sessions.get(token)
  if (!userId) return null
  return getUserById(userId)
}

function requireAuth(req, res) {
  const user = getAuthenticatedUser(req)
  if (!user) {
    sendError(res, 401, 'Unauthorized')
    return null
  }
  return user
}

function requireAdmin(user, res) {
  if (!user || user.role !== 'admin') {
    sendError(res, 403, 'Forbidden')
    return false
  }
  return true
}

function userOwnsRecord(user, ownerId) {
  return user.role === 'admin' || user.id === Number(ownerId)
}

function createUserRecord(body, roleOverride = null) {
  const users = getUsers()
  const timestamp = nowIso()
  const user = {
    id: nextId(users),
    name: String(body.name || '').trim(),
    email: String(body.email || '').trim(),
    password_hash: hashPassword(String(body.password || '')),
    role: roleOverride || (body.role === 'admin' ? 'admin' : 'student'),
    avatar_url: body.avatar_url || null,
    created_at: timestamp,
    updated_at: timestamp
  }
  users.push(user)
  saveUsers(users)
  return user
}

function updateUserRecord(id, body, authUser) {
  const users = getUsers()
  const idx = users.findIndex(user => user.id === Number(id))
  if (idx === -1) return null
  const user = users[idx]
  if (!userOwnsRecord(authUser, user.id)) return 'forbidden'

  if (body.email !== undefined) {
    const nextEmail = String(body.email).trim()
    const conflict = users.find(entry => entry.email.toLowerCase() === nextEmail.toLowerCase() && entry.id !== user.id)
    if (conflict) return 'email_conflict'
  }

  if (body.password && authUser.role !== 'admin') {
    if (!body.currentPassword || !verifyPassword(body.currentPassword, user.password_hash)) {
      return 'password_invalid'
    }
  }

  users[idx] = {
    ...user,
    name: body.name !== undefined ? String(body.name).trim() || user.name : user.name,
    email: body.email !== undefined ? String(body.email).trim() || user.email : user.email,
    role: body.role !== undefined && authUser.role === 'admin' ? (body.role === 'admin' ? 'admin' : 'student') : user.role,
    avatar_url: body.avatar_url !== undefined ? body.avatar_url || null : user.avatar_url,
    password_hash: body.password ? hashPassword(String(body.password)) : user.password_hash,
    updated_at: nowIso()
  }
  saveUsers(users)
  return users[idx]
}

function deleteUserRecord(id) {
  const userId = Number(id)
  saveUsers(getUsers().filter(user => user.id !== userId))
  saveResumes(getResumes().filter(resume => resume.user_id !== userId))
}

function createResumeRecord(userId, body = {}) {
  const resumes = getResumes()
  const timestamp = nowIso()
  const resume = {
    id: nextId(resumes),
    user_id: Number(userId),
    title: String(body.title || 'Untitled Resume'),
    summary: body.summary !== undefined ? String(body.summary) : null,
    selected_template_id: body.selected_template_id ? Number(body.selected_template_id) : null,
    created_at: timestamp,
    updated_at: timestamp
  }
  resumes.push(resume)
  saveResumes(resumes)
  return resume
}

function updateResumeRecord(id, body, authUser) {
  const resumes = getResumes()
  const idx = resumes.findIndex(resume => resume.id === Number(id))
  if (idx === -1) return null

  const resume = resumes[idx]
  if (!userOwnsRecord(authUser, resume.user_id)) return 'forbidden'

  if (body.selected_template_id !== undefined && body.selected_template_id !== null && body.selected_template_id !== '') {
    if (!getTemplateById(body.selected_template_id)) return 'template_not_found'
  }

  resumes[idx] = {
    ...resume,
    title: body.title !== undefined ? String(body.title).trim() || resume.title : resume.title,
    summary: body.summary !== undefined ? (body.summary === null ? null : String(body.summary)) : resume.summary,
    selected_template_id: body.selected_template_id !== undefined
      ? (body.selected_template_id ? Number(body.selected_template_id) : null)
      : resume.selected_template_id,
    updated_at: nowIso()
  }
  saveResumes(resumes)
  return resumes[idx]
}

function deleteResumeRecord(id, authUser) {
  const resumes = getResumes()
  const resume = resumes.find(entry => entry.id === Number(id))
  if (!resume) return null
  if (!userOwnsRecord(authUser, resume.user_id)) return 'forbidden'

  saveResumes(resumes.filter(entry => entry.id !== Number(id)))
  return true
}

function normalizeTemplateBody(body, existing = {}) {
  return {
    name: body.name !== undefined ? String(body.name).trim() : existing.name,
    description: body.description !== undefined ? String(body.description) : existing.description,
    rating: body.rating !== undefined ? Number(body.rating) || 5 : existing.rating,
    uses: body.uses !== undefined ? String(body.uses) : existing.uses,
    layout_type: body.layout_type !== undefined ? String(body.layout_type) : existing.layout_type,
    is_active: body.is_active !== undefined ? (Number(body.is_active) === 0 ? 0 : 1) : existing.is_active,
    popular: body.popular !== undefined ? Boolean(body.popular) : Boolean(existing.popular),
    new: body.new !== undefined ? Boolean(body.new) : Boolean(existing.new),
    tag: body.tag !== undefined ? String(body.tag || 'Modern') : existing.tag,
    atsReady: body.atsReady !== undefined ? Boolean(body.atsReady) : Boolean(existing.atsReady)
  }
}

function createTemplateRecord(body) {
  const templates = getTemplates()
  const timestamp = nowIso()
  const template = {
    id: nextId(templates),
    ...normalizeTemplateBody(body, {
      name: 'Untitled Template',
      description: '',
      rating: 5,
      uses: '0',
      layout_type: 'single-column',
      is_active: 1,
      popular: false,
      new: false,
      tag: 'Modern',
      atsReady: false
    }),
    created_at: timestamp,
    updated_at: timestamp
  }
  templates.push(template)
  saveTemplates(templates)
  return template
}

function updateTemplateRecord(id, body) {
  const templates = getTemplates()
  const idx = templates.findIndex(template => template.id === Number(id))
  if (idx === -1) return null
  templates[idx] = {
    ...templates[idx],
    ...normalizeTemplateBody(body, templates[idx]),
    updated_at: nowIso()
  }
  saveTemplates(templates)
  return templates[idx]
}

function deleteTemplateRecord(id) {
  const templateId = Number(id)
  const templates = getTemplates()
  const exists = templates.some(template => template.id === templateId)
  if (!exists) return false
  saveTemplates(templates.filter(template => template.id !== templateId))
  return true
}

seedData()

async function handleRequest(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    })
    res.end()
    return
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host}`)
  const { pathname } = requestUrl

  try {
    if (req.method === 'GET' && pathname === '/api/health') {
      return sendJson(res, 200, { ok: true, storage: 'json' })
    }

    if (req.method === 'POST' && pathname === '/api/auth/register') {
      const body = await readBody(req)
      const name = String(body.name || '').trim()
      const email = String(body.email || '').trim()
      const password = String(body.password || '')
      if (!name || !email || !password) return sendError(res, 400, 'Name, email, and password are required')
      if (getUserByEmail(email)) return sendError(res, 409, 'Email already registered')

      const user = createUserRecord({ name, email, password }, 'student')
      const resume = createResumeRecord(user.id, { title: `${user.name}'s Resume`, selected_template_id: 1 })
      const token = createSession(user.id)
      return sendJson(res, 201, { user: publicUser(user), resume: publicResume(resume), token })
    }

    if (req.method === 'POST' && pathname === '/api/auth/login') {
      const body = await readBody(req)
      const user = getUserByEmail(body.email)
      if (!user || !verifyPassword(body.password || '', user.password_hash)) {
        return sendError(res, 401, 'Invalid credentials')
      }
      const token = createSession(user.id)
      return sendJson(res, 200, { user: publicUser(user), token })
    }

    if (req.method === 'POST' && pathname === '/api/auth/logout') {
      const header = req.headers.authorization || ''
      removeSession(header.startsWith('Bearer ') ? header.slice(7).trim() : null)
      return sendJson(res, 200, { ok: true })
    }

    if (req.method === 'GET' && pathname === '/api/me') {
      const user = requireAuth(req, res)
      if (!user) return
      return sendJson(res, 200, { user: publicUser(user) })
    }

    if (req.method === 'GET' && pathname === '/api/users') {
      const user = requireAuth(req, res)
      if (!user || !requireAdmin(user, res)) return
      return sendJson(res, 200, { users: getUsers().map(publicUser).sort((a, b) => a.id - b.id) })
    }

    if (req.method === 'POST' && pathname === '/api/users') {
      const user = requireAuth(req, res)
      if (!user || !requireAdmin(user, res)) return
      const body = await readBody(req)
      const name = String(body.name || '').trim()
      const email = String(body.email || '').trim()
      const password = String(body.password || '')
      if (!name || !email || !password) return sendError(res, 400, 'Name, email, and password are required')
      if (getUserByEmail(email)) return sendError(res, 409, 'Email already registered')
      return sendJson(res, 201, { user: publicUser(createUserRecord(body)) })
    }

    const userDetailMatch = pathname.match(/^\/api\/users\/(\d+)$/)
    const userResumesMatch = pathname.match(/^\/api\/users\/(\d+)\/resumes$/)

    if (userDetailMatch && req.method === 'GET') {
      const authUser = requireAuth(req, res)
      if (!authUser) return
      const id = Number(userDetailMatch[1])
      if (!userOwnsRecord(authUser, id)) return sendError(res, 403, 'Forbidden')
      const user = getUserById(id)
      if (!user) return sendError(res, 404, 'User not found')
      return sendJson(res, 200, { user: publicUser(user) })
    }

    if (userDetailMatch && ['PUT', 'PATCH'].includes(req.method)) {
      const authUser = requireAuth(req, res)
      if (!authUser) return
      const result = updateUserRecord(Number(userDetailMatch[1]), await readBody(req), authUser)
      if (result === null) return sendError(res, 404, 'User not found')
      if (result === 'forbidden') return sendError(res, 403, 'Forbidden')
      if (result === 'email_conflict') return sendError(res, 409, 'Email already registered')
      if (result === 'password_invalid') return sendError(res, 401, 'Current password is incorrect')
      return sendJson(res, 200, { user: publicUser(result) })
    }

    if (userDetailMatch && req.method === 'DELETE') {
      const authUser = requireAuth(req, res)
      if (!authUser || !requireAdmin(authUser, res)) return
      const id = Number(userDetailMatch[1])
      if (!getUserById(id)) return sendError(res, 404, 'User not found')
      deleteUserRecord(id)
      return sendJson(res, 200, { ok: true })
    }

    if (userResumesMatch && req.method === 'GET') {
      const authUser = requireAuth(req, res)
      if (!authUser) return
      const id = Number(userResumesMatch[1])
      if (!userOwnsRecord(authUser, id)) return sendError(res, 403, 'Forbidden')
      return sendJson(res, 200, { resumes: getResumes().filter(resume => resume.user_id === id).map(publicResume) })
    }

    if (userResumesMatch && req.method === 'POST') {
      const authUser = requireAuth(req, res)
      if (!authUser) return
      const id = Number(userResumesMatch[1])
      if (!userOwnsRecord(authUser, id)) return sendError(res, 403, 'Forbidden')
      if (!getUserById(id)) return sendError(res, 404, 'User not found')
      const body = await readBody(req)
      if (!String(body.title || '').trim()) return sendError(res, 400, 'Resume title is required')
      if (body.selected_template_id && !getTemplateById(body.selected_template_id)) {
        return sendError(res, 404, 'Template not found')
      }
      return sendJson(res, 201, { resume: publicResume(createResumeRecord(id, body)) })
    }

    if (req.method === 'GET' && pathname === '/api/resumes') {
      const authUser = requireAuth(req, res)
      if (!authUser) return
      const resumes = authUser.role === 'admin'
        ? getResumes()
        : getResumes().filter(resume => resume.user_id === authUser.id)
      return sendJson(res, 200, { resumes: resumes.map(publicResume).sort((a, b) => a.id - b.id) })
    }

    const resumeDetailMatch = pathname.match(/^\/api\/resumes\/(\d+)$/)

    if (resumeDetailMatch && req.method === 'GET') {
      const authUser = requireAuth(req, res)
      if (!authUser) return
      const resume = getResumeById(Number(resumeDetailMatch[1]))
      if (!resume) return sendError(res, 404, 'Resume not found')
      if (!userOwnsRecord(authUser, resume.user_id)) return sendError(res, 403, 'Forbidden')
      return sendJson(res, 200, { resume: publicResume(resume) })
    }

    if (resumeDetailMatch && ['PUT', 'PATCH'].includes(req.method)) {
      const authUser = requireAuth(req, res)
      if (!authUser) return
      const result = updateResumeRecord(Number(resumeDetailMatch[1]), await readBody(req), authUser)
      if (result === null) return sendError(res, 404, 'Resume not found')
      if (result === 'forbidden') return sendError(res, 403, 'Forbidden')
      if (result === 'template_not_found') return sendError(res, 404, 'Template not found')
      return sendJson(res, 200, { resume: publicResume(result) })
    }

    if (resumeDetailMatch && req.method === 'DELETE') {
      const authUser = requireAuth(req, res)
      if (!authUser) return
      const result = deleteResumeRecord(Number(resumeDetailMatch[1]), authUser)
      if (result === null) return sendError(res, 404, 'Resume not found')
      if (result === 'forbidden') return sendError(res, 403, 'Forbidden')
      return sendJson(res, 200, { ok: true })
    }

    if (req.method === 'GET' && pathname === '/api/templates') {
      return sendJson(res, 200, { templates: getTemplates().map(publicTemplate).sort((a, b) => a.id - b.id) })
    }

    if (req.method === 'POST' && pathname === '/api/templates') {
      const user = requireAuth(req, res)
      if (!user || !requireAdmin(user, res)) return
      const body = await readBody(req)
      if (!String(body.name || '').trim()) return sendError(res, 400, 'Template name is required')
      return sendJson(res, 201, { template: publicTemplate(createTemplateRecord(body)) })
    }

    const templateDetailMatch = pathname.match(/^\/api\/templates\/(\d+)$/)

    if (templateDetailMatch && req.method === 'GET') {
      const template = getTemplates().find(entry => entry.id === Number(templateDetailMatch[1]))
      if (!template) return sendError(res, 404, 'Template not found')
      return sendJson(res, 200, { template: publicTemplate(template) })
    }

    if (templateDetailMatch && ['PUT', 'PATCH'].includes(req.method)) {
      const user = requireAuth(req, res)
      if (!user || !requireAdmin(user, res)) return
      const result = updateTemplateRecord(Number(templateDetailMatch[1]), await readBody(req))
      if (!result) return sendError(res, 404, 'Template not found')
      return sendJson(res, 200, { template: publicTemplate(result) })
    }

    if (templateDetailMatch && req.method === 'DELETE') {
      const user = requireAuth(req, res)
      if (!user || !requireAdmin(user, res)) return
      if (!deleteTemplateRecord(Number(templateDetailMatch[1]))) {
        return sendError(res, 404, 'Template not found')
      }
      return sendJson(res, 200, { ok: true })
    }

    return sendError(res, 404, 'Route not found')
  } catch (error) {
    console.error(error)
    return sendError(res, 500, error.message || 'Internal server error')
  }
}

http.createServer(handleRequest).listen(PORT, () => {
  console.log(`JSON API server running on http://localhost:${PORT}`)
})
