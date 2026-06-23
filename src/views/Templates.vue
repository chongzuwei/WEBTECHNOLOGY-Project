<template>
  <div class="main-content container templates-layout">
    
    <!-- Left Main Panel -->
    <div class="templates-main-content">
      <div class="templates-header">
        <h2>Choose Your Style</h2>
        <p>Pick a template that fits your industry and personality — you can switch anytime.</p>
      </div>

      <!-- Search & Filters Row -->
      <div class="filters-bar-container no-print">
        <div class="search-input-wrapper">
          <input type="text" v-model="searchQuery" class="form-input search-box" placeholder="Search templates..." />
        </div>
        
        <div class="category-chips-list">
          <button v-for="cat in categories" :key="cat" @click="activeCategory = cat" class="chip-btn" :class="{ 'active': activeCategory === cat }">
            {{ cat }}
          </button>
        </div>

        <div class="sort-select-wrapper">
          <span class="sort-lbl">Sort by:</span>
          <select v-model="sortBy" class="sort-dropdown">
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <div class="results-count">{{ filteredTemplates.length }} templates available</div>

      <!-- Templates Cards Grid -->
      <div class="templates-grid">
        <div v-for="tpl in filteredTemplates" :key="tpl.id" class="card template-grid-card" :class="{ 'selected-border': storeState.resumeData.selected_template_id === tpl.id }" @click="selectTemplateLocal(tpl)">
          
          <!-- Badges or ribbons at top -->
          <div class="card-ribbon-row">
            <span v-if="tpl.popular" class="badge-ribbon popular">Popular</span>
            <span v-else-if="tpl.new" class="badge-ribbon new">New</span>
            <div v-else></div>
            
            <span v-if="storeState.resumeData.selected_template_id === tpl.id" class="badge-selected-pill">SELECTED</span>
          </div>

          <!-- Template Mock Image representation -->
          <div class="template-image-mock" :class="'mock-bg-' + tpl.id">
            <div class="mock-document">
              <div class="mock-header" :class="'mock-header-style-' + tpl.id"></div>
              <div class="mock-body-lines">
                <div class="mock-line long"></div>
                <div class="mock-line medium"></div>
                <div class="mock-line short"></div>
              </div>
            </div>
          </div>

          <!-- Card Details description -->
          <div class="template-card-footer">
            <div class="footer-title-row">
              <h4>{{ tpl.name }}</h4>
              <div class="stars-rating">
                <span class="star-icon">★</span>
                <span>{{ tpl.rating }}</span>
              </div>
            </div>
            <div class="tpl-meta-subtitle">{{ tpl.tag }} • {{ tpl.layout_type }} • {{ tpl.uses }} uses</div>
            
            <div class="card-action-buttons">
              <button @click.stop="previewTemplateDialog(tpl)" class="btn-small-action btn-sec">Preview</button>
              <button v-if="storeState.resumeData.selected_template_id === tpl.id" class="btn-small-action btn-pri-selected" disabled>✓ Selected</button>
              <button v-else @click.stop="applyTemplateDirect(tpl.id)" class="btn-small-action btn-pri">Select</button>
            </div>
          </div>

        </div>
      </div>

      <!-- Recommended Alert Banner -->
      <div class="recommended-alert-card">
        <div class="rec-icon-box">★</div>
        <div class="rec-details">
          <strong>Recommended for you</strong>
          <p>Based on your position <strong>{{ userRole }}</strong>, we recommend the <strong>Modern Blue</strong> template — it's ATS-optimized and tech-friendly.</p>
        </div>
        <button @click="applyTemplateDirect(1)" class="btn-rec-action">Use Modern Blue</button>
      </div>

    </div>

    <!-- Right Sidebar Detail View -->
    <aside class="selected-template-panel">
      <h3 class="panel-title">Selected Template</h3>
      
      <!-- Mini Mock Paper image -->
      <div class="side-mock-preview-container">
        <div class="side-mock-sheet" :class="'mock-bg-' + focusedTemplate.id">
          <div class="mock-header" :class="'mock-header-style-' + focusedTemplate.id"></div>
          <div class="mock-body-lines">
            <div class="mock-line long"></div>
            <div class="mock-line medium"></div>
            <div class="mock-line short"></div>
          </div>
        </div>
      </div>

      <div class="side-details-block">
        <h3>{{ focusedTemplate.name }}</h3>
        
        <div class="side-badges-row">
          <span class="badge badge-pdf">{{ focusedTemplate.tag }}</span>
          <span v-if="focusedTemplate.atsReady" class="badge badge-success">ATS-Ready</span>
          <span v-else class="badge badge-warning">Visual Heavy</span>
        </div>

        <p class="template-desc">{{ focusedTemplate.description }}</p>

        <div class="side-rating-info">
          <span class="stars-val">★★★★★</span>
          <span class="uses-count"><strong>{{ focusedTemplate.rating }}</strong> • {{ focusedTemplate.uses }} uses</span>
        </div>

        <button @click="applyTemplateDirect(focusedTemplate.id)" class="btn btn-primary full-width-btn">
          Apply Template →
        </button>
        <button @click="previewTemplateDialog(focusedTemplate)" class="btn btn-secondary full-width-btn margin-top-btn">
          Full Preview
        </button>
      </div>
    </aside>

    <!-- Modal dialog for large template preview -->
    <div v-if="previewDialogVisible" class="modal-overlay" @click="previewDialogVisible = false">
      <div class="modal-card" @click.stop>
        <div class="modal-header-row">
          <h3>Template Preview: {{ previewTarget.name }}</h3>
          <button @click="previewDialogVisible = false" class="modal-close-x">×</button>
        </div>
        <div class="modal-body-content">
          <div class="large-mock-sheet" :class="'mock-bg-' + previewTarget.id">
            <div class="large-mock-header" :class="'mock-header-style-' + previewTarget.id">
              <h2>{{ storeState.resumeData.personal.name }}</h2>
              <p>{{ storeState.resumeData.personal.title }}</p>
            </div>
            <div class="large-mock-body">
              <div class="col-main">
                <div class="large-mock-section">
                  <div class="section-header-mock">SUMMARY</div>
                  <div class="line long"></div>
                  <div class="line medium"></div>
                </div>
                <div class="large-mock-section">
                  <div class="section-header-mock">EDUCATION</div>
                  <div class="line long"></div>
                  <div class="line short"></div>
                </div>
              </div>
              <div class="col-side">
                <div class="large-mock-section">
                  <div class="section-header-mock">SKILLS</div>
                  <div class="chip-mock">React</div>
                  <div class="chip-mock">TypeScript</div>
                  <div class="chip-mock">Git</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer-row">
          <button @click="previewDialogVisible = false" class="btn btn-secondary">Close</button>
          <button @click="applyAndClose(previewTarget.id)" class="btn btn-primary">Apply this Template</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/services/store'

export default {
  setup() {
    const router = useRouter()
    const storeState = store.state
    const storeTemplates = store.templates
    const emptyTemplate = { id: 1, name: 'Loading...', description: '', rating: 0, uses: '0', tag: '', layout_type: '', is_active: 1, atsReady: false }

    const searchQuery = ref('')
    const activeCategory = ref('All')
    const sortBy = ref('popular')

    const focusedTemplate = ref(storeTemplates[0] || emptyTemplate)

    // Preview Modal triggers
    const previewDialogVisible = ref(false)
    const previewTarget = ref(null)

    const categories = ['All', 'Modern', 'Classic', 'Minimal', 'Creative', 'Tech']

    onMounted(async () => {
      try {
        await store.loadTemplates()
        focusedTemplate.value = store.state.templates.find(t => t.id === storeState.resumeData.selected_template_id) || store.state.templates[0] || emptyTemplate
      } catch (error) {
        console.error('Failed to load templates', error)
      }
    })

    const userRole = computed(() => {
      return storeState.resumeData.personal.title || 'Frontend Developer'
    })

    const filteredTemplates = computed(() => {
      let list = store.state.templates.filter(t => t.is_active === 1)

      // Search query
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        list = list.filter(t => t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query))
      }

      // Category filter
      if (activeCategory.value !== 'All') {
        list = list.filter(t => t.tag.toLowerCase() === activeCategory.value.toLowerCase())
      }

      // Sort order
      if (sortBy.value === 'popular') {
        list.sort((a, b) => parseInt(b.uses.replace(',', '')) - parseInt(a.uses.replace(',', '')))
      } else if (sortBy.value === 'rating') {
        list.sort((a, b) => b.rating - a.rating)
      } else if (sortBy.value === 'newest') {
        list.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0))
      }

      return list
    })

    function selectTemplateLocal(tpl) {
      focusedTemplate.value = tpl
    }

    function applyTemplateDirect(id) {
      store.setTemplate(id)
      alert(`Applied template: ${storeTemplates.find(x => x.id === id)?.name}!`)
      router.push('/editor')
    }

    function previewTemplateDialog(tpl) {
      previewTarget.value = tpl
      previewDialogVisible.value = true
    }

    function applyAndClose(id) {
      previewDialogVisible.value = false
      applyTemplateDirect(id)
    }

    return {
      storeState,
      storeTemplates,
      searchQuery,
      activeCategory,
      sortBy,
      focusedTemplate,
      categories,
      userRole,
      filteredTemplates,
      selectTemplateLocal,
      applyTemplateDirect,
      previewTemplateDialog,
      previewDialogVisible,
      previewTarget,
      applyAndClose
    }
  }
}
</script>

<style scoped>
.templates-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.templates-main-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.templates-header h2 {
  font-family: var(--font-brand);
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.templates-header p {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

/* Filters row */
.filters-bar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  gap: 1rem;
}

.search-input-wrapper {
  flex: 1;
}

.search-box {
  background-color: #f1f5f9;
  margin-bottom: 0;
}

.category-chips-list {
  display: flex;
  gap: 0.375rem;
}

.chip-btn {
  background-color: #f1f5f9;
  border: none;
  border-radius: 50px;
  padding: 0.375rem 0.875rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.chip-btn:hover {
  background-color: #e2e8f0;
  color: var(--color-text-main);
}

.chip-btn.active {
  background-color: var(--color-primary);
  color: white;
}

.sort-select-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-lbl {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.sort-dropdown {
  border: 1px solid var(--color-border);
  padding: 0.375rem 0.5rem;
  border-radius: var(--radius-sm);
  outline: none;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: white;
}

.results-count {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-light);
}

/* Template Grid list */
.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}

.template-grid-card {
  cursor: pointer;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.template-grid-card.selected-border {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.card-ribbon-row {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  right: 0.5rem;
  z-index: 5;
}

.badge-ribbon {
  font-size: 0.65rem;
  font-weight: 700;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}
.badge-ribbon.popular { background-color: var(--color-primary); }
.badge-ribbon.new { background-color: #a855f7; }

.badge-selected-pill {
  background-color: var(--color-success);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}

/* Mock document visual representation inside card */
.template-image-mock {
  height: 150px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--color-border);
}

.mock-bg-1 { background-color: #eff6ff; }
.mock-bg-2 { background-color: #f8fafc; }
.mock-bg-3 { background-color: #1e293b; }
.mock-bg-4 { background-color: #ccfbf1; }
.mock-bg-5 { background-color: #f0fdf4; }
.mock-bg-6 { background-color: #fffbeb; }

.mock-document {
  width: 90px;
  height: 120px;
  background-color: white;
  border-radius: 2px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.06);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.mock-header {
  height: 14px;
  border-radius: 1px;
}

.mock-header-style-1 { background-color: #1e3a8a; }
.mock-header-style-2 { border-bottom: 1px solid #cbd5e1; }
.mock-header-style-3 { background-color: #0f172a; height: 100%; width: 24px; position: absolute; left: 0; top: 0; }
.mock-header-style-4 { background-color: #0d9488; }
.mock-header-style-5 { border-left: 2px solid #16a34a; }
.mock-header-style-6 { background-color: #f59e0b; }

.mock-body-lines {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
}

.mock-line {
  height: 4px;
  background-color: #e2e8f0;
  border-radius: 1px;
}
.mock-line.long { width: 90%; }
.mock-line.medium { width: 70%; }
.mock-line.short { width: 45%; }

.template-card-footer {
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.footer-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-title-row h4 {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text-main);
}

.stars-rating {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-warning);
}

.tpl-meta-subtitle {
  font-size: 0.65rem;
  color: var(--color-text-muted);
}

.card-action-buttons {
  display: flex;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

.btn-small-action {
  flex: 1;
  border: 1px solid var(--color-border);
  padding: 0.375rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-small-action.btn-sec {
  background-color: white;
  color: var(--color-text-muted);
}
.btn-small-action.btn-sec:hover {
  background-color: #f8fafc;
}

.btn-small-action.btn-pri {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
.btn-small-action.btn-pri:hover {
  background-color: var(--color-primary-hover);
}

.btn-small-action.btn-pri-selected {
  background-color: var(--color-success-light);
  color: var(--color-success);
  border-color: var(--color-success);
  cursor: default;
}

/* Recommended Alert card */
.recommended-alert-card {
  display: flex;
  align-items: center;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: var(--radius-md);
  padding: 1.25rem;
  gap: 1rem;
  margin-top: 1rem;
}

.rec-icon-box {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
}

.rec-details {
  flex: 1;
}

.rec-details strong {
  font-size: 0.9rem;
  color: var(--color-primary-dark);
}

.rec-details p {
  font-size: 0.8rem;
  color: var(--color-text-main);
  margin-top: 0.125rem;
}

.btn-rec-action {
  border: none;
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--radius-sm);
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}
.btn-rec-action:hover {
  background-color: var(--color-primary-hover);
}

/* Sidebar selected template details */
.selected-template-panel {
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: max-content;
  position: sticky;
  top: 1.5rem;
}

.panel-title {
  font-family: var(--font-brand);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text-main);
  margin-bottom: 1.25rem;
}

.side-mock-preview-container {
  height: 180px;
  background-color: #f1f5f9;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  border: 1px solid var(--color-border);
}

.side-mock-sheet {
  width: 110px;
  height: 150px;
  background-color: white;
  border-radius: 2px;
  box-shadow: var(--shadow-md);
  padding: 0.625rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.side-details-block h3 {
  font-family: var(--font-brand);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-text-main);
  margin-bottom: 0.5rem;
}

.side-badges-row {
  display: flex;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
}

.template-desc {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  line-height: 1.4;
  margin-bottom: 1rem;
}

.side-rating-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-border);
  padding-top: 0.75rem;
  margin-bottom: 1.25rem;
}

.stars-val {
  color: var(--color-warning);
  font-size: 0.875rem;
}

.uses-count {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.full-width-btn {
  width: 100%;
}

.margin-top-btn {
  margin-top: 0.5rem;
}

/* Modal styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.4);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-card {
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-premium);
  width: 90%;
  max-width: 520px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header-row {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header-row h3 {
  font-family: var(--font-brand);
  font-weight: 700;
  font-size: 1.1rem;
}

.modal-close-x {
  border: none;
  background: transparent;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--color-text-light);
}

.modal-body-content {
  padding: 1.5rem;
  background-color: #f1f5f9;
  display: flex;
  justify-content: center;
}

.large-mock-sheet {
  width: 320px;
  height: 400px;
  background-color: white;
  border-radius: 4px;
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

.large-mock-header {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
}
.large-mock-header h2 { font-size: 1.1rem; font-family: var(--font-brand); }
.large-mock-header p { font-size: 0.75rem; color: var(--color-text-muted); }

.large-mock-body {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  flex: 1;
}

.section-header-mock {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.375rem;
  letter-spacing: 0.05em;
}

.large-mock-section .line {
  height: 6px;
  background-color: #f1f5f9;
  margin-bottom: 0.25rem;
  border-radius: 2px;
}
.large-mock-section .line.long { width: 90%; }
.large-mock-section .line.medium { width: 70%; }
.large-mock-section .line.short { width: 40%; }

.chip-mock {
  display: inline-block;
  font-size: 0.65rem;
  background-color: #f1f5f9;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
}

.modal-footer-row {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
