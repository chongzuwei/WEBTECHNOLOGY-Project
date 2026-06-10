<template>
  <div class="resume-builder">
    <!-- Left Column: Data Entry -->
    <div class="builder-sidebar">
      <div class="stepper-nav">
        <button 
          v-for="step in steps" 
          :key="step.id"
          :class="['step-btn', { active: currentStep === step.id }]"
          @click="currentStep = step.id"
        >
          <span class="step-num">{{ step.id }}</span>
          {{ step.label }}
        </button>
      </div>
      
      <div class="form-container">
        <h2 class="section-title">{{ currentStepObj.title }}</h2>
        <p class="section-subtitle">{{ currentStepObj.subtitle }}</p>
        
        <component :is="currentStepComponent" />
      </div>
    </div>

    <!-- Right Column: Live Preview -->
    <div class="builder-preview">
      <div class="preview-toolbar">
        <div class="template-selector">
          <label>Template:</label>
          <select>
            <option>Modern Blue</option>
          </select>
        </div>
        <button class="btn-export" @click="printResume">
          ⭳ Export PDF
        </button>
      </div>
      
      <div class="preview-scroll">
        <ResumePreview />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PersonalForm from '@/components/resume/PersonalForm.vue'
import SectionList from '@/components/resume/SectionList.vue'
import CustomizeForm from '@/components/resume/CustomizeForm.vue'
import ResumePreview from '@/components/resume/ResumePreview.vue'

const steps = [
  { id: 1, label: 'Personal', title: 'Personal Information', subtitle: 'Basic contact information and personal details.', component: PersonalForm },
  { id: 2, label: 'Sections', title: 'Resume Sections', subtitle: 'Add and organize the content sections of your resume.', component: SectionList },
  { id: 3, label: 'Customize', title: 'Customize Template', subtitle: 'Adjust the visual appearance of your resume.', component: CustomizeForm },
]

const currentStep = ref(1)

const currentStepObj = computed(() => steps.find(s => s.id === currentStep.value))
const currentStepComponent = computed(() => currentStepObj.value.component)

const printResume = () => {
  window.print()
}
</script>

<style scoped>
.resume-builder {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  height: calc(100vh - 4rem); /* Assuming nav is ~4rem */
}

/* Sidebar Styles */
.builder-sidebar {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
.stepper-nav {
  display: flex;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  gap: 0.5rem;
  overflow-x: auto;
}
.step-btn {
  background: #f3f4f6;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  white-space: nowrap;
}
.step-btn:hover {
  background: #e5e7eb;
}
.step-btn.active {
  background: var(--primary-color);
  color: white;
}
.step-btn.active .step-num {
  background: rgba(255, 255, 255, 0.2);
}
.step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  background: #e5e7eb;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: bold;
}

.form-container {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}
.section-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}
.section-subtitle {
  color: var(--text-secondary);
  margin: 0 0 2rem 0;
  font-size: 0.95rem;
}

/* Preview Styles */
.builder-preview {
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
}
.preview-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: white;
  border-bottom: 1px solid var(--border-color);
}
.template-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}
.template-selector select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  outline: none;
}
.btn-export {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-export:hover {
  background-color: var(--primary-color-dark);
}
.preview-scroll {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  justify-content: center;
}
</style>
