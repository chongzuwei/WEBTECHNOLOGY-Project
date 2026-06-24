<template>
  <div class="form-section">
    <div class="form-group">
      <label>Professional Summary</label>
      <RichTextEditor v-model="state.personal.summary" placeholder="Briefly describe your professional background and goals..." />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useResume } from '@/composables/useResume'
import RichTextEditor from './RichTextEditor.vue'

const props = defineProps({
  sectionId: {
    type: String,
    required: true
  }
})

const { state } = useResume()
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
label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}
</style>
