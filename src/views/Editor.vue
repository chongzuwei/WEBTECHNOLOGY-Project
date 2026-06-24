<template>
  <div class="main-content editor-page-layout">
    
    <!-- Left panel: Form editor -->
    <div class="editor-left-panel no-print">
      
      <!-- Tab Navigation -->
      <div class="editor-tabs">
        <button 
          class="editor-tab" 
          :class="{ active: activeTab === 'content' }" 
          @click="activeTab = 'content'"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Content
        </button>
        <button 
          class="editor-tab" 
          :class="{ active: activeTab === 'customize' }" 
          @click="activeTab = 'customize'"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          Customize
        </button>
      </div>

      <!-- Tab Content -->
      <div class="editor-tab-content">
        
        <!-- Content Tab -->
        <div v-if="activeTab === 'content'" class="tab-panel">
          <!-- Personal Details Section -->
          <div class="panel-section">
            <div class="panel-section-header" @click="showPersonal = !showPersonal">
              <div class="panel-section-title">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <h3>Personal Details</h3>
              </div>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="chevron" :class="{ 'rotated': showPersonal }"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <div v-show="showPersonal" class="panel-section-content">
              <PersonalForm />
            </div>
          </div>

          <!-- Dynamic Sections -->
          <SectionList />
        </div>

        <!-- Customize Tab -->
        <div v-if="activeTab === 'customize'" class="tab-panel">
          <CustomizeForm />
        </div>

      </div>
    </div>

    <!-- Right panel: Live preview -->
    <div class="editor-right-panel">
      
      <!-- Preview Header Bar -->
      <div class="preview-settings-bar no-print">
        <div class="settings-left">
          <span class="bar-lbl">Live Preview</span>
        </div>
        <div class="zoom-controls">
          <span class="bar-lbl">Zoom:</span>
          <button @click="zoomOut" class="btn-zoom-act">-</button>
          <span class="zoom-val">{{ zoomLevel }}%</span>
          <button @click="zoomIn" class="btn-zoom-act">+</button>
        </div>
      </div>

      <!-- Scrollable Resume viewport -->
      <div class="resume-viewport">
        <div class="resume-print-wrapper" :style="`transform: scale(${zoomLevel / 100}); transform-origin: top center;`">
          <ResumePreview />
        </div>
      </div>

      <!-- Action buttons under Live preview -->
      <div class="preview-bottom-actions no-print">
        <button @click="triggerPrint" class="btn btn-primary flex-grow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Export PDF
        </button>
        <button @click="triggerDocxDownload" class="btn btn-success flex-grow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Export DOCX
        </button>
        <button @click="shareLink" class="btn btn-secondary">
          Share Link
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { store } from '@/services/store'
import { useResume } from '@/composables/useResume'
import PersonalForm from '@/components/resume/PersonalForm.vue'
import SectionList from '@/components/resume/SectionList.vue'
import CustomizeForm from '@/components/resume/CustomizeForm.vue'
import ResumePreview from '@/components/resume/ResumePreview.vue'

export default {
  components: {
    PersonalForm,
    SectionList,
    CustomizeForm,
    ResumePreview
  },
  setup() {
    const { state: resumeState } = useResume()
    const activeTab = ref('content')
    const showPersonal = ref(true)
    const zoomLevel = ref(70)

    // Zoom Handlers
    function zoomIn() {
      if (zoomLevel.value < 120) {
        zoomLevel.value += 10
      }
    }
    function zoomOut() {
      if (zoomLevel.value > 30) {
        zoomLevel.value -= 10
      }
    }

    function triggerPrint() {
      window.print()
      store.addExportRecord(`${resumeState.personal.name || 'Resume'}.pdf`, 'PDF')
    }

    function triggerDocxDownload() {
      const resumeElement = document.getElementById('resume-preview')
      if (!resumeElement) {
        alert('Resume preview element not found. Please try again.')
        return
      }

      const name = resumeState.personal.name || 'Resume'
      const filename = `${name.replace(/\s+/g, '_')}.doc`

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
          <title>${name}</title>
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
          ${resumeElement.outerHTML}
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

      // Add to export history in global store
      store.addExportRecord(filename, 'DOCX')
    }

    function shareLink() {
      const dummyLink = `${window.location.origin}/preview/share-${Date.now()}`
      navigator.clipboard.writeText(dummyLink).then(() => {
        alert('Resume link copied to clipboard!')
      }).catch(() => {
        alert(`Share link created: ${dummyLink}`)
      })
    }

    onMounted(() => {
      store.incrementPreviewSessions()
      if (store.state.versions.length === 0) {
        const newVer = store.createNewVersion('My First Resume')
        store.selectVersionForExport(newVer.id)
      }
    })

    return {
      activeTab,
      showPersonal,
      zoomLevel,
      zoomIn,
      zoomOut,
      triggerPrint,
      triggerDocxDownload,
      shareLink
    }
  }
}
</script>

<style scoped>
/* ─── MAIN EDITOR LAYOUT ─── */
.editor-page-layout {
  display: flex;
  gap: 0;
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.editor-left-panel {
  width: 480px;
  min-width: 420px;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  border-right: 1px solid var(--border-color, #e2e8f0);
  overflow: hidden;
}

.editor-right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #e2e8f0;
  overflow: hidden;
}

/* ─── TAB NAVIGATION ─── */
.editor-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color, #e2e8f0);
  background-color: white;
  flex-shrink: 0;
}

.editor-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 0.95rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.editor-tab:hover {
  color: #334155;
  background-color: #f1f5f9;
}

.editor-tab.active {
  color: var(--primary-color, #4f46e5);
  border-bottom-color: var(--primary-color, #4f46e5);
  background-color: white;
}

.editor-tab svg {
  flex-shrink: 0;
}

/* ─── TAB CONTENT ─── */
.editor-tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.tab-panel {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ─── PERSONAL DETAILS ACCORDION ─── */
.panel-section {
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 12px;
  background-color: white;
  overflow: hidden;
}

.panel-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  cursor: pointer;
  background-color: #f8fafc;
  transition: background-color 0.2s;
}

.panel-section-header:hover {
  background-color: #f1f5f9;
}

.panel-section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.panel-section-title h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary, #0f172a);
}

.panel-section-content {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color, #e2e8f0);
}

.chevron {
  color: #64748b;
  transition: transform 0.3s ease;
}

.chevron.rotated {
  transform: rotate(180deg);
}

/* ─── PREVIEW PANEL ─── */
.preview-settings-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 1rem;
  background: white;
  border-bottom: 1px solid var(--border-color, #e2e8f0);
  flex-shrink: 0;
}

.settings-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bar-lbl {
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.btn-zoom-act {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: white;
  color: #334155;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.btn-zoom-act:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.zoom-val {
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
  color: #334155;
}

/* ─── RESUME VIEWPORT ─── */
.resume-viewport {
  flex: 1;
  overflow: auto;
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.resume-print-wrapper {
  transition: transform 0.2s ease;
}

/* ─── BOTTOM ACTIONS ─── */
.preview-bottom-actions {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border-color, #e2e8f0);
  background: white;
  flex-shrink: 0;
}

.btn {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color, #4f46e5), #7c3aed);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.btn-success:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-secondary {
  background: white;
  color: #334155;
  border: 1px solid #cbd5e1;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.flex-grow {
  flex: 1;
}

/* ─── PRINT STYLES ─── */
@media print {
  .no-print {
    display: none !important;
  }
  .editor-page-layout {
    display: block !important;
    position: static !important;
    height: auto !important;
    overflow: visible !important;
  }
  .editor-right-panel {
    display: block !important;
    position: static !important;
    overflow: visible !important;
    background: none !important;
    width: 100% !important;
    height: auto !important;
  }
  .resume-viewport {
    padding: 0 !important;
    overflow: visible !important;
    display: block !important;
    width: 100% !important;
    height: auto !important;
  }
  .resume-print-wrapper {
    transform: none !important; /* Reset zoom scaling for real A4 printing size */
    width: 100% !important;
    height: auto !important;
  }
}

/* ─── RESPONSIVE ─── */
@media (max-width: 1024px) {
  .editor-left-panel {
    width: 380px;
    min-width: 340px;
  }
}

@media (max-width: 768px) {
  .editor-page-layout {
    flex-direction: column;
    height: auto;
  }
  .editor-left-panel {
    width: 100%;
    min-width: unset;
    max-height: 50vh;
    border-right: none;
    border-bottom: 1px solid var(--border-color, #e2e8f0);
  }
  .editor-right-panel {
    min-height: 50vh;
  }
}
</style>
