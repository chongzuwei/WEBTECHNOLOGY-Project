<template>
  <div class="main-content container admin-dashboard-layout">
    
    <!-- Header Platform Stats Row (5 KPI blocks) -->
    <div class="admin-stats-row">
      <div class="card stat-card">
        <div class="card-icon blue">👥</div>
        <div class="card-details">
          <span class="val">{{ users.length }}</span>
          <span class="lbl">Total Users</span>
        </div>
      </div>
      
      <div class="card stat-card">
        <div class="card-icon green">📁</div>
        <div class="card-details">
          <span class="val">{{ resumes.length }}</span>
          <span class="lbl">Active Resumes</span>
        </div>
      </div>

      <div class="card stat-card">
        <div class="card-icon purple">🎨</div>
        <div class="card-details">
          <span class="val">{{ activeTemplatesCount }}</span>
          <span class="lbl">Active Templates</span>
        </div>
      </div>

      <div class="card stat-card">
        <div class="card-icon orange">↓</div>
        <div class="card-details">
          <span class="val">{{ storeState.globalExportsLog.length }}</span>
          <span class="lbl">Total Exports</span>
        </div>
      </div>

      <div class="card stat-card">
        <div class="card-icon teal">👁️</div>
        <div class="card-details">
          <span class="val">{{ storeState.previewSessionsCounter }}</span>
          <span class="lbl">Preview Sessions</span>
        </div>
      </div>
    </div>

    <!-- Main Navigation Tabs -->
    <div class="admin-nav-tabs">
      <button @click="activeTab = 'users'" class="tab-btn" :class="{ 'active': activeTab === 'users' }">
        👥 Manage Users
      </button>
      <button @click="activeTab = 'templates'" class="tab-btn" :class="{ 'active': activeTab === 'templates' }">
        🎨 Manage Templates
      </button>
      <button @click="activeTab = 'exports'" class="tab-btn" :class="{ 'active': activeTab === 'exports' }">
        📋 Global Export Logs
      </button>
    </div>

    <!-- Tab 1: User Management -->
    <div v-if="activeTab === 'users'" class="admin-tab-content">
      <div class="content-header-row">
        <div>
          <h3>User Management</h3>
          <p class="subtitle">Manage all registered users on the platform</p>
        </div>
        <button @click="openUserModal(null)" class="btn btn-primary btn-add-new">+ Add New User</button>
      </div>

      <!-- Filters & Search Bar -->
      <div class="admin-filters-bar">
        <div class="search-input-wrapper">
          <input type="text" v-model="userSearchQuery" class="form-input search-box" placeholder="Search users by name or email..." />
        </div>
        <div class="filters-group-right">
          <div class="role-filter-wrapper">
            <select v-model="userRoleFilter" class="filter-dropdown">
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="card table-card">
        <table class="admin-data-table">
          <thead>
            <tr>
              <th class="checkbox-th"><input type="checkbox" /></th>
              <th>USER</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>REGISTERED</th>
              <th>RESUMES</th>
              <th class="actions-th">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in filteredUsers" :key="u.id">
              <td class="checkbox-td"><input type="checkbox" /></td>
              <td class="user-name-cell">
                <span class="user-avatar-initial" :class="getAvatarColorClass(u.name)">
                  {{ u.name.charAt(0).toUpperCase() }}{{ u.name.split(' ')[1] ? u.name.split(' ')[1].charAt(0).toUpperCase() : '' }}
                </span>
                <div>
                  <div class="user-name-text">{{ u.name }}</div>
                  <div class="user-id-sub">#00{{ u.id }}</div>
                </div>
              </td>
              <td>{{ u.email }}</td>
              <td>
                <span class="badge" :class="u.role === 'admin' ? 'badge-danger' : 'badge-pdf'">
                  {{ u.role === 'admin' ? 'Admin' : 'Student' }}
                </span>
              </td>
              <td>{{ getRegistrationDate(u) }}</td>
              <td class="resumes-count-cell">
                <div class="resumes-flex-wrap">
                  <span class="count-val">{{ getUserResumesCount(u.id) }}</span>
                  <div class="resume-progress-track">
                    <div class="resume-progress-bar" 
                         :class="getResumeBarColorClass(getUserResumesCount(u.id), u.id)"
                         :style="`width: ${Math.min(getUserResumesCount(u.id) * 20, 100)}%`">
                    </div>
                  </div>
                </div>
              </td>
              <td class="actions-cell">
                <button @click="openViewUserModal(u)" class="btn-table-action btn-view" title="View Profile">👁️</button>
                <button @click="openUserModal(u)" class="btn-table-action btn-edit" title="Edit Settings">✏️</button>
                <button @click="deleteUserLocal(u.id)" class="btn-table-action btn-delete" :disabled="u.role === 'admin'" title="Delete Account">🗑️</button>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="7" class="no-results-td">No user accounts matched your filters.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tab 2: Template Library Management (Cards Grid with sidebar) -->
    <div v-else-if="activeTab === 'templates'" class="admin-tab-content templates-grid-layout">
      <!-- Left: Main Templates list -->
      <div class="templates-main-area">
        <div class="content-header-row">
          <div>
            <h3>Template Library</h3>
            <p class="subtitle">Manage all resume templates available to users</p>
          </div>
          <div class="header-right-stats">
            <span class="stats-counter"><strong>{{ storeState.templates.length }}</strong> templates · <strong>{{ activeTemplatesCount }}</strong> active</span>
            <button @click="startAddTemplate" class="btn btn-primary btn-add-new">+ Add New Template</button>
          </div>
        </div>

        <!-- Filters & Search Bar -->
        <div class="admin-filters-bar">
          <div class="search-input-wrapper">
            <input type="text" v-model="templateSearchQuery" class="form-input search-box" placeholder="Search templates..." />
          </div>
          
          <div class="filters-group-right">
            <div class="role-filter-wrapper">
              <select v-model="templateTagFilter" class="filter-dropdown">
                <option value="all">All Styles</option>
                <option value="Modern">Modern</option>
                <option value="Classic">Classic</option>
                <option value="Minimal">Minimal</option>
                <option value="Creative">Creative</option>
              </select>
            </div>

            <div class="role-filter-wrapper">
              <select v-model="templateStatusFilter" class="filter-dropdown">
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Disabled Only</option>
              </select>
            </div>

            <!-- Layout switches -->
            <div class="layout-toggle-btns">
              <button @click="templateViewMode = 'grid'" class="toggle-layout-btn" :class="{ 'active': templateViewMode === 'grid' }" title="Grid Layout">
                Grid
              </button>
              <button @click="templateViewMode = 'list'" class="toggle-layout-btn" :class="{ 'active': templateViewMode === 'list' }" title="List Layout">
                List
              </button>
            </div>
          </div>
        </div>

        <!-- Templates Grid Mode -->
        <div v-if="templateViewMode === 'grid'" class="templates-cards-grid">
          <!-- Iterate Templates -->
          <div v-for="t in filteredTemplates" :key="t.id" class="template-card" :class="{ 'editing-border': editingTemplateId === t.id }" @click="selectTemplateForEdit(t)">
            <div class="template-card-preview-area">
              <!-- Top-left indicator -->
              <span v-if="editingTemplateId === t.id" class="badge-editing">Editing</span>

              <!-- Top-right badge -->
              <span class="badge-status" :class="t.is_active === 1 ? 'active' : 'disabled'">
                <span class="dot"></span> {{ t.is_active === 1 ? 'Active' : 'Disabled' }}
              </span>

              <!-- Real-time dynamic CSS mock sheet preview -->
              <div class="mock-resume-sheet-preview" :style="{
                fontFamily: t.font_family || 'Inter',
                borderColor: t.primary_color || '#cbd5e1'
              }">
                <!-- Top header layout: shown for 2-column, single-column, card-layout -->
                <div v-if="t.layout_type !== 'sidebar'" class="preview-header-mock" :style="{
                  backgroundColor: t.layout_type === '2-column' || t.layout_type === 'card-layout' ? (t.primary_color + '15') : 'transparent',
                  alignItems: t.layout_type === 'single-column' ? 'center' : 'flex-start',
                  borderBottom: '1px solid ' + (t.layout_type === '2-column' || t.layout_type === 'card-layout' ? t.primary_color + '30' : '#f1f5f9'),
                  paddingBottom: '0.375rem'
                }">
                  <div class="preview-title-line" :style="{ backgroundColor: t.title_color || t.primary_color || '#2563eb' }"></div>
                  <div class="preview-sub-line" :style="{ backgroundColor: (t.title_color || t.primary_color || '#2563eb') + '80' }"></div>
                </div>

                <div class="preview-body-mock" :style="{
                  marginTop: t.layout_type === 'sidebar' ? '-0.5rem' : '0'
                }">
                  <!-- Left column: shown for 2-column, sidebar -->
                  <div v-if="t.layout_type === '2-column' || t.layout_type === 'sidebar'" class="preview-left-mock-col" :style="{
                    backgroundColor: t.layout_type === 'sidebar' ? (t.primary_color || '#0f172a') : 'transparent',
                    borderRight: t.layout_type === 'sidebar' ? 'none' : '1px solid ' + (t.primary_color + '30'),
                    padding: t.layout_type === 'sidebar' ? '0.5rem 0.25rem' : '0 0.25rem 0 0',
                    height: t.layout_type === 'sidebar' ? '100%' : 'auto',
                    width: t.layout_type === 'sidebar' ? '35%' : '30%'
                  }">
                    <div class="preview-block-line" :style="{ backgroundColor: t.layout_type === 'sidebar' ? '#ffffff60' : (t.primary_color || '#93c5fd') }"></div>
                    <div class="preview-block-line" :style="{ backgroundColor: t.layout_type === 'sidebar' ? '#ffffff60' : (t.primary_color || '#93c5fd') }"></div>
                    <div class="preview-block-line" :style="{ backgroundColor: t.layout_type === 'sidebar' ? '#ffffff60' : (t.primary_color || '#93c5fd') }"></div>
                  </div>

                  <!-- Right column: shown for all -->
                  <div class="preview-right-mock-col" :style="{
                    paddingTop: t.layout_type === 'sidebar' ? '0.5rem' : '0'
                  }">
                    <div class="preview-block-line long" :style="{ backgroundColor: t.layout_type === 'single-column' ? '#cbd5e1' : '#e2e8f0' }"></div>
                    <div class="preview-block-line long" :style="{ backgroundColor: t.layout_type === 'single-column' ? '#cbd5e1' : '#e2e8f0' }"></div>
                    <div class="preview-block-line" :style="{ backgroundColor: '#cbd5e1' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Bottom Info -->
            <div class="template-card-body">
              <div class="title-toggle-row">
                <h4 class="template-card-title">{{ t.name }}</h4>
                <label class="switch select-status-switch" @click.stop>
                  <input type="checkbox" :checked="t.is_active === 1" @change="toggleTemplateStatus(t)" />
                  <span class="slider round"></span>
                </label>
              </div>
              <p class="template-card-subtitle">{{ t.tag }} · {{ t.layout_type }}</p>
              <p class="template-card-uses">Used by <strong>{{ t.uses }}</strong> users</p>

              <!-- Card Action list -->
              <div class="template-card-actions" @click.stop>
                <div class="left-actions">
                  <button @click="selectTemplateForEdit(t)" class="btn-card-action" title="Edit Template">
                    ✏️
                  </button>
                  <button @click="duplicateTemplate(t)" class="btn-card-action" title="Duplicate Template">
                    📋
                  </button>
                  <button @click="previewTemplate(t)" class="btn-card-action" title="View Full Preview">
                    👁️
                  </button>
                </div>
                <button @click="deleteTemplateLocal(t.id)" class="btn-card-action danger" title="Delete Template">
                  🗑️
                </button>
              </div>
            </div>
          </div>

          <!-- Add New Template Dashed Card -->
          <div class="template-card add-new-template-card-dashed" @click="startAddTemplate">
            <div class="dashed-add-content">
              <div class="plus-icon">+</div>
              <h4>Add New Template</h4>
              <p>Upload preview & configure</p>
            </div>
          </div>
        </div>

        <!-- Templates List Mode (table representation) -->
        <div v-else class="card table-card">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Template Layout</th>
                <th>Category</th>
                <th>Layout Type</th>
                <th>Stats (Rating / Uses)</th>
                <th>Status</th>
                <th class="actions-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in filteredTemplates" :key="t.id" :class="{ 'editing-row-highlight': editingTemplateId === t.id }" @click="selectTemplateForEdit(t)">
                <td class="template-name-cell">
                  <div class="template-color-dot" :class="'dot-' + t.id"></div>
                  <strong>{{ t.name }}</strong>
                </td>
                <td>{{ t.tag }}</td>
                <td>{{ t.layout_type }}</td>
                <td>⭐ {{ t.rating }} • {{ t.uses }} uses</td>
                <td>
                  <label class="switch" @click.stop>
                    <input type="checkbox" :checked="t.is_active === 1" @change="toggleTemplateStatus(t)" />
                    <span class="slider round"></span>
                  </label>
                </td>
                <td class="actions-cell" @click.stop>
                  <button @click="selectTemplateForEdit(t)" class="btn-table-action btn-edit">Edit</button>
                  <button @click="deleteTemplateLocal(t.id)" class="btn-table-action btn-delete">Delete</button>
                </td>
              </tr>
              <tr v-if="filteredTemplates.length === 0">
                <td colspan="6" class="no-results-td">No resume templates matched your filters.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal overlay for Edit/Add Template -->
      <div v-if="templateEditModalVisible" class="modal-overlay" @click="templateEditModalVisible = false">
        <div class="modal-card template-edit-modal" @click.stop>
          <div class="modal-header-row">
            <h3>{{ templateSidebarMode === 'add' ? 'Create Template' : 'Edit Template' }}</h3>
            <button @click="templateEditModalVisible = false" class="modal-close-x">×</button>
          </div>
          <div class="modal-body-content scrollable-modal-form" style="max-height: 75vh; overflow-y: auto; display: block; padding: 1.5rem;">
            
            <div class="template-edit-modal-grid">
              <!-- Left column: details -->
              <div class="modal-form-col" style="display: flex; flex-direction: column; gap: 1rem;">
                <div class="form-group">
                  <label>Template Name</label>
                  <input v-model="templateForm.name" class="form-input" placeholder="e.g. Modern Blue" />
                </div>

                <div class="form-group">
                  <label>Description</label>
                  <textarea v-model="templateForm.description" rows="3" class="form-input text-area" placeholder="Template description details..."></textarea>
                </div>

                <div class="form-group">
                  <label>Layout Style</label>
                  <select v-model="templateForm.layout_type" class="form-input select-styled">
                    <option value="2-column">2-column</option>
                    <option value="single-column">single-column</option>
                    <option value="sidebar">sidebar</option>
                    <option value="card-layout">card-layout</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Tags</label>
                  <div class="tags-edit-container">
                    <div v-for="tag in templateFormTags" :key="tag" class="tag-edit-pill">
                      {{ tag }}
                      <span class="remove-tag-x" @click="removeTemplateTag(tag)">×</span>
                    </div>
                    <button @click="addTemplateTagPrompt" class="btn-add-tag-pill">+ Add</button>
                  </div>
                </div>

                <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                  <div class="form-group">
                    <label>Star Rating</label>
                    <input type="number" step="0.1" min="1" max="5" v-model="templateForm.rating" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Uses Counter</label>
                    <input v-model="templateForm.uses" class="form-input" />
                  </div>
                </div>

                <div class="form-group sidebar-status-toggle">
                  <div class="lbl-details">
                    <strong>Status</strong>
                    <p>{{ templateForm.is_active ? 'Active — visible to users' : 'Inactive — hidden from users' }}</p>
                  </div>
                  <label class="switch">
                    <input type="checkbox" v-model="templateForm.is_active" />
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>

              <!-- Right column: Styling & Live Preview -->
              <div class="modal-style-col" style="display: flex; flex-direction: column; gap: 1rem;">
                <div class="form-group-section-title" style="font-size: 0.85rem; font-weight: 700; border-top: 1px dashed var(--color-border); padding-top: 0.5rem; color: var(--color-text-main);">
                  🎨 Color Theme & Typography
                </div>

                <div class="form-row-3" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
                  <div class="form-group">
                    <label style="font-size: 0.7rem;">Primary</label>
                    <input type="color" v-model="templateForm.primary_color" style="width: 100%; height: 32px; border: 1px solid var(--color-border); border-radius: 4px; cursor: pointer; padding: 0;" />
                  </div>
                  <div class="form-group">
                    <label style="font-size: 0.7rem;">Title</label>
                    <input type="color" v-model="templateForm.title_color" style="width: 100%; height: 32px; border: 1px solid var(--color-border); border-radius: 4px; cursor: pointer; padding: 0;" />
                  </div>
                  <div class="form-group">
                    <label style="font-size: 0.7rem;">Text</label>
                    <input type="color" v-model="templateForm.text_color" style="width: 100%; height: 32px; border: 1px solid var(--color-border); border-radius: 4px; cursor: pointer; padding: 0;" />
                  </div>
                </div>

                <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                  <div class="form-group">
                    <label style="font-size: 0.7rem;">Font Family</label>
                    <select v-model="templateForm.font_family" class="form-input select-styled" style="height: 32px; font-size: 0.75rem; padding: 0.25rem;">
                      <option value="Inter">Inter (Sans-Serif)</option>
                      <option value="Arial">Arial (Clean)</option>
                      <option value="Times New Roman">Times New Roman (Formal)</option>
                      <option value="Georgia">Georgia (Elegant Serif)</option>
                      <option value="Courier New">Courier New (Monospace)</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label style="font-size: 0.7rem;">Heading Style</label>
                    <select v-model="templateForm.heading_style" class="form-input select-styled" style="height: 32px; font-size: 0.75rem; padding: 0.25rem;">
                      <option value="underline">Underline</option>
                      <option value="border-all">Border All</option>
                      <option value="bg-fill">Background Fill</option>
                      <option value="border-top-bottom">Top & Bottom Border</option>
                      <option value="lines-side">Lines Side</option>
                      <option value="line-through">Line Through</option>
                      <option value="dots">Dots Underline</option>
                      <option value="zigzag">Dashed Underline</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label>Style Live Preview</label>
                  <div class="admin-live-preview-box-container">
                    <div class="admin-live-preview-box-scale">
                      <ResumePreview :themeOverride="templateForm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="templateSidebarError" class="modal-error-banner" style="margin-top: 1rem;">{{ templateSidebarError }}</div>
          </div>
          <div class="modal-footer-row">
            <button @click="saveSidebarTemplate" class="btn btn-primary">Save Changes</button>
            <button @click="cancelSidebarEdit" class="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Global Export History Logs -->
    <div v-else-if="activeTab === 'exports'" class="admin-tab-content">
      <div class="content-header-row">
        <h3>Platform Export History</h3>
        <span class="count-tag">{{ storeState.globalExportsLog.length }} total exports</span>
      </div>

      <!-- Filters & Search Bar -->
      <div class="admin-filters-bar">
        <div class="search-input-wrapper">
          <input type="text" v-model="exportSearchQuery" class="form-input search-box" placeholder="Search logs by name, email or filename..." />
        </div>
        <div class="role-filter-wrapper">
          <span class="filter-lbl">Format:</span>
          <select v-model="exportFormatFilter" class="filter-dropdown">
            <option value="all">All Formats</option>
            <option value="PDF">PDF</option>
            <option value="DOCX">DOCX</option>
          </select>
        </div>
      </div>

      <!-- Exports Table -->
      <div class="card table-card">
        <table class="admin-data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email Address</th>
              <th>File Name</th>
              <th>Format</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in filteredExports" :key="log.id">
              <td class="user-name-cell">
                <span class="user-avatar-initial">{{ log.userName.charAt(0).toUpperCase() }}</span>
                {{ log.userName }}
              </td>
              <td>{{ log.userEmail }}</td>
              <td class="file-name-cell">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="file-icon"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                {{ log.filename }}
              </td>
              <td>
                <span class="badge" :class="log.format === 'PDF' ? 'badge-pdf' : 'badge-docx'">{{ log.format }}</span>
              </td>
              <td>{{ log.date }}</td>
            </tr>
            <tr v-if="filteredExports.length === 0">
              <td colspan="5" class="no-results-td">No export logs matched your filters.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- USER MODAL (ADD / EDIT) -->
    <div v-if="userModalVisible" class="modal-overlay" @click="userModalVisible = false">
      <div class="modal-card" @click.stop>
        <div class="modal-header-row">
          <h3>{{ userModalMode === 'add' ? 'Create New User Account' : 'Edit User Settings' }}</h3>
          <button @click="userModalVisible = false" class="modal-close-x">×</button>
        </div>
        <div class="modal-body-content flex-column">
          <div class="form-group">
            <label for="modalName">Full Name</label>
            <input id="modalName" v-model="userForm.name" class="form-input" placeholder="e.g. Alex Chen" />
          </div>

          <div class="form-group">
            <label for="modalEmail">Email Address</label>
            <input id="modalEmail" v-model="userForm.email" class="form-input" placeholder="e.g. alex.chen@example.com" />
          </div>

          <div class="form-group" v-if="userModalMode === 'add'">
            <label for="modalPassword">Password</label>
            <input id="modalPassword" type="password" v-model="userForm.password" class="form-input" placeholder="Password (Min. 6 chars)" />
          </div>

          <div class="form-group">
            <label for="modalRole">User Privilege Role</label>
            <select id="modalRole" v-model="userForm.role" class="form-input select-styled">
              <option value="student">Student / Job Seeker</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <div v-if="userModalError" class="modal-error-banner">{{ userModalError }}</div>
        </div>
        <div class="modal-footer-row">
          <button @click="userModalVisible = false" class="btn btn-secondary">Cancel</button>
          <button @click="saveUser" class="btn btn-primary">Save Account</button>
        </div>
      </div>
    </div>

    <!-- VIEW PROFILE & RESUMES MODAL (INSPECT USER) -->
    <div v-if="inspectModalVisible" class="modal-overlay" @click="inspectModalVisible = false">
      <div class="modal-card modal-inspect-card" @click.stop>
        <div class="modal-header-row">
          <h3>Inspect User Profile & Resumes</h3>
          <button @click="inspectModalVisible = false" class="modal-close-x">×</button>
        </div>
        
        <div class="modal-inspect-body">
          <!-- Left side: User details & versions list -->
          <div class="inspect-sidebar">
            <div class="inspect-user-info-section">
              <span class="sidebar-section-title">USER ACCOUNT</span>
              <div class="user-profile-badge-large">
                <span class="user-avatar-large">{{ inspectUser?.name ? inspectUser.name.charAt(0).toUpperCase() : 'U' }}</span>
                <div>
                  <h4>{{ inspectUser?.name }}</h4>
                  <span class="badge" :class="inspectUser?.role === 'admin' ? 'badge-danger' : 'badge-pdf'">{{ inspectUser?.role }}</span>
                </div>
              </div>
              
              <div class="user-detail-meta-list">
                <div class="meta-item">
                  <span class="lbl">Email:</span>
                  <span class="val">{{ inspectUser?.email }}</span>
                </div>
                <div class="meta-item">
                  <span class="lbl">Joined:</span>
                  <span class="val">{{ formatTimestamp(inspectUser?.id) }}</span>
                </div>
              </div>
            </div>

            <div class="inspect-versions-section">
              <span class="sidebar-section-title">RESUMES ({{ inspectVersions.length }})</span>
              <div class="inspect-versions-list">
                <div v-for="ver in inspectVersions" :key="ver.id" class="inspect-ver-item" :class="{ 'active': selectedInspectVersionId === ver.id }" @click="selectInspectVersion(ver)">
                  <div class="ver-icon-mini" :class="'ver-icon-bg-' + ver.template_id">📄</div>
                  <div class="ver-details">
                    <span class="ver-title">{{ ver.title }}</span>
                    <span class="ver-subtitle">{{ getTemplateName(ver.template_id) }}</span>
                  </div>
                </div>
                <div v-if="inspectVersions.length === 0" class="no-resumes-text">
                  No resume versions created yet.
                </div>
              </div>
            </div>
          </div>

          <!-- Right side: Resume Content preview -->
          <div class="inspect-content-preview">
            <div v-if="selectedInspectVersion" class="inspect-version-header">
              <h4>📄 {{ selectedInspectVersion.title }}</h4>
              <span class="ver-edit-date">Last edited: {{ selectedInspectVersion.last_edited }}</span>
            </div>
            
            <div v-if="selectedInspectVersion && inspectResumeData" class="inspect-resume-scroll-area">
              <!-- Summary block -->
              <div class="preview-section-block">
                <h5 class="preview-sec-title">Professional Summary</h5>
                <p class="preview-summary-text">{{ inspectResumeData.personal?.summary || 'No summary provided.' }}</p>
              </div>

              <!-- Education block -->
              <div class="preview-section-block">
                <h5 class="preview-sec-title">Education History</h5>
                <div class="preview-entries-list">
                  <div v-for="edu in inspectResumeData.education" :key="edu.id" class="preview-entry-item">
                    <div class="entry-header">
                      <strong>{{ edu.institution }}</strong>
                      <span>{{ edu.start_date }} — {{ edu.end_date }}</span>
                    </div>
                    <div class="entry-sub">{{ edu.qualification }}</div>
                    <p class="entry-desc" v-if="edu.description">{{ edu.description }}</p>
                  </div>
                  <div v-if="!inspectResumeData.education || inspectResumeData.education.length === 0" class="empty-section-text">
                    No education history added.
                  </div>
                </div>
              </div>

              <!-- Experience block -->
              <div class="preview-section-block">
                <h5 class="preview-sec-title">Work Experience</h5>
                <div class="preview-entries-list">
                  <div v-for="exp in inspectResumeData.experience" :key="exp.id" class="preview-entry-item">
                    <div class="entry-header">
                      <strong>{{ exp.company_name }}</strong>
                      <span>{{ exp.start_date }} — {{ exp.end_date }}</span>
                    </div>
                    <div class="entry-sub">{{ exp.job_title }}</div>
                    <p class="entry-desc" v-if="exp.description">{{ exp.description }}</p>
                  </div>
                  <div v-if="!inspectResumeData.experience || inspectResumeData.experience.length === 0" class="empty-section-text">
                    No work experience added.
                  </div>
                </div>
              </div>

              <!-- Skills block -->
              <div class="preview-section-block">
                <h5 class="preview-sec-title">Technical Skills</h5>
                <div class="preview-skills-badges">
                  <span v-for="s in inspectResumeData.skills" :key="s.id" class="preview-skill-pill">
                    {{ s.skill_name }} <span class="lvl">({{ s.skill_level }})</span>
                  </span>
                  <div v-if="!inspectResumeData.skills || inspectResumeData.skills.length === 0" class="empty-section-text">
                    No skills added.
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="inspect-no-selection">
              <div class="empty-state-graphic">🔍</div>
              <p>Select a resume version on the left to inspect its contents.</p>
            </div>
          </div>
        </div>

        <div class="modal-footer-row">
          <button @click="inspectModalVisible = false" class="btn btn-secondary">Close Inspection</button>
        </div>
      </div>
    </div>

    <!-- TEMPLATE PREVIEW MODAL (LARGE VIEW) -->
    <div v-if="templatePreviewVisible" class="modal-overlay" @click="templatePreviewVisible = false">
      <div class="modal-card large-preview-modal" @click.stop>
        <div class="modal-header-row">
          <h3>Template Preview: {{ templatePreviewTarget?.name }}</h3>
          <button @click="templatePreviewVisible = false" class="modal-close-x">×</button>
        </div>
        <div class="modal-body-content scrollable-preview-content flex-column">
          <div class="modal-live-preview-container">
            <ResumePreview :themeOverride="templatePreviewTarget" />
          </div>
          <div class="preview-details-banner" style="width: 100%; max-width: 210mm; margin: 1.5rem auto 0 auto; padding: 1rem; background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-sm); box-shadow: var(--shadow-sm);">
            <p class="tpl-desc-preview" style="font-size: 0.95rem; font-weight: 500; color: var(--color-text-main); margin-bottom: 0.75rem;">
              {{ templatePreviewTarget?.description }}
            </p>
            <div class="mini-metrics-pills">
              <span class="pill-metric passed" style="background-color: #f1f5f9; color: #334155; padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.75rem; font-weight: 600; margin-right: 0.5rem; display: inline-block;">Layout Structure: {{ templatePreviewTarget?.layout_type }}</span>
              <span class="pill-metric warnings" style="background-color: #f1f5f9; color: #334155; padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.75rem; font-weight: 600; margin-right: 0.5rem; display: inline-block;">Category: {{ templatePreviewTarget?.tag }}</span>
              <span class="pill-metric critical" v-if="templatePreviewTarget?.atsReady" style="background-color: #f0fdf4; color: #16a34a; padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.75rem; font-weight: 600; display: inline-block;">✓ ATS Friendly</span>
            </div>
          </div>
        </div>
        <div class="modal-footer-row">
          <button @click="templatePreviewVisible = false" class="btn btn-secondary">Close Preview</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import auth, { apiRequest } from '@/services/auth'
import { store } from '@/services/store'
import ResumePreview from '@/components/resume/ResumePreview.vue'

export default {
  components: {
    ResumePreview
  },
  setup() {
    const storeState = store.state
    const activeTab = ref('users')

    // Search and Filter variables
    const users = ref([])
    const resumes = ref([])
    const isRefreshing = ref(false)
    const userSearchQuery = ref('')
    const userRoleFilter = ref('all')

    const templateViewMode = ref('grid') // grid or list
    const templateSearchQuery = ref('')
    const templateTagFilter = ref('all')
    const templateStatusFilter = ref('all')

    const exportSearchQuery = ref('')
    const exportFormatFilter = ref('all')

    // Modals visibility toggles
    const userModalVisible = ref(false)
    const userModalMode = ref('add') // add or edit
    const userModalError = ref('')
    const editingUserId = ref(null)
    const userForm = ref({ name: '', email: '', password: '', role: 'student' })

    // Template Sidebar panel properties
    const editingTemplateId = ref(1) // modern blue selected by default
    const templateSidebarMode = ref('edit')
    const templateSidebarError = ref('')
    const templateForm = ref({ name: '', description: '', rating: 5.0, uses: '0', tag: 'Modern', layout_type: 'single-column', is_active: true, popular: false, new: false, atsReady: true, primary_color: '#2563eb', title_color: '#2563eb', text_color: '#334155', font_family: 'Inter', heading_style: 'underline' })
    const templateFormTags = ref([])
    const templateEditModalVisible = ref(false)

    // Inspection Modal states
    const inspectModalVisible = ref(false)
    const inspectUser = ref(null)
    const inspectVersions = ref([])
    const selectedInspectVersionId = ref(null)
    const selectedInspectVersion = ref(null)
    const inspectResumeData = ref(null)

    // Template Preview modal
    const templatePreviewVisible = ref(false)
    const templatePreviewTarget = ref(null)

    async function fetchUsers() {
      users.value = await auth.getAllUsers()
    }

    async function fetchResumes() {
      try {
        const payload = await apiRequest('/resumes')
        resumes.value = payload.resumes || []
      } catch (error) {
        console.error('Failed to fetch resumes', error)
      }
    }

    async function refreshData() {
      if (isRefreshing.value) return
      isRefreshing.value = true
      try {
        await Promise.all([
          fetchUsers(),
          fetchResumes(),
          store.loadTemplates()
        ])
      } catch (error) {
        console.error('Failed to refresh data', error)
      } finally {
        isRefreshing.value = false
      }
    }

    let refreshInterval = null

    onMounted(async () => {
      await refreshData()
      if (storeState.templates && storeState.templates.length > 0) {
        selectTemplateForEdit(storeState.templates[0])
      }
      refreshInterval = setInterval(refreshData, 15000)
    })

    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    })

    watch(activeTab, () => {
      refreshData()
    })

    // Dynamic stats computation
    const activeTemplatesCount = computed(() => {
      return storeState.templates.filter(t => t.is_active === 1).length
    })

    // User filtration
    const filteredUsers = computed(() => {
      let list = [...users.value]
      
      if (userSearchQuery.value.trim()) {
        const query = userSearchQuery.value.toLowerCase()
        list = list.filter(u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query))
      }

      if (userRoleFilter.value !== 'all') {
        list = list.filter(u => u.role === userRoleFilter.value)
      }

      return list
    })

    // Template filtration
    const filteredTemplates = computed(() => {
      let list = [...storeState.templates]

      if (templateSearchQuery.value.trim()) {
        const query = templateSearchQuery.value.toLowerCase()
        list = list.filter(t => t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query))
      }

      if (templateTagFilter.value !== 'all') {
        list = list.filter(t => t.tag === templateTagFilter.value)
      }

      if (templateStatusFilter.value !== 'all') {
        const activeVal = templateStatusFilter.value === 'active' ? 1 : 0
        list = list.filter(t => t.is_active === activeVal)
      }

      return list
    })

    // Exports filtration
    const filteredExports = computed(() => {
      let list = [...storeState.globalExportsLog]

      if (exportSearchQuery.value.trim()) {
        const query = exportSearchQuery.value.toLowerCase()
        list = list.filter(log => 
          log.userName.toLowerCase().includes(query) || 
          log.userEmail.toLowerCase().includes(query) || 
          log.filename.toLowerCase().includes(query)
        )
      }

      if (exportFormatFilter.value !== 'all') {
        list = list.filter(log => log.format === exportFormatFilter.value)
      }

      return list
    })

    // User CRUD actions
    function openUserModal(userObj) {
      userModalError.value = ''
      if (userObj) {
        userModalMode.value = 'edit'
        editingUserId.value = userObj.id
        userForm.value = {
          name: userObj.name,
          email: userObj.email,
          password: '',
          role: userObj.role
        }
      } else {
        userModalMode.value = 'add'
        editingUserId.value = null
        userForm.value = { name: '', email: '', password: '', role: 'student' }
      }
      userModalVisible.value = true
    }

    async function saveUser() {
      userModalError.value = ''
      const form = userForm.value
      
      // Basic validators
      if (!form.name.trim()) return userModalError.value = 'Name is required'
      if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) return userModalError.value = 'Valid email is required'
      
      if (userModalMode.value === 'add') {
        if (!form.password || form.password.length < 6) {
          return userModalError.value = 'Password must be at least 6 characters'
        }
        try {
          await auth.createUser({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            role: form.role
          })
          userModalVisible.value = false
          await refreshData()
        } catch (e) {
          userModalError.value = e.message
        }
      } else {
        try {
          const updateFields = {
            name: form.name.trim(),
            email: form.email.trim(),
            role: form.role
          }
          // Change password only if typed
          if (form.password && form.password.trim().length >= 6) {
            updateFields.password = form.password.trim()
          }
          await auth.updateUser(editingUserId.value, updateFields)
          userModalVisible.value = false
          await refreshData()
        } catch (e) {
          userModalError.value = e.message
        }
      }
    }

    async function deleteUserLocal(id) {
      if (confirm('Are you sure you want to delete this user account? All resume metadata will be permanently lost.')) {
        try {
          await auth.deleteUser(id)
          await refreshData()
        } catch (e) {
          alert(e.message)
        }
      }
    }

    // Template Sidebar management CRUD
    function selectTemplateForEdit(t) {
      editingTemplateId.value = t.id
      templateSidebarMode.value = 'edit'
      templateSidebarError.value = ''
      
      templateForm.value = {
        name: t.name,
        description: t.description,
        rating: t.rating,
        uses: t.uses,
        tag: t.tag,
        layout_type: t.layout_type,
        is_active: t.is_active === 1,
        popular: t.popular || false,
        new: t.new || false,
        atsReady: t.atsReady || false,
        primary_color: t.primary_color || '#2563eb',
        title_color: t.title_color || '#2563eb',
        text_color: t.text_color || '#334155',
        font_family: t.font_family || 'Inter',
        heading_style: t.heading_style || 'underline'
      }
      loadTagsForForm(t)
      templateEditModalVisible.value = true
    }

    function startAddTemplate() {
      editingTemplateId.value = null
      templateSidebarMode.value = 'add'
      templateSidebarError.value = ''
      
      templateForm.value = {
        name: '',
        description: '',
        rating: 4.8,
        uses: '0',
        tag: 'Modern',
        layout_type: 'single-column',
        is_active: true,
        popular: false,
        new: false,
        atsReady: true,
        primary_color: '#2563eb',
        title_color: '#2563eb',
        text_color: '#334155',
        font_family: 'Inter',
        heading_style: 'underline'
      }
      templateFormTags.value = ['Modern', 'ATS-Friendly']
      templateEditModalVisible.value = true
    }

    async function saveSidebarTemplate() {
      templateSidebarError.value = ''
      const form = templateForm.value
      
      if (!form.name.trim()) return templateSidebarError.value = 'Template name is required'
      
      const payload = {
        name: form.name.trim(),
        description: form.description,
        rating: parseFloat(form.rating) || 5.0,
        uses: form.uses,
        layout_type: form.layout_type,
        is_active: form.is_active ? 1 : 0,
        primary_color: form.primary_color || '#2563eb',
        title_color: form.title_color || '#2563eb',
        text_color: form.text_color || '#334155',
        font_family: form.font_family || 'Inter',
        heading_style: form.heading_style || 'underline'
      }
      saveTagsFromForm(payload)

      try {
        if (templateSidebarMode.value === 'add') {
          const newTpl = await store.createTemplate(payload)
          selectTemplateForEdit(newTpl)
        } else {
          const updated = await store.updateTemplate(editingTemplateId.value, payload)
          selectTemplateForEdit(updated)
        }
        templateEditModalVisible.value = false
        await refreshData()
      } catch (error) {
        templateSidebarError.value = error.message
      }
    }

    function cancelSidebarEdit() {
      templateEditModalVisible.value = false
      if (editingTemplateId.value) {
        const activeTpl = storeState.templates.find(t => t.id === editingTemplateId.value)
        if (activeTpl) {
          templateForm.value = {
            name: activeTpl.name,
            description: activeTpl.description,
            rating: activeTpl.rating,
            uses: activeTpl.uses,
            tag: activeTpl.tag,
            layout_type: activeTpl.layout_type,
            is_active: activeTpl.is_active === 1,
            popular: activeTpl.popular || false,
            new: activeTpl.new || false,
            atsReady: activeTpl.atsReady || false,
            primary_color: activeTpl.primary_color || '#2563eb',
            title_color: activeTpl.title_color || '#2563eb',
            text_color: activeTpl.text_color || '#334155',
            font_family: activeTpl.font_family || 'Inter',
            heading_style: activeTpl.heading_style || 'underline'
          }
          loadTagsForForm(activeTpl)
          return
        }
      }
    }

    async function duplicateTemplate(t) {
      const payload = {
        name: `${t.name} (Copy)`,
        description: t.description,
        rating: t.rating,
        uses: '0',
        tag: t.tag,
        layout_type: t.layout_type,
        is_active: t.is_active,
        popular: t.popular || false,
        new: t.new || false,
        atsReady: t.atsReady || false,
        primary_color: t.primary_color || '#2563eb',
        title_color: t.title_color || '#2563eb',
        text_color: t.text_color || '#334155',
        font_family: t.font_family || 'Inter',
        heading_style: t.heading_style || 'underline'
      }
      try {
        const newTpl = await store.createTemplate(payload)
        selectTemplateForEdit(newTpl)
        await refreshData()
      } catch (error) {
        templateSidebarError.value = error.message
      }
    }

    function previewTemplate(t) {
      templatePreviewTarget.value = t
      templatePreviewVisible.value = true
    }

    async function toggleTemplateStatus(tpl) {
      const nextActive = tpl.is_active === 1 ? 0 : 1
      try {
        const updated = await store.updateTemplate(tpl.id, { is_active: nextActive })
        if (editingTemplateId.value === tpl.id) {
          templateForm.value.is_active = (updated.is_active === 1)
        }
        await refreshData()
      } catch (error) {
        templateSidebarError.value = error.message
      }
    }

    // User table display helpers
    function getUserResumesCount(userId) {
      return resumes.value.filter(r => r.user_id === userId).length
    }

    function getRegistrationDate(u) {
      const sourceDate = u.created_at || u.id
      return new Date(sourceDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    function getResumeBarColorClass(count, userId) {
      if (count >= 5) return 'bg-green'
      if (count === 4) return 'bg-teal'
      if (count === 3) return 'bg-blue'
      if (count === 2) {
        return userId === 129 ? 'bg-pink' : 'bg-orange'
      }
      if (count === 1) return 'bg-red'
      return 'bg-gray'
    }

    function getAvatarColorClass(name) {
      const classes = ['avatar-blue', 'avatar-green', 'avatar-purple', 'avatar-orange', 'avatar-red', 'avatar-teal', 'avatar-pink']
      const total = String(name || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
      return classes[total % classes.length] || 'avatar-default'
    }

    async function deleteTemplateLocal(id) {
      if (confirm('Are you sure you want to delete this template from the library?')) {
        try {
          await store.deleteTemplate(id)
          if (editingTemplateId.value === id) {
            editingTemplateId.value = null
            cancelSidebarEdit()
          }
          await refreshData()
        } catch (error) {
          alert(error.message)
        }
      }
    }

    // Form tags list helper
    function loadTagsForForm(t) {
      const tags = []
      if (t.tag) tags.push(t.tag)
      if (t.atsReady) tags.push('ATS-Friendly')
      if (t.popular) tags.push('Popular')
      if (t.new) tags.push('New')
      templateFormTags.value = tags
    }

    function saveTagsFromForm(payload) {
      payload.atsReady = templateFormTags.value.includes('ATS-Friendly')
      payload.popular = templateFormTags.value.includes('Popular')
      payload.new = templateFormTags.value.includes('New')
      
      const category = templateFormTags.value.find(tg => !['ATS-Friendly', 'Popular', 'New'].includes(tg))
      payload.tag = category || 'Modern'
    }

    function removeTemplateTag(tag) {
      templateFormTags.value = templateFormTags.value.filter(tg => tg !== tag)
    }

    function addTemplateTagPrompt() {
      const newTag = prompt('Enter a new tag name (e.g. Creative, Minimal, ATS-Friendly):')
      if (newTag && newTag.trim()) {
        const cleanTag = newTag.trim()
        if (!templateFormTags.value.includes(cleanTag)) {
          templateFormTags.value.push(cleanTag)
        }
      }
    }

    // Inspect user and resume details modal
    async function openViewUserModal(userObj) {
      inspectUser.value = userObj
      inspectVersions.value = []
      inspectResumeData.value = null
      selectedInspectVersionId.value = null
      selectedInspectVersion.value = null
      inspectModalVisible.value = true
      
      try {
        const payload = await apiRequest(`/users/${userObj.id}/resumes`)
        const userResumes = payload.resumes || []
        inspectVersions.value = userResumes.map(r => ({
          id: r.id,
          title: r.title,
          template_id: r.selected_template_id || 1,
          last_edited: new Date(r.updated_at).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric'
          }),
          content: r.content
        }))
        
        if (inspectVersions.value.length > 0) {
          selectInspectVersion(inspectVersions.value[0])
        }
      } catch (e) {
        console.error('Failed to inspect user resumes', e)
      }
    }

    function selectInspectVersion(ver) {
      selectedInspectVersionId.value = ver.id
      selectedInspectVersion.value = ver
      inspectResumeData.value = ver.content
    }

    function formatTimestamp(timestamp) {
      if (!timestamp) return 'N/A'
      return new Date(timestamp).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    function getTemplateName(id) {
      const t = storeState.templates.find(x => x.id === id)
      return t ? t.name : 'Classic White'
    }

    return {
      storeState,
      activeTab,
      users,
      resumes,
      refreshData,
      userSearchQuery,
      userRoleFilter,
      templateViewMode,
      templateSearchQuery,
      templateTagFilter,
      templateStatusFilter,
      exportSearchQuery,
      exportFormatFilter,
      filteredUsers,
      filteredTemplates,
      filteredExports,
      activeTemplatesCount,
      // User Modal CRUD
      userModalVisible,
      userModalMode,
      userModalError,
      userForm,
      openUserModal,
      saveUser,
      deleteUserLocal,
      // Templates Sidebar CRUD Settings
      editingTemplateId,
      templateSidebarMode,
      templateSidebarError,
      templateForm,
      templateFormTags,
      selectTemplateForEdit,
      startAddTemplate,
      saveSidebarTemplate,
      cancelSidebarEdit,
      duplicateTemplate,
      previewTemplate,
      toggleTemplateStatus,
      deleteTemplateLocal,
      removeTemplateTag,
      addTemplateTagPrompt,
      // View Inspect Profile & Resume
      inspectModalVisible,
      inspectUser,
      inspectVersions,
      selectedInspectVersionId,
      selectedInspectVersion,
      inspectResumeData,
      openViewUserModal,
      selectInspectVersion,
      formatTimestamp,
      getTemplateName,
      // Large template preview modal
      templatePreviewVisible,
      templatePreviewTarget,
      templateEditModalVisible,
      // Table column helper variables
      getUserResumesCount,
      getRegistrationDate,
      getResumeBarColorClass,
      getAvatarColorClass
    }
  }
}
</script>

<style scoped>
.admin-dashboard-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

/* Header summary metrics cards style */
.admin-stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.25rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1rem;
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  flex-shrink: 0;
}
.card-icon.blue { background-color: var(--color-primary-light); color: var(--color-primary); }
.card-icon.green { background-color: var(--color-success-light); color: var(--color-success); }
.card-icon.purple { background-color: #f3e8ff; color: #a855f7; }
.card-icon.orange { background-color: var(--color-warning-light); color: var(--color-warning); }
.card-icon.teal { background-color: #e6fffa; color: #0d9488; }
.card-icon.pink { background-color: #fdf2f8; color: #db2777; }

.card-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-details .val {
  font-size: 1.4rem;
  font-weight: 800;
  font-family: var(--font-brand);
  color: var(--color-text-main);
  line-height: 1.1;
}

.card-details .lbl {
  font-size: 0.68rem;
  color: var(--color-text-muted);
  font-weight: 700;
  text-transform: uppercase;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

/* Tabs selectors */
.admin-nav-tabs {
  display: flex;
  border-bottom: 2px solid var(--color-border);
  gap: 1.5rem;
}

.tab-btn {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.75rem 0.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: var(--color-primary);
}

.tab-btn.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.admin-tab-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-header-row h3 {
  font-family: var(--font-brand);
  font-weight: 700;
  font-size: 1.2rem;
}

.content-header-row .subtitle {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: 0.125rem;
}

.count-tag {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-muted);
  background-color: #f1f5f9;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
}

/* Admin Filters bar */
.admin-filters-bar {
  display: flex;
  background-color: white;
  border: 1px solid var(--color-border);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;
}

.filters-group-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-input-wrapper {
  flex: 1;
}

.search-box {
  background-color: #f1f5f9;
  margin-bottom: 0;
}

.role-filter-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-lbl {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.filter-dropdown {
  border: 1px solid var(--color-border);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  background-color: white;
  outline: none;
  cursor: pointer;
}

/* Datatable designs */
.table-card {
  padding: 0;
  overflow: hidden;
}

.admin-data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;
}

.admin-data-table th {
  background-color: #f8fafc;
  padding: 0.875rem 1.25rem;
  font-weight: 700;
  color: var(--color-text-muted);
  border-bottom: 2px solid var(--color-border);
}

.admin-data-table td {
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-main);
  vertical-align: middle;
}

.admin-data-table tr:last-child td {
  border-bottom: none;
}

.editing-row-highlight {
  background-color: var(--color-primary-light);
  border-left: 3px solid var(--color-primary);
}

.user-name-cell {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-name-text {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text-main);
}

.user-id-sub {
  font-size: 0.68rem;
  color: var(--color-text-light);
  margin-top: 0.05rem;
}

.checkbox-th, .checkbox-td {
  width: 40px;
  text-align: center;
  padding-right: 0 !important;
}

.checkbox-td input[type="checkbox"], .checkbox-th input[type="checkbox"] {
  cursor: pointer;
  width: 14px;
  height: 14px;
}

.user-avatar-initial {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.8rem;
  box-shadow: var(--shadow-sm);
}

.user-avatar-initial.avatar-blue { background-color: #dbeafe; color: #2563eb; }
.user-avatar-initial.avatar-green { background-color: #d1fae5; color: #10b981; }
.user-avatar-initial.avatar-purple { background-color: #f3e8ff; color: #a855f7; }
.user-avatar-initial.avatar-orange { background-color: #fef3c7; color: #d97706; }
.user-avatar-initial.avatar-red { background-color: #fee2e2; color: #ef4444; }
.user-avatar-initial.avatar-teal { background-color: #e6fffa; color: #0d9488; }
.user-avatar-initial.avatar-pink { background-color: #fdf2f8; color: #db2777; }
.user-avatar-initial.avatar-default { background-color: #f1f5f9; color: #64748b; }

.template-name-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.template-color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.template-color-dot.dot-1 { background-color: var(--color-primary); }
.template-color-dot.dot-2 { background-color: var(--color-text-muted); }
.template-color-dot.dot-3 { background-color: #0f172a; }
.template-color-dot.dot-4 { background-color: #0d9488; }
.template-color-dot.dot-5 { background-color: #16a34a; }
.template-color-dot.dot-6 { background-color: #f59e0b; }

.actions-th {
  text-align: right;
}

.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-table-action {
  border: 1px solid var(--color-border);
  background: white;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-table-action.btn-view:hover {
  border-color: var(--color-success);
  color: var(--color-success);
  background-color: var(--color-success-light);
}

.btn-table-action.btn-edit:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.btn-table-action.btn-delete:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background-color: var(--color-danger-light);
}

.btn-table-action[disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}

.no-results-td {
  text-align: center;
  color: var(--color-text-light);
  font-style: italic;
  padding: 2rem !important;
}

.file-name-cell {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.file-icon {
  color: var(--color-text-muted);
}

/* User table additional resumes progress bars styles */
.resumes-count-cell {
  vertical-align: middle;
}

.resumes-flex-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.count-val {
  font-weight: 700;
  font-size: 0.85rem;
  min-width: 12px;
}

.resume-progress-track {
  width: 60px;
  height: 4px;
  background-color: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.resume-progress-bar {
  height: 100%;
  border-radius: 2px;
}

.resume-progress-bar.bg-green { background-color: #10b981; }
.resume-progress-bar.bg-teal { background-color: #0d9488; }
.resume-progress-bar.bg-blue { background-color: #2563eb; }
.resume-progress-bar.bg-orange { background-color: #f59e0b; }
.resume-progress-bar.bg-pink { background-color: #db2777; }
.resume-progress-bar.bg-red { background-color: #ef4444; }
.resume-progress-bar.bg-gray { background-color: #cbd5e1; }

.badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.badge.badge-danger {
  background-color: #f3e8ff;
  color: #a855f7;
}

.badge.badge-pdf {
  background-color: #dbeafe;
  color: #2563eb;
}

/* Toggle Switch rules */
.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 20px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #cbd5e1;
  transition: .15s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .15s;
}
input:checked + .slider {
  background-color: var(--color-primary);
}
input:checked + .slider:before {
  transform: translateX(18px);
}
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(15, 23, 42, 0.4);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-card {
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-premium);
  width: 90%;
  max-width: 480px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header-row {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.modal-header-row h3 {
  font-family: var(--font-brand);
  font-weight: 700;
  font-size: 1.1rem;
}

.modal-close-x {
  border: none;
  background: transparent;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--color-text-light);
}

.modal-body-content {
  padding: 1.5rem;
  display: flex;
}

.modal-body-content.flex-column {
  flex-direction: column;
  gap: 1rem;
}

.modal-scroll {
  max-height: 400px;
  overflow-y: auto;
}

.select-styled {
  background-color: white;
  height: 38px;
}

.checkboxes-form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  padding: 0.5rem 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  margin-top: 0.5rem;
}

.checkbox-label {
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
}

.modal-error-banner {
  background-color: var(--color-danger-light);
  border: 1px solid #fca5a5;
  color: #b91c1c;
  padding: 0.625rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
}

.modal-footer-row {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* Modal Inspect specific styles */
.modal-inspect-card {
  max-width: 900px !important;
  width: 95% !important;
  height: 80vh;
}

.modal-inspect-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  height: calc(80vh - 120px);
}

.inspect-sidebar {
  width: 280px;
  border-right: 1px solid var(--color-border);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
  background-color: #f8fafc;
  flex-shrink: 0;
}

.inspect-content-preview {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: white;
}

.sidebar-section-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-text-light);
  letter-spacing: 0.08em;
  display: block;
  margin-bottom: 0.5rem;
}

.user-profile-badge-large {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
  box-shadow: var(--shadow-sm);
}

.user-profile-badge-large h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text-main);
  margin-bottom: 0.25rem;
}

.user-detail-meta-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  border-top: 1px dashed var(--color-border);
  padding-top: 0.75rem;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
}

.meta-item .lbl {
  color: var(--color-text-muted);
  font-weight: 600;
}

.meta-item .val {
  color: var(--color-text-main);
  font-weight: 700;
  text-align: right;
  word-break: break-all;
}

.inspect-versions-section {
  display: flex;
  flex-direction: column;
  border-top: 1px dashed var(--color-border);
  padding-top: 1rem;
  flex: 1;
}

.inspect-versions-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.inspect-ver-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.625rem;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all var(--transition-fast);
}

.inspect-ver-item:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.inspect-ver-item.active {
  background-color: var(--color-primary-light);
  border-color: var(--color-primary);
}

.ver-icon-mini {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: white;
}

.ver-icon-bg-1 { background-color: var(--color-primary); }
.ver-icon-bg-2 { background-color: var(--color-text-muted); }
.ver-icon-bg-3 { background-color: #0f172a; }
.ver-icon-bg-4 { background-color: #0d9488; }
.ver-icon-bg-5 { background-color: #16a34a; }
.ver-icon-bg-6 { background-color: #f59e0b; }

.ver-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ver-details .ver-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text-main);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.ver-details .ver-subtitle {
  font-size: 0.65rem;
  color: var(--color-text-muted);
}

.inspect-version-header {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.inspect-version-header h4 {
  font-family: var(--font-brand);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--color-text-main);
}

.ver-edit-date {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.inspect-resume-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preview-section-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-sec-title {
  font-family: var(--font-brand);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.25rem;
}

.preview-summary-text {
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--color-text-main);
}

.preview-entries-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.preview-entry-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
}

.entry-header strong {
  color: var(--color-text-main);
}

.entry-header span {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.entry-sub {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.entry-desc {
  font-size: 0.78rem;
  line-height: 1.4;
  color: var(--color-text-main);
  margin-top: 0.125rem;
}

.preview-skills-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.preview-skill-pill {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
}

.preview-skill-pill .lvl {
  font-weight: 500;
  font-size: 0.65rem;
  opacity: 0.8;
}

.empty-section-text, .no-resumes-text {
  font-size: 0.75rem;
  font-style: italic;
  color: var(--color-text-light);
}

.inspect-no-selection {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--color-text-light);
}

.empty-state-graphic {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.inspect-no-selection p {
  font-size: 0.85rem;
}

/* Templates Layout section */
.templates-grid-layout {
  display: block;
  width: 100%;
}

@media (max-width: 1024px) {
  .templates-grid-layout {
    grid-template-columns: 1fr;
  }
}

.templates-main-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.header-right-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stats-counter {
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.layout-toggle-btns {
  display: flex;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
}

.toggle-layout-btn {
  background: white;
  border: none;
  padding: 0.375rem 0.75rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.toggle-layout-btn.active {
  background-color: var(--color-primary);
  color: white;
}

.toggle-layout-btn:first-child {
  border-right: 1px solid var(--color-border);
}

/* Templates Cards Grid */
.templates-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}

.template-card {
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: all var(--transition-fast);
  position: relative;
}

.template-card:hover {
  border-color: #cbd5e1;
  box-shadow: var(--shadow-md);
}

.template-card.editing-border {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.template-card-preview-area {
  background-color: #f8fafc;
  padding: 1rem;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
}

.badge-editing {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background-color: var(--color-primary);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  z-index: 5;
}

.badge-status {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  z-index: 5;
}

.badge-status.active {
  background-color: var(--color-success-light);
  color: var(--color-success);
}

.badge-status.active .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-success);
}

.badge-status.disabled {
  background-color: #f1f5f9;
  color: var(--color-text-muted);
}

.badge-status.disabled .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #94a3b8;
}

.template-card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.title-toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.template-card-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text-main);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.select-status-switch {
  transform: scale(0.8);
  flex-shrink: 0;
}

.template-card-subtitle {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}

.template-card-uses {
  font-size: 0.72rem;
  color: var(--color-text-light);
  margin-top: auto;
  margin-bottom: 0.75rem;
}

.template-card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-border);
  padding-top: 0.75rem;
  margin-top: 0.5rem;
}

.left-actions {
  display: flex;
  gap: 0.25rem;
}

.btn-card-action {
  border: 1px solid var(--color-border);
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-card-action:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.btn-card-action.danger:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background-color: var(--color-danger-light);
}

/* Dashed Add Card */
.add-new-template-card-dashed {
  border: 2px dashed var(--color-border);
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
  min-height: 290px;
  box-shadow: none;
}

.add-new-template-card-dashed:hover {
  border-color: var(--color-primary);
  background-color: #f0f9ff;
}

.dashed-add-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.plus-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  box-shadow: var(--shadow-sm);
}

.dashed-add-content h4 {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text-main);
  margin-top: 0.5rem;
}

.dashed-add-content p {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

/* Edit template sidebar panel */
.template-edit-sidebar {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  gap: 1.25rem;
  background-color: white;
  border: 1px solid var(--color-border);
  height: max-content;
  max-height: calc(100vh - 120px);
  position: sticky;
  top: 1.5rem;
}

.template-edit-modal-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .template-edit-modal-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.sidebar-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
  flex-shrink: 0;
}

.sidebar-header-row h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-main);
}

.active-template-badge {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 0.68rem;
  font-weight: 750;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}

.sidebar-body-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding-right: 0.25rem;
  flex: 1;
}

.tags-edit-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.5rem;
  background-color: #f8fafc;
  min-height: 38px;
  align-items: center;
}

.tag-edit-pill {
  background-color: white;
  border: 1px solid var(--color-border);
  color: var(--color-text-main);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.remove-tag-x {
  cursor: pointer;
  color: var(--color-text-muted);
  font-weight: 800;
}

.remove-tag-x:hover {
  color: var(--color-danger);
}

.btn-add-tag-pill {
  background: white;
  border: 1px dashed var(--color-primary);
  color: var(--color-primary);
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-add-tag-pill:hover {
  background-color: var(--color-primary-light);
}

.sidebar-status-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px dashed var(--color-border);
  border-bottom: 1px dashed var(--color-border);
  padding: 0.75rem 0;
  margin-top: 0.5rem;
}

.lbl-details strong {
  font-size: 0.8rem;
  color: var(--color-text-main);
  display: block;
}

.lbl-details p {
  font-size: 0.68rem;
  color: var(--color-text-muted);
}

.sidebar-footer-row {
  display: flex;
  gap: 0.5rem;
  border-top: 1px solid var(--color-border);
  padding-top: 0.75rem;
  flex-shrink: 0;
}

/* Card Preview Resume Mock layouts */
.mock-resume-sheet-preview {
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  width: 100%;
  height: 140px;
  box-shadow: var(--shadow-sm);
  padding: 0.75rem;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: transform var(--transition-fast);
}

.template-card:hover .mock-resume-sheet-preview {
  transform: translateY(-2px);
}

.preview-header-mock {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.375rem;
  flex-shrink: 0;
}

.preview-title-line {
  height: 8px;
  width: 45%;
  background-color: #cbd5e1;
  border-radius: 1px;
}

.preview-sub-line {
  height: 5px;
  width: 25%;
  background-color: #cbd5e1;
  border-radius: 1px;
}

.preview-body-mock {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  overflow: hidden;
}

.preview-left-mock-col {
  width: 30%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-right: 1px solid #f1f5f9;
  padding-right: 0.25rem;
}

.preview-right-mock-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.preview-block-line {
  height: 4px;
  width: 90%;
  background-color: #cbd5e1;
  border-radius: 1px;
}

.preview-block-line.long {
  width: 100%;
}

/* Individual Template Mock Styling overrides */
/* Modern Blue (id 1): blue header and highlights */
.mock-sheet-style-1 .preview-header-mock {
  background-color: var(--color-primary-light);
  border-color: #dbeafe;
}
.mock-sheet-style-1 .preview-title-line {
  background-color: var(--color-primary);
}
.mock-sheet-style-1 .preview-sub-line {
  background-color: #60a5fa;
}
.mock-sheet-style-1 .preview-left-mock-col .preview-block-line {
  background-color: #93c5fd;
}

/* Elegant Classic (id 2): centered header and single-column style (no left col border, lines centered) */
.mock-sheet-style-2 .preview-header-mock {
  align-items: center;
}
.mock-sheet-style-2 .preview-title-line {
  background-color: #334155;
  width: 50%;
}
.mock-sheet-style-2 .preview-sub-line {
  background-color: #64748b;
}
.mock-sheet-style-2 .preview-left-mock-col {
  display: none;
}
.mock-sheet-style-2 .preview-right-mock-col .preview-block-line {
  background-color: #e2e8f0;
}

/* Simple Dark (id 3): Dark sidebar left column, white right column */
.mock-sheet-style-3 .preview-body-mock {
  margin-top: -0.5rem;
}
.mock-sheet-style-3 .preview-header-mock {
  display: none;
}
.mock-sheet-style-3 .preview-left-mock-col {
  width: 35%;
  background-color: #0f172a;
  border: none;
  padding: 0.5rem 0.25rem;
  height: 100%;
}
.mock-sheet-style-3 .preview-left-mock-col .preview-block-line {
  background-color: #475569;
}
.mock-sheet-style-3 .preview-right-mock-col {
  padding-top: 0.5rem;
}
.mock-sheet-style-3 .preview-right-mock-col .preview-block-line {
  background-color: #e2e8f0;
}

/* Creative Teal (id 4): Teal highlights, colorful left sidebar */
.mock-sheet-style-4 .preview-header-mock {
  border-color: #ccfbf1;
}
.mock-sheet-style-4 .preview-title-line {
  background-color: #0d9488;
}
.mock-sheet-style-4 .preview-sub-line {
  background-color: #2dd4bf;
}
.mock-sheet-style-4 .preview-left-mock-col {
  border-right-color: #ccfbf1;
}
.mock-sheet-style-4 .preview-left-mock-col .preview-block-line {
  background-color: #0d9488;
}

/* Clean Green (id 5): Green accents, clean single column */
.mock-sheet-style-5 .preview-title-line {
  background-color: #16a34a;
}
.mock-sheet-style-5 .preview-sub-line {
  background-color: #4ade80;
}
.mock-sheet-style-5 .preview-left-mock-col {
  display: none;
}
.mock-sheet-style-5 .preview-right-mock-col .preview-block-line {
  background-color: #f1f5f9;
}

/* Warm Amber (id 6): Amber header, grid pattern */
.mock-sheet-style-6 .preview-header-mock {
  background-color: #fffbeb;
  border-color: #fde68a;
}
.mock-sheet-style-6 .preview-title-line {
  background-color: #d97706;
}
.mock-sheet-style-6 .preview-sub-line {
  background-color: #fbbf24;
}

/* Upload preview box styles */
.admin-live-preview-box-container {
  height: 340px;
  background-color: #f8fafc;
  border-radius: var(--radius-md);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  border: 1px solid var(--color-border);
  overflow: hidden;
  position: relative;
  padding: 0.75rem;
}

.admin-live-preview-box-scale {
  width: 210mm;
  height: 297mm;
  transform: scale(0.35);
  transform-origin: top center;
  flex-shrink: 0;
  box-shadow: var(--shadow-md);
  background-color: white;
  margin-bottom: -730px;
}

.preview-upload-placeholder-box {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-sm);
  padding: 1.5rem;
  text-align: center;
  background-color: #f8fafc;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  transition: all var(--transition-fast);
}

.preview-upload-placeholder-box:hover {
  border-color: var(--color-primary);
  background-color: #f0f9ff;
}

.upload-icon {
  font-size: 1.5rem;
}

.upload-lbl {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text-main);
}

.upload-sub {
  font-size: 0.68rem;
  color: var(--color-text-muted);
}

/* Large mockup preview for dialog */
.large-mock-sheet-preview {
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  width: 100%;
  height: 300px;
  box-shadow: var(--shadow-premium);
  padding: 1.5rem;
  box-sizing: border-box;
  overflow: hidden;
}

.tpl-desc-preview {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  line-height: 1.4;
  margin-top: 0.5rem;
}

.modal-card.template-edit-modal {
  max-width: 1050px;
  width: 95%;
  max-height: 90vh;
  height: auto;
}

.template-edit-modal-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2rem;
}

@media (max-width: 992px) {
  .modal-card.template-edit-modal {
    max-height: 95vh;
  }
  .template-edit-modal-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .admin-live-preview-box-container {
    height: 280px;
  }
  .admin-live-preview-box-scale {
    transform: scale(0.28);
    margin-bottom: -810px;
  }
}

.modal-card.large-preview-modal {
  max-width: 850px;
  width: 95%;
  height: 85vh;
}

.modal-body-content.scrollable-preview-content {
  flex: 1;
  padding: 1.5rem;
  background-color: #f1f5f9;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.modal-live-preview-container {
  width: 210mm;
  height: 297mm;
  transform: scale(0.85);
  transform-origin: top center;
  margin: 0 auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  background-color: white;
  flex-shrink: 0;
  margin-bottom: -150px;
}

/* Responsive scale for modal preview */
@media (max-width: 768px) {
  .modal-card.large-preview-modal {
    height: 90vh;
  }
  .modal-live-preview-container {
    transform: scale(0.6);
    margin-bottom: -450px;
  }
}

@media (max-width: 480px) {
  .modal-live-preview-container {
    transform: scale(0.45);
    margin-bottom: -600px;
  }
}
</style>
