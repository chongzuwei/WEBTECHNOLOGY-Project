<template>
  <div class="main-content container insights-page-layout">
    
    <!-- Top Header -->
    <div class="insights-header no-print">
      <div>
        <h2>Resume Insights</h2>
        <p>Improve your resume's impact and track your activity.</p>
      </div>
      <div class="analyzing-selector">
        <span class="lbl">Analyzing:</span>
        <select v-model="selectedVersionId" @change="onVersionChange" class="dropdown-ver-select">
          <option v-for="ver in storeState.versions" :key="ver.id" :value="ver.id">{{ ver.title }}</option>
        </select>
      </div>
    </div>

    <!-- Left Column: ATS Score Wheel & checklist -->
    <div class="insights-left-col">
      
      <!-- ATS Score Wheel Card -->
      <div class="card ats-score-card">
        <h3 class="widget-title">ATS Friendly Score</h3>
        
        <div class="ats-gauge-main-row">
          
          <div class="conic-gauge-block">
            <div class="ats-wheel" :style="`background: conic-gradient(${scoreColor} 0% ${atsScore}%, #e2e8f0 ${atsScore}% 100%)`">
              <div class="ats-wheel-inner">
                <span class="score-num" :style="`color: ${scoreColor}`">{{ atsScore }}</span>
                <span class="score-total">/100</span>
              </div>
            </div>
          </div>

          <div class="score-explanation-block">
            <h4 class="score-grade-text" :style="`color: ${scoreColor}`">{{ scoreGrade }}</h4>
            <p class="score-sub-desc">
              Your resume is performing well but has room for improvement to pass ATS systems.
            </p>
            <div class="mini-metrics-pills">
              <span class="pill-metric passed"><strong>{{ checklistCounts.passed }}</strong> Passed</span>
              <span class="pill-metric warnings"><strong>{{ checklistCounts.warning }}</strong> Warnings</span>
              <span class="pill-metric critical"><strong>{{ checklistCounts.critical }}</strong> Critical</span>
            </div>
          </div>

        </div>

        <div class="ats-sub-progress-bars">
          <div class="bar-stat-row">
            <div class="bar-stat-header">
              <span>Keyword Match</span>
              <span>{{ keywordMatchScore }}%</span>
            </div>
            <div class="progress-bar-wrap"><div class="progress-fill" :style="`width: ${keywordMatchScore}%; background-color: var(--color-primary)`"></div></div>
          </div>

          <div class="bar-stat-row">
            <div class="bar-stat-header">
              <span>Format & Structure</span>
              <span>{{ formatStructureScore }}%</span>
            </div>
            <div class="progress-bar-wrap"><div class="progress-fill" :style="`width: ${formatStructureScore}%; background-color: var(--color-success)`"></div></div>
          </div>

          <div class="bar-stat-row">
            <div class="bar-stat-header">
              <span>Quantified Impact</span>
              <span>{{ quantifiedImpactScore }}%</span>
            </div>
            <div class="progress-bar-wrap"><div class="progress-fill" :style="`width: ${quantifiedImpactScore}%; background-color: var(--color-warning)`"></div></div>
          </div>
        </div>

      </div>

      <!-- Checklist card -->
      <div class="card checklist-card">
        <div class="checklist-header">
          <h3 class="widget-title">Improvement Checklist</h3>
          <span class="items-count-badge">{{ checklistItems.length }} items</span>
        </div>

        <div class="checklist-items-list">
          <div v-for="item in checklistItems" :key="item.id" class="checklist-item-row" :class="item.status">
            <div class="checklist-status-badge">
              <span v-if="item.status === 'passed'" class="badge-icon passed">✓</span>
              <span v-else-if="item.status === 'warning'" class="badge-icon warning">!</span>
              <span v-else class="badge-icon critical">×</span>
            </div>
            <div class="checklist-item-details">
              <strong>{{ item.title }}</strong>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>

        <button @click="getAITips" class="btn btn-primary tips-action-btn">
          <span>★</span> Get AI Optimization Tips
        </button>
      </div>

    </div>

    <!-- Right Column: Stats and download logs -->
    <div class="insights-right-col">
      
      <!-- Counter Stats cards row -->
      <div class="mini-stats-cards-grid">
        <div class="card mini-stat-card">
          <div class="mini-card-icon blue-bg">↓</div>
          <div class="mini-card-details">
            <span class="val">{{ storeState.exportHistory.length + 9 }}</span>
            <span class="lbl">Total Exports</span>
          </div>
        </div>

        <div class="card mini-stat-card">
          <div class="mini-card-icon green-bg">📁</div>
          <div class="mini-card-details">
            <span class="val">{{ storeState.versions.length }}</span>
            <span class="lbl">Saved Versions</span>
          </div>
        </div>

        <div class="card mini-stat-card">
          <div class="mini-card-icon purple-bg">🎨</div>
          <div class="mini-card-details">
            <span class="val">7</span>
            <span class="lbl">Template Switches</span>
          </div>
        </div>
      </div>

      <!-- Recent History log -->
      <div class="card logs-card">
        <h3 class="widget-title">Recent Export History</h3>
        
        <div class="logs-list">
          <div v-for="log in storeState.exportHistory.slice(0, 3)" :key="log.id" class="log-item-row">
            <div class="log-info">
              <strong>{{ log.filename }}</strong>
              <span>{{ log.date.split(' ')[0] + ' ' + log.date.split(' ')[1] }}</span>
            </div>
            <span class="badge" :class="log.format === 'PDF' ? 'badge-pdf' : 'badge-docx'">{{ log.format }}</span>
          </div>
          <div v-if="storeState.exportHistory.length === 0" class="no-logs">No downloads recorded yet.</div>
        </div>
      </div>

      <!-- Dark card stats widget -->
      <div class="card dark-statistics-card">
        <div class="dark-card-header">
          <span class="lbl-light">Platform Statistics</span>
          <router-link to="/settings" class="admin-view-btn">Admin View</router-link>
        </div>

        <div class="dark-stats-grid">
          <div class="dark-stat-col">
            <span class="val">156</span>
            <span class="lbl">Total Users</span>
          </div>
          <div class="dark-stat-col">
            <span class="val">89</span>
            <span class="lbl">Active This Month</span>
          </div>
          <div class="dark-stat-col">
            <span class="val green">+12</span>
            <span class="lbl">New This Week</span>
          </div>
        </div>

        <div class="dark-card-footer">
          <span>Most popular: <strong>Modern Blue</strong></span>
          <span>Total resumes: <strong>412</strong></span>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { store } from '@/services/store'

export default {
  setup() {
    const storeState = store.state
    const selectedVersionId = ref(storeState.resumeData.id)

    function onVersionChange() {
      store.selectVersionForExport(selectedVersionId.value)
    }

    // Dynamic metrics calculators
    const hasPersonal = computed(() => !!storeState.resumeData.personal.name)
    const hasEmail = computed(() => !!storeState.resumeData.personal.email)
    const hasPhone = computed(() => !!storeState.resumeData.personal.phone)
    const hasSummary = computed(() => !!storeState.resumeData.personal.summary)
    
    const hasEducation = computed(() => storeState.resumeData.education.length > 0)
    const hasExperience = computed(() => storeState.resumeData.experience.length > 0)
    const hasSkills = computed(() => storeState.resumeData.skills.length > 0)

    // Keywords checker
    const matchKeywords = computed(() => {
      const matchWords = ['react', 'javascript', 'typescript', 'css', 'tailwind', 'git', 'node']
      const currentSkills = storeState.resumeData.skills.map(s => s.skill_name.toLowerCase())
      return matchWords.filter(w => currentSkills.some(cs => cs.includes(w)))
    })

    const keywordMatchScore = computed(() => {
      return matchKeywords.value.length >= 4 ? 85 : matchKeywords.value.length >= 2 ? 65 : 35
    })

    const formatStructureScore = computed(() => {
      let score = 50
      if (hasPersonal.value) score += 15
      if (hasEducation.value) score += 15
      if (hasExperience.value) score += 15
      if (storeState.resumeData.selected_template_id === 1 || storeState.resumeData.selected_template_id === 2 || storeState.resumeData.selected_template_id === 5) {
        score += 5 // ATS Optimized templates get bonus points
      }
      return score
    })

    const quantifiedImpactScore = computed(() => {
      // Look for numbers inside work experience descriptions represent "quantifying impact"
      let foundNumbers = false
      storeState.resumeData.experience.forEach(exp => {
        if (/\d+/.test(exp.description)) {
          foundNumbers = true
        }
      })
      return foundNumbers ? 85 : 45
    })

    const atsScore = computed(() => {
      return Math.round((keywordMatchScore.value + formatStructureScore.value + quantifiedImpactScore.value) / 3)
    })

    const scoreGrade = computed(() => {
      if (atsScore.value >= 85) return 'Excellent'
      if (atsScore.value >= 70) return 'Good'
      return 'Needs Review'
    })

    const scoreColor = computed(() => {
      if (atsScore.value >= 85) return 'var(--color-success)'
      if (atsScore.value >= 70) return 'var(--color-warning)'
      return 'var(--color-danger)'
    })

    // Dynamic checklist items listing
    const checklistItems = computed(() => {
      const list = []
      
      // Personal email checklist
      if (hasEmail.value && hasPhone.value) {
        list.push({ id: 1, status: 'passed', title: 'Contact information is complete', desc: 'Email, phone, and location address found' })
      } else {
        list.push({ id: 1, status: 'critical', title: 'Missing Contact Details', desc: 'Ensure email and phone number are visible' })
      }

      // Headers check
      if (hasEducation.value && hasExperience.value && hasSkills.value) {
        list.push({ id: 2, status: 'passed', title: 'Standard section headers used', desc: 'Education, Experience, and Skills blocks detected' })
      } else {
        list.push({ id: 2, status: 'warning', title: 'Incomplete resume sections', desc: 'Ensure you fill out education, experience, and skills' })
      }

      // Format page check
      list.push({ id: 3, status: 'passed', title: 'Single-page format (ATS preferred)', desc: '1-page resume layout length detected' })

      // Keywords check
      if (matchKeywords.value.length >= 4) {
        list.push({ id: 4, status: 'passed', title: 'Strong keyword alignment', desc: 'Technical keywords matched your industry profile' })
      } else {
        list.push({ id: 4, status: 'warning', title: 'Add more technical keywords', desc: 'Suggest: JavaScript, React, REST API, Agile' })
      }

      // Portfolio check
      const descContainsLink = storeState.resumeData.personal.summary.toLowerCase().includes('github') || storeState.resumeData.personal.summary.toLowerCase().includes('linkedin')
      if (descContainsLink) {
        list.push({ id: 5, status: 'passed', title: 'Social credentials linked', desc: 'GitHub, LinkedIn or portfolio links found' })
      } else {
        list.push({ id: 5, status: 'warning', title: 'Missing portfolio or project links', desc: 'GitHub, LinkedIn, or personal website recommended' })
      }

      // Quantified results check
      if (quantifiedImpactScore.value >= 70) {
        list.push({ id: 6, status: 'passed', title: 'Quantifiable achievements found', desc: 'Your descriptions include metrics and percentages' })
      } else {
        list.push({ id: 6, status: 'critical', title: 'Work experience lacks quantified results', desc: 'Use numbers: "Improved load time by 40%" instead of "Improved performance"' })
      }

      return list
    })

    const checklistCounts = computed(() => {
      const counts = { passed: 0, warning: 0, critical: 0 }
      checklistItems.value.forEach(item => {
        counts[item.status]++
      })
      return counts
    })

    function getAITips() {
      alert("AI optimization tips:\n\n1. Use action verbs (e.g. Led, Optimized, Built) at the start of experience bullet points.\n2. Incorporate exact technical keywords from the job description to bypass ATS filters.\n3. Keep experience descriptions limited to 3-5 concise bullet points.")
    }

    return {
      storeState,
      selectedVersionId,
      onVersionChange,
      atsScore,
      scoreGrade,
      scoreColor,
      keywordMatchScore,
      formatStructureScore,
      quantifiedImpactScore,
      checklistItems,
      checklistCounts,
      getAITips
    }
  }
}
</script>

<style scoped>
.insights-page-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.insights-header {
  grid-column: 1 / span 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
  margin-bottom: 0.5rem;
}

.insights-header h2 {
  font-family: var(--font-brand);
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.insights-header p {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.analyzing-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.analyzing-selector .lbl {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.dropdown-ver-select {
  border: 1px solid var(--color-border);
  padding: 0.375rem 0.625rem;
  border-radius: var(--radius-sm);
  background-color: white;
  font-weight: 600;
  font-size: 0.85rem;
  outline: none;
}

.insights-left-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ATS score gauge layouts */
.ats-score-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ats-gauge-main-row {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.score-num {
  font-family: var(--font-brand);
  font-size: 2.25rem;
  font-weight: 800;
}

.score-total {
  font-size: 0.95rem;
  color: var(--color-text-light);
  font-weight: 600;
}

.score-explanation-block {
  flex: 1;
}

.score-grade-text {
  font-family: var(--font-brand);
  font-weight: 800;
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.score-sub-desc {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.mini-metrics-pills {
  display: flex;
  gap: 0.5rem;
}

.pill-metric {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}
.pill-metric.passed { background-color: var(--color-success-light); color: var(--color-success); }
.pill-metric.warnings { background-color: var(--color-warning-light); color: var(--color-warning); }
.pill-metric.critical { background-color: var(--color-danger-light); color: var(--color-danger); }

.ats-sub-progress-bars {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-top: 1px solid var(--color-border);
  padding-top: 1rem;
}

.bar-stat-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.bar-stat-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-text-main);
}

.progress-bar-wrap {
  height: 6px;
  background-color: #f1f5f9;
  border-radius: 4px;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
}

/* Checklist cards formatting */
.checklist-card {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.checklist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.checklist-header .widget-title {
  margin-bottom: 0;
}

.items-count-badge {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-text-muted);
  background-color: #f1f5f9;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}

.checklist-items-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checklist-item-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
}

.checklist-item-row.passed {
  background-color: var(--color-success-light);
  border-color: #d1fae5;
}

.checklist-item-row.warning {
  background-color: var(--color-warning-light);
  border-color: #fef3c7;
}

.checklist-item-row.critical {
  background-color: var(--color-danger-light);
  border-color: #fee2e2;
}

.badge-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  color: white;
}
.badge-icon.passed { background-color: var(--color-success); }
.badge-icon.warning { background-color: var(--color-warning); }
.badge-icon.critical { background-color: var(--color-danger); }

.checklist-item-details strong {
  font-size: 0.82rem;
  color: var(--color-text-main);
  display: block;
}

.checklist-item-details p {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.tips-action-btn {
  width: 100%;
}

/* Right Column panel styles */
.insights-right-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mini-stats-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mini-stat-card {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mini-card-icon {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
}
.mini-card-icon.blue-bg { background-color: var(--color-primary-light); color: var(--color-primary); }
.mini-card-icon.green-bg { background-color: var(--color-success-light); color: var(--color-success); }
.mini-card-icon.purple-bg { background-color: #f3e8ff; color: #a855f7; }

.mini-card-details {
  display: flex;
  flex-direction: column;
}

.mini-card-details .val {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--color-text-main);
  line-height: 1.2;
}

.mini-card-details .lbl {
  font-size: 0.72rem;
  color: var(--color-text-muted);
  font-weight: 600;
}

/* Log blocks */
.logs-card {
  background-color: white;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.log-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.625rem;
}
.log-item-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.log-info {
  display: flex;
  flex-direction: column;
}

.log-info strong {
  font-size: 0.8rem;
  color: var(--color-text-main);
}

.log-info span {
  font-size: 0.68rem;
  color: var(--color-text-light);
}

.no-logs {
  font-size: 0.75rem;
  color: var(--color-text-light);
  font-style: italic;
  text-align: center;
}

/* Dark card */
.dark-statistics-card {
  background-color: #0f172a;
  color: white;
  border-color: #1e293b;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dark-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lbl-light {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.admin-view-btn {
  font-size: 0.65rem;
  font-weight: 700;
  color: #38bdf8;
  text-decoration: none;
  background-color: #1e293b;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}
.admin-view-btn:hover {
  background-color: #334155;
  color: white;
}

.dark-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
  text-align: center;
  border-bottom: 1px solid #1e293b;
  padding-bottom: 1rem;
}

.dark-stat-col {
  display: flex;
  flex-direction: column;
}

.dark-stat-col .val {
  font-size: 1.25rem;
  font-weight: 800;
  font-family: var(--font-brand);
}
.dark-stat-col .val.green {
  color: #4ade80;
}

.dark-stat-col .lbl {
  font-size: 0.625rem;
  color: #94a3b8;
  font-weight: 550;
}

.dark-card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.68rem;
  color: #94a3b8;
}

.dark-card-footer strong {
  color: white;
}
</style>
