<template>
  <div class="resume-preview-wrapper" :style="customStyles">
    <div class="resume-preview-container a4-page" id="resume-preview">
      
      <div class="resume-header" :class="['align-' + state.theme.headerAlignment]">
        <h1 class="header-name">{{ state.personal.name || 'Your Name' }}</h1>
        <h2 class="header-title">{{ state.personal.title || 'Professional Title' }}</h2>
        
        <div :class="['contact-info', 'arrange-' + state.theme.headerDetailsArrangement]">
          <span v-if="state.personal.email">
            <span v-if="state.theme.iconStyle === 'emoji'">&#128231;</span>
            <svg v-if="state.theme.iconStyle === 'solid'" class="icon" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
            <span v-if="state.theme.iconStyle === 'outline'" class="icon">&#9993;</span>
            {{ state.personal.email }}
          </span>
          <span v-if="state.personal.phone">
            <span v-if="state.theme.iconStyle === 'emoji'">&#128241;</span>
            <svg v-if="state.theme.iconStyle === 'solid'" class="icon" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
            <span v-if="state.theme.iconStyle === 'outline'" class="icon">&#9990;</span>
            {{ state.personal.phone }}
          </span>
          <span v-if="state.personal.location">
            <span v-if="state.theme.iconStyle === 'emoji'">&#128205;</span>
            <svg v-if="state.theme.iconStyle === 'solid'" class="icon" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
            <span v-if="state.theme.iconStyle === 'outline'" class="icon">&#8962;</span>
            {{ state.personal.location }}
          </span>
          <!-- Custom Details -->
          <span v-for="detail in state.personal.customDetails" :key="detail.label">
            {{ detail.value }}
          </span>
          <!-- Social Links -->
          <span v-for="link in state.personal.socialLinks" :key="link.label">
            <span v-if="state.theme.iconStyle === 'emoji'">&#128279;</span>
            <svg v-if="state.theme.iconStyle === 'solid'" class="icon" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/></svg>
            <span v-if="state.theme.iconStyle === 'outline'" class="icon">&#128279;</span>
            {{ link.url }}
          </span>
        </div>
      </div>
      
      <div class="resume-body">
        <template v-for="section in state.sections" :key="section.id">
          
          <div v-if="section.visible && hasContent(section)" class="resume-section">
            <h3 class="section-title" :class="[state.theme.headingStyle, state.theme.headingCapitalization]">
              <span class="title-text">{{ section.title }}</span>
            </h3>
            
            <!-- Summary Type -->
            <div v-if="section.type === 'summary'" class="rich-text-content" v-html="state.personal.summary"></div>
            
            <!-- Education Type -->
            <template v-if="section.type === 'education'">
              <div v-for="item in section.items" :key="item.id" class="resume-item">
                <div class="item-header">
                  <strong class="item-title">{{ item.school || 'School Name' }}</strong>
                  <span class="date">{{ formatMonth(item.startDate) }}<span v-if="item.endDate"> - {{ formatMonth(item.endDate) }}</span></span>
                </div>
                <div class="item-subtitle">{{ item.degree }}</div>
                <div v-if="item.description" class="rich-text-content" v-html="item.description"></div>
              </div>
            </template>
            
            <!-- Experience Type -->
            <template v-if="section.type === 'experience'">
              <div v-for="item in section.items" :key="item.id" class="resume-item">
                <div class="item-header">
                  <strong class="item-title">{{ item.company || 'Company Name' }}</strong>
                  <span class="date">{{ formatMonth(item.startDate) }}<span v-if="item.endDate"> - {{ formatMonth(item.endDate) }}</span></span>
                </div>
                <div class="item-subtitle">{{ item.position }}</div>
                <div v-if="item.description" class="rich-text-content" v-html="item.description"></div>
              </div>
            </template>
            
            <!-- Skills Type -->
            <template v-if="section.type === 'skills'">
              <div class="skills-list">
                <span v-for="skill in section.items" :key="skill" class="skill-badge">{{ skill }}</span>
              </div>
            </template>

            <!-- Custom Type -->
            <template v-if="['custom', 'projects', 'languages', 'certificates', 'interests', 'courses', 'awards', 'organisations', 'publications', 'references', 'declaration', 'extracurricular'].includes(section.type)">
              <div v-for="item in section.items" :key="item.id" class="resume-item">
                <div class="item-header">
                  <strong class="item-title">{{ item.title || 'Entry Title' }}</strong>
                  <span v-if="item.startDate || item.endDate" class="date">{{ formatMonth(item.startDate) }}<span v-if="item.endDate"> - {{ formatMonth(item.endDate) }}</span></span>
                </div>
                <div v-if="item.subtitle" class="item-subtitle">{{ item.subtitle }}</div>
                <div v-if="item.description" class="rich-text-content" v-html="item.description"></div>
              </div>
            </template>

          </div>
        </template>

        <div v-if="state.sections.length === 0" class="resume-section empty-state">
          <p class="body-text">Add sections using the builder</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useResume } from '@/composables/useResume'

const { state } = useResume()

const formatMonth = (dateStr) => {
  if (!dateStr) return ''
  // Try to parse if it looks like a valid ISO date, otherwise return as-is
  const parts = dateStr.split('-')
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
     const date = new Date(dateStr)
     if (!isNaN(date.getTime())) {
         return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
     }
  }
  return dateStr // Return string typed by user directly
}

const hasContent = (section) => {
  if (section.type === 'summary') return !!state.personal.summary;
  if (section.items && section.items.length > 0) return true;
  return false;
}

const customStyles = computed(() => {
  const t = state.theme
  return {
    '--theme-font': `"${t.fontFamily}", sans-serif`,
    '--theme-primary': t.primaryColor,
    '--theme-title': t.titleColor,
    '--theme-text': t.textColor,
    '--theme-line-height': t.lineHeight,
    '--theme-margin-x': `${t.marginX}mm`,
    '--theme-margin-y': `${t.marginY}mm`,
    // Apply granular font sizes
    '--font-size-base': `${t.fontSize.base}pt`,
    '--font-size-name': `${t.fontSize.name}pt`,
    '--font-size-title': `${t.fontSize.title}pt`,
    '--font-size-headings': `${t.fontSize.headings}pt`,
    '--font-size-entry-header': `${t.fontSize.entryHeader}pt`,
  }
})
</script>

<style scoped>
.resume-preview-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}

/* A4 Page Definition */
.a4-page {
  width: 210mm;
  min-height: 297mm;
  background-color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  font-family: var(--theme-font);
  font-size: var(--font-size-base);
  line-height: var(--theme-line-height);
  color: var(--theme-text);
  display: flex;
  flex-direction: column;
}

.resume-header {
  background-color: var(--theme-primary);
  color: white;
  padding: var(--theme-margin-y) var(--theme-margin-x);
}
.resume-header.align-left { text-align: left; }
.resume-header.align-center { text-align: center; }
.resume-header.align-right { text-align: right; }

.header-name {
  margin: 0 0 0.1em 0;
  font-size: var(--font-size-name);
  font-weight: 700;
  line-height: 1.1;
}
.header-title {
  margin: 0 0 0.75em 0;
  font-size: var(--font-size-title);
  font-weight: 400;
  opacity: 0.9;
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5em;
  font-size: 0.9em;
  opacity: 0.9;
}
.resume-header.align-center .contact-info { justify-content: center; }
.resume-header.align-right .contact-info { justify-content: flex-end; }
.contact-info.arrange-column {
  flex-direction: column;
  gap: 0.5em;
}

.contact-info span {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
}
.icon {
  width: 1.1em;
  height: 1.1em;
}

.resume-body {
  padding: var(--theme-margin-y) var(--theme-margin-x);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}

.resume-section {
  display: flex;
  flex-direction: column;
}

/* SECTION HEADINGS STYLING */
.section-title {
  color: var(--theme-title);
  font-size: var(--font-size-headings);
  font-weight: 600;
  margin: 0 0 0.75em 0;
  position: relative;
  display: flex;
  align-items: center;
}

.section-title.capitalize { text-transform: capitalize; }
.section-title.uppercase { text-transform: uppercase; letter-spacing: 0.05em; }

/* Simple (no line) */
.section-title.simple { }

/* Underline */
.section-title.underline {
  padding-bottom: 0.25em;
  border-bottom: 2px solid var(--theme-title);
}

/* Border Bottom only width of text */
.section-title.underline .title-text {
  display: inline-block;
}

/* Border All */
.section-title.border-all {
  border: 1px solid var(--theme-title);
  padding: 0.25em 0.5em;
  display: inline-block;
  width: max-content;
}

/* Background Fill */
.section-title.bg-fill {
  background-color: var(--theme-title);
  color: white;
  padding: 0.25em 0.5em;
  display: inline-block;
  width: max-content;
}

/* Border Top Bottom */
.section-title.border-top-bottom {
  border-top: 1px solid var(--theme-title);
  border-bottom: 1px solid var(--theme-title);
  padding: 0.25em 0;
}

/* Lines Side */
.section-title.lines-side {
  display: flex;
  align-items: center;
  text-align: center;
  width: 100%;
}
.section-title.lines-side::before,
.section-title.lines-side::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid var(--theme-title);
}
.section-title.lines-side::before { margin-right: .5em; }
.section-title.lines-side::after { margin-left: .5em; }

/* Line Through */
.section-title.line-through {
  position: relative;
  text-align: center;
}
.section-title.line-through::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  border-bottom: 1px solid var(--theme-title);
  z-index: 1;
}
.section-title.line-through .title-text {
  background: white;
  padding: 0 10px;
  position: relative;
  z-index: 2;
  display: inline-block;
}

/* Dots */
.section-title.dots {
  padding-bottom: 0.25em;
  background-image: radial-gradient(circle, var(--theme-title) 1px, transparent 1px);
  background-size: 4px 4px;
  background-position: bottom;
  background-repeat: repeat-x;
}

/* Zigzag */
.section-title.zigzag {
  padding-bottom: 0.25em;
  border-bottom: 2px dashed var(--theme-title);
}

.body-text {
  margin: 0;
  color: var(--theme-text);
}

.rich-text-content {
  color: var(--theme-text);
  margin-top: 0.25em;
}
/* Ensure formatting inside rich text matches theme */
.rich-text-content :deep(ul), .rich-text-content :deep(ol) {
  margin: 0.25em 0;
  padding-left: 1.5em;
}
.rich-text-content :deep(p) {
  margin: 0.25em 0;
}

.resume-item {
  margin-bottom: 1em;
}
.resume-item:last-child {
  margin-bottom: 0;
}
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.15em;
}
.item-title {
  font-size: var(--font-size-entry-header);
  color: var(--theme-text);
  font-weight: 600;
}
.date {
  font-size: 0.9em;
  opacity: 0.8;
}
.item-subtitle {
  font-size: 0.95em;
  color: var(--theme-primary);
  font-weight: 500;
  margin-bottom: 0.35em;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
}
.skill-badge {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--theme-text);
  padding: 0.35em 0.85em;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
  border: 1px solid rgba(0,0,0,0.1);
}

.empty-state {
  text-align: center;
  padding: 2em;
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px dashed rgba(0,0,0,0.1);
  border-radius: 8px;
  opacity: 0.6;
}

@media print {
  @page {
    size: A4;
    margin: 0;
  }
  .a4-page {
    box-shadow: none !important;
    width: 210mm !important;
    min-height: 297mm !important;
  }
}
</style>
