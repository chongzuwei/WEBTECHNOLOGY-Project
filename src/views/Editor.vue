<template>
  <div class="main-content editor-page-layout">
    
    <!-- Left panel: Form editor -->
    <div class="editor-left-panel no-print">
      
      <!-- Wizard Step indicators -->
      <div class="steps-progress-row">
        <div v-for="s in steps" :key="s.num" class="step-progress-item" :class="{ 'active': currentStep === s.num, 'completed': currentStep > s.num }" @click="goToStep(s.num)">
          <div class="step-num-icon">
            <span v-if="currentStep > s.num">✓</span>
            <span v-else>{{ s.num }}</span>
          </div>
          <span class="step-text">{{ s.name }}</span>
        </div>
      </div>

      <!-- Step 1: Personal Info Form -->
      <div v-if="currentStep === 1" class="step-form-container">
        <div class="form-header-block">
          <h2>Personal Details</h2>
          <p>Provide your contact information and a brief summary of your career background.</p>
        </div>

        <div class="form-card active-card">
          <div class="form-row-2">
            <div class="form-group">
              <label for="fullName">Full Name</label>
              <input id="fullName" v-model="storeState.resumeData.personal.name" class="form-input" placeholder="e.g. Alex Chen" />
            </div>
            <div class="form-group">
              <label for="jobTitle">Job Title / Role</label>
              <input id="jobTitle" v-model="storeState.resumeData.personal.title" class="form-input" placeholder="e.g. Frontend Developer" />
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" v-model="storeState.resumeData.personal.email" class="form-input" placeholder="e.g. alex@example.com" />
            </div>
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input id="phone" v-model="storeState.resumeData.personal.phone" class="form-input" placeholder="e.g. +86 138 0000 1234" />
            </div>
            <div class="form-group">
              <label for="location">Location</label>
              <input id="location" v-model="storeState.resumeData.personal.location" class="form-input" placeholder="e.g. Beijing, China" />
            </div>
          </div>

          <div class="form-group">
            <label for="summary">Professional Summary</label>
            <textarea id="summary" v-model="storeState.resumeData.personal.summary" rows="4" class="form-input text-area" placeholder="Briefly introduce yourself, your experience, and goals..."></textarea>
          </div>
        </div>
      </div>

      <!-- Step 2: Education History Form -->
      <div v-if="currentStep === 2" class="step-form-container">
        <div class="form-header-block">
          <h2>Education History</h2>
          <p>Add your academic background and qualifications.</p>
        </div>

        <div class="entries-list">
          <div v-for="(edu, idx) in storeState.resumeData.education" :key="edu.id" class="form-card entry-card" :class="{ 'active-card': activeEduId === edu.id }" @click="activeEduId = edu.id">
            <div class="entry-card-header">
              <span class="entry-label">Entry #{{ idx + 1 }}</span>
              <button @click.stop="removeEducation(edu.id)" class="btn-remove-entry">Remove</button>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label>School / University</label>
                <input v-model="edu.institution" class="form-input" placeholder="e.g. Peking University" />
              </div>
              <div class="form-group">
                <label>Degree / Qualification</label>
                <input v-model="edu.qualification" class="form-input" placeholder="e.g. Bachelor of Computer Science" />
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label>Start Date</label>
                <input v-model="edu.start_date" class="form-input" placeholder="e.g. 2021-09" />
              </div>
              <div class="form-group">
                <label>End Date</label>
                <input v-model="edu.end_date" class="form-input" placeholder="e.g. 2025-07" />
              </div>
            </div>

            <div class="form-group">
              <label>Description (optional)</label>
              <textarea v-model="edu.description" rows="2" class="form-input text-area" placeholder="Relevant courses, GPA, honors, etc..."></textarea>
            </div>
          </div>
        </div>

        <button @click="addEducation" class="btn-add-entry">+ Add Education</button>
      </div>

      <!-- Step 3: Work Experience Form -->
      <div v-if="currentStep === 3" class="step-form-container">
        <div class="form-header-block">
          <h2>Work Experience</h2>
          <p>List your professional work history, internships, or freelance experience.</p>
        </div>

        <div class="entries-list">
          <div v-for="(exp, idx) in storeState.resumeData.experience" :key="exp.id" class="form-card entry-card" :class="{ 'active-card': activeExpId === exp.id }" @click="activeExpId = exp.id">
            <div class="entry-card-header">
              <span class="entry-label">Entry #{{ idx + 1 }}</span>
              <button @click.stop="removeExperience(exp.id)" class="btn-remove-entry">Remove</button>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label>Company / Employer</label>
                <input v-model="exp.company_name" class="form-input" placeholder="e.g. TechSolutions Inc." />
              </div>
              <div class="form-group">
                <label>Job Title</label>
                <input v-model="exp.job_title" class="form-input" placeholder="e.g. Software Engineer" />
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label>Start Date</label>
                <input v-model="exp.start_date" class="form-input" placeholder="e.g. 2024-06" />
              </div>
              <div class="form-group">
                <label>End Date</label>
                <input v-model="exp.end_date" class="form-input" placeholder="e.g. Present" />
              </div>
            </div>

            <div class="form-group">
              <label>Description (optional)</label>
              <textarea v-model="exp.description" rows="4" class="form-input text-area" placeholder="Responsibilities and achievements (aim for quantifiable results)..."></textarea>
            </div>
          </div>
        </div>

        <button @click="addExperience" class="btn-add-entry">+ Add Experience</button>
      </div>

      <!-- Step 4: Technical Skills Form -->
      <div v-if="currentStep === 4" class="step-form-container">
        <div class="form-header-block">
          <h2>Skills</h2>
          <p>List technical skills, methodologies, or certifications that show your expertise.</p>
        </div>

        <div class="form-card active-card">
          <div class="skill-input-row">
            <div class="form-group flex-grow">
              <label for="newSkill">Add Skill</label>
              <input id="newSkill" v-model="newSkillName" @keypress.enter="addNewSkill" class="form-input" placeholder="e.g. React, Python, UI Design" />
            </div>
            <button @click="addNewSkill" class="btn-add-skill-button">Add</button>
          </div>

          <div class="skills-manager-container">
            <label class="section-label">Skills List (Click to delete)</label>
            <div class="skills-badge-list">
              <span v-for="skill in storeState.resumeData.skills" :key="skill.id" class="skill-manager-badge" @click="removeSkill(skill.id)">
                {{ skill.skill_name }}
                <span class="remove-x">×</span>
              </span>
              <span v-if="storeState.resumeData.skills.length === 0" class="no-skills-text">No skills added yet. Add skills above.</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Bottom Actions buttons -->
      <div class="form-bottom-actions">
        <button v-if="currentStep > 1" @click="prevStep" class="btn btn-secondary">
          ← Back: {{ steps[currentStep - 2].name }}
        </button>
        <div v-else></div>
        
        <button v-if="currentStep < 4" @click="nextStep" class="btn btn-primary">
          Next: {{ steps[currentStep].name }} →
        </button>
        <router-link v-else to="/versions" class="btn btn-primary">
          Finish & Export
        </router-link>
      </div>

    </div>

    <!-- Right panel: Live preview -->
    <div v-if="storeState.showLivePreview" class="editor-right-panel no-print">
      
      <!-- Preview Header Settings -->
      <div class="preview-settings-bar">
        <div class="settings-left">
          <span class="bar-lbl">Template:</span>
          <select v-model="storeState.resumeData.selected_template_id" class="template-selector-dropdown">
            <option v-for="t in storeTemplates" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
        </div>

        <div class="zoom-controls">
          <span class="bar-lbl">Zoom:</span>
          <button @click="zoomOut" class="btn-zoom-act">-</button>
          <span class="zoom-val">{{ storeState.zoomLevel }}%</span>
          <button @click="zoomIn" class="btn-zoom-act">+</button>
        </div>
      </div>

      <!-- Scrollable Resume viewport -->
      <div class="resume-viewport">
        
        <!-- Target container scaling based on zoom state -->
        <div class="resume-print-wrapper" :style="`transform: scale(${storeState.zoomLevel / 100}); transform-origin: top center;`">
          <div class="resume-preview-sheet" :class="activeTemplateClass">
            
            <!-- Render Templates dynamically based on ID -->
            
            <!-- MODERN BLUE (ID: 1) -->
            <div v-if="storeState.resumeData.selected_template_id === 1" class="template-modern-blue">
              <div class="resume-header">
                <h1>{{ storeState.resumeData.personal.name || 'Your Name' }}</h1>
                <div class="title">{{ storeState.resumeData.personal.title || 'Job Title' }}</div>
                <div class="contact-row">
                  <span v-if="storeState.resumeData.personal.email">✉ {{ storeState.resumeData.personal.email }}</span>
                  <span v-if="storeState.resumeData.personal.phone">📞 {{ storeState.resumeData.personal.phone }}</span>
                  <span v-if="storeState.resumeData.personal.location">📍 {{ storeState.resumeData.personal.location }}</span>
                </div>
              </div>
              <div class="resume-body">
                <!-- Left Main Column -->
                <div class="resume-left-col">
                  <!-- Summary -->
                  <div class="resume-section" v-if="storeState.resumeData.personal.summary">
                    <h2 class="resume-section-title">Summary</h2>
                    <p class="resume-entry-desc">{{ storeState.resumeData.personal.summary }}</p>
                  </div>
                  <!-- Education -->
                  <div class="resume-section">
                    <h2 class="resume-section-title">Education</h2>
                    <div v-for="edu in storeState.resumeData.education" :key="edu.id" class="resume-entry">
                      <div class="resume-entry-header">
                        <span class="institution-bold">{{ edu.institution || 'School/University' }}</span>
                        <span class="resume-entry-date">{{ edu.start_date || 'Start' }} – {{ edu.end_date || 'End' }}</span>
                      </div>
                      <div class="resume-entry-sub">{{ edu.qualification || 'Degree' }}</div>
                      <p class="resume-entry-desc" v-if="edu.description">{{ edu.description }}</p>
                    </div>
                    <div v-if="storeState.resumeData.education.length === 0" class="placeholder-item">
                      Complete Step 2 to add academic details.
                    </div>
                  </div>
                  <!-- Work Experience -->
                  <div class="resume-section">
                    <h2 class="resume-section-title">Work Experience</h2>
                    <div v-for="exp in storeState.resumeData.experience" :key="exp.id" class="resume-entry">
                      <div class="resume-entry-header">
                        <span class="company-bold">{{ exp.company_name || 'Company Name' }}</span>
                        <span class="resume-entry-date">{{ exp.start_date || 'Start' }} – {{ exp.end_date || 'End' }}</span>
                      </div>
                      <div class="resume-entry-sub">{{ exp.job_title || 'Job Title' }}</div>
                      <p class="resume-entry-desc" v-if="exp.description">{{ exp.description }}</p>
                    </div>
                    <div v-if="storeState.resumeData.experience.length === 0" class="placeholder-item">
                      Complete Step 3 to add work experience.
                    </div>
                  </div>
                </div>
                <!-- Right Side Column -->
                <div class="resume-right-col">
                  <div class="resume-section">
                    <h2 class="resume-section-title">Technical Skills</h2>
                    <div class="skills-tags-wrap">
                      <span v-for="skill in storeState.resumeData.skills" :key="skill.id" class="skill-tag">
                        {{ skill.skill_name }}
                      </span>
                    </div>
                    <div v-if="storeState.resumeData.skills.length === 0" class="placeholder-item">
                      Complete Step 4 to add skills.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ELEGANT CLASSIC (ID: 2) -->
            <div v-else-if="storeState.resumeData.selected_template_id === 2" class="template-elegant-classic">
              <div class="resume-header">
                <h1>{{ storeState.resumeData.personal.name || 'Your Name' }}</h1>
                <div class="title">{{ storeState.resumeData.personal.title || 'Job Title' }}</div>
                <div class="contact-row">
                  <span v-if="storeState.resumeData.personal.email">{{ storeState.resumeData.personal.email }}</span>
                  <span v-if="storeState.resumeData.personal.phone">• {{ storeState.resumeData.personal.phone }}</span>
                  <span v-if="storeState.resumeData.personal.location">• {{ storeState.resumeData.personal.location }}</span>
                </div>
              </div>
              <!-- Summary -->
              <div class="resume-section" v-if="storeState.resumeData.personal.summary">
                <h2 class="resume-section-title">Professional Summary</h2>
                <p class="resume-entry-desc">{{ storeState.resumeData.personal.summary }}</p>
              </div>
              <!-- Education -->
              <div class="resume-section">
                <h2 class="resume-section-title">Education</h2>
                <div v-for="edu in storeState.resumeData.education" :key="edu.id" class="resume-entry">
                  <div class="resume-entry-header">
                    <strong>{{ edu.institution || 'Institution' }}</strong>
                    <span class="resume-entry-date">{{ edu.start_date }} – {{ edu.end_date }}</span>
                  </div>
                  <div class="resume-entry-sub">{{ edu.qualification }}</div>
                  <p class="resume-entry-desc" v-if="edu.description">{{ edu.description }}</p>
                </div>
                <div v-if="storeState.resumeData.education.length === 0" class="placeholder-item">
                  Complete Step 2 to add academic details.
                </div>
              </div>
              <!-- Work Experience -->
              <div class="resume-section">
                <h2 class="resume-section-title">Experience</h2>
                <div v-for="exp in storeState.resumeData.experience" :key="exp.id" class="resume-entry">
                  <div class="resume-entry-header">
                    <strong>{{ exp.company_name || 'Company Name' }}</strong>
                    <span class="resume-entry-date">{{ exp.start_date }} – {{ exp.end_date }}</span>
                  </div>
                  <div class="resume-entry-sub">{{ exp.job_title }}</div>
                  <p class="resume-entry-desc" v-if="exp.description">{{ exp.description }}</p>
                </div>
                <div v-if="storeState.resumeData.experience.length === 0" class="placeholder-item">
                  Complete Step 3 to add experience.
                </div>
              </div>
              <!-- Skills -->
              <div class="resume-section">
                <h2 class="resume-section-title">Skills & Credentials</h2>
                <div class="skills-tags-wrap">
                  <span v-for="skill in storeState.resumeData.skills" :key="skill.id" class="skill-tag">
                    {{ skill.skill_name }}
                  </span>
                </div>
                <div v-if="storeState.resumeData.skills.length === 0" class="placeholder-item">
                  Complete Step 4 to add skills.
                </div>
              </div>
            </div>

            <!-- SIMPLE DARK (ID: 3) -->
            <div v-else-if="storeState.resumeData.selected_template_id === 3" class="template-simple-dark">
              <div class="sidebar">
                <div>
                  <h1>{{ storeState.resumeData.personal.name || 'Your Name' }}</h1>
                  <div class="title">{{ storeState.resumeData.personal.title || 'Job Title' }}</div>
                </div>
                <!-- Contact info inside dark bar -->
                <div class="sidebar-contact" style="font-size: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; opacity: 0.85;">
                  <div v-if="storeState.resumeData.personal.email">✉ {{ storeState.resumeData.personal.email }}</div>
                  <div v-if="storeState.resumeData.personal.phone">📞 {{ storeState.resumeData.personal.phone }}</div>
                  <div v-if="storeState.resumeData.personal.location">📍 {{ storeState.resumeData.personal.location }}</div>
                </div>
                <!-- Skills inside dark bar -->
                <div class="sidebar-section">
                  <h2 class="resume-section-title" style="color: white; border-color: #334155; margin-bottom: 0.5rem;">Skills</h2>
                  <div class="skills-tags-wrap">
                    <span v-for="skill in storeState.resumeData.skills" :key="skill.id" class="skill-tag">
                      {{ skill.skill_name }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="main-body">
                <!-- Summary -->
                <div class="resume-section" v-if="storeState.resumeData.personal.summary">
                  <h2 class="resume-section-title">Summary</h2>
                  <p class="resume-entry-desc" style="font-size: 0.8rem; color: #475569;">{{ storeState.resumeData.personal.summary }}</p>
                </div>
                <!-- Education -->
                <div class="resume-section" style="margin-top: 1.5rem;">
                  <h2 class="resume-section-title">Education</h2>
                  <div v-for="edu in storeState.resumeData.education" :key="edu.id" class="resume-entry">
                    <div class="resume-entry-header">
                      <strong>{{ edu.institution }}</strong>
                      <span class="resume-entry-date">{{ edu.start_date }} – {{ edu.end_date }}</span>
                    </div>
                    <div class="resume-entry-sub">{{ edu.qualification }}</div>
                    <p class="resume-entry-desc" v-if="edu.description">{{ edu.description }}</p>
                  </div>
                </div>
                <!-- Work Experience -->
                <div class="resume-section" style="margin-top: 1.5rem;">
                  <h2 class="resume-section-title">Experience</h2>
                  <div v-for="exp in storeState.resumeData.experience" :key="exp.id" class="resume-entry">
                    <div class="resume-entry-header">
                      <strong>{{ exp.company_name }}</strong>
                      <span class="resume-entry-date">{{ exp.start_date }} – {{ exp.end_date }}</span>
                    </div>
                    <div class="resume-entry-sub">{{ exp.job_title }}</div>
                    <p class="resume-entry-desc" v-if="exp.description">{{ exp.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- CREATIVE TEAL (ID: 4) -->
            <div v-else-if="storeState.resumeData.selected_template_id === 4" class="template-creative-teal">
              <div class="resume-header">
                <h1>{{ storeState.resumeData.personal.name || 'Your Name' }}</h1>
                <div class="title">{{ storeState.resumeData.personal.title || 'Job Title' }}</div>
                <div class="contact-row" style="display: flex; gap: 1rem; font-size: 0.8rem; opacity: 0.9;">
                  <span v-if="storeState.resumeData.personal.email">✉ {{ storeState.resumeData.personal.email }}</span>
                  <span v-if="storeState.resumeData.personal.phone">📞 {{ storeState.resumeData.personal.phone }}</span>
                  <span v-if="storeState.resumeData.personal.location">📍 {{ storeState.resumeData.personal.location }}</span>
                </div>
              </div>
              <div class="resume-body">
                <div class="resume-left-col">
                  <!-- Skills and Details sidebar in Creative template -->
                  <div class="resume-section">
                    <h2 class="resume-section-title">Skills</h2>
                    <div class="skills-tags-wrap">
                      <span v-for="skill in storeState.resumeData.skills" :key="skill.id" class="skill-tag">
                        {{ skill.skill_name }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="resume-right-col">
                  <!-- Summary -->
                  <div class="resume-section" v-if="storeState.resumeData.personal.summary">
                    <h2 class="resume-section-title">Profile</h2>
                    <p class="resume-entry-desc">{{ storeState.resumeData.personal.summary }}</p>
                  </div>
                  <!-- Education -->
                  <div class="resume-section" style="margin-top: 1rem;">
                    <h2 class="resume-section-title">Education</h2>
                    <div v-for="edu in storeState.resumeData.education" :key="edu.id" class="resume-entry">
                      <div class="resume-entry-header">
                        <strong>{{ edu.institution }}</strong>
                        <span class="resume-entry-date">{{ edu.start_date }} – {{ edu.end_date }}</span>
                      </div>
                      <div class="resume-entry-sub">{{ edu.qualification }}</div>
                      <p class="resume-entry-desc" v-if="edu.description">{{ edu.description }}</p>
                    </div>
                  </div>
                  <!-- Experience -->
                  <div class="resume-section" style="margin-top: 1rem;">
                    <h2 class="resume-section-title">Work Experience</h2>
                    <div v-for="exp in storeState.resumeData.experience" :key="exp.id" class="resume-entry">
                      <div class="resume-entry-header">
                        <strong>{{ exp.company_name }}</strong>
                        <span class="resume-entry-date">{{ exp.start_date }} – {{ exp.end_date }}</span>
                      </div>
                      <div class="resume-entry-sub">{{ exp.job_title }}</div>
                      <p class="resume-entry-desc" v-if="exp.description">{{ exp.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CLEAN GREEN (ID: 5) -->
            <div v-else-if="storeState.resumeData.selected_template_id === 5" class="template-clean-green">
              <div class="resume-header">
                <h1>{{ storeState.resumeData.personal.name || 'Your Name' }}</h1>
                <div class="title">{{ storeState.resumeData.personal.title || 'Job Title' }}</div>
                <div class="contact-row">
                  <span v-if="storeState.resumeData.personal.email">✉ {{ storeState.resumeData.personal.email }}</span>
                  <span v-if="storeState.resumeData.personal.phone">📞 {{ storeState.resumeData.personal.phone }}</span>
                  <span v-if="storeState.resumeData.personal.location">📍 {{ storeState.resumeData.personal.location }}</span>
                </div>
              </div>
              <!-- Summary -->
              <div class="resume-section" v-if="storeState.resumeData.personal.summary">
                <h2 class="resume-section-title">Summary</h2>
                <p class="resume-entry-desc">{{ storeState.resumeData.personal.summary }}</p>
              </div>
              <!-- Education -->
              <div class="resume-section">
                <h2 class="resume-section-title">Education Background</h2>
                <div v-for="edu in storeState.resumeData.education" :key="edu.id" class="resume-entry">
                  <div class="resume-entry-header">
                    <strong>{{ edu.institution }}</strong>
                    <span class="resume-entry-date">{{ edu.start_date }} – {{ edu.end_date }}</span>
                  </div>
                  <div class="resume-entry-sub">{{ edu.qualification }}</div>
                  <p class="resume-entry-desc" v-if="edu.description">{{ edu.description }}</p>
                </div>
              </div>
              <!-- Experience -->
              <div class="resume-section">
                <h2 class="resume-section-title">Work Experience</h2>
                <div v-for="exp in storeState.resumeData.experience" :key="exp.id" class="resume-entry">
                  <div class="resume-entry-header">
                    <strong>{{ exp.company_name }}</strong>
                    <span class="resume-entry-date">{{ exp.start_date }} – {{ exp.end_date }}</span>
                  </div>
                  <div class="resume-entry-sub">{{ exp.job_title }}</div>
                  <p class="resume-entry-desc" v-if="exp.description">{{ exp.description }}</p>
                </div>
              </div>
              <!-- Skills -->
              <div class="resume-section">
                <h2 class="resume-section-title">Key Skills</h2>
                <div class="skills-tags-wrap">
                  <span v-for="skill in storeState.resumeData.skills" :key="skill.id" class="skill-tag">
                    {{ skill.skill_name }}
                  </span>
                </div>
              </div>
            </div>

            <!-- WARM AMBER (ID: 6) -->
            <div v-else class="template-warm-amber">
              <div class="resume-header">
                <h1>{{ storeState.resumeData.personal.name || 'Your Name' }}</h1>
                <div class="title">{{ storeState.resumeData.personal.title || 'Job Title' }}</div>
              </div>
              <!-- Contact details inside amber -->
              <div class="contact-details-row" style="font-size:0.8rem; display:flex; gap:1.5rem; margin-bottom:1rem; color:#b45309;">
                <span v-if="storeState.resumeData.personal.email">✉ {{ storeState.resumeData.personal.email }}</span>
                <span v-if="storeState.resumeData.personal.phone">📞 {{ storeState.resumeData.personal.phone }}</span>
                <span v-if="storeState.resumeData.personal.location">📍 {{ storeState.resumeData.personal.location }}</span>
              </div>
              <!-- Summary -->
              <div class="resume-section" v-if="storeState.resumeData.personal.summary">
                <h2 class="resume-section-title">Career Overview</h2>
                <p class="resume-entry-desc">{{ storeState.resumeData.personal.summary }}</p>
              </div>
              <!-- Education -->
              <div class="resume-section">
                <h2 class="resume-section-title">Education</h2>
                <div v-for="edu in storeState.resumeData.education" :key="edu.id" class="resume-entry">
                  <div class="resume-entry-header">
                    <strong>{{ edu.institution }}</strong>
                    <span class="resume-entry-date">{{ edu.start_date }} – {{ edu.end_date }}</span>
                  </div>
                  <div class="resume-entry-sub">{{ edu.qualification }}</div>
                  <p class="resume-entry-desc" v-if="edu.description">{{ edu.description }}</p>
                </div>
              </div>
              <!-- Experience -->
              <div class="resume-section">
                <h2 class="resume-section-title">Professional Experience</h2>
                <div v-for="exp in storeState.resumeData.experience" :key="exp.id" class="resume-entry">
                  <div class="resume-entry-header">
                    <strong>{{ exp.company_name }}</strong>
                    <span class="resume-entry-date">{{ exp.start_date }} – {{ exp.end_date }}</span>
                  </div>
                  <div class="resume-entry-sub">{{ exp.job_title }}</div>
                  <p class="resume-entry-desc" v-if="exp.description">{{ exp.description }}</p>
                </div>
              </div>
              <!-- Skills -->
              <div class="resume-section">
                <h2 class="resume-section-title">Professional Skills</h2>
                <div class="skills-tags-wrap">
                  <span v-for="skill in storeState.resumeData.skills" :key="skill.id" class="skill-tag">
                    {{ skill.skill_name }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- Action buttons under Live preview -->
      <div class="preview-bottom-actions">
        <button @click="triggerPrint" class="btn btn-primary flex-grow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Export PDF
        </button>
        <button @click="shareLink" class="btn btn-secondary">
          Share Link
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { store } from '@/services/store'

export default {
  setup() {
    const currentStep = ref(1)
    const storeState = store.state
    const storeTemplates = store.templates

    // Tracking active card selections
    const activeEduId = ref(null)
    const activeExpId = ref(null)

    // Skills tagging inputs
    const newSkillName = ref('')

    const steps = [
      { num: 1, name: 'Personal' },
      { num: 2, name: 'Education' },
      { num: 3, name: 'Experience' },
      { num: 4, name: 'Skills' }
    ]

    function goToStep(stepNum) {
      currentStep.value = stepNum
    }
    function nextStep() {
      if (currentStep.value < 4) currentStep.value++
    }
    function prevStep() {
      if (currentStep.value > 1) currentStep.value--
    }

    // Education CRUD handlers
    function addEducation() {
      store.addEducation()
      // Auto focus the new entry
      const last = storeState.resumeData.education[storeState.resumeData.education.length - 1]
      if (last) activeEduId.value = last.id
    }
    function removeEducation(id) {
      store.removeEducation(id)
      if (activeEduId.value === id) activeEduId.value = null
    }

    // Experience CRUD handlers
    function addExperience() {
      store.addExperience()
      const last = storeState.resumeData.experience[storeState.resumeData.experience.length - 1]
      if (last) activeExpId.value = last.id
    }
    function removeExperience(id) {
      store.removeExperience(id)
      if (activeExpId.value === id) activeExpId.value = null
    }

    // Skills handlers
    function addNewSkill() {
      if (newSkillName.value.trim()) {
        store.addSkill(newSkillName.value.trim())
        newSkillName.value = ''
      }
    }
    function removeSkill(id) {
      store.removeSkill(id)
    }

    // Zoom Handlers
    function zoomIn() {
      if (storeState.zoomLevel < 120) {
        storeState.zoomLevel += 10
      }
    }
    function zoomOut() {
      if (storeState.zoomLevel > 50) {
        storeState.zoomLevel -= 10
      }
    }

    // Active design classes
    const activeTemplateClass = computed(() => {
      const id = storeState.resumeData.selected_template_id
      return `template-${store.templates.find(t => t.id === id)?.name.toLowerCase().replace(' ', '-') || 'modern-blue'}`
    })

    function triggerPrint() {
      window.print()
      store.addExportRecord(`${storeState.resumeData.title}.pdf`, 'PDF')
    }

    function shareLink() {
      const dummyLink = `${window.location.origin}/preview/share-${Date.now()}`
      navigator.clipboard.writeText(dummyLink).then(() => {
        alert('Resume link copied to clipboard!')
      }).catch(() => {
        alert(`Share link created: ${dummyLink}`)
      })
    }

    onMounted(() => {
      // Default active selections on mount
      if (storeState.resumeData.education.length > 0) {
        activeEduId.value = storeState.resumeData.education[0].id
      }
      if (storeState.resumeData.experience.length > 0) {
        activeExpId.value = storeState.resumeData.experience[0].id
      }
    })

    return {
      currentStep,
      steps,
      storeState,
      storeTemplates,
      activeEduId,
      activeExpId,
      newSkillName,
      goToStep,
      nextStep,
      prevStep,
      addEducation,
      removeEducation,
      addExperience,
      removeExperience,
      addNewSkill,
      removeSkill,
      zoomIn,
      zoomOut,
      activeTemplateClass,
      triggerPrint,
      shareLink
    }
  }
}
</script>

<style scoped>
.editor-page-layout {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  height: calc(100vh - 64px);
  overflow: hidden;
}

/* Left panel form style rules */
.editor-left-panel {
  padding: 1.5rem 2rem;
  overflow-y: auto;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  background-color: white;
}

.steps-progress-row {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.step-progress-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity var(--transition-fast);
}

.step-progress-item.active {
  opacity: 1;
}

.step-progress-item.completed {
  opacity: 0.85;
}

.step-num-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #cbd5e1;
  color: var(--color-text-main);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}

.step-progress-item.active .step-num-icon {
  background-color: var(--color-primary);
  color: white;
}

.step-progress-item.completed .step-num-icon {
  background-color: var(--color-success-light);
  color: var(--color-success);
  border: 1px solid var(--color-success);
}

.step-text {
  font-size: 0.875rem;
  font-weight: 600;
}

.form-header-block {
  margin-bottom: 1.5rem;
}

.form-header-block h2 {
  font-family: var(--font-brand);
  font-weight: 700;
  font-size: 1.35rem;
  color: var(--color-text-main);
  margin-bottom: 0.25rem;
}

.form-header-block p {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

/* Card details list in forms */
.form-card {
  background-color: #fafbfc;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  margin-bottom: 1.25rem;
  transition: all var(--transition-normal);
}

.form-card.active-card {
  border-color: var(--color-primary);
  background-color: white;
  box-shadow: var(--shadow-sm);
}

.entry-card {
  cursor: pointer;
}

.entry-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
}

.entry-label {
  font-weight: 700;
  font-size: 0.8rem;
  color: var(--color-primary);
  background-color: var(--color-primary-light);
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}

.btn-remove-entry {
  border: none;
  background-color: transparent;
  color: var(--color-danger);
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}
.btn-remove-entry:hover {
  text-decoration: underline;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-row-3 {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 1rem;
}

.text-area {
  resize: vertical;
}

.btn-add-entry {
  width: 100%;
  border: 1px dashed var(--color-primary);
  color: var(--color-primary);
  background-color: var(--color-primary-light);
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: 1.5rem;
}

.btn-add-entry:hover {
  background-color: #dbeafe;
}

/* Skills tagging */
.skill-input-row {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.flex-grow {
  flex: 1;
}
.flex-grow input {
  margin-bottom: 0;
}

.btn-add-skill-button {
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.625rem 1.25rem;
  font-weight: 700;
  height: 38px;
  cursor: pointer;
}

.skills-manager-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.skills-badge-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  border: 1px solid var(--color-border);
  background-color: #f8fafc;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  min-height: 80px;
}

.skill-manager-badge {
  background-color: white;
  border: 1px solid var(--color-border);
  padding: 0.25rem 0.625rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-main);
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.skill-manager-badge:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background-color: var(--color-danger-light);
}

.remove-x {
  opacity: 0.6;
}

.no-skills-text {
  font-size: 0.8rem;
  color: var(--color-text-light);
  margin: auto;
}

.form-bottom-actions {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  border-top: 1px solid var(--color-border);
  padding-top: 1.25rem;
}

/* Right panel live preview style rules */
.editor-right-panel {
  display: flex;
  flex-direction: column;
  background-color: #cbd5e1;
  padding: 1.5rem;
  height: 100%;
}

.preview-settings-bar {
  display: flex;
  justify-content: space-between;
  background-color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  margin-bottom: 1rem;
  font-size: 0.8rem;
}

.settings-left, .zoom-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bar-lbl {
  font-weight: 700;
  color: var(--color-text-muted);
}

.template-selector-dropdown {
  border: 1px solid var(--color-border);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: #f8fafc;
  font-weight: 600;
  outline: none;
}

.btn-zoom-act {
  width: 24px;
  height: 24px;
  background-color: #f1f5f9;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-zoom-act:hover {
  background-color: #e2e8f0;
}

.zoom-val {
  font-weight: 700;
  color: var(--color-text-main);
  min-width: 36px;
  text-align: center;
}

.resume-viewport {
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1.5rem 0;
  background-color: #cbd5e1;
}

.resume-print-wrapper {
  width: 595px; /* Fixed rendering width representing A4 proportion scale target */
  flex-shrink: 0;
  box-shadow: var(--shadow-lg);
}

.placeholder-item {
  border: 1px dashed var(--color-border);
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
  color: var(--color-text-light);
  font-size: 0.75rem;
  font-style: italic;
  margin-top: 0.5rem;
}

.preview-bottom-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>
