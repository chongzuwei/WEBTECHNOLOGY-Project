<template>
  <div class="rich-text-editor">
    <div class="toolbar" v-if="!disabled">
      <button type="button" @click.prevent="format('bold')" :class="{ active: isActive('bold') }" title="Bold">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
      </button>
      <button type="button" @click.prevent="format('italic')" :class="{ active: isActive('italic') }" title="Italic">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
      </button>
      <button type="button" @click.prevent="format('underline')" :class="{ active: isActive('underline') }" title="Underline">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line></svg>
      </button>
      <div class="divider"></div>
      <button type="button" @click.prevent="format('insertUnorderedList')" :class="{ active: isActive('insertUnorderedList') }" title="Bullet List">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
      </button>
      <button type="button" @click.prevent="format('insertOrderedList')" :class="{ active: isActive('insertOrderedList') }" title="Numbered List">
         <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>
      </button>
      <div class="divider"></div>
      <button type="button" @click.prevent="format('justifyLeft')" :class="{ active: isActive('justifyLeft') }" title="Align Left">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="6" x2="3" y2="6"></line><line x1="15" y1="12" x2="3" y2="12"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>
      </button>
      <button type="button" @click.prevent="format('justifyCenter')" :class="{ active: isActive('justifyCenter') }" title="Align Center">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="6" x2="3" y2="6"></line><line x1="19" y1="12" x2="5" y2="12"></line><line x1="19" y1="18" x2="5" y2="18"></line></svg>
      </button>
      <button type="button" @click.prevent="format('justifyRight')" :class="{ active: isActive('justifyRight') }" title="Align Right">
         <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="12" x2="9" y2="12"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>
      </button>
    </div>
    <div
      ref="editorRef"
      class="editor-content"
      :class="{ disabled }"
      :contenteditable="!disabled"
      @input="handleInput"
      @blur="handleBlur"
      @keyup="updateActiveState"
      @mouseup="updateActiveState"
      v-html="localValue"
    ></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Enter description...'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const editorRef = ref(null)
const localValue = ref(props.modelValue)
const activeFormats = ref(new Set())

watch(() => props.modelValue, (newValue) => {
  if (editorRef.value && newValue !== editorRef.value.innerHTML) {
    localValue.value = newValue
    // Ensure content matches after Vue updates the v-html
    nextTick(() => {
      if (editorRef.value && !editorRef.value.innerHTML && !newValue) {
         editorRef.value.innerHTML = '';
      }
    });
  }
})

const format = (command, value = null) => {
  document.execCommand(command, false, value)
  updateActiveState()
  handleInput()
}

const updateActiveState = () => {
  const formats = ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList', 'justifyLeft', 'justifyCenter', 'justifyRight']
  const newActive = new Set()
  formats.forEach(f => {
    if (document.queryCommandState(f)) {
      newActive.add(f)
    }
  })
  activeFormats.value = newActive
}

const isActive = (command) => {
  return activeFormats.value.has(command)
}

const handleInput = () => {
  if (editorRef.value) {
    emit('update:modelValue', editorRef.value.innerHTML)
  }
}

const handleBlur = () => {
  updateActiveState()
}

onMounted(() => {
  // Set placeholder using CSS empty selector hack if needed, or handle it via a class
  if (editorRef.value && !props.modelValue) {
      editorRef.value.innerHTML = '';
  }
})
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--input-bg, #ffffff);
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: #f8fafc;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  gap: 0.25rem;
  flex-wrap: wrap;
}

.toolbar button {
  background: none;
  border: none;
  border-radius: 4px;
  padding: 0.25rem;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.toolbar button:hover {
  background-color: #e2e8f0;
  color: #0f172a;
}

.toolbar button.active {
  background-color: var(--primary-color-light, #e0e7ff);
  color: var(--primary-color, #4f46e5);
}

.divider {
  width: 1px;
  height: 20px;
  background-color: #cbd5e1;
  margin: 0 0.25rem;
}

.editor-content {
  padding: 0.75rem;
  min-height: 100px;
  outline: none;
  color: var(--text-primary, #334155);
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;
}

.editor-content:empty:before {
  content: attr(placeholder);
  color: #94a3b8;
  pointer-events: none;
  display: block; /* For Firefox */
}

.editor-content.disabled {
  background-color: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}

.editor-content:focus {
  box-shadow: inset 0 0 0 2px var(--primary-color-light, #e0e7ff);
}
</style>
