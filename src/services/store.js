import { reactive, watch } from 'vue'
import auth from '@/services/auth'
import { apiRequest } from '@/services/auth'

const STORAGE_KEY = 'maxcv_store_state'

const defaultResume = {
  id: 1,
  title: 'Frontend Developer v1',
  selected_template_id: 1, // Modern Blue
  personal: {
    name: 'Alex Chen',
    title: 'Frontend Developer',
    email: 'alex.chen@example.com',
    phone: '+86 138 0000 1234',
    location: 'Beijing, China',
    summary: 'Passionate frontend developer with expertise in React, TypeScript, and modern CSS. Seeking internship opportunities to apply my skills in building performant, user-friendly web applications.'
  },
  education: [
    {
      id: 1,
      institution: 'Peking University',
      qualification: 'Bachelor of Computer Science',
      start_date: '2021-09',
      end_date: '2025-07',
      description: "GPA 3.8/4.0 · Dean's List 2022–2024 · Focus on Software Engineering"
    }
  ],
  experience: [
    {
      id: 1,
      company_name: 'TechSolutions Inc.',
      job_title: 'Frontend Engineering Intern',
      start_date: '2024-06',
      end_date: '2024-09',
      description: 'Collaborated on developing and maintaining responsive web components using React and Vue. Improved page load times by optimizing bundle sizes and implementing lazy loading.'
    }
  ],
  skills: [
    { id: 1, skill_name: 'React', skill_level: 'Advanced' },
    { id: 2, skill_name: 'TypeScript', skill_level: 'Intermediate' },
    { id: 3, skill_name: 'Node.js', skill_level: 'Intermediate' },
    { id: 4, skill_name: 'CSS/Tailwind', skill_level: 'Advanced' },
    { id: 5, skill_name: 'Git', skill_level: 'Advanced' }
  ]
}

const defaultTemplates = []

const defaultVersions = [
  { id: 1, title: 'Intern Application_v2', template_id: 1, last_edited: 'May 5, 2026', selected_for_export: true },
  { id: 2, title: 'Frontend Developer v1', template_id: 2, last_edited: 'May 4, 2026', selected_for_export: false },
  { id: 3, title: 'Full Stack Intern v2', template_id: 3, last_edited: 'May 2, 2026', selected_for_export: false },
  { id: 4, title: 'UI Designer Draft', template_id: 4, last_edited: 'Apr 28, 2026', selected_for_export: false }
]

const defaultExportHistory = [
  { id: 1, filename: 'Intern_Application_v2.pdf', date: 'May 5, 2026 10:24 AM', format: 'PDF' },
  { id: 2, filename: 'Frontend_Developer_v1.pdf', date: 'May 4, 2026 3:15 PM', format: 'PDF' },
  { id: 3, filename: 'Full_Stack_Intern_v2.docx', date: 'May 2, 2026 9:42 AM', format: 'DOCX' }
]

const defaultActivities = [
  { id: 1, type: 'export', text: 'Exported resume.pdf', time: 'May 5, 2026 - 10:24 AM', icon: 'export' },
  { id: 2, type: 'template', text: 'Switched to Classic White template', time: 'May 4, 2026 - 3:15 PM', icon: 'template' },
  { id: 3, type: 'update', text: 'Updated Work Experience', time: 'May 3, 2026 - 9:42 AM', icon: 'update' },
  { id: 4, type: 'duplicate', text: 'Duplicated Frontend Developer v1', time: 'Apr 30, 2026 - 2:05 PM', icon: 'duplicate' }
]

const defaultGlobalExports = [
  { id: 1, userName: 'Alex Chen', userEmail: 'alex.chen@example.com', filename: 'Intern_Application_v2.pdf', date: 'May 5, 2026 10:24 AM', format: 'PDF' },
  { id: 2, userName: 'Aina', userEmail: 'aina@example.com', filename: 'Internship_Resume.pdf', date: 'May 5, 2026 11:30 AM', format: 'PDF' },
  { id: 3, userName: 'Faris', userEmail: 'faris@example.com', filename: 'Technical_Dev_v2.pdf', date: 'May 5, 2026 4:12 PM', format: 'PDF' },
  { id: 4, userName: 'Alex Chen', userEmail: 'alex.chen@example.com', filename: 'Frontend_Developer_v1.pdf', date: 'May 4, 2026 3:15 PM', format: 'PDF' },
  { id: 5, userName: 'Alex Chen', userEmail: 'alex.chen@example.com', filename: 'Full_Stack_Intern_v2.docx', date: 'May 2, 2026 9:42 AM', format: 'DOCX' }
]

function getInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      parsed.templates = []
      if (!parsed.globalExportsLog) {
        parsed.globalExportsLog = JSON.parse(JSON.stringify(defaultGlobalExports))
      }
      if (!parsed.resumesByUser || !parsed.resumesByUser[124] || !parsed.resumesByUser[125]) {
        parsed.resumesByUser = {
          124: {
            resumeData: parsed.resumeData || JSON.parse(JSON.stringify(defaultResume)),
            versions: parsed.versions ? parsed.versions.slice(0, 3) : JSON.parse(JSON.stringify(defaultVersions)).slice(0, 3)
          },
          125: {
            resumeData: JSON.parse(JSON.stringify(defaultResume)),
            versions: [
              { id: 1001, title: 'Internship Resume', template_id: 1, last_edited: 'Feb 3, 2026', selected_for_export: true },
              { id: 1002, title: 'Job Application Draft', template_id: 2, last_edited: 'Feb 2, 2026', selected_for_export: false },
              { id: 1003, title: 'V3 Backup', template_id: 3, last_edited: 'Jan 28, 2026', selected_for_export: false },
              { id: 1004, title: 'Design Layout Spec', template_id: 4, last_edited: 'Jan 24, 2026', selected_for_export: false },
              { id: 1005, title: 'V5 Final', template_id: 5, last_edited: 'Jan 20, 2026', selected_for_export: false }
            ]
          },
          103: {
            resumeData: JSON.parse(JSON.stringify(defaultResume)),
            versions: []
          },
          126: {
            resumeData: JSON.parse(JSON.stringify(defaultResume)),
            versions: [
              { id: 2001, title: 'Kevin Resume v1', template_id: 1, last_edited: 'Feb 18, 2026', selected_for_export: true },
              { id: 2002, title: 'Kevin Resume v2', template_id: 2, last_edited: 'Feb 15, 2026', selected_for_export: false }
            ]
          },
          127: {
            resumeData: JSON.parse(JSON.stringify(defaultResume)),
            versions: [
              { id: 3001, title: 'Maya Resume v1', template_id: 1, last_edited: 'Mar 5, 2026', selected_for_export: true }
            ]
          },
          128: {
            resumeData: JSON.parse(JSON.stringify(defaultResume)),
            versions: [
              { id: 4001, title: 'David Resume v1', template_id: 1, last_edited: 'Mar 12, 2026', selected_for_export: true },
              { id: 4002, title: 'David Resume v2', template_id: 2, last_edited: 'Mar 10, 2026', selected_for_export: false },
              { id: 4003, title: 'David Resume v3', template_id: 3, last_edited: 'Mar 5, 2026', selected_for_export: false },
              { id: 4004, title: 'David Resume v4', template_id: 4, last_edited: 'Mar 1, 2026', selected_for_export: false }
            ]
          },
          129: {
            resumeData: JSON.parse(JSON.stringify(defaultResume)),
            versions: [
              { id: 5001, title: 'Lily Resume v1', template_id: 1, last_edited: 'Mar 20, 2026', selected_for_export: true },
              { id: 5002, title: 'Lily Resume v2', template_id: 2, last_edited: 'Mar 18, 2026', selected_for_export: false }
            ]
          }
        }
      }
      if (parsed.previewSessionsCounter === undefined) {
        parsed.previewSessionsCounter = 42
      }
      if (parsed.aiChecklistClicks === undefined) {
        parsed.aiChecklistClicks = 18
      }
      return parsed
    }
  } catch (e) {
    console.error('Failed to load state', e)
  }
  return {
    resumeData: JSON.parse(JSON.stringify(defaultResume)),
    versions: JSON.parse(JSON.stringify(defaultVersions)),
    exportHistory: JSON.parse(JSON.stringify(defaultExportHistory)),
    activities: JSON.parse(JSON.stringify(defaultActivities)),
    templates: JSON.parse(JSON.stringify(defaultTemplates)),
    globalExportsLog: JSON.parse(JSON.stringify(defaultGlobalExports)),
    resumesByUser: {
      124: {
        resumeData: JSON.parse(JSON.stringify(defaultResume)),
        versions: JSON.parse(JSON.stringify(defaultVersions)).slice(0, 3)
      },
      125: {
        resumeData: JSON.parse(JSON.stringify(defaultResume)),
        versions: [
          { id: 1001, title: 'Internship Resume', template_id: 1, last_edited: 'Feb 3, 2026', selected_for_export: true },
          { id: 1002, title: 'Job Application Draft', template_id: 2, last_edited: 'Feb 2, 2026', selected_for_export: false },
          { id: 1003, title: 'V3 Backup', template_id: 3, last_edited: 'Jan 28, 2026', selected_for_export: false },
          { id: 1004, title: 'Design Layout Spec', template_id: 4, last_edited: 'Jan 24, 2026', selected_for_export: false },
          { id: 1005, title: 'V5 Final', template_id: 5, last_edited: 'Jan 20, 2026', selected_for_export: false }
        ]
      },
      103: {
        resumeData: JSON.parse(JSON.stringify(defaultResume)),
        versions: []
      },
      126: {
        resumeData: JSON.parse(JSON.stringify(defaultResume)),
        versions: [
          { id: 2001, title: 'Kevin Resume v1', template_id: 1, last_edited: 'Feb 18, 2026', selected_for_export: true },
          { id: 2002, title: 'Kevin Resume v2', template_id: 2, last_edited: 'Feb 15, 2026', selected_for_export: false }
        ]
      },
      127: {
        resumeData: JSON.parse(JSON.stringify(defaultResume)),
        versions: [
          { id: 3001, title: 'Maya Resume v1', template_id: 1, last_edited: 'Mar 5, 2026', selected_for_export: true }
        ]
      },
      128: {
        resumeData: JSON.parse(JSON.stringify(defaultResume)),
        versions: [
          { id: 4001, title: 'David Resume v1', template_id: 1, last_edited: 'Mar 12, 2026', selected_for_export: true },
          { id: 4002, title: 'David Resume v2', template_id: 2, last_edited: 'Mar 10, 2026', selected_for_export: false },
          { id: 4003, title: 'David Resume v3', template_id: 3, last_edited: 'Mar 5, 2026', selected_for_export: false },
          { id: 4004, title: 'David Resume v4', template_id: 4, last_edited: 'Mar 1, 2026', selected_for_export: false }
        ]
      },
      129: {
        resumeData: JSON.parse(JSON.stringify(defaultResume)),
        versions: [
          { id: 5001, title: 'Lily Resume v1', template_id: 1, last_edited: 'Mar 20, 2026', selected_for_export: true },
          { id: 5002, title: 'Lily Resume v2', template_id: 2, last_edited: 'Mar 18, 2026', selected_for_export: false }
        ]
      }
    },
    previewSessionsCounter: 42,
    aiChecklistClicks: 18,
    exportSettings: {
      format: 'PDF',
      paperSize: 'A4',
      includePhoto: true,
      includeContactInfo: true,
      hyperlinksActive: true
    },
    showLivePreview: true,
    zoomLevel: 80
  }
}

const state = reactive(getInitialState())

function replaceTemplateList(templates) {
  state.templates.splice(0, state.templates.length, ...templates)
}

// Auto-save changes to localStorage
watch(state, (newState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
  } catch (e) {
    console.error('Failed to save state', e)
  }
}, { deep: true })

export const store = {
  state,
  
  // Getter for templates list to support CRUD update notifications automatically
  get templates() {
    return state.templates
  },

  async loadTemplates() {
    const payload = await apiRequest('/templates')
    replaceTemplateList(payload.templates || [])
    return state.templates
  },

  // Resume modifications
  updatePersonalInfo(info) {
    state.resumeData.personal = { ...state.resumeData.personal, ...info }
    this.addActivity('update', 'Updated Personal Information')
  },

  updateResumeTitle(title) {
    state.resumeData.title = title
    // Update versions list if current matches
    const currentVer = state.versions.find(v => v.id === state.resumeData.id)
    if (currentVer) {
      currentVer.title = title
      currentVer.last_edited = this.formatToday()
    }
  },

  addEducation(entry = null) {
    const id = Date.now()
    const newEntry = entry || {
      id,
      institution: '',
      qualification: '',
      start_date: '',
      end_date: '',
      description: ''
    }
    state.resumeData.education.push(newEntry)
    this.addActivity('update', 'Added Education Entry')
  },

  removeEducation(id) {
    state.resumeData.education = state.resumeData.education.filter(e => e.id !== id)
    this.addActivity('update', 'Removed Education Entry')
  },

  addExperience(entry = null) {
    const id = Date.now()
    const newEntry = entry || {
      id,
      company_name: '',
      job_title: '',
      start_date: '',
      end_date: '',
      description: ''
    }
    state.resumeData.experience.push(newEntry)
    this.addActivity('update', 'Added Work Experience')
  },

  removeExperience(id) {
    state.resumeData.experience = state.resumeData.experience.filter(e => e.id !== id)
    this.addActivity('update', 'Removed Work Experience')
  },

  addSkill(skillName, skillLevel = 'Intermediate') {
    if (!skillName) return
    const id = Date.now()
    state.resumeData.skills.push({ id, skill_name: skillName, skill_level: skillLevel })
    this.addActivity('update', `Added Skill: ${skillName}`)
  },

  removeSkill(id) {
    const skill = state.resumeData.skills.find(s => s.id === id)
    state.resumeData.skills = state.resumeData.skills.filter(s => s.id !== id)
    if (skill) {
      this.addActivity('update', `Removed Skill: ${skill.skill_name}`)
    }
  },

  setTemplate(templateId) {
    state.resumeData.selected_template_id = templateId
    const template = state.templates.find(t => t.id === templateId)
    this.addActivity('template', `Switched template to ${template?.name || 'Classic White'}`)
  },

  // Version management
  selectVersionForExport(id) {
    state.versions.forEach(v => {
      v.selected_for_export = (v.id === id)
    })
    // load mock values to state matching version if wanted
    const ver = state.versions.find(v => v.id === id)
    if (ver) {
      state.resumeData.id = ver.id
      state.resumeData.title = ver.title
      state.resumeData.selected_template_id = ver.template_id
    }
  },

  createNewVersion(title = 'Untitled Resume') {
    const id = Date.now()
    const newVer = {
      id,
      title: title,
      template_id: 1,
      last_edited: this.formatToday(),
      selected_for_export: false
    }
    state.versions.push(newVer)
    this.addActivity('duplicate', `Created new version: ${title}`)
    return newVer
  },

  duplicateVersion(id) {
    const original = state.versions.find(v => v.id === id)
    if (!original) return
    const newId = Date.now()
    const duplicate = {
      id: newId,
      title: `${original.title} (Copy)`,
      template_id: original.template_id,
      last_edited: this.formatToday(),
      selected_for_export: false
    }
    state.versions.push(duplicate)
    this.addActivity('duplicate', `Duplicated ${original.title}`)
  },

  deleteVersion(id) {
    const idx = state.versions.findIndex(v => v.id === id)
    if (idx !== -1) {
      state.versions.splice(idx, 1)
      this.addActivity('update', 'Deleted a resume version')
      // Reset if deleted the active one
      if (state.resumeData.id === id && state.versions.length > 0) {
        this.selectVersionForExport(state.versions[0].id)
      }
    }
  },

  renameVersion(id, newTitle) {
    const ver = state.versions.find(v => v.id === id)
    if (ver) {
      const oldTitle = ver.title
      ver.title = newTitle
      ver.last_edited = this.formatToday()
      if (state.resumeData.id === id) {
        state.resumeData.title = newTitle
      }
      this.addActivity('update', `Renamed "${oldTitle}" to "${newTitle}"`)
    }
  },

  // Export management
  addExportRecord(filename, format) {
    const id = Date.now()
    const user = auth.getUser()

    // User-specific history
    const record = {
      id,
      filename,
      date: this.formatTodayTime(),
      format
    }
    state.exportHistory.unshift(record)

    // Global platform-wide logs
    const globalRecord = {
      id,
      userName: user ? user.name : 'Guest',
      userEmail: user ? user.email : 'guest@example.com',
      filename,
      date: this.formatTodayTime(),
      format
    }
    state.globalExportsLog.unshift(globalRecord)

    this.addActivity('export', `Exported ${filename} (${format})`)
  },

  // Template CRUD (Admin)
  async createTemplate(tplData) {
    const payload = await apiRequest('/templates', {
      method: 'POST',
      body: JSON.stringify(tplData)
    })
    const newTpl = payload.template
    state.templates.push(newTpl)
    this.addActivity('update', `Created new template: ${newTpl.name}`)
    return newTpl
  },

  async updateTemplate(id, tplData) {
    const payload = await apiRequest(`/templates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(tplData)
    })
    const updatedTemplate = payload.template
    const idx = state.templates.findIndex(t => t.id === id)
    if (idx !== -1) {
      state.templates[idx] = updatedTemplate
    } else {
      state.templates.push(updatedTemplate)
    }
    this.addActivity('update', `Updated template: ${updatedTemplate.name}`)
    return updatedTemplate
  },

  async deleteTemplate(id) {
    await apiRequest(`/templates/${id}`, { method: 'DELETE' })
    const idx = state.templates.findIndex(t => t.id === id)
    if (idx !== -1) {
      const tpl = state.templates[idx]
      state.templates.splice(idx, 1)
      this.addActivity('update', `Deleted template: ${tpl.name}`)
    }
  },

  // User specific resume management
  initForUser(userId) {
    if (!userId) return
    
    if (!state.resumesByUser) {
      state.resumesByUser = {}
    }
    
    if (!state.resumesByUser[userId]) {
      const user = auth.getUser()
      const userResume = JSON.parse(JSON.stringify(defaultResume))
      if (user && user.id === userId) {
        userResume.personal.name = user.name
        userResume.personal.email = user.email
      }
      userResume.id = Date.now()
      
      const userVersions = JSON.parse(JSON.stringify(defaultVersions))
      if (userVersions.length > 0) {
        userVersions[0].id = userResume.id
        userVersions[0].title = userResume.title
      }
      
      state.resumesByUser[userId] = {
        resumeData: userResume,
        versions: userVersions
      }
    }
    
    state.resumeData = state.resumesByUser[userId].resumeData
    state.versions = state.resumesByUser[userId].versions
  },

  getUserResumes(userId) {
    if (!state.resumesByUser || !state.resumesByUser[userId]) {
      this.initForUser(userId)
    }
    return state.resumesByUser[userId]?.versions || []
  },

  getUserResumeData(userId) {
    if (!state.resumesByUser || !state.resumesByUser[userId]) {
      this.initForUser(userId)
    }
    return state.resumesByUser[userId]?.resumeData || null
  },

  incrementPreviewSessions() {
    if (state.previewSessionsCounter === undefined) {
      state.previewSessionsCounter = 42
    }
    state.previewSessionsCounter++
  },

  incrementAIClicks() {
    if (state.aiChecklistClicks === undefined) {
      state.aiChecklistClicks = 18
    }
    state.aiChecklistClicks++
  },

  // Utility
  addActivity(type, text) {
    const id = Date.now()
    state.activities.unshift({
      id,
      type,
      text,
      time: this.formatTodayTime(),
      icon: type
    })
    // Cap at 20 activities
    if (state.activities.length > 20) {
      state.activities.pop()
    }
  },

  formatToday() {
    const d = new Date()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  },

  formatTodayTime() {
    const d = new Date()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let hours = d.getHours()
    const minutes = d.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${hours}:${minutes} ${ampm}`
  }
}
