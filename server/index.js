const http = require('http')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const Database = require('better-sqlite3')

const PORT = process.env.PORT || 3000
const DB_PATH = path.join(__dirname, 'database.sqlite')
const db = new Database(DB_PATH)

// Enable foreign key support
db.pragma('foreign_keys = ON')

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'maxcv-super-secret-key-2026-auth'

// ─── JWT SIGNING & VERIFICATION (HS256) ───
function base64url(buf) {
  return buf.toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function base64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) {
    str += '='
  }
  return Buffer.from(str, 'base64').toString('utf8')
}

function generateJwt(payload) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const part1 = base64url(Buffer.from(JSON.stringify(header)))
  const part2 = base64url(Buffer.from(JSON.stringify({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24 Hours
  })))
  
  const signatureInput = `${part1}.${part2}`
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(signatureInput)
    .digest()
  const part3 = base64url(signature)
  return `${signatureInput}.${part3}`
}

function verifyJwt(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [part1, part2, part3] = parts
    
    const signatureInput = `${part1}.${part2}`
    const expectedSignature = base64url(
      crypto.createHmac('sha256', JWT_SECRET)
        .update(signatureInput)
        .digest()
    )
    if (part3 !== expectedSignature) return null
    
    const payload = JSON.parse(base64urlDecode(part2))
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null // Expired
    }
    return payload
  } catch {
    return null
  }
}

// ─── INITIALIZE DATABASE TABLES ───
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar_url TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    rating REAL DEFAULT 5.0,
    uses TEXT DEFAULT '0',
    layout_type TEXT,
    is_active INTEGER DEFAULT 1,
    popular INTEGER DEFAULT 0,
    new INTEGER DEFAULT 0,
    tag TEXT DEFAULT 'Modern',
    atsReady INTEGER DEFAULT 0,
    primary_color TEXT DEFAULT '#2563eb',
    title_color TEXT DEFAULT '#2563eb',
    text_color TEXT DEFAULT '#334155',
    font_family TEXT DEFAULT 'Inter',
    heading_style TEXT DEFAULT 'underline',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    selected_template_id INTEGER,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`)

// Migration: Add content column to resumes table if it does not exist
try {
  db.prepare("SELECT content FROM resumes LIMIT 1").get()
} catch (e) {
  db.exec("ALTER TABLE resumes ADD COLUMN content TEXT")
}

// Migration: Check and add missing columns to templates table to ensure all fields exist
const expectedTemplatesColumns = [
  { name: 'description', type: 'TEXT' },
  { name: 'rating', type: 'REAL DEFAULT 5.0' },
  { name: 'uses', type: "TEXT DEFAULT '0'" },
  { name: 'layout_type', type: 'TEXT' },
  { name: 'is_active', type: 'INTEGER DEFAULT 1' },
  { name: 'popular', type: 'INTEGER DEFAULT 0' },
  { name: 'new', type: 'INTEGER DEFAULT 0' },
  { name: 'tag', type: "TEXT DEFAULT 'Modern'" },
  { name: 'atsReady', type: 'INTEGER DEFAULT 0' },
  { name: 'primary_color', type: "TEXT DEFAULT '#2563eb'" },
  { name: 'title_color', type: "TEXT DEFAULT '#2563eb'" },
  { name: 'text_color', type: "TEXT DEFAULT '#334155'" },
  { name: 'font_family', type: "TEXT DEFAULT 'Inter'" },
  { name: 'heading_style', type: "TEXT DEFAULT 'underline'" }
]

for (const col of expectedTemplatesColumns) {
  try {
    db.prepare(`SELECT ${col.name} FROM templates LIMIT 1`).get()
  } catch (e) {
    console.log(`Migration: Adding missing column ${col.name} to templates table`)
    try {
      db.exec(`ALTER TABLE templates ADD COLUMN ${col.name} ${col.type}`)
    } catch (alterError) {
      console.error(`Failed to add column ${col.name}:`, alterError)
    }
  }
}

// ─── HELPERS ───
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

// ─── DB OPERATIONS ───
function getUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(Number(id)) || null
}

function getUserByEmail(email) {
  const normalized = String(email || '').trim().toLowerCase()
  return db.prepare('SELECT * FROM users WHERE LOWER(email) = ?').get(normalized) || null
}

function getTemplateById(id) {
  return db.prepare('SELECT * FROM templates WHERE id = ?').get(Number(id)) || null
}

function getResumeById(id) {
  return db.prepare('SELECT * FROM resumes WHERE id = ?').get(Number(id)) || null
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
    primary_color: template.primary_color || '#2563eb',
    title_color: template.title_color || '#2563eb',
    text_color: template.text_color || '#334155',
    font_family: template.font_family || 'Inter',
    heading_style: template.heading_style || 'underline',
    created_at: template.created_at,
    updated_at: template.updated_at
  }
}

function publicResume(resume) {
  if (!resume) return null
  return {
    id: resume.id,
    user_id: resume.user_id,
    title: resume.title,
    summary: resume.summary || null,
    selected_template_id: resume.selected_template_id || null,
    content: resume.content ? (typeof resume.content === 'string' ? JSON.parse(resume.content) : resume.content) : null,
    created_at: resume.created_at,
    updated_at: resume.updated_at
  }
}

// ─── DATABASE SEEDING ───
function seedData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count
  if (userCount > 0) return

  const timestamp = '2026-05-01T08:00:00.000Z'
  const seedPassword = hashPassword('password', 'seed-salt')

  // Seed Users
  const users = [
    { id: 103, name: 'Sarah Reid', email: 'admin@maxcv.com', role: 'admin' },
    { id: 124, name: 'Alex Chen', email: 'alex.chen@example.com', role: 'student' },
    { id: 125, name: 'Jamie Liu', email: 'jamie.liu@school.edu', role: 'student' },
    { id: 126, name: 'Kevin Wang', email: 'kevin.w@university.edu', role: 'student' },
    { id: 127, name: 'Maya Lee', email: 'maya.lee@gmail.com', role: 'student' },
    { id: 128, name: 'David Kim', email: 'd.kim@techuni.edu', role: 'student' },
    { id: 129, name: 'Lily Park', email: 'lily.park@design.edu', role: 'student' }
  ]

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, role, password_hash, avatar_url, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, NULL, ?, ?)
  `)

  db.transaction(() => {
    for (const u of users) {
      insertUser.run(u.id, u.name, u.email, u.role, seedPassword, timestamp, timestamp)
    }
  })()

  // Seed Templates
  const templates = [
    { id: 1, name: 'Modern Blue', description: 'Clean 2-column layout with a bold blue header. Perfect for tech roles and modern companies.', rating: 4.9, uses: '2,300', layout_type: '2-column', is_active: 1, popular: 1, new: 0, tag: 'Modern', atsReady: 1, primary_color: '#2563eb', title_color: '#2563eb', text_color: '#1e293b', font_family: 'Inter', heading_style: 'underline' },
    { id: 2, name: 'Elegant Classic', description: 'Serif-based single-column template focusing on standard typography and readable margins.', rating: 4.7, uses: '1,800', layout_type: 'single-column', is_active: 1, popular: 0, new: 0, tag: 'Classic', atsReady: 1, primary_color: '#1e293b', title_color: '#1e293b', text_color: '#334155', font_family: 'Georgia', heading_style: 'border-top-bottom' },
    { id: 3, name: 'Simple Dark', description: 'Modern dark theme design with high-contrast sections and left sidebar layout.', rating: 4.8, uses: '987', layout_type: 'sidebar', is_active: 1, popular: 0, new: 1, tag: 'Minimal', atsReady: 0, primary_color: '#0f172a', title_color: '#475569', text_color: '#334155', font_family: 'Arial', heading_style: 'bg-fill' },
    { id: 4, name: 'Creative Teal', description: 'Vibrant teal accents and unique timeline layout, perfect for UI/UX and product designers.', rating: 4.9, uses: '1,100', layout_type: '2-column', is_active: 1, popular: 0, new: 0, tag: 'Creative', atsReady: 0, primary_color: '#0d9488', title_color: '#0f766e', text_color: '#1e293b', font_family: 'Inter', heading_style: 'simple' },
    { id: 5, name: 'Clean Green', description: 'Minimalist layout accented with soft forest green elements and sans-serif typography.', rating: 4.6, uses: '654', layout_type: 'single-column', is_active: 1, popular: 0, new: 0, tag: 'Modern', atsReady: 1, primary_color: '#059669', title_color: '#065f46', text_color: '#334155', font_family: 'Times New Roman', heading_style: 'lines-side' },
    { id: 6, name: 'Warm Amber', description: 'Card-based content grouping with a warm amber palette for business and creative jobs.', rating: 4.5, uses: '432', layout_type: 'card-layout', is_active: 1, popular: 0, new: 0, tag: 'Creative', atsReady: 1, primary_color: '#d97706', title_color: '#92400e', text_color: '#334155', font_family: 'Georgia', heading_style: 'dots' }
  ]

  const insertTemplate = db.prepare(`
    INSERT INTO templates (id, name, description, rating, uses, layout_type, is_active, popular, new, tag, atsReady, primary_color, title_color, text_color, font_family, heading_style, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  db.transaction(() => {
    for (const t of templates) {
      insertTemplate.run(t.id, t.name, t.description, t.rating, t.uses, t.layout_type, t.is_active, t.popular, t.new, t.tag, t.atsReady, t.primary_color, t.title_color, t.text_color, t.font_family, t.heading_style, timestamp, timestamp)
    }
  })()

  // Seed Resumes
  const resumes = [
    { id: 1, user_id: 124, title: 'Frontend Developer v1', summary: 'Passionate frontend developer focused on React, Vue, and modern CSS.', selected_template_id: 1 },
    { id: 2, user_id: 124, title: 'Frontend Developer v2', summary: 'A second draft with tighter experience and stronger project framing.', selected_template_id: 2 },
    { id: 3, user_id: 125, title: 'Internship Resume', summary: 'Resume draft for internship applications with coursework and project focus.', selected_template_id: 1 }
  ]

  const insertResume = db.prepare(`
    INSERT INTO resumes (id, user_id, title, summary, selected_template_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  db.transaction(() => {
    for (const r of resumes) {
      insertResume.run(r.id, r.user_id, r.title, r.summary, r.selected_template_id, timestamp, timestamp)
    }
  })()
}

seedData()

// ─── AUTHENTICATION MIDDLEWARE ───
function getAuthenticatedUser(req) {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) return null
  const token = header.slice(7).trim()
  const payload = verifyJwt(token)
  if (!payload || !payload.id) return null
  return getUserById(payload.id)
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

// ─── VALIDATION HELPERS ───
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(String(email).trim())
}

// ─── REQUEST HANDLER ───
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
    // Health Check
    if (req.method === 'GET' && pathname === '/api/health') {
      return sendJson(res, 200, { ok: true, storage: 'sqlite' })
    }

    // Register User
    if (req.method === 'POST' && pathname === '/api/auth/register') {
      const body = await readBody(req)
      const name = String(body.name || '').trim()
      const email = String(body.email || '').trim()
      const password = String(body.password || '')

      if (!name || !email || !password) {
        return sendError(res, 400, 'Name, email, and password are required')
      }
      if (!isValidEmail(email)) {
        return sendError(res, 400, 'Invalid email format')
      }
      if (password.length < 6) {
        return sendError(res, 400, 'Password must be at least 6 characters long')
      }

      if (getUserByEmail(email)) {
        return sendError(res, 409, 'Email already registered')
      }

      const timestamp = nowIso()
      const passwordHash = hashPassword(password)
      
      const insert = db.prepare(`
        INSERT INTO users (name, email, role, password_hash, created_at, updated_at)
        VALUES (?, ?, 'student', ?, ?, ?)
      `)
      
      const result = insert.run(name, email, passwordHash, timestamp, timestamp)
      const userId = result.lastInsertRowid
      const user = getUserById(userId)

      // Create initial default resume
      const insertResume = db.prepare(`
        INSERT INTO resumes (user_id, title, selected_template_id, created_at, updated_at)
        VALUES (?, ?, 1, ?, ?)
      `)
      const resumeResult = insertResume.run(userId, `${name}'s Resume`, timestamp, timestamp)
      const resume = getResumeById(resumeResult.lastInsertRowid)

      const token = generateJwt({ id: user.id, email: user.email, role: user.role })
      return sendJson(res, 201, { user: publicUser(user), resume: publicResume(resume), token })
    }

    // Login User
    if (req.method === 'POST' && pathname === '/api/auth/login') {
      const body = await readBody(req)
      const email = String(body.email || '').trim()
      const password = String(body.password || '')

      if (!email || !password) {
        return sendError(res, 400, 'Email and password are required')
      }

      const user = getUserByEmail(email)
      if (!user || !verifyPassword(password, user.password_hash)) {
        return sendError(res, 401, 'Invalid credentials')
      }

      const token = generateJwt({ id: user.id, email: user.email, role: user.role })
      return sendJson(res, 200, { user: publicUser(user), token })
    }

    // Logout User
    if (req.method === 'POST' && pathname === '/api/auth/logout') {
      // JWT is stateless on server, client discards token
      return sendJson(res, 200, { ok: true })
    }

    // Get Active User Profile
    if (req.method === 'GET' && pathname === '/api/me') {
      const user = requireAuth(req, res)
      if (!user) return
      return sendJson(res, 200, { user: publicUser(user) })
    }

    // Get All Users (Admin-only)
    if (req.method === 'GET' && pathname === '/api/users') {
      const user = requireAuth(req, res)
      if (!user || !requireAdmin(user, res)) return
      const usersList = db.prepare('SELECT * FROM users ORDER BY id ASC').all()
      return sendJson(res, 200, { users: usersList.map(publicUser) })
    }

    // Create User (Admin-only)
    if (req.method === 'POST' && pathname === '/api/users') {
      const user = requireAuth(req, res)
      if (!user || !requireAdmin(user, res)) return
      const body = await readBody(req)
      const name = String(body.name || '').trim()
      const email = String(body.email || '').trim()
      const password = String(body.password || '')
      const role = body.role === 'admin' ? 'admin' : 'student'

      if (!name || !email || !password) {
        return sendError(res, 400, 'Name, email, and password are required')
      }
      if (!isValidEmail(email)) {
        return sendError(res, 400, 'Invalid email format')
      }
      if (getUserByEmail(email)) {
        return sendError(res, 409, 'Email already registered')
      }

      const timestamp = nowIso()
      const passwordHash = hashPassword(password)
      const insert = db.prepare(`
        INSERT INTO users (name, email, role, password_hash, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      const result = insert.run(name, email, role, passwordHash, timestamp, timestamp)
      const newUser = getUserById(result.lastInsertRowid)
      return sendJson(res, 201, { user: publicUser(newUser) })
    }

    const userDetailMatch = pathname.match(/^\/api\/users\/(\d+)$/)
    const userResumesMatch = pathname.match(/^\/api\/users\/(\d+)\/resumes$/)

    // Get Single User details
    if (userDetailMatch && req.method === 'GET') {
      const authUser = requireAuth(req, res)
      if (!authUser) return
      const targetId = Number(userDetailMatch[1])
      if (!userOwnsRecord(authUser, targetId)) {
        return sendError(res, 403, 'Forbidden')
      }
      const targetUser = getUserById(targetId)
      if (!targetUser) {
        return sendError(res, 404, 'User not found')
      }
      return sendJson(res, 200, { user: publicUser(targetUser) })
    }

    // Update User Details (Email, name, password)
    if (userDetailMatch && ['PUT', 'PATCH'].includes(req.method)) {
      const authUser = requireAuth(req, res)
      if (!authUser) return
      const targetId = Number(userDetailMatch[1])
      if (!userOwnsRecord(authUser, targetId)) {
        return sendError(res, 403, 'Forbidden')
      }

      const targetUser = getUserById(targetId)
      if (!targetUser) {
        return sendError(res, 404, 'User not found')
      }

      const body = await readBody(req)
      const name = body.name !== undefined ? String(body.name).trim() || targetUser.name : targetUser.name
      let email = targetUser.email
      let role = targetUser.role
      let passwordHash = targetUser.password_hash

      if (body.email !== undefined) {
        const nextEmail = String(body.email).trim()
        if (!isValidEmail(nextEmail)) {
          return sendError(res, 400, 'Invalid email format')
        }
        const conflict = getUserByEmail(nextEmail)
        if (conflict && conflict.id !== targetId) {
          return sendError(res, 409, 'Email already registered')
        }
        email = nextEmail
      }

      if (body.role !== undefined && authUser.role === 'admin') {
        role = body.role === 'admin' ? 'admin' : 'student'
      }

      if (body.password) {
        if (authUser.role !== 'admin') {
          if (!body.currentPassword || !verifyPassword(body.currentPassword, targetUser.password_hash)) {
            return sendError(res, 401, 'Current password is incorrect')
          }
        }
        if (body.password.length < 6) {
          return sendError(res, 400, 'Password must be at least 6 characters long')
        }
        passwordHash = hashPassword(body.password)
      }

      const timestamp = nowIso()
      const update = db.prepare(`
        UPDATE users 
        SET name = ?, email = ?, role = ?, password_hash = ?, updated_at = ?
        WHERE id = ?
      `)
      update.run(name, email, role, passwordHash, timestamp, targetId)
      const updatedUser = getUserById(targetId)
      return sendJson(res, 200, { user: publicUser(updatedUser) })
    }

    // Delete User details (Admin-only)
    if (userDetailMatch && req.method === 'DELETE') {
      const authUser = requireAuth(req, res)
      if (!authUser || !requireAdmin(authUser, res)) return
      const targetId = Number(userDetailMatch[1])
      const exists = getUserById(targetId)
      if (!exists) {
        return sendError(res, 404, 'User not found')
      }
      db.prepare('DELETE FROM users WHERE id = ?').run(targetId)
      return sendJson(res, 200, { ok: true })
    }

    // Get User Resumes
    if (userResumesMatch && req.method === 'GET') {
      const authUser = requireAuth(req, res)
      if (!authUser) return
      const targetUserId = Number(userResumesMatch[1])
      if (!userOwnsRecord(authUser, targetUserId)) {
        return sendError(res, 403, 'Forbidden')
      }
      const resumesList = db.prepare('SELECT * FROM resumes WHERE user_id = ? ORDER BY id ASC').all(targetUserId)
      return sendJson(res, 200, { resumes: resumesList.map(publicResume) })
    }

    // Create User Resume
    if (userResumesMatch && req.method === 'POST') {
      const authUser = requireAuth(req, res)
      if (!authUser) return
      const targetUserId = Number(userResumesMatch[1])
      if (!userOwnsRecord(authUser, targetUserId)) {
        return sendError(res, 403, 'Forbidden')
      }
      if (!getUserById(targetUserId)) {
        return sendError(res, 404, 'User not found')
      }

      const body = await readBody(req)
      const title = String(body.title || '').trim()
      if (!title) {
        return sendError(res, 400, 'Resume title is required')
      }
      const selectedTemplateId = body.selected_template_id ? Number(body.selected_template_id) : 1

      const timestamp = nowIso()
      const contentStr = body.content ? JSON.stringify(body.content) : null
      const insert = db.prepare(`
        INSERT INTO resumes (user_id, title, summary, selected_template_id, content, created_at, updated_at)
        VALUES (?, ?, NULL, ?, ?, ?, ?)
      `)
      const result = insert.run(targetUserId, title, selectedTemplateId, contentStr, timestamp, timestamp)
      const resume = getResumeById(result.lastInsertRowid)
      return sendJson(res, 201, { resume: publicResume(resume) })
    }

    // Get All Resumes (User-specific or Admin All)
    if (req.method === 'GET' && pathname === '/api/resumes') {
      const authUser = requireAuth(req, res)
      if (!authUser) return
      let resumesList
      if (authUser.role === 'admin') {
        resumesList = db.prepare('SELECT * FROM resumes ORDER BY id ASC').all()
      } else {
        resumesList = db.prepare('SELECT * FROM resumes WHERE user_id = ? ORDER BY id ASC').all(authUser.id)
      }
      return sendJson(res, 200, { resumes: resumesList.map(publicResume) })
    }

    const resumeDetailMatch = pathname.match(/^\/api\/resumes\/(\d+)$/)

    // Get Single Resume Details
    if (resumeDetailMatch && req.method === 'GET') {
      const authUser = requireAuth(req, res)
      if (!authUser) return
      const resumeId = Number(resumeDetailMatch[1])
      const resume = getResumeById(resumeId)
      if (!resume) {
        return sendError(res, 404, 'Resume not found')
      }
      if (!userOwnsRecord(authUser, resume.user_id)) {
        return sendError(res, 403, 'Forbidden')
      }
      return sendJson(res, 200, { resume: publicResume(resume) })
    }

    // Update Resume Details (Title, Template, Summary)
    if (resumeDetailMatch && ['PUT', 'PATCH'].includes(req.method)) {
      const authUser = requireAuth(req, res)
      if (!authUser) return
      const resumeId = Number(resumeDetailMatch[1])
      const resume = getResumeById(resumeId)
      if (!resume) {
        return sendError(res, 404, 'Resume not found')
      }
      if (!userOwnsRecord(authUser, resume.user_id)) {
        return sendError(res, 403, 'Forbidden')
      }

      const body = await readBody(req)
      const title = body.title !== undefined ? String(body.title).trim() || resume.title : resume.title
      const summary = body.summary !== undefined ? (body.summary === null ? null : String(body.summary)) : resume.summary
      const contentStr = body.content !== undefined ? (body.content === null ? null : JSON.stringify(body.content)) : resume.content
      let selectedTemplateId = resume.selected_template_id

      if (body.selected_template_id !== undefined && body.selected_template_id !== null && body.selected_template_id !== '') {
        const tid = Number(body.selected_template_id)
        if (!getTemplateById(tid)) {
          return sendError(res, 404, 'Template not found')
        }
        selectedTemplateId = tid
      } else if (body.selected_template_id === null || body.selected_template_id === '') {
        selectedTemplateId = null
      }

      const timestamp = nowIso()
      const update = db.prepare(`
        UPDATE resumes 
        SET title = ?, summary = ?, selected_template_id = ?, content = ?, updated_at = ?
        WHERE id = ?
      `)
      update.run(title, summary, selectedTemplateId, contentStr, timestamp, resumeId)
      const updatedResume = getResumeById(resumeId)
      return sendJson(res, 200, { resume: publicResume(updatedResume) })
    }

    // Delete Resume Details
    if (resumeDetailMatch && req.method === 'DELETE') {
      const authUser = requireAuth(req, res)
      if (!authUser) return
      const resumeId = Number(resumeDetailMatch[1])
      const resume = getResumeById(resumeId)
      if (!resume) {
        return sendError(res, 404, 'Resume not found')
      }
      if (!userOwnsRecord(authUser, resume.user_id)) {
        return sendError(res, 403, 'Forbidden')
      }

      db.prepare('DELETE FROM resumes WHERE id = ?').run(resumeId)
      return sendJson(res, 200, { ok: true })
    }

    // Get All Templates
    if (req.method === 'GET' && pathname === '/api/templates') {
      const templatesList = db.prepare('SELECT * FROM templates ORDER BY id ASC').all()
      return sendJson(res, 200, { templates: templatesList.map(publicTemplate) })
    }

    // Create Template (Admin-only)
    if (req.method === 'POST' && pathname === '/api/templates') {
      const user = requireAuth(req, res)
      if (!user || !requireAdmin(user, res)) return
      const body = await readBody(req)
      const name = String(body.name || '').trim()
      if (!name) {
        return sendError(res, 400, 'Template name is required')
      }

      const timestamp = nowIso()
      const rating = Number(body.rating) || 5.0
      const uses = String(body.uses ?? '0')
      const layoutType = body.layout_type || 'single-column'
      const isActive = body.is_active === 0 ? 0 : 1
      const popular = body.popular ? 1 : 0
      const isNew = body.new ? 1 : 0
      const tag = body.tag || 'Modern'
      const atsReady = body.atsReady ? 1 : 0
      const primaryColor = body.primary_color || '#2563eb'
      const titleColor = body.title_color || '#2563eb'
      const textColor = body.text_color || '#334155'
      const fontFamily = body.font_family || 'Inter'
      const headingStyle = body.heading_style || 'underline'

      const insert = db.prepare(`
        INSERT INTO templates (name, description, rating, uses, layout_type, is_active, popular, new, tag, atsReady, primary_color, title_color, text_color, font_family, heading_style, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      const result = insert.run(name, body.description || '', rating, uses, layoutType, isActive, popular, isNew, tag, atsReady, primaryColor, titleColor, textColor, fontFamily, headingStyle, timestamp, timestamp)
      const template = getTemplateById(result.lastInsertRowid)
      return sendJson(res, 201, { template: publicTemplate(template) })
    }

    const templateDetailMatch = pathname.match(/^\/api\/templates\/(\d+)$/)

    // Get Single Template Details
    if (templateDetailMatch && req.method === 'GET') {
      const templateId = Number(templateDetailMatch[1])
      const template = getTemplateById(templateId)
      if (!template) {
        return sendError(res, 404, 'Template not found')
      }
      return sendJson(res, 200, { template: publicTemplate(template) })
    }

    // Update Template Details (Admin-only)
    if (templateDetailMatch && ['PUT', 'PATCH'].includes(req.method)) {
      const user = requireAuth(req, res)
      if (!user || !requireAdmin(user, res)) return
      const templateId = Number(templateDetailMatch[1])
      const template = getTemplateById(templateId)
      if (!template) {
        return sendError(res, 404, 'Template not found')
      }

      const body = await readBody(req)
      const name = body.name !== undefined ? String(body.name).trim() || template.name : template.name
      const description = body.description !== undefined ? String(body.description) : template.description
      const rating = body.rating !== undefined ? Number(body.rating) || 5.0 : template.rating
      const uses = body.uses !== undefined ? String(body.uses) : template.uses
      const layoutType = body.layout_type !== undefined ? String(body.layout_type) : template.layout_type
      const isActive = body.is_active !== undefined ? (Number(body.is_active) === 0 ? 0 : 1) : template.is_active
      const popular = body.popular !== undefined ? (body.popular ? 1 : 0) : template.popular
      const isNew = body.new !== undefined ? (body.new ? 1 : 0) : template.new
      const tag = body.tag !== undefined ? String(body.tag || 'Modern') : template.tag
      const atsReady = body.atsReady !== undefined ? (body.atsReady ? 1 : 0) : template.atsReady
      const primaryColor = body.primary_color !== undefined ? String(body.primary_color) : template.primary_color
      const titleColor = body.title_color !== undefined ? String(body.title_color) : template.title_color
      const textColor = body.text_color !== undefined ? String(body.text_color) : template.text_color
      const fontFamily = body.font_family !== undefined ? String(body.font_family) : template.font_family
      const headingStyle = body.heading_style !== undefined ? String(body.heading_style) : template.heading_style

      const timestamp = nowIso()
      const update = db.prepare(`
        UPDATE templates 
        SET name = ?, description = ?, rating = ?, uses = ?, layout_type = ?, is_active = ?, popular = ?, new = ?, tag = ?, atsReady = ?, primary_color = ?, title_color = ?, text_color = ?, font_family = ?, heading_style = ?, updated_at = ?
        WHERE id = ?
      `)
      update.run(name, description, rating, uses, layoutType, isActive, popular, isNew, tag, atsReady, primaryColor, titleColor, textColor, fontFamily, headingStyle, timestamp, templateId)
      const updatedTemplate = getTemplateById(templateId)
      return sendJson(res, 200, { template: publicTemplate(updatedTemplate) })
    }

    // Delete Template Details (Admin-only)
    if (templateDetailMatch && req.method === 'DELETE') {
      const user = requireAuth(req, res)
      if (!user || !requireAdmin(user, res)) return
      const templateId = Number(templateDetailMatch[1])
      const exists = getTemplateById(templateId)
      if (!exists) {
        return sendError(res, 404, 'Template not found')
      }
      db.prepare('DELETE FROM templates WHERE id = ?').run(templateId)
      return sendJson(res, 200, { ok: true })
    }

    // Default Route not found
    return sendError(res, 404, 'Route not found')
  } catch (error) {
    console.error(error)
    return sendError(res, 500, error.message || 'Internal server error')
  }
}

http.createServer(handleRequest).listen(PORT, () => {
  console.log(`JSON API SQLite server running on http://localhost:${PORT}`)
})
