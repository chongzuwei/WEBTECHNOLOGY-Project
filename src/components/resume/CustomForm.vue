<template>
  <div class="form-section">
    <div v-for="(item, index) in items" :key="item.id" class="entry-card">
      <div class="entry-header">
        <h4>Entry #{{ index + 1 }}</h4>
        <button class="btn-remove" @click="removeSectionItem(sectionId, item.id)">Remove</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Title</label>
          <input type="text" v-model="item.title" placeholder="e.g. Project Name / Language" />
        </div>
        <div class="form-group">
          <label>Subtitle / Details</label>
          <input type="text" v-model="item.subtitle" placeholder="e.g. Role / Proficiency" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Start Date</label>
          <div class="date-input-group">
            <input type="text" v-model="item.startDate" placeholder="Optional" />
            <input type="month" v-model="item.startDate" class="date-picker-icon" title="Choose date" />
          </div>
        </div>
        <div class="form-group">
          <label>End Date</label>
          <div class="date-input-group">
            <input type="text" v-model="item.endDate" placeholder="Optional" />
            <input type="month" v-model="item.endDate" class="date-picker-icon" title="Choose date" />
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <RichTextEditor v-model="item.description" placeholder="Details..." />
      </div>
    </div>
    
    <button class="btn-add" @click="addCustomItem">+ Add Entry</button>
  </div>
</template>

<script setup>
import { defineProps, onMounted } from 'vue'
import { useResume } from '@/composables/useResume'
import RichTextEditor from './RichTextEditor.vue'

const props = defineProps({
  sectionId: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  }
})

const { addSectionItem, removeSectionItem } = useResume()

const addCustomItem = () => {
  addSectionItem(props.sectionId, {
    title: '',
    subtitle: '',
    startDate: '',
    endDate: '',
    description: ''
  })
}

onMounted(() => {
  if (props.items && props.items.length === 0) {
    addCustomItem()
  }
})
</script>

<style scoped>
.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.entry-card {
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background-color: var(--card-bg);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.entry-header h4 {
  margin: 0;
  color: var(--primary-color);
  font-size: 0.9rem;
}
.btn-remove {
  background-color: #fee2e2;
  color: #ef4444;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}
.btn-remove:hover {
  background-color: #fecaca;
}
.btn-add {
  background-color: var(--primary-color-light);
  color: var(--primary-color);
  border: 2px dashed var(--primary-color);
  padding: 0.75rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}
.btn-add:hover {
  background-color: var(--primary-color);
  color: white;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}
input, textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  background-color: var(--input-bg);
  color: var(--text-primary);
  transition: border-color 0.2s, box-shadow 0.2s;
}
input:focus, textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-color-light);
}
.date-input-group {
  position: relative;
  display: flex;
  align-items: center;
}
.date-input-group input[type="text"] {
  width: 100%;
  padding-right: 2.5rem;
}
.date-input-group .date-picker-icon {
  position: absolute;
  right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  opacity: 0;
}
.date-input-group .date-picker-icon::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: auto;
  height: auto;
  color: transparent;
  background: transparent;
  cursor: pointer;
  opacity: 1;
}
.date-input-group::after {
  content: '\1f4c5';
  position: absolute;
  right: 0.75rem;
  pointer-events: none;
  opacity: 0.6;
}
</style>
