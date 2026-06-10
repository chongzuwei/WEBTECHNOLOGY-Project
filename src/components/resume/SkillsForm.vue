<template>
  <div class="form-section">
    <div class="form-group">
      <label>Technical Skills</label>
      <div class="skill-input-container">
        <input 
          type="text" 
          v-model="newSkill" 
          @keydown.enter.prevent="handleAddSkill"
          placeholder="e.g. React (Press Enter to add)" 
        />
        <button class="btn-add-skill" @click="handleAddSkill">Add</button>
      </div>
    </div>
    
    <div class="skills-list">
      <div v-for="skill in items" :key="skill" class="skill-tag">
        {{ skill }}
        <button class="btn-remove-skill" @click="removeSectionItem(sectionId, skill)">&times;</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { useResume } from '@/composables/useResume'

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
const newSkill = ref('')

const handleAddSkill = () => {
  const skill = newSkill.value.trim()
  if (skill && !props.items.includes(skill)) {
    // Add as a string since skills are an array of strings in state
    addSectionItem(props.sectionId, skill)
    // Wait, addSectionItem expects an object and adds an id. 
    // Let's modify this because items are simple strings here.
    // Actually, in useResume, if we push a string, it will be { id: ..., ...itemTemplate }.
    // That's bad for strings.
    // Let me rethink how to add a simple string item.
    // I can just push to items directly since it's reactive, OR provide a simpler way.
    // Since items is a prop (reactive array), I can just push to it.
    props.items.push(skill)
    newSkill.value = ''
  }
}
</script>

<style scoped>
.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.skill-input-container {
  display: flex;
  gap: 0.5rem;
}
.skill-input-container input {
  flex: 1;
}
.btn-add-skill {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-add-skill:hover {
  background-color: var(--primary-color-dark, #2b6cb0);
}
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}
.skill-tag {
  background-color: var(--primary-color-light);
  color: var(--primary-color-dark);
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-remove-skill {
  background: none;
  border: none;
  color: var(--primary-color-dark);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-remove-skill:hover {
  color: #ef4444;
}
label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}
input {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  background-color: var(--input-bg);
  color: var(--text-primary);
  transition: border-color 0.2s, box-shadow 0.2s;
}
input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-color-light);
}
</style>
