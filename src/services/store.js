import { reactive, watch } from 'vue'
import auth from '@/services/auth'
import { apiRequest } from '@/services/auth'
import { useResume } from '@/composables/useResume'

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

let isSyncing = false
let autoSaveTimeout = null

function queueAutoSave(resumeId, resumeTitle, templateId, content) {
  // If resumeId is a temporary client-side timestamp, do not auto-save to database
  if (!resumeId || resumeId > 1e11) return
  
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout)
  }
  autoSaveTimeout = setTimeout(async () => {
    try {
      await apiRequest(`/resumes/${resumeId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: resumeTitle,
          selected_template_id: templateId,
          content: content
        })
      })
    } catch (e) {
      console.error('Failed to auto-save resume to database', e)
    }
  }, 1000)
}

function syncEditorToStore(editorState, storeState) {
  if (isSyncing || !editorState || !storeState || !storeState.resumeData) return
  isSyncing = true
  try {
    // 1. Sync personal details
    storeState.resumeData.personal = {
      name: editorState.personal.name || '',
      title: editorState.personal.title || '',
      email: editorState.personal.email || '',
      phone: editorState.personal.phone || '',
      location: editorState.personal.location || '',
      summary: editorState.personal.summary || ''
    }

    // 2. Sync education
    const eduSection = editorState.sections.find(s => s.type === 'education')
    if (eduSection && eduSection.items) {
      storeState.resumeData.education = eduSection.items.map(item => ({
        id: item.id || Date.now(),
        institution: item.school || '',
        qualification: item.degree || '',
        start_date: item.startDate || '',
        end_date: item.endDate || '',
        description: item.description || ''
      }))
    }

    // 3. Sync experience
    const expSection = editorState.sections.find(s => s.type === 'experience')
    if (expSection && expSection.items) {
      storeState.resumeData.experience = expSection.items.map(item => ({
        id: item.id || Date.now(),
        company_name: item.company || '',
        job_title: item.position || '',
        start_date: item.startDate || '',
        end_date: item.endDate || '',
        description: item.description || ''
      }))
    }

    // 4. Sync skills
    const skillsSection = editorState.sections.find(s => s.type === 'skills')
    if (skillsSection && skillsSection.items) {
      storeState.resumeData.skills = skillsSection.items.map((skill, index) => {
        if (typeof skill === 'object') {
          return {
            id: skill.id || index,
            skill_name: skill.skill_name || '',
            skill_level: skill.skill_level || 'Intermediate'
          }
        }
        return {
          id: index,
          skill_name: skill,
          skill_level: 'Intermediate'
        }
      })
    }

    // Update in-memory dbResumesMap cache & queue database auto-save
    const user = auth.getUser()
    if (user && storeState.resumesByUser && storeState.resumesByUser[user.id] && storeState.resumesByUser[user.id].dbResumesMap) {
      storeState.resumesByUser[user.id].dbResumesMap[storeState.resumeData.id] = JSON.parse(JSON.stringify(storeState.resumeData))
      queueAutoSave(storeState.resumeData.id, storeState.resumeData.title, storeState.resumeData.selected_template_id, storeState.resumeData)
    }
  } finally {
    isSyncing = false
  }
}

function syncStoreToEditor(storeState, editorState) {
  if (isSyncing || !storeState || !storeState.resumeData || !editorState) return
  isSyncing = true
  try {
    const data = storeState.resumeData

    // 1. Sync personal details
    editorState.personal.name = data.personal?.name || ''
    editorState.personal.title = data.personal?.title || ''
    editorState.personal.email = data.personal?.email || ''
    editorState.personal.phone = data.personal?.phone || ''
    editorState.personal.location = data.personal?.location || ''
    editorState.personal.summary = data.personal?.summary || ''

    // 2. Sync education items
    const eduSection = editorState.sections.find(s => s.type === 'education')
    if (eduSection) {
      eduSection.items = (data.education || []).map(item => ({
        id: item.id,
        school: item.institution || '',
        degree: item.qualification || '',
        startDate: item.start_date || '',
        endDate: item.end_date || '',
        description: item.description || ''
      }))
    }

    // 3. Sync experience items
    const expSection = editorState.sections.find(s => s.type === 'experience')
    if (expSection) {
      expSection.items = (data.experience || []).map(item => ({
        id: item.id,
        company: item.company_name || '',
        position: item.job_title || '',
        startDate: item.start_date || '',
        endDate: item.end_date || '',
        description: item.description || ''
      }))
    }

    // 4. Sync skills items
    const skillsSection = editorState.sections.find(s => s.type === 'skills')
    if (skillsSection) {
      skillsSection.items = (data.skills || []).map(s => {
        if (typeof s === 'object') {
          return s.skill_name || ''
        }
        return s || ''
      })
    }
  } finally {
    isSyncing = false
  }
}

// Auto-sync editor state changes back to store.state.resumeData
try {
  const { state: editorState } = useResume()
  watch(editorState, (newEditorState) => {
    syncEditorToStore(newEditorState, state)
  }, { deep: true, immediate: true })
} catch (e) {
  console.error('Failed to initialize editor-to-store sync watcher', e)
}

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
    
    // Sync style configuration to useResume theme
    try {
      const { state: resumeState } = useResume()
      const themePreset = template ? {
        primaryColor: template.primary_color || '#2563eb',
        titleColor: template.title_color || '#2563eb',
        fontFamily: template.font_family || 'Inter',
        headingStyle: template.heading_style || 'underline'
      } : { primaryColor: '#2563eb', titleColor: '#2563eb', fontFamily: 'Inter', headingStyle: 'underline' }
      
      if (resumeState && resumeState.theme) {
        resumeState.theme.primaryColor = themePreset.primaryColor
        resumeState.theme.titleColor = themePreset.titleColor
        resumeState.theme.fontFamily = themePreset.fontFamily
        resumeState.theme.headingStyle = themePreset.headingStyle
      }
    } catch (e) {
      console.error('Failed to sync theme with useResume state', e)
    }
  },

  // Version management
  selectVersionForExport(id) {
    state.versions.forEach(v => {
      v.selected_for_export = (v.id === id)
    })
    const ver = state.versions.find(v => v.id === id)
    if (ver) {
      const user = auth.getUser()
      let selectedContent = null
      if (user && state.resumesByUser && state.resumesByUser[user.id] && state.resumesByUser[user.id].dbResumesMap && state.resumesByUser[user.id].dbResumesMap[id]) {
        selectedContent = JSON.parse(JSON.stringify(state.resumesByUser[user.id].dbResumesMap[id]))
      } else {
        selectedContent = JSON.parse(JSON.stringify(defaultResume))
      }

      // Load into active state in-place to preserve reactivity
      for (const key in state.resumeData) {
        delete state.resumeData[key]
      }
      Object.assign(state.resumeData, selectedContent)
      
      state.resumeData.id = ver.id
      state.resumeData.title = ver.title
      state.resumeData.selected_template_id = ver.template_id

      // Sync loaded version to editor state
      try {
        const { state: editorState } = useResume()
        syncStoreToEditor(state, editorState)
      } catch (e) {
        console.error('Failed to sync version resume to editor', e)
      }

      // Sync style configuration to useResume theme for selected version
      try {
        const { state: resumeState } = useResume()
        const template = state.templates.find(t => t.id === ver.template_id)
        const themePreset = template ? {
          primaryColor: template.primary_color || '#2563eb',
          titleColor: template.title_color || '#2563eb',
          fontFamily: template.font_family || 'Inter',
          headingStyle: template.heading_style || 'underline'
        } : { primaryColor: '#2563eb', titleColor: '#2563eb', fontFamily: 'Inter', headingStyle: 'underline' }
        
        if (resumeState && resumeState.theme) {
          resumeState.theme.primaryColor = themePreset.primaryColor
          resumeState.theme.titleColor = themePreset.titleColor
          resumeState.theme.fontFamily = themePreset.fontFamily
          resumeState.theme.headingStyle = themePreset.headingStyle
        }
      } catch (e) {
        console.error('Failed to sync theme with useResume state', e)
      }
    }
  },

  async createNewVersion(title = 'Untitled Resume') {
    const user = auth.getUser()
    if (user) {
      try {
        const defaultContent = JSON.parse(JSON.stringify(defaultResume))
        const payload = await apiRequest(`/users/${user.id}/resumes`, {
          method: 'POST',
          body: JSON.stringify({
            title,
            selected_template_id: 1,
            content: defaultContent
          })
        })
        const r = payload.resume
        const newVer = {
          id: r.id,
          title: r.title,
          template_id: r.selected_template_id || 1,
          last_edited: this.formatToday(new Date(r.updated_at)),
          selected_for_export: false
        }
        state.versions.push(newVer)
        
        // Save in cache
        if (state.resumesByUser && state.resumesByUser[user.id]) {
          state.resumesByUser[user.id].dbResumesMap[r.id] = defaultContent
        }
        
        this.addActivity('duplicate', `Created new version: ${title}`)
        return newVer
      } catch (e) {
        console.error('Failed to create version in database', e)
      }
    }

    // Local fallback
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

  async duplicateVersion(id) {
    const original = state.versions.find(v => v.id === id)
    if (!original) return
    
    const user = auth.getUser()
    let originalContent = null
    if (user && state.resumesByUser && state.resumesByUser[user.id]) {
      if (state.resumeData.id === id) {
        originalContent = JSON.parse(JSON.stringify(state.resumeData))
      } else {
        originalContent = state.resumesByUser[user.id].dbResumesMap[id]
      }
    }
    if (!originalContent) {
      originalContent = JSON.parse(JSON.stringify(defaultResume))
    }

    if (user) {
      try {
        const payload = await apiRequest(`/users/${user.id}/resumes`, {
          method: 'POST',
          body: JSON.stringify({
            title: `${original.title} (Copy)`,
            selected_template_id: original.template_id,
            content: originalContent
          })
        })
        const r = payload.resume
        const duplicate = {
          id: r.id,
          title: r.title,
          template_id: r.selected_template_id || 1,
          last_edited: this.formatToday(new Date(r.updated_at)),
          selected_for_export: false
        }
        state.versions.push(duplicate)
        
        if (state.resumesByUser && state.resumesByUser[user.id]) {
          state.resumesByUser[user.id].dbResumesMap[r.id] = originalContent
        }
        
        this.addActivity('duplicate', `Duplicated ${original.title}`)
        return
      } catch (e) {
        console.error('Failed to duplicate version in database', e)
      }
    }

    // Local fallback
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

  async deleteVersion(id) {
    const idx = state.versions.findIndex(v => v.id === id)
    if (idx !== -1) {
      state.versions.splice(idx, 1)
      
      const user = auth.getUser()
      if (user) {
        try {
          await apiRequest(`/resumes/${id}`, {
            method: 'DELETE'
          })
          if (state.resumesByUser && state.resumesByUser[user.id]) {
            delete state.resumesByUser[user.id].dbResumesMap[id]
          }
        } catch (e) {
          console.error('Failed to delete version from database', e)
        }
      }

      this.addActivity('update', 'Deleted a resume version')
      // Reset if deleted the active one
      if (state.resumeData.id === id) {
        if (state.versions.length > 0) {
          this.selectVersionForExport(state.versions[0].id)
        } else {
          // If no versions left, clear resume data but preserve user details
          const user = auth.getUser()
          state.resumeData.title = 'My First Resume'
          state.resumeData.education = []
          state.resumeData.experience = []
          state.resumeData.skills = []
          state.resumeData.personal = {
            name: user ? user.name : '',
            title: '',
            email: user ? user.email : '',
            phone: '',
            location: '',
            summary: ''
          }
          // Also sync with editor if needed
          try {
            const { state: editorState } = useResume()
            syncStoreToEditor(state, editorState)
          } catch (e) {
            console.error('Failed to sync empty resume to editor', e)
          }
        }
      }
    }
  },

  async renameVersion(id, newTitle) {
    const ver = state.versions.find(v => v.id === id)
    if (ver) {
      const oldTitle = ver.title
      ver.title = newTitle
      ver.last_edited = this.formatToday()
      if (state.resumeData.id === id) {
        state.resumeData.title = newTitle
      }
      
      const user = auth.getUser()
      if (user) {
        try {
          await apiRequest(`/resumes/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              title: newTitle
            })
          })
        } catch (e) {
          console.error('Failed to rename version in database', e)
        }
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
    
    // 1. Instantly perform local memory sync
    this.initForUserLocal(userId)
    
    // 2. Fetch full resume content from backend database asynchronously
    this.loadUserResumes(userId)
  },

  initForUserLocal(userId) {
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
      
      const isPreseeded = [124, 125, 126, 127, 128, 129].includes(Number(userId))
      const userVersions = isPreseeded
        ? JSON.parse(JSON.stringify(defaultVersions))
        : []
      
      if (userVersions.length === 0) {
        userResume.title = 'My First Resume'
        userResume.education = []
        userResume.experience = []
        userResume.skills = []
        userResume.personal.summary = ''
      } else if (userVersions.length > 0) {
        userVersions[0].id = userResume.id
        userVersions[0].title = userResume.title
      }
      
      state.resumesByUser[userId] = {
        resumeData: userResume,
        versions: userVersions,
        dbResumesMap: {}
      }
    }
    
    // Assign references
    state.resumeData = state.resumesByUser[userId].resumeData
    state.versions = state.resumesByUser[userId].versions

    try {
      const { state: editorState } = useResume()
      syncStoreToEditor(state, editorState)
    } catch (e) {
      console.error('Failed to sync loaded user resume to editor', e)
    }
  },

  async loadUserResumes(userId) {
    if (!userId) return
    try {
      const payload = await apiRequest('/resumes')
      const dbResumes = payload.resumes || []
      
      // Map database resumes to versions format
      const versions = dbResumes.map((r, index) => ({
        id: r.id,
        title: r.title,
        template_id: r.selected_template_id || 1,
        last_edited: this.formatToday(new Date(r.updated_at)),
        selected_for_export: r.id === state.resumeData.id || (index === 0 && (state.resumeData.id === undefined || state.resumeData.id > 1e11))
      }))

      // If no resumes in database, create the first one
      if (versions.length === 0) {
        const defaultContent = JSON.parse(JSON.stringify(defaultResume))
        const resPayload = await apiRequest(`/users/${userId}/resumes`, {
          method: 'POST',
          body: JSON.stringify({
            title: 'My First Resume',
            selected_template_id: 1,
            content: defaultContent
          })
        })
        const newRes = resPayload.resume
        versions.push({
          id: newRes.id,
          title: newRes.title,
          template_id: newRes.selected_template_id || 1,
          last_edited: this.formatToday(new Date(newRes.updated_at)),
          selected_for_export: true
        })
        dbResumes.push(newRes)
      }

      let activeVer = versions.find(v => v.selected_for_export)
      if (!activeVer) {
        activeVer = versions[0]
        activeVer.selected_for_export = true
      }

      const activeDbResume = dbResumes.find(r => r.id === activeVer.id)
      let resumeDataContent = activeDbResume && activeDbResume.content
        ? (typeof activeDbResume.content === 'string' ? JSON.parse(activeDbResume.content) : activeDbResume.content)
        : JSON.parse(JSON.stringify(defaultResume))

      resumeDataContent.id = activeVer.id
      resumeDataContent.title = activeVer.title
      resumeDataContent.selected_template_id = activeVer.template_id

      // Update maps
      state.resumesByUser[userId] = {
        resumeData: resumeDataContent,
        versions: versions,
        dbResumesMap: dbResumes.reduce((acc, r) => {
          acc[r.id] = r.content
            ? (typeof r.content === 'string' ? JSON.parse(r.content) : r.content)
            : JSON.parse(JSON.stringify(defaultResume))
          return acc
        }, {})
      }

      // Mutate active state in-place to preserve reactive references
      state.versions.splice(0, state.versions.length, ...versions)
      
      for (const key in state.resumeData) {
        delete state.resumeData[key]
      }
      Object.assign(state.resumeData, resumeDataContent)

      try {
        const { state: editorState } = useResume()
        syncStoreToEditor(state, editorState)
      } catch (e) {
        console.error('Failed to sync loaded user resume to editor', e)
      }
    } catch (e) {
      console.error('Failed to load resumes from database', e)
    }
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
