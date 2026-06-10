<template>
  <div class="form-section">
    <!-- Font Size Section -->
    <div class="customize-group">
      <h3>Font Size</h3>
      
      <div class="font-size-slider">
        <label>Base Font Size</label>
        <div class="slider-controls">
          <input type="range" v-model.number="state.theme.fontSize.base" min="7" max="12" step="1" />
          <span class="size-value">{{ state.theme.fontSize.base }}pt</span>
          <div class="adjust-buttons-group">
            <button type="button" class="btn-adjust" @click="adjustValue('fontSize.base', -1, 7, 12, true)">-</button>
            <button type="button" class="btn-adjust" @click="adjustValue('fontSize.base', 1, 7, 12, true)">+</button>
          </div>
        </div>
      </div>

      <div class="font-size-slider">
        <label>Full Name</label>
        <div class="slider-controls">
          <input type="range" v-model.number="state.theme.fontSize.name" min="10" max="36" step="1" />
          <span class="size-value">+{{ state.theme.fontSize.name - state.theme.fontSize.base }}pt</span>
          <div class="adjust-buttons-group">
            <button type="button" class="btn-adjust" @click="adjustValue('fontSize.name', -1, 10, 36, true)">-</button>
            <button type="button" class="btn-adjust" @click="adjustValue('fontSize.name', 1, 10, 36, true)">+</button>
          </div>
        </div>
      </div>

      <div class="font-size-slider">
        <label>Professional Title</label>
        <div class="slider-controls">
          <input type="range" v-model.number="state.theme.fontSize.title" min="8" max="24" step="1" />
          <span class="size-value">+{{ state.theme.fontSize.title - state.theme.fontSize.base }}pt</span>
          <div class="adjust-buttons-group">
            <button type="button" class="btn-adjust" @click="adjustValue('fontSize.title', -1, 8, 24, true)">-</button>
            <button type="button" class="btn-adjust" @click="adjustValue('fontSize.title', 1, 8, 24, true)">+</button>
          </div>
        </div>
      </div>

      <div class="font-size-slider">
        <label>Section Headings</label>
        <div class="slider-controls">
          <input type="range" v-model.number="state.theme.fontSize.headings" min="8" max="20" step="1" />
          <span class="size-value">+{{ state.theme.fontSize.headings - state.theme.fontSize.base }}pt</span>
          <div class="adjust-buttons-group">
            <button type="button" class="btn-adjust" @click="adjustValue('fontSize.headings', -1, 8, 20, true)">-</button>
            <button type="button" class="btn-adjust" @click="adjustValue('fontSize.headings', 1, 8, 20, true)">+</button>
          </div>
        </div>
      </div>

      <div class="font-size-slider">
        <label>Entry Header</label>
        <div class="slider-controls">
          <input type="range" v-model.number="state.theme.fontSize.entryHeader" min="8" max="18" step="1" />
          <span class="size-value">+{{ state.theme.fontSize.entryHeader - state.theme.fontSize.base }}pt</span>
          <div class="adjust-buttons-group">
            <button type="button" class="btn-adjust" @click="adjustValue('fontSize.entryHeader', -1, 8, 18, true)">-</button>
            <button type="button" class="btn-adjust" @click="adjustValue('fontSize.entryHeader', 1, 8, 18, true)">+</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Headings Section -->
    <div class="customize-group">
      <h3>Section Headings</h3>
      
      <div class="form-group">
        <label>Style</label>
        <div class="style-grid">
          <button type="button" :class="{ active: state.theme.headingStyle === 'underline' }" @click="state.theme.headingStyle = 'underline'">
            <div class="style-preview underline-preview"></div>
          </button>
          <button type="button" :class="{ active: state.theme.headingStyle === 'border-all' }" @click="state.theme.headingStyle = 'border-all'">
             <div class="style-preview border-all-preview"></div>
          </button>
          <button type="button" :class="{ active: state.theme.headingStyle === 'bg-fill' }" @click="state.theme.headingStyle = 'bg-fill'">
             <div class="style-preview bg-fill-preview"></div>
          </button>
          <button type="button" :class="{ active: state.theme.headingStyle === 'border-top-bottom' }" @click="state.theme.headingStyle = 'border-top-bottom'">
             <div class="style-preview border-tb-preview"></div>
          </button>
          <button type="button" :class="{ active: state.theme.headingStyle === 'lines-side' }" @click="state.theme.headingStyle = 'lines-side'">
             <div class="style-preview lines-side-preview"></div>
          </button>
          <button type="button" :class="{ active: state.theme.headingStyle === 'line-through' }" @click="state.theme.headingStyle = 'line-through'">
             <div class="style-preview line-through-preview"></div>
          </button>
          <button type="button" :class="{ active: state.theme.headingStyle === 'dots' }" @click="state.theme.headingStyle = 'dots'">
             <div class="style-preview dots-preview"></div>
          </button>
          <button type="button" :class="{ active: state.theme.headingStyle === 'zigzag' }" @click="state.theme.headingStyle = 'zigzag'">
             <div class="style-preview zigzag-preview"></div>
          </button>
        </div>
      </div>

      <div class="form-group">
        <label>Capitalization</label>
        <div class="radio-buttons-group">
          <button type="button" :class="{ active: state.theme.headingCapitalization === 'capitalize' }" @click="state.theme.headingCapitalization = 'capitalize'">Capitalize</button>
          <button type="button" :class="{ active: state.theme.headingCapitalization === 'uppercase' }" @click="state.theme.headingCapitalization = 'uppercase'">UPPERCASE</button>
        </div>
      </div>
      
      <div class="form-group">
        <label>Icons</label>
        <div class="radio-buttons-group">
          <button type="button" :class="{ active: state.theme.iconStyle === 'none' }" @click="state.theme.iconStyle = 'none'">None</button>
          <button type="button" :class="{ active: state.theme.iconStyle === 'outline' }" @click="state.theme.iconStyle = 'outline'">Outline</button>
          <button type="button" :class="{ active: state.theme.iconStyle === 'solid' }" @click="state.theme.iconStyle = 'solid'">Filled</button>
        </div>
      </div>
    </div>

    <div class="customize-group">
      <h3>Typography & Spacing</h3>
      <div class="form-group">
        <label>Font Family</label>
        <select v-model="state.theme.fontFamily">
          <option value="Inter">Inter</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
        </select>
      </div>
      <div class="form-group">
        <label>Line Height</label>
        <div class="slider-controls">
          <input type="range" v-model.number="state.theme.lineHeight" min="1.1" max="2.0" step="0.1" />
          <span class="size-value">{{ state.theme.lineHeight }}</span>
          <div class="adjust-buttons-group">
            <button type="button" class="btn-adjust" @click="adjustValue('lineHeight', -0.1, 1.1, 2.0)">-</button>
            <button type="button" class="btn-adjust" @click="adjustValue('lineHeight', 0.1, 1.1, 2.0)">+</button>
          </div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>X Margin (mm)</label>
          <div class="slider-controls">
            <input type="range" v-model.number="state.theme.marginX" min="5" max="50" step="1" />
            <span class="size-value">{{ state.theme.marginX }}mm</span>
            <div class="adjust-buttons-group">
              <button type="button" class="btn-adjust" @click="adjustValue('marginX', -1, 5, 50)">-</button>
              <button type="button" class="btn-adjust" @click="adjustValue('marginX', 1, 5, 50)">+</button>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>Y Margin (mm)</label>
          <div class="slider-controls">
            <input type="range" v-model.number="state.theme.marginY" min="5" max="50" step="1" />
            <span class="size-value">{{ state.theme.marginY }}mm</span>
            <div class="adjust-buttons-group">
              <button type="button" class="btn-adjust" @click="adjustValue('marginY', -1, 5, 50)">-</button>
              <button type="button" class="btn-adjust" @click="adjustValue('marginY', 1, 5, 50)">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="customize-group">
      <h3>Colors</h3>
      <div class="form-row">
        <div class="form-group">
          <label>Primary</label>
          <input type="color" v-model="state.theme.primaryColor" />
        </div>
        <div class="form-group">
          <label>Section Titles</label>
          <input type="color" v-model="state.theme.titleColor" />
        </div>
        <div class="form-group">
          <label>Body Text</label>
          <input type="color" v-model="state.theme.textColor" />
        </div>
      </div>
    </div>

    <div class="customize-group">
      <h3>Header Layout</h3>
      <div class="form-group">
        <label>Text Alignment</label>
        <div class="radio-buttons-group">
          <button type="button" :class="{ active: state.theme.headerAlignment === 'left' }" @click="state.theme.headerAlignment = 'left'">Left</button>
          <button type="button" :class="{ active: state.theme.headerAlignment === 'center' }" @click="state.theme.headerAlignment = 'center'">Center</button>
          <button type="button" :class="{ active: state.theme.headerAlignment === 'right' }" @click="state.theme.headerAlignment = 'right'">Right</button>
        </div>
      </div>
      <div class="form-group">
        <label>Contact Details Arrangement</label>
        <div class="radio-buttons-group">
          <button type="button" :class="{ active: state.theme.headerDetailsArrangement === 'row' }" @click="state.theme.headerDetailsArrangement = 'row'">Row</button>
          <button type="button" :class="{ active: state.theme.headerDetailsArrangement === 'column' }" @click="state.theme.headerDetailsArrangement = 'column'">Column</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useResume } from '@/composables/useResume'

const { state } = useResume()

const adjustValue = (path, delta, min, max, isNested = false) => {
  if (isNested) {
    const keys = path.split('.')
    let current = state.theme
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    const lastKey = keys[keys.length - 1]
    let val = Number(current[lastKey])
    val = Number((val + delta).toFixed(2))
    if (val < min) val = min
    if (val > max) val = max
    current[lastKey] = val
  } else {
    let val = Number(state.theme[path])
    val = Number((val + delta).toFixed(2))
    if (val < min) val = min
    if (val > max) val = max
    state.theme[path] = val
  }
}
</script>

<style scoped>
.form-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.customize-group {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}
.customize-group h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
}
label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  justify-content: space-between;
}

/* Font Size Sliders */
.font-size-slider {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.slider-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.slider-controls input[type="range"] {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}
.slider-controls input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
}
.btn-adjust {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: white;
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  padding: 0;
  line-height: 1;
}
.btn-adjust:hover {
  background-color: var(--primary-color-light);
  border-color: var(--primary-color);
  color: var(--primary-color-dark);
}
.btn-adjust:active {
  transform: scale(0.95);
}
.adjust-buttons-group {
  display: flex;
  gap: 4px;
}
.size-value {
  font-size: 0.875rem;
  color: #64748b;
  min-width: 48px;
  text-align: right;
}

/* Style Grid */
.style-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}
.style-grid button {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0.5rem;
}
.style-grid button:hover {
  border-color: #cbd5e1;
}
.style-grid button.active {
  border-color: var(--primary-color);
  background-color: var(--primary-color-light);
}
.style-preview {
  width: 100%;
  height: 100%;
  background-color: #cbd5e1;
}
.style-grid button.active .style-preview {
  background-color: var(--primary-color);
}

/* Specific Style Previews */
.underline-preview { height: 2px; align-self: flex-end; width: 60%; margin-right: auto; }
.border-all-preview { background-color: transparent; border: 2px solid #cbd5e1; height: 60%; width: 60%; }
.bg-fill-preview { height: 60%; width: 60%; border-radius: 2px; }
.border-tb-preview { background-color: transparent; border-top: 2px solid #cbd5e1; border-bottom: 2px solid #cbd5e1; height: 60%; width: 80%; }
.lines-side-preview { height: 4px; width: 30%; margin-right: auto; }
.line-through-preview { height: 2px; width: 80%; }
.dots-preview { background-image: radial-gradient(circle, #cbd5e1 2px, transparent 2px); background-size: 6px 6px; background-position: bottom; background-repeat: repeat-x; height: 100%; width: 80%; background-color: transparent; }
.zigzag-preview { background-color: transparent; border-bottom: 2px dashed #cbd5e1; height: 50%; width: 80%; }

.style-grid button.active .border-all-preview { border-color: var(--primary-color); }
.style-grid button.active .border-tb-preview { border-color: var(--primary-color); }
.style-grid button.active .dots-preview { background-image: radial-gradient(circle, var(--primary-color) 2px, transparent 2px); }
.style-grid button.active .zigzag-preview { border-color: var(--primary-color); }

/* Radio Buttons Group */
.radio-buttons-group {
  display: flex;
  gap: 0.5rem;
}
.radio-buttons-group button {
  flex: 1;
  padding: 0.5rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}
.radio-buttons-group button:hover {
  background-color: #f8fafc;
}
.radio-buttons-group button.active {
  border-color: var(--primary-color);
  background-color: var(--primary-color-light);
  color: var(--primary-color-dark);
  font-weight: 500;
}

input[type="color"] {
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  padding: 0;
}
select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  background-color: var(--input-bg);
}
</style>
