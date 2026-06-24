<template>
  <div class="form-section">
    <div class="form-group">
      <label>Full Name</label>
      <input type="text" v-model="state.personal.name" placeholder="e.g. Alex Chen" />
    </div>
    <div class="form-group">
      <label>Professional Title</label>
      <input type="text" v-model="state.personal.title" placeholder="e.g. Frontend Developer" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="state.personal.email" placeholder="e.g. alex@example.com" />
      </div>
      <div class="form-group">
        <label>Phone</label>
        <input type="text" v-model="state.personal.phone" placeholder="e.g. +1 234 567 890" />
      </div>
    </div>
    <div class="form-group">
      <label>Location</label>
      <input type="text" v-model="state.personal.location" placeholder="e.g. Beijing, China" />
    </div>

    <!-- Render Custom Personal Details -->
    <div class="form-row" v-if="state.personal.customDetails.length > 0">
      <div class="form-group" v-for="detail in state.personal.customDetails" :key="detail.label">
        <label>
          {{ detail.label }}
          <button class="btn-remove-inline" @click="removePersonalDetail(detail.label)" title="Remove">&times;</button>
        </label>
        <input type="text" v-model="detail.value" />
      </div>
    </div>

    <!-- Render Social Links -->
    <div class="form-row" v-if="state.personal.socialLinks.length > 0">
      <div class="form-group" v-for="link in state.personal.socialLinks" :key="link.label">
        <label>
          {{ link.label }}
          <button class="btn-remove-inline" @click="removeSocialLink(link.label)" title="Remove">&times;</button>
        </label>
        <input type="text" v-model="link.url" placeholder="URL or username" />
      </div>
    </div>

    <div class="add-details-section">
      <h4>Add details</h4>
      
      <div class="details-category">
        <h5>Personal details</h5>
        <div class="chip-container">
          <button 
            v-for="detail in availablePersonalDetails" 
            :key="detail"
            class="chip-btn"
            @click="addPersonalDetail(detail)"
            :disabled="hasPersonalDetail(detail)"
          >
            + {{ detail }}
          </button>
        </div>
      </div>

      <div class="details-category">
        <h5>Links / social profiles</h5>
        <div class="chip-container">
          <button 
            v-for="link in availableSocialLinks" 
            :key="link"
            class="chip-btn"
            @click="addSocialLink(link)"
            :disabled="hasSocialLink(link)"
          >
            + {{ link }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useResume } from '@/composables/useResume'

const { state, addPersonalDetail, removePersonalDetail, addSocialLink, removeSocialLink } = useResume()

const availablePersonalDetails = [
  'Passport or Id', 'Nationality', 'Date of Birth', 'Visa', 
  'Availability', 'Gender/Pronoun', 'Disability'
]

const availableSocialLinks = [
  'Website', 'Portfolio', 'GitBook', 'Medium', 'ORCID', 
  'Skype', 'Bluesky', 'Threads', 'X', 'LinkedIn', 'GitHub'
]

const hasPersonalDetail = (label) => {
  return state.personal.customDetails.some(d => d.label === label)
}

const hasSocialLink = (label) => {
  return state.personal.socialLinks.some(l => l.label === label)
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
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}
.btn-remove-inline {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0;
  font-size: 0.8rem;
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
.add-details-section {
  margin-top: 1rem;
}
.add-details-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}
.details-category {
  margin-bottom: 1.5rem;
}
.details-category h5 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: var(--text-primary);
  font-weight: 600;
}
.chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.chip-btn {
  background-color: #f1f5f9;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.chip-btn:hover:not(:disabled) {
  background-color: #e2e8f0;
  color: #0f172a;
}
.chip-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  display: none; /* Hide when selected to save space, or can just be disabled */
}
</style>
