import { reactive, watch } from 'vue'

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

const defaultTemplates = [
  { id: 1, name: 'Modern Blue', description: 'Clean 2-column layout with a bold blue header. Perfect for tech roles and modern companies.', rating: 4.9, uses: '2,300', layout_type: '2-column', is_active: 1, popular: true, tag: 'Modern', atsReady: true },
  { id: 2, name: 'Elegant Classic', description: 'Serif-based single-column template focusing on standard typography and readable margins.', rating: 4.7, uses: '1,800', layout_type: 'single-column', is_active: 1, tag: 'Classic', atsReady: true },
  { id: 3, name: 'Simple Dark', description: 'Modern dark theme design with high-contrast sections and left sidebar layout.', rating: 4.8, uses: '987', layout_type: 'sidebar', is_active: 1, new: true, tag: 'Minimal', atsReady: false },
  { id: 4, name: 'Creative Teal', description: 'Vibrant teal accents and unique timeline layout, perfect for UI/UX and product designers.', rating: 4.9, uses: '1,100', layout_type: '2-column', is_active: 1, tag: 'Creative', atsReady: false },
  { id: 5, name: 'Clean Green', description: 'Minimalist layout accented with soft forest green elements and sans-serif typography.', rating: 4.6, uses: '654', layout_type: 'single-column', is_active: 1, tag: 'Modern', atsReady: true },
  { id: 6, name: 'Warm Amber', description: 'Card-based content grouping with a warm amber palette for business and creative jobs.', rating: 4.5, uses: '432', layout_type: 'card-layout', is_active: 1, tag: 'Creative', atsReady: true }
]

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

function getInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Ensure templates exists in saved state, otherwise seed it
      if (!parsed.templates) {
        parsed.templates = JSON.parse(JSON.stringify(defaultTemplates))
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
    const record = {
      id,
      filename,
      date: this.formatTodayTime(),
      format
    }
    state.exportHistory.unshift(record)
    this.addActivity('export', `Exported ${filename} (${format})`)
  },

  // Template CRUD (Admin)
  createTemplate(tplData) {
    const id = state.templates.length > 0 ? Math.max(...state.templates.map(t => t.id)) + 1 : 1
    const newTpl = {
      id,
      name: tplData.name || 'Untitled Template',
      description: tplData.description || '',
      rating: parseFloat(tplData.rating) || 5.0,
      uses: tplData.uses || '0',
      layout_type: tplData.layout_type || 'single-column',
      is_active: tplData.is_active !== undefined ? tplData.is_active : 1,
      popular: tplData.popular || false,
      new: tplData.new || false,
      tag: tplData.tag || 'Modern',
      atsReady: tplData.atsReady || false
    }
    state.templates.push(newTpl)
    this.addActivity('update', `Created new template: ${newTpl.name}`)
    return newTpl
  },

  updateTemplate(id, tplData) {
    const idx = state.templates.findIndex(t => t.id === id)
    if (idx !== -1) {
      state.templates[idx] = {
        ...state.templates[idx],
        ...tplData,
        rating: parseFloat(tplData.rating) || state.templates[idx].rating
      }
      this.addActivity('update', `Updated template: ${state.templates[idx].name}`)
    }
  },

  deleteTemplate(id) {
    const idx = state.templates.findIndex(t => t.id === id)
    if (idx !== -1) {
      const tpl = state.templates[idx]
      state.templates.splice(idx, 1)
      this.addActivity('update', `Deleted template: ${tpl.name}`)
    }
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
