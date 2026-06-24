<template>
  <div class="main-content container versions-page-layout">
    
    <!-- Left Panel: Versions list -->
    <div class="card versions-list-panel no-print">
      <div class="panel-header-row">
        <h3>My Resume Versions</h3>
        <span class="count-tag">{{ storeState.versions.length }} saved</span>
      </div>

      <!-- Search Box -->
      <div class="search-box-row">
        <input type="text" v-model="searchQuery" class="form-input search-input" placeholder="Search versions..." />
      </div>

      <!-- Scrollable list of version cards -->
      <div class="versions-scroll-list">
        <template v-if="filteredVersions.length > 0">
          <div v-for="ver in filteredVersions" :key="ver.id" class="version-card-row" :class="{ 'selected-border': ver.selected_for_export }" @click="selectVersion(ver.id)">
            
            <div class="ver-card-body">
              <div class="ver-color-icon" :class="'ver-icon-bg-' + ver.template_id">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div class="ver-card-details">
                <div class="ver-card-title">{{ ver.title }}</div>
                <div class="ver-card-subtitle">{{ getTemplateName(ver.template_id) }} • Last edited {{ ver.last_edited }}</div>
                <span v-if="ver.selected_for_export" class="badge-selected-text">Selected for export</span>
              </div>
            </div>

            <div class="ver-card-actions" @click.stop>
              <button @click="renamePrompt(ver)" class="small-action-btn" title="Rename">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              </button>
              <button @click="duplicateVersion(ver.id)" class="small-action-btn" title="Duplicate">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>
              <button @click="deleteVersion(ver.id)" class="small-action-btn danger-hover" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>

          </div>
        </template>
        <div v-else class="no-versions-empty-state">
          <div class="empty-state-small-icon">📂</div>
          <span>No versions created yet.</span>
        </div>
      </div>

      <button @click="createNewVersion" class="btn btn-secondary add-ver-btn">+ New Version</button>
    </div>

    <!-- Right Panel: Export Settings and history logs -->
    <div class="export-settings-main-container no-print">
      
      <!-- Export configuration Card -->
      <div class="card export-settings-panel no-print">
        <div class="settings-header">
          <div class="settings-title-row">
            <h3>Export Settings</h3>
            <span class="active-export-label">Exporting: <strong>{{ activeVersionTitle }}</strong></span>
          </div>
        </div>

        <div class="settings-grid-options">
          <div class="settings-form-options">
            
            <!-- Export format Selection -->
            <div class="form-group-custom">
              <label class="custom-group-label">Export Format</label>
              <div class="options-flex-row">
                <button @click="storeState.exportSettings.format = 'PDF'" class="option-toggle-btn" :class="{ 'active': storeState.exportSettings.format === 'PDF' }">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  PDF
                  <span class="rec-pill">Recommended</span>
                </button>
                <button @click="storeState.exportSettings.format = 'DOCX'" class="option-toggle-btn" :class="{ 'active': storeState.exportSettings.format === 'DOCX' }">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  DOCX
                  <span class="edit-pill">Editable</span>
                </button>
              </div>
            </div>

            <!-- Paper Size Selection -->
            <div class="form-group-custom">
              <label class="custom-group-label">Paper Size</label>
              <div class="options-flex-row">
                <button @click="storeState.exportSettings.paperSize = 'A4'" class="option-toggle-btn" :class="{ 'active': storeState.exportSettings.paperSize === 'A4' }">
                  A4
                  <span class="size-pill">210 × 297mm</span>
                </button>
                <button @click="storeState.exportSettings.paperSize = 'Letter'" class="option-toggle-btn" :class="{ 'active': storeState.exportSettings.paperSize === 'Letter' }">
                  Letter
                  <span class="size-pill">8.5 × 11in</span>
                </button>
              </div>
            </div>

            <!-- Configuration Toggles -->
            <div class="form-group-custom">
              <label class="custom-group-label">Export Options</label>
              <div class="toggles-list">
                <div class="toggle-row">
                  <div>
                    <strong>Include Photo</strong>
                    <p>Add your profile picture to the header</p>
                  </div>
                  <label class="switch">
                    <input type="checkbox" v-model="storeState.exportSettings.includePhoto" />
                    <span class="slider round"></span>
                  </label>
                </div>

                <div class="toggle-row">
                  <div>
                    <strong>Include Contact Info</strong>
                    <p>Show email, phone number, and address</p>
                  </div>
                  <label class="switch">
                    <input type="checkbox" v-model="storeState.exportSettings.includeContactInfo" />
                    <span class="slider round"></span>
                  </label>
                </div>

                <div class="toggle-row">
                  <div>
                    <strong>Hyperlinks Active</strong>
                    <p>Clickable website links inside PDF output</p>
                  </div>
                  <label class="switch">
                    <input type="checkbox" v-model="storeState.exportSettings.hyperlinksActive" />
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
            </div>

          </div>

          <!-- Tiny mockup Preview Panel -->
          <div class="settings-preview-aside">
            <span class="preview-lbl">Preview</span>
            <div class="mini-sheet-wrapper">
              <div class="side-mock-sheet" :class="'mock-bg-' + activeTemplateId">
                <div class="mock-header" :class="'mock-header-style-' + activeTemplateId"></div>
                <div class="mock-body-lines">
                  <div class="mock-line long"></div>
                  <div class="mock-line medium"></div>
                  <div class="mock-line short"></div>
                </div>
              </div>
            </div>
            <div class="mini-sheet-meta">
              <strong>{{ activeVersionTitle }}</strong>
              <span>{{ activeTemplateName }} • {{ storeState.exportSettings.paperSize }}</span>
            </div>
          </div>
        </div>

        <div class="settings-actions">
          <button @click="triggerExport" class="btn btn-primary export-action-btn" :disabled="exporting">
            <span v-if="exporting">Exporting document...</span>
            <span v-else>↓ Export & Download</span>
          </button>
          <button @click="shareLink" class="btn btn-secondary share-action-btn">
            Share Link Instead
          </button>
        </div>
      </div>

      <!-- Export History Log Table -->
      <div class="card history-log-panel no-print">
        <h3 class="widget-title">Export History</h3>
        
        <table class="history-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Date & Time</th>
              <th>Format</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in storeState.exportHistory" :key="item.id">
              <td class="file-name-cell">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="file-icon"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                {{ item.filename }}
              </td>
              <td>{{ item.date }}</td>
              <td>
                <span class="badge" :class="item.format === 'PDF' ? 'badge-pdf' : 'badge-docx'">{{ item.format }}</span>
              </td>
              <td>
                <a href="#" @click.prevent="triggerReDownload(item)" class="action-link">Re-download</a>
              </td>
            </tr>
            <tr v-if="storeState.exportHistory.length === 0">
              <td colspan="4" class="no-history-text">No downloads logged yet. Export a file above!</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- Hidden container for printing only -->
    <div class="print-only-resume-container">
      <ResumePreview />
    </div>

    <!-- Spinner loading Overlay -->
    <div v-if="exporting" class="export-spinner-overlay">
      <div class="spinner-container">
        <div class="spinner-wheel"></div>
        <h4>Generating your Resume Document</h4>
        <p>Formatting blocks and compiling layouts into A4 {{ storeState.exportSettings.format }}...</p>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { store } from '@/services/store'
import ResumePreview from '@/components/resume/ResumePreview.vue'
import { useResume } from '@/composables/useResume'

export default {
  components: {
    ResumePreview
  },
  setup() {
    const storeState = store.state
    const searchQuery = ref('')
    const exporting = ref(false)

    const filteredVersions = computed(() => {
      let list = [...storeState.versions]
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        list = list.filter(v => v.title.toLowerCase().includes(query))
      }
      return list
    })

    const selectedVersion = computed(() => {
      return storeState.versions.find(v => v.selected_for_export) || storeState.versions[0]
    })

    const activeVersionTitle = computed(() => {
      return selectedVersion.value ? selectedVersion.value.title : 'No Resume Selected'
    })

    const activeTemplateId = computed(() => {
      return selectedVersion.value ? selectedVersion.value.template_id : 1
    })

    const activeTemplateName = computed(() => {
      const t = store.templates.find(x => x.id === activeTemplateId.value)
      return t ? t.name : 'Classic White'
    })

    function getTemplateName(id) {
      const t = store.templates.find(x => x.id === id)
      return t ? t.name : 'Classic White'
    }

    function selectVersion(id) {
      store.selectVersionForExport(id)
    }

    async function createNewVersion() {
      const newVer = await store.createNewVersion(`Version #${storeState.versions.length + 1}`)
      store.selectVersionForExport(newVer.id)
    }

    function duplicateVersion(id) {
      store.duplicateVersion(id)
    }

    function deleteVersion(id) {
      if (confirm('Are you sure you want to delete this resume version?')) {
        store.deleteVersion(id)
      }
    }

    function renamePrompt(ver) {
      const title = prompt('Enter new version name:', ver.title)
      if (title && title.trim()) {
        store.renameVersion(ver.id, title.trim())
      }
    }

    function downloadDocx(filename) {
      const resumeElement = document.getElementById('resume-preview')
      if (!resumeElement) {
        alert('Resume preview element not found. Please try again.')
        return
      }

      // Get the HTML content
      const htmlContent = resumeElement.outerHTML
      const { state: resumeState } = useResume()

      // Define styling specifically for Word
      const cssStyles = `
        @page {
          size: A4;
          margin: 20mm 20mm 20mm 20mm;
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 10pt;
          line-height: 1.5;
          color: #333333;
        }
        .resume-preview-wrapper {
          width: 100%;
        }
        .resume-preview-container {
          width: 100%;
        }
        .resume-header {
          background-color: ${resumeState.theme.primaryColor || '#2563eb'};
          color: #ffffff;
          padding: 24px;
          margin-bottom: 24px;
        }
        .header-name {
          font-size: 24pt;
          font-weight: bold;
          margin: 0;
          color: #ffffff;
        }
        .header-title {
          font-size: 14pt;
          margin-top: 5px;
          margin-bottom: 10px;
          color: #ffffff;
          opacity: 0.9;
        }
        .contact-info {
          font-size: 9.5pt;
          margin-top: 10px;
          color: #ffffff;
          opacity: 0.9;
        }
        .contact-info span {
          margin-right: 15px;
        }
        .resume-body {
          padding: 10px 24px;
        }
        .section-title {
          font-size: 13pt;
          font-weight: bold;
          color: ${resumeState.theme.titleColor || '#2563eb'};
          border-bottom: 2px solid ${resumeState.theme.titleColor || '#2563eb'};
          padding-bottom: 4px;
          margin-top: 24px;
          margin-bottom: 12px;
          text-transform: uppercase;
        }
        .resume-item {
          margin-bottom: 16px;
        }
        .item-header {
          font-weight: bold;
          font-size: 10.5pt;
          margin-bottom: 4px;
        }
        .item-subtitle {
          font-style: italic;
          font-weight: 500;
          color: ${resumeState.theme.primaryColor || '#2563eb'};
          margin-bottom: 6px;
        }
        .rich-text-content {
          font-size: 10pt;
          color: #334155;
          margin-top: 4px;
        }
        .skills-list {
          margin-top: 6px;
        }
        .skill-badge {
          display: inline-block;
          background-color: #f1f5f9;
          padding: 4px 8px;
          margin-right: 6px;
          margin-bottom: 6px;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          color: #1e293b;
        }
      `

      // Wrap in complete Word HTML template
      const documentSource = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <title>${activeVersionTitle.value}</title>
          <!--[if gte mso 9]>
          <xml>
            <o:DocumentProperties>
              <o:Author>MaxCV</o:Author>
              <o:Template>Normal</o:Template>
            </o:DocumentProperties>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
              <w:DoNotOptimizeForBrowser/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            ${cssStyles}
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `

      const blob = new Blob(['\ufeff' + documentSource], {
        type: 'application/msword'
      })

      // Trigger download
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    function triggerExport() {
      if (storeState.versions.length === 0) {
        alert('You do not have any resumes to export. Please create one first!')
        return
      }
      exporting.value = true
      
      // Simulate rendering time
      setTimeout(() => {
        exporting.value = false
        const format = storeState.exportSettings.format
        const ext = format === 'DOCX' ? 'doc' : format.toLowerCase()
        const filename = `${activeVersionTitle.value.replace(/\s+/g, '_')}.${ext}`
        
        // Log log record
        store.addExportRecord(filename, format)
        
        // Trigger print or download
        if (format === 'PDF') {
          window.print()
        } else {
          downloadDocx(filename)
        }
      }, 1500)
    }

    function triggerReDownload(item) {
      exporting.value = true
      setTimeout(() => {
        exporting.value = false
        if (item.format === 'PDF') {
          window.print()
        } else {
          let fn = item.filename
          if (fn.endsWith('.docx')) {
            fn = fn.substring(0, fn.length - 5) + '.doc'
          }
          downloadDocx(fn)
        }
      }, 1000)
    }

    function shareLink() {
      if (!selectedVersion.value) {
        alert('You do not have any resumes to share. Please create one first!')
        return
      }
      const dummyLink = `${window.location.origin}/preview/share-${selectedVersion.value.id}`
      navigator.clipboard.writeText(dummyLink).then(() => {
        alert('Resume link copied to clipboard!')
      })
    }

    return {
      storeState,
      searchQuery,
      exporting,
      filteredVersions,
      activeVersionTitle,
      activeTemplateId,
      activeTemplateName,
      getTemplateName,
      selectVersion,
      createNewVersion,
      duplicateVersion,
      deleteVersion,
      renamePrompt,
      triggerExport,
      triggerReDownload,
      shareLink
    }
  }
}
</script>

<style scoped>
.versions-page-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

/* Sidebar versions panel */
.versions-list-panel {
  display: flex;
  flex-direction: column;
  height: max-content;
  max-height: calc(100vh - 120px);
}

.panel-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.panel-header-row h3 {
  font-family: var(--font-brand);
  font-weight: 700;
  font-size: 1.05rem;
}

.count-tag {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-muted);
  background-color: #f1f5f9;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}

.search-box-row {
  margin-bottom: 1rem;
}

.search-input {
  background-color: #f8fafc;
  margin-bottom: 0;
}

.versions-scroll-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  margin-bottom: 1.25rem;
}

.version-card-row {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: white;
  transition: all var(--transition-fast);
}

.version-card-row:hover {
  border-color: #cbd5e1;
  background-color: #f8fafc;
}

.version-card-row.selected-border {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.ver-card-body {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex: 1;
}

.ver-color-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

.ver-icon-bg-1 { background-color: var(--color-primary); }
.ver-icon-bg-2 { background-color: var(--color-text-muted); }
.ver-icon-bg-3 { background-color: #0f172a; }
.ver-icon-bg-4 { background-color: #0d9488; }
.ver-icon-bg-5 { background-color: #16a34a; }
.ver-icon-bg-6 { background-color: #f59e0b; }

.ver-card-details {
  display: flex;
  flex-direction: column;
}

.ver-card-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text-main);
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ver-card-subtitle {
  font-size: 0.68rem;
  color: var(--color-text-muted);
}

.badge-selected-text {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-top: 0.125rem;
}

.ver-card-actions {
  display: flex;
  gap: 0.25rem;
}

.small-action-btn {
  background: white;
  border: 1px solid var(--color-border);
  color: var(--color-text-light);
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.small-action-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.small-action-btn.danger-hover:hover {
  color: var(--color-danger);
  border-color: var(--color-danger);
  background-color: var(--color-danger-light);
}

.add-ver-btn {
  width: 100%;
}

/* Settings main layout */
.export-settings-main-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
}

.settings-title-row h3 {
  font-family: var(--font-brand);
  font-weight: 700;
  font-size: 1.15rem;
}

.active-export-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.settings-grid-options {
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: 2rem;
}

.form-group-custom {
  margin-bottom: 1.5rem;
}

.custom-group-label {
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  margin-bottom: 0.625rem;
  letter-spacing: 0.03em;
}

.options-flex-row {
  display: flex;
  gap: 0.75rem;
}

.option-toggle-btn {
  flex: 1;
  background-color: white;
  border: 1px solid var(--color-border);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.option-toggle-btn.active {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
}

.option-toggle-btn svg {
  color: var(--color-text-muted);
  margin-bottom: 0.125rem;
}

.option-toggle-btn.active svg {
  color: var(--color-primary);
}

.rec-pill, .edit-pill, .size-pill {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.0625rem 0.375rem;
  border-radius: 4px;
}
.rec-pill { background-color: var(--color-primary-light); color: var(--color-primary); }
.edit-pill { background-color: var(--color-success-light); color: var(--color-success); }
.size-pill { background-color: #f1f5f9; color: var(--color-text-muted); }

.toggles-list {
  background-color: #f8fafc;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.25rem 1rem;
}

.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}
.toggle-row:last-child {
  border-bottom: none;
}

.toggle-row strong {
  font-size: 0.85rem;
  color: var(--color-text-main);
  display: block;
}

.toggle-row p {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

/* Toggle Switch rules */
.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 20px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #cbd5e1;
  transition: .15s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .15s;
}
input:checked + .slider {
  background-color: var(--color-primary);
}
input:checked + .slider:before {
  transform: translateX(18px);
}
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}

.settings-preview-aside {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-lbl {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.mini-sheet-wrapper {
  background-color: #f1f5f9;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
}

.mini-sheet-meta {
  text-align: center;
  display: flex;
  flex-direction: column;
}

.mini-sheet-meta strong {
  font-size: 0.8rem;
  color: var(--color-text-main);
}

.mini-sheet-meta span {
  font-size: 0.65rem;
  color: var(--color-text-muted);
}

.settings-actions {
  display: flex;
  gap: 0.75rem;
  border-top: 1px solid var(--color-border);
  padding-top: 1.25rem;
  margin-top: 0.5rem;
}

.export-action-btn {
  flex: 2;
  font-weight: 700;
  font-size: 0.9rem;
}

.share-action-btn {
  flex: 1;
}

/* History logs */
.history-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  text-align: left;
}

.history-table th {
  font-weight: 700;
  color: var(--color-text-muted);
  padding: 0.625rem 0.75rem;
  border-bottom: 2px solid var(--color-border);
}

.history-table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-main);
}

.file-name-cell {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.file-icon {
  color: var(--color-text-muted);
}

.action-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
}
.action-link:hover {
  text-decoration: underline;
}

.no-history-text {
  text-align: center;
  color: var(--color-text-light);
  padding: 1.5rem !important;
  font-style: italic;
}

/* Spinner Modal */
.export-spinner-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(15, 23, 42, 0.6);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-container {
  background-color: white;
  padding: 2.25rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-premium);
  text-align: center;
  max-width: 380px;
}

.spinner-wheel {
  width: 44px;
  height: 44px;
  border: 4px solid var(--color-primary-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  margin: 0 auto 1.25rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-container h4 {
  font-family: var(--font-brand);
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.375rem;
}

.spinner-container p {
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.print-only-resume-container {
  display: none;
}

@media print {
  .versions-page-layout {
    display: block !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
  }
  .print-only-resume-container {
    display: block !important;
    width: 100% !important;
    height: auto !important;
    position: absolute;
    left: 0;
    top: 0;
    margin: 0 !important;
    padding: 0 !important;
  }
}

/* ─── EMPTY STATE FOR VERSIONS ─── */
.no-versions-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-sm);
  background-color: #fafbfc;
  color: var(--color-text-muted);
  text-align: center;
  gap: 0.5rem;
}

.empty-state-small-icon {
  font-size: 1.5rem;
}

.no-versions-empty-state span {
  font-size: 0.775rem;
  font-weight: 600;
}
</style>
