<template>
  <div class="section-list">
    <!-- List of active sections -->
    <div 
      v-for="(section, index) in state.sections" 
      :key="section.id" 
      class="section-card"
      :draggable="isDraggable"
      @dragstart="onDragStart($event, index)"
      @dragover.prevent
      @dragenter="onDragEnter(index)"
      @dragend="onDragEnd"
      :class="{ 'dragging': draggedIndex === index }"
    >
      <div class="section-header" @click="toggleAccordion(section.id)">
        <div class="section-title">
          <svg 
            viewBox="0 0 24 24" 
            width="18" 
            height="18" 
            stroke="currentColor" 
            stroke-width="2" 
            fill="none" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            class="drag-handle"
            @mousedown="isDraggable = true"
            @mouseup="isDraggable = false"
            @mouseleave="isDraggable = false"
          >
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          <h3>{{ section.title }}</h3>
        </div>
        <div class="section-actions">
          <button @click.stop="removeSection(section.id)" title="Remove Section" class="text-red">✕</button>
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="chevron" :class="{ 'rotated': openSections.includes(section.id) }"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>
      
      <div v-show="openSections.includes(section.id)" class="section-content">
        <!-- Dynamic component rendering based on section type -->
        <component 
          :is="getComponentForType(section.type)" 
          :section-id="section.id"
          :items="section.items"
        />
      </div>
    </div>

    <!-- Add Content Button -->
    <div class="add-content-wrapper">
      <button class="btn-add-content" @click="openAddModal">
        + Add Content
      </button>
    </div>

    <!-- Add Content Modal Pop-out -->
    <Teleport to="body">
      <div v-if="showAddModal" class="modal-backdrop" @click="closeAddModal">
        <div class="modal-window" @click.stop>
          <div class="modal-header">
            <h2>Add content</h2>
            <button class="btn-close" @click="closeAddModal">✕</button>
          </div>
          
          <div class="modal-grid">
            <div 
              v-for="(card, i) in availableSections" 
              :key="i"
              class="section-card-option"
              :class="{ 'dashed-card': card.isDashed, 'active-custom': card.title === 'Custom' && activeCustomIndex === i }"
              @click="handleCardClick(card, i)"
            >
              <div class="card-option-header">
                <div class="card-icon" v-html="getIconSvg(card.icon)"></div>
                <h3>{{ card.title }}</h3>
              </div>
              <p class="card-description">{{ card.description }}</p>
              
              <!-- Inline custom title input -->
              <div v-if="card.title === 'Custom' && activeCustomIndex === i" class="inline-custom-input" @click.stop>
                <input 
                  type="text" 
                  v-model="customSectionTitle" 
                  ref="customInputRef"
                  placeholder="Section Name" 
                  @keyup.enter="handleAddCustom" 
                />
                <div class="inline-actions">
                  <button class="btn-cancel-inline" @click="activeCustomIndex = null">Cancel</button>
                  <button class="btn-confirm-inline" @click="handleAddCustom">Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import { useResume } from '@/composables/useResume'

const { state, addSection, removeSection } = useResume()

const openSections = ref([])
const showAddModal = ref(false)
const activeCustomIndex = ref(null)
const customSectionTitle = ref('')
const customInputRef = ref(null)

const isDraggable = ref(false)
const draggedIndex = ref(null)

const availableSections = [
  {
    type: 'education',
    title: 'Education',
    description: 'Add your degrees and schools. Include your focus, honors, or exchange terms.',
    icon: 'graduation-cap',
  },
  {
    type: 'experience',
    title: 'Job Experience',
    description: 'Add your professional roles and employer history including internships.',
    icon: 'briefcase',
  },
  {
    type: 'skills',
    title: 'Skills',
    description: 'Add your hard and soft skills that help you stand out from the crowd today.',
    icon: 'lightbulb',
  },
  {
    type: 'languages',
    title: 'Languages',
    description: 'Add your languages and proficiency level to show your communication range.',
    icon: 'globe',
  },
  {
    type: 'certificates',
    title: 'Certificates',
    description: 'Add your industry certificates or licences. Include issuer and date earned.',
    icon: 'certificate',
  },
  {
    type: 'interests',
    title: 'Interests',
    description: 'Add relevant personal interests that support your career story and cultural fit.',
    icon: 'interests',
  },
  {
    type: 'projects',
    title: 'Projects',
    description: 'Add key projects you participated in and highlight your challenges, role, and impact.',
    icon: 'folder',
  },
  {
    type: 'courses',
    title: 'Courses',
    description: 'Add online or in-person courses and trainings you joined and completed.',
    icon: 'courses',
  },
  {
    type: 'awards',
    title: 'Awards',
    description: 'Add your awards and recognitions from industry, competitions, or academia.',
    icon: 'award',
  },
  {
    type: 'organisations',
    title: 'Organisations',
    description: 'Add your memberships or volunteering with organisations including your role.',
    icon: 'organisations',
  },
  {
    type: 'publications',
    title: 'Publications',
    description: 'Add publications, articles, or books you wrote or contributed to.',
    icon: 'book',
  },
  {
    type: 'references',
    title: 'References',
    description: 'Add your references from managers or coworkers, including their contact details.',
    icon: 'references',
  },
  {
    type: 'declaration',
    title: 'Declaration',
    description: 'Add your declaration by creating or uploading your personal signature.',
    icon: 'declaration',
  },
  {
    type: 'custom',
    title: 'Custom',
    description: 'Add a custom section for anything else, or combine sections cleanly.',
    icon: 'custom',
    isDashed: true,
  }
]

// Initialize first section as open if any
if (state.sections.length > 0) {
  openSections.value.push(state.sections[0].id)
}

const toggleAccordion = (id) => {
  const index = openSections.value.indexOf(id)
  if (index === -1) {
    openSections.value.push(id)
  } else {
    openSections.value.splice(index, 1)
  }
}

const openAddModal = () => {
  showAddModal.value = true
  activeCustomIndex.value = null
}

const closeAddModal = () => {
  showAddModal.value = false
  activeCustomIndex.value = null
}

const handleCardClick = (card, index) => {
  if (card.title === 'Custom') {
    activeCustomIndex.value = index
    setTimeout(() => {
      if (customInputRef.value && customInputRef.value[0]) {
        customInputRef.value[0].focus()
      } else if (customInputRef.value) {
        customInputRef.value.focus()
      }
    }, 100)
  } else {
    handleAddSection(card.type, card.title)
    closeAddModal()
  }
}

const handleAddSection = (type, title) => {
  addSection(type, title)
  // Automatically open the newly added section (which is at the end)
  setTimeout(() => {
    const newSection = state.sections[state.sections.length - 1]
    if (newSection && !openSections.value.includes(newSection.id)) {
        openSections.value.push(newSection.id)
    }
  }, 50)
}

const handleAddCustom = () => {
  if (customSectionTitle.value.trim()) {
    handleAddSection('custom', customSectionTitle.value.trim())
    customSectionTitle.value = ''
    closeAddModal()
  }
}

const onDragStart = (event, index) => {
  draggedIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', index)
}

const onDragEnter = (index) => {
  if (draggedIndex.value === null || draggedIndex.value === index) return
  const temp = state.sections[draggedIndex.value]
  state.sections.splice(draggedIndex.value, 1)
  state.sections.splice(index, 0, temp)
  draggedIndex.value = index
}

const onDragEnd = () => {
  draggedIndex.value = null
  isDraggable.value = false
}

const getIconSvg = (name) => {
  switch (name) {
    case 'graduation-cap':
      return `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`
    case 'briefcase':
      return `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`
    case 'lightbulb':
      return `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M15.09 14c.18-.33.3-.68.37-1.04A5 5 0 0 0 16 9a6 6 0 0 0-12 0c0 1.57.61 3.02 1.63 4.1.07.36.19.71.37 1.04.5 1 1.5 2.5 1.5 3.5h7c0-1 1-2.5 1.5-3.5z"/></svg>`
    case 'globe':
      return `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
    case 'certificate':
      return `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`
    case 'interests':
      return `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`
    case 'folder':
      return `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`
    case 'courses':
      return `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>`
    case 'award':
      return `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`
    case 'organisations':
      return `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
    case 'book':
      return `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z"/></svg>`
    case 'references':
      return `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
    case 'declaration':
      return `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`
    case 'custom-section':
      return `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
    case 'custom':
      return `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`
    default:
      return `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`
  }
}

// Map section types to their respective form components
const getComponentForType = (type) => {
  switch (type) {
    case 'summary':
      return defineAsyncComponent(() => import('./SummaryForm.vue')) // Assuming we'll create this
    case 'education':
      return defineAsyncComponent(() => import('./EducationForm.vue'))
    case 'experience':
      return defineAsyncComponent(() => import('./ExperienceForm.vue'))
    case 'skills':
      return defineAsyncComponent(() => import('./SkillsForm.vue'))
    case 'projects':
    case 'languages':
    case 'custom':
    case 'certificates':
    case 'interests':
    case 'courses':
    case 'awards':
    case 'organisations':
    case 'publications':
    case 'references':
    case 'declaration':
    case 'extracurricular':
      // Fallback or generic custom form
      return defineAsyncComponent(() => import('./CustomForm.vue')) // We'll create a generic one
    default:
      return null
  }
}
</script>

<style scoped>
.section-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-card {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background-color: var(--card-bg);
  overflow: hidden;
  transition: box-shadow 0.2s, opacity 0.2s, transform 0.2s;
}

.section-card.dragging {
  opacity: 0.5;
  border: 1px dashed var(--primary-color);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transform: scale(0.98);
}

.section-card:hover:not(.dragging) {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  cursor: pointer;
  background-color: #f8fafc;
  border-bottom: 1px solid transparent;
  transition: background-color 0.2s;
}

.section-header:hover {
  background-color: #f1f5f9;
}

.section-content {
  border-top: 1px solid var(--border-color);
  padding: 1.5rem;
  background-color: white;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.drag-handle {
  color: #94a3b8;
  cursor: grab;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-actions button {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0.25rem;
  border-radius: 4px;
}

.section-actions button:hover:not(:disabled) {
  background-color: #e2e8f0;
}

.section-actions button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.text-red {
  color: #ef4444 !important;
}
.text-red:hover {
  background-color: #fee2e2 !important;
}

.chevron {
  color: #64748b;
  transition: transform 0.3s ease;
}
.chevron.rotated {
  transform: rotate(180deg);
}

.add-content-wrapper {
  margin-top: 1rem;
  width: 100%;
}

.btn-add-content {
  width: 100%;
  padding: 1rem;
  background-color: transparent;
  border: 2px dashed var(--primary-color);
  color: var(--primary-color);
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-content:hover {
  background-color: var(--primary-color-light);
}

/* Modal Backdrop Overlay */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease-out;
}

/* Modal Container Window */
.modal-window {
  background: white;
  width: 90%;
  max-width: 1100px;
  max-height: 85vh;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e1b4b;
}

.btn-close {
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #64748b;
  transition: all 0.2s;
}

.btn-close:hover {
  background-color: #e2e8f0;
  color: #0f172a;
}

/* Modal Cards Grid */
.modal-grid {
  padding: 2rem;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

@media (max-width: 1024px) {
  .modal-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 768px) {
  .modal-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .modal-grid {
    grid-template-columns: 1fr;
  }
}

/* Option Cards */
.section-card-option {
  background-color: #f8fafc;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  min-height: 120px;
  position: relative;
  text-align: left;
  box-sizing: border-box;
}

.section-card-option:hover {
  background-color: white;
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.dashed-card {
  border: 1px dashed #cbd5e1;
}

.dashed-card:hover {
  border-style: dashed;
  border-color: var(--primary-color);
}

.active-custom {
  border-color: var(--primary-color);
  background-color: white;
}

.card-option-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.card-icon {
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-option-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.card-description {
  margin: 0;
  font-size: 0.825rem;
  line-height: 1.4;
  color: #64748b;
}

/* Inline Custom Title Input */
.inline-custom-input {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.inline-custom-input input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.875rem;
  box-sizing: border-box;
  background-color: white;
  color: var(--text-primary);
}

.inline-custom-input input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.inline-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-cancel-inline {
  background: transparent;
  border: none;
  font-size: 0.8rem;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.btn-cancel-inline:hover {
  background-color: #f1f5f9;
}

.btn-confirm-inline {
  background-color: var(--primary-color);
  color: white;
  border: none;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
}

.btn-confirm-inline:hover {
  background-color: var(--primary-color-dark);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
