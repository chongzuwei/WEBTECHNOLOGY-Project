<template>
  <div class="main-content container dashboard-grid">
    
    <!-- Left Navigation Sidebar -->
    <aside class="sidebar-panel no-print">
      <div class="sidebar-section">
        <span class="sidebar-section-title">MAIN</span>
        <router-link to="/" class="sidebar-link active">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          Dashboard
        </router-link>
        <router-link to="/editor" class="sidebar-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          My Resumes
        </router-link>
        <router-link to="/templates" class="sidebar-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          Templates
        </router-link>
        <router-link to="/versions" class="sidebar-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Export
        </router-link>
      </div>

      <div class="sidebar-section">
        <span class="sidebar-section-title">INSIGHTS</span>
        <router-link to="/insights" class="sidebar-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          ATS Score
        </router-link>
        <router-link to="/insights" class="sidebar-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
          Activity
        </router-link>
      </div>
    </aside>

    <!-- Main Dashboard Section -->
    <div class="dashboard-body">
      
      <!-- Welcome/Progress Banner -->
      <div class="welcome-banner">
        <div class="banner-content">
          <h2>Good morning, {{ userName }}! 🌟</h2>
          <p>Your resume is {{ completionPercentage }}% complete. Keep going to land your dream job!</p>
        </div>
        <router-link to="/editor" class="btn btn-banner">
          Continue Editing
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </router-link>
      </div>

      <!-- Top Widgets Column Grid -->
      <div class="dashboard-main-grid">
        
        <!-- Widget 1: Resume Progress Checklist -->
        <div class="card widget-card">
          <h3 class="widget-title">Resume Progress</h3>
          <div class="progress-container">
            <div class="ats-wheel" :style="`background: conic-gradient(var(--color-primary) 0% ${completionPercentage}%, #e2e8f0 ${completionPercentage}% 100%)`">
              <div class="ats-wheel-inner">
                <span class="progress-val">{{ completionPercentage }}%</span>
              </div>
            </div>
            <ul class="progress-checklist">
              <li :class="{ completed: hasPersonal }">
                <span class="check-icon">✓</span> Personal Info
              </li>
              <li :class="{ completed: hasEducation }">
                <span class="check-icon">✓</span> Education
              </li>
              <li :class="{ completed: hasExperience }">
                <span class="check-icon">✓</span> Work Experience
              </li>
              <li :class="{ completed: hasSkills }">
                <span class="check-icon">✓</span> Skills & Certs
              </li>
            </ul>
          </div>
        </div>

        <!-- Widget 2: Saved Resumes list -->
        <div class="card widget-card resumes-list-card">
          <div class="widget-header-row">
            <h3 class="widget-title">My Resumes</h3>
            <button @click="createNewResume" class="btn-small-new">+ New</button>
          </div>
          
          <div class="resumes-list">
            <div v-for="ver in storeState.versions" :key="ver.id" class="resume-item-row" :class="{ 'selected-border': ver.selected_for_export }">
              <div class="resume-item-details" @click="editResume(ver.id)">
                <div class="resume-file-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div>
                  <div class="resume-item-title">{{ ver.title }}</div>
                  <div class="resume-item-subtitle">{{ getTemplateName(ver.template_id) }} • {{ ver.last_edited }}</div>
                </div>
              </div>
              
              <div class="resume-item-actions">
                <button @click="renamePrompt(ver)" class="action-btn" title="Rename">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </button>
                <button @click="duplicateResume(ver.id)" class="action-btn" title="Duplicate">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                </button>
                <button @click="deleteResume(ver.id)" class="action-btn delete-btn" title="Delete">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Widget 3: Quick Actions & ATS gauge -->
        <div class="quick-actions-column">
          <!-- Quick actions Card -->
          <div class="card widget-card quick-actions-card">
            <h3 class="widget-title">Quick Actions</h3>
            <div class="quick-actions-list">
              <button @click="createNewResume" class="quick-action-item">
                <span class="action-icon blue-bg">+</span>
                New Resume
              </button>
              <router-link to="/templates" class="quick-action-item">
                <span class="action-icon green-bg">🎨</span>
                Browse Templates
              </router-link>
              <router-link to="/versions" class="quick-action-item">
                <span class="action-icon orange-bg">↓</span>
                Export Resume
              </router-link>
            </div>
          </div>

          <!-- ATS Score Gauge -->
          <div class="card widget-card ats-score-card">
            <div class="ats-gauge-header">
              <h3 class="widget-title">ATS Score</h3>
              <span class="ats-score-badge">78</span>
            </div>
            <div class="ats-slider-container">
              <div class="ats-slider-bar">
                <div class="ats-slider-progress" style="width: 78%"></div>
              </div>
              <div class="ats-slider-label">Good • Add keywords to improve</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Activity and Stats Grid -->
      <div class="dashboard-bottom-grid">
        
        <!-- Activity Log Card -->
        <div class="card bottom-card">
          <h3 class="widget-title">Recent Activity</h3>
          <div class="activity-timeline">
            <div v-for="act in storeState.activities.slice(0, 4)" :key="act.id" class="activity-timeline-item">
              <div class="activity-icon-container" :class="act.type">
                <span v-if="act.type === 'export'">↓</span>
                <span v-else-if="act.type === 'template'">🎨</span>
                <span v-else-if="act.type === 'update'">✎</span>
                <span v-else>⎘</span>
              </div>
              <div class="activity-timeline-details">
                <div class="activity-text">{{ act.text }}</div>
                <div class="activity-time">{{ act.time }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Template usage + Counter Stats Card -->
        <div class="card bottom-card template-stats-card">
          <h3 class="widget-title">Template Usage Stats</h3>
          <div class="template-stats-list">
            <div class="template-stat-row">
              <div class="template-stat-info">
                <span>Modern Blue</span>
                <span>45%</span>
              </div>
              <div class="stat-progress-bar"><div class="stat-progress-fill" style="width: 45%; background-color: var(--color-primary)"></div></div>
            </div>
            <div class="template-stat-row">
              <div class="template-stat-info">
                <span>Classic White</span>
                <span>30%</span>
              </div>
              <div class="stat-progress-bar"><div class="stat-progress-fill" style="width: 30%; background-color: var(--color-success)"></div></div>
            </div>
            <div class="template-stat-row">
              <div class="template-stat-info">
                <span>Simple Dark</span>
                <span>15%</span>
              </div>
              <div class="stat-progress-bar"><div class="stat-progress-fill" style="width: 15%; background-color: #6366f1"></div></div>
            </div>
            <div class="template-stat-row">
              <div class="template-stat-info">
                <span>Creative Teal</span>
                <span>10%</span>
              </div>
              <div class="stat-progress-bar"><div class="stat-progress-fill" style="width: 10%; background-color: #0d9488"></div></div>
            </div>
          </div>

          <!-- Horizontal mini-counters -->
          <div class="mini-metrics-row">
            <div class="metric-block">
              <span class="metric-val">{{ storeState.versions.length }}</span>
              <span class="metric-lbl">Resumes</span>
            </div>
            <div class="metric-block">
              <span class="metric-val">{{ storeState.exportHistory.length }}</span>
              <span class="metric-lbl">Exports</span>
            </div>
            <div class="metric-block">
              <span class="metric-val">78</span>
              <span class="metric-lbl">ATS Score</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/services/store'
import auth from '@/services/auth'

export default {
  setup() {
    const router = useRouter()
    const storeState = store.state

    const userName = computed(() => {
      const user = auth.getUser()
      return user ? user.name : 'Guest'
    })

    const hasPersonal = computed(() => !!storeState.resumeData.personal.name)
    const hasEducation = computed(() => storeState.resumeData.education.length > 0)
    const hasExperience = computed(() => storeState.resumeData.experience.length > 0)
    const hasSkills = computed(() => storeState.resumeData.skills.length > 0)

    const completionPercentage = computed(() => {
      let score = 0
      if (hasPersonal.value) score += 25
      if (hasEducation.value) score += 25
      if (hasExperience.value) score += 25
      if (hasSkills.value) score += 25
      return score
    })

    function getTemplateName(id) {
      const t = store.templates.find(x => x.id === id)
      return t ? t.name : 'Classic White'
    }

    function editResume(versionId) {
      store.selectVersionForExport(versionId)
      router.push('/editor')
    }

    function createNewResume() {
      const newVer = store.createNewVersion(`Resume #${storeState.versions.length + 1}`)
      store.selectVersionForExport(newVer.id)
      router.push('/editor')
    }

    function duplicateResume(id) {
      store.duplicateVersion(id)
    }

    function deleteResume(id) {
      if (storeState.versions.length <= 1) {
        alert('You must keep at least one resume version.')
        return
      }
      if (confirm('Are you sure you want to delete this resume version?')) {
        store.deleteVersion(id)
      }
    }

    function renamePrompt(ver) {
      const newTitle = prompt('Enter new name for your resume:', ver.title)
      if (newTitle && newTitle.trim()) {
        store.renameVersion(ver.id, newTitle.trim())
      }
    }

    return {
      storeState,
      userName,
      hasPersonal,
      hasEducation,
      hasExperience,
      hasSkills,
      completionPercentage,
      getTemplateName,
      editResume,
      createNewResume,
      duplicateResume,
      deleteResume,
      renamePrompt
    }
  }
}
</script>

<style scoped>
/* Grid settings */
.dashboard-grid {
  margin-top: 1.5rem;
}

.sidebar-panel {
  background-color: white;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: max-content;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.sidebar-section-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-text-light);
  letter-spacing: 0.1em;
  padding-left: 0.75rem;
  margin-bottom: 0.25rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.sidebar-link:hover {
  background-color: #f8fafc;
  color: var(--color-primary);
}

.sidebar-link.active {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.dashboard-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Welcome Banner card */
.welcome-banner {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: var(--radius-md);
  color: white;
  padding: 1.75rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-md);
}

.banner-content h2 {
  font-family: var(--font-brand);
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 0.375rem;
}

.banner-content p {
  opacity: 0.9;
  font-size: 0.875rem;
}

.btn-banner {
  background-color: white;
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  padding: 0.625rem 1.25rem;
  font-weight: 700;
  font-size: 0.85rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: transform var(--transition-fast);
}
.btn-banner:hover {
  background-color: #f8fafc;
  transform: translateX(3px);
}

/* Widgets general */
.widget-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
}

.widget-title {
  font-family: var(--font-brand);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text-main);
  margin-bottom: 1.25rem;
}

.widget-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.widget-header-row .widget-title {
  margin-bottom: 0;
}

.btn-small-new {
  border: none;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
  transition: background var(--transition-fast);
}
.btn-small-new:hover {
  background-color: #dbeafe;
}

/* Progress indicator */
.progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.progress-val {
  font-size: 1.6rem;
  font-weight: 800;
  font-family: var(--font-brand);
  color: var(--color-primary);
}

.progress-checklist {
  list-style: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-checklist li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.progress-checklist li.completed {
  color: var(--color-text-main);
}

.progress-checklist li .check-icon {
  width: 16px;
  height: 16px;
  background-color: #cbd5e1;
  color: white;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 800;
}

.progress-checklist li.completed .check-icon {
  background-color: var(--color-success);
}

/* Resumes List */
.resumes-list-card {
  background-color: var(--color-bg-card);
}

.resumes-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.resume-item-row {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all var(--transition-fast);
}

.resume-item-row:hover {
  border-color: #cbd5e1;
  background-color: #f8fafc;
}

.resume-item-row.selected-border {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.resume-item-details {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
  flex: 1;
}

.resume-file-icon {
  width: 32px;
  height: 32px;
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.resume-item-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.resume-item-subtitle {
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

.resume-item-actions {
  display: flex;
  gap: 0.375rem;
}

.action-btn {
  background: white;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.action-btn.delete-btn:hover {
  color: var(--color-danger);
  border-color: var(--color-danger);
  background-color: var(--color-danger-light);
}

/* Quick Actions Column */
.quick-actions-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.quick-actions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quick-action-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #f8fafc;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.625rem 0.875rem;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-text-main);
  text-align: left;
  cursor: pointer;
  width: 100%;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.quick-action-item:hover {
  border-color: #cbd5e1;
  background-color: white;
  transform: translateY(-1px);
}

.action-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}
.action-icon.blue-bg { background-color: var(--color-primary-light); color: var(--color-primary); }
.action-icon.green-bg { background-color: var(--color-success-light); color: var(--color-success); }
.action-icon.orange-bg { background-color: var(--color-warning-light); color: var(--color-warning); }

/* ATS Score Widget */
.ats-score-card {
  padding: 1rem 1.25rem;
}
.ats-gauge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.ats-gauge-header .widget-title {
  margin-bottom: 0;
}
.ats-score-badge {
  font-size: 1.25rem;
  font-weight: 800;
  font-family: var(--font-brand);
  color: var(--color-primary);
}
.ats-slider-bar {
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.375rem;
}
.ats-slider-progress {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b 0%, #10b981 100%);
  border-radius: 4px;
}
.ats-slider-label {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  font-weight: 550;
}

/* Bottom elements styles */
.bottom-card {
  min-height: 260px;
}

/* Activity logs */
.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-timeline-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.activity-icon-container {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  flex-shrink: 0;
}
.activity-icon-container.export { background-color: var(--color-primary-light); color: var(--color-primary); }
.activity-icon-container.template { background-color: var(--color-success-light); color: var(--color-success); }
.activity-icon-container.update { background-color: var(--color-warning-light); color: var(--color-warning); }
.activity-icon-container.duplicate { background-color: #e0e7ff; color: #4f46e5; }

.activity-text {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.activity-time {
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

/* Template stats styles */
.template-stats-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.template-stats-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-bottom: 1.25rem;
}

.template-stat-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.template-stat-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.stat-progress-bar {
  height: 4px;
  background-color: #f1f5f9;
  border-radius: 2px;
}

.stat-progress-fill {
  height: 100%;
  border-radius: 2px;
}

/* Metrics counters block */
.mini-metrics-row {
  display: flex;
  justify-content: space-between;
  background-color: #f8fafc;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.625rem;
}

.metric-block {
  flex: 1;
  text-align: center;
  border-right: 1px solid var(--color-border);
}
.metric-block:last-child {
  border-right: none;
}

.metric-val {
  display: block;
  font-size: 1.125rem;
  font-weight: 800;
  font-family: var(--font-brand);
  color: var(--color-primary);
}

.metric-lbl {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
}
</style>
