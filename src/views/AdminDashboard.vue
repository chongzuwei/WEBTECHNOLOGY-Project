<template>
  <div class="main-content container admin-dashboard-layout">
    
    <!-- Header Platform Stats Row -->
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
          <span class="val">{{ storeState.versions.length + 5 }}</span>
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
          <span class="val">{{ storeState.exportHistory.length + 9 }}</span>
          <span class="lbl">Total Exports</span>
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
    </div>

    <!-- Tab 1: User Management -->
    <div v-if="activeTab === 'users'" class="admin-tab-content">
      <div class="content-header-row">
        <h3>Registered Accounts</h3>
        <button @click="openUserModal(null)" class="btn btn-primary btn-add-new">+ Add New User</button>
      </div>

      <!-- Filters & Search Bar -->
      <div class="admin-filters-bar">
        <div class="search-input-wrapper">
          <input type="text" v-model="userSearchQuery" class="form-input search-box" placeholder="Search users by name or email..." />
        </div>
        <div class="role-filter-wrapper">
          <span class="filter-lbl">Role:</span>
          <select v-model="userRoleFilter" class="filter-dropdown">
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <!-- Users Table -->
      <div class="card table-card">
        <table class="admin-data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email Address</th>
              <th>Role</th>
              <th class="actions-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in filteredUsers" :key="u.id">
              <td class="user-name-cell">
                <span class="user-avatar-initial">{{ u.name.charAt(0).toUpperCase() }}</span>
                {{ u.name }}
              </td>
              <td>{{ u.email }}</td>
              <td>
                <span class="badge" :class="u.role === 'admin' ? 'badge-danger' : 'badge-pdf'">{{ u.role }}</span>
              </td>
              <td class="actions-cell">
                <button @click="openUserModal(u)" class="btn-table-action btn-edit">Edit</button>
                <button @click="deleteUserLocal(u.id)" class="btn-table-action btn-delete" :disabled="u.email === 'admin@maxcv.com'">Delete</button>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="4" class="no-results-td">No user accounts matched your filters.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tab 2: Template Management -->
    <div v-else-if="activeTab === 'templates'" class="admin-tab-content">
      <div class="content-header-row">
        <h3>Resume Template Library</h3>
        <button @click="openTemplateModal(null)" class="btn btn-primary btn-add-new">+ Add New Template</button>
      </div>

      <!-- Filters & Search Bar -->
      <div class="admin-filters-bar">
        <div class="search-input-wrapper">
          <input type="text" v-model="templateSearchQuery" class="form-input search-box" placeholder="Search templates by name or description..." />
        </div>
        <div class="role-filter-wrapper">
          <span class="filter-lbl">Category:</span>
          <select v-model="templateTagFilter" class="filter-dropdown">
            <option value="all">All Categories</option>
            <option value="Modern">Modern</option>
            <option value="Classic">Classic</option>
            <option value="Minimal">Minimal</option>
            <option value="Creative">Creative</option>
          </select>
        </div>
      </div>

      <!-- Templates Grid/Table -->
      <div class="card table-card">
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
            <tr v-for="t in filteredTemplates" :key="t.id">
              <td class="template-name-cell">
                <div class="template-color-dot" :class="'dot-' + t.id"></div>
                <strong>{{ t.name }}</strong>
              </td>
              <td>{{ t.tag }}</td>
              <td>{{ t.layout_type }}</td>
              <td>⭐ {{ t.rating }} • {{ t.uses }} uses</td>
              <td>
                <label class="switch">
                  <input type="checkbox" :checked="t.is_active === 1" @change="toggleTemplateStatus(t)" />
                  <span class="slider round"></span>
                </label>
              </td>
              <td class="actions-cell">
                <button @click="openTemplateModal(t)" class="btn-table-action btn-edit">Edit</button>
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

    <!-- TEMPLATE MODAL (ADD / EDIT) -->
    <div v-if="templateModalVisible" class="modal-overlay" @click="templateModalVisible = false">
      <div class="modal-card" @click.stop>
        <div class="modal-header-row">
          <h3>{{ templateModalMode === 'add' ? 'Add Custom Template' : 'Edit Template Parameters' }}</h3>
          <button @click="templateModalVisible = false" class="modal-close-x">×</button>
        </div>
        <div class="modal-body-content flex-column modal-scroll">
          <div class="form-group">
            <label>Template Name</label>
            <input v-model="templateForm.name" class="form-input" placeholder="e.g. Modern Blue" />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="templateForm.description" rows="3" class="form-input text-area" placeholder="Briefly describe the layout style..."></textarea>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>Star Rating</label>
              <input type="number" step="0.1" min="1" max="5" v-model="templateForm.rating" class="form-input" placeholder="e.g. 4.9" />
            </div>
            <div class="form-group">
              <label>Uses Counter</label>
              <input v-model="templateForm.uses" class="form-input" placeholder="e.g. 2,300" />
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>Category (Tag)</label>
              <select v-model="templateForm.tag" class="form-input select-styled">
                <option value="Modern">Modern</option>
                <option value="Classic">Classic</option>
                <option value="Minimal">Minimal</option>
                <option value="Creative">Creative</option>
              </select>
            </div>
            <div class="form-group">
              <label>Layout Structure</label>
              <select v-model="templateForm.layout_type" class="form-input select-styled">
                <option value="2-column">2-Column Layout</option>
                <option value="single-column">Single-Column Standard</option>
                <option value="sidebar">Left Sidebar Accent</option>
                <option value="card-layout">Card Content Boxes</option>
              </select>
            </div>
          </div>

          <div class="checkboxes-form-row">
            <label class="checkbox-label">
              <input type="checkbox" v-model="templateForm.is_active" /> Active
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="templateForm.popular" /> Popular flag
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="templateForm.new" /> New layout flag
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="templateForm.atsReady" /> ATS-Ready compatibility
            </label>
          </div>

          <div v-if="templateModalError" class="modal-error-banner">{{ templateModalError }}</div>
        </div>
        <div class="modal-footer-row">
          <button @click="templateModalVisible = false" class="btn btn-secondary">Cancel</button>
          <button @click="saveTemplate" class="btn btn-primary">Save Template</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import auth from '@/services/auth'
import { store } from '@/services/store'

export default {
  setup() {
    const storeState = store.state
    const activeTab = ref('users')

    // Search and Filter variables
    const users = ref([])
    const userSearchQuery = ref('')
    const userRoleFilter = ref('all')

    const templateSearchQuery = ref('')
    const templateTagFilter = ref('all')

    // Modals visibility toggles
    const userModalVisible = ref(false)
    const userModalMode = ref('add') // add or edit
    const userModalError = ref('')
    const editingUserId = ref(null)
    const userForm = ref({ name: '', email: '', password: '', role: 'student' })

    const templateModalVisible = ref(false)
    const templateModalMode = ref('add') // add or edit
    const templateModalError = ref('')
    const editingTemplateId = ref(null)
    const templateForm = ref({ name: '', description: '', rating: 5.0, uses: '0', tag: 'Modern', layout_type: 'single-column', is_active: true, popular: false, new: false, atsReady: true })

    function fetchUsers() {
      users.value = auth.getAllUsers()
    }

    onMounted(fetchUsers)

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

    function saveUser() {
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
          auth.createUser({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            role: form.role
          })
          userModalVisible.value = false
          fetchUsers()
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
          auth.updateUser(editingUserId.value, updateFields)
          userModalVisible.value = false
          fetchUsers()
        } catch (e) {
          userModalError.value = e.message
        }
      }
    }

    function deleteUserLocal(id) {
      if (confirm('Are you sure you want to delete this user account? All resume metadata will be permanently lost.')) {
        try {
          auth.deleteUser(id)
          fetchUsers()
        } catch (e) {
          alert(e.message)
        }
      }
    }

    // Template CRUD actions
    function openTemplateModal(tplObj) {
      templateModalError.value = ''
      if (tplObj) {
        templateModalMode.value = 'edit'
        editingTemplateId.value = tplObj.id
        templateForm.value = {
          name: tplObj.name,
          description: tplObj.description,
          rating: tplObj.rating,
          uses: tplObj.uses,
          tag: tplObj.tag,
          layout_type: tplObj.layout_type,
          is_active: tplObj.is_active === 1,
          popular: tplObj.popular || false,
          new: tplObj.new || false,
          atsReady: tplObj.atsReady || false
        }
      } else {
        templateModalMode.value = 'add'
        editingTemplateId.value = null
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
          atsReady: true
        }
      }
      templateModalVisible.value = true
    }

    function saveTemplate() {
      templateModalError.value = ''
      const form = templateForm.value
      
      if (!form.name.trim()) return templateModalError.value = 'Template name is required'
      
      const payload = {
        name: form.name.trim(),
        description: form.description,
        rating: parseFloat(form.rating) || 5.0,
        uses: form.uses,
        tag: form.tag,
        layout_type: form.layout_type,
        is_active: form.is_active ? 1 : 0,
        popular: form.popular,
        new: form.new,
        atsReady: form.atsReady
      }

      if (templateModalMode.value === 'add') {
        store.createTemplate(payload)
      } else {
        store.updateTemplate(editingTemplateId.value, payload)
      }
      templateModalVisible.value = false
    }

    function toggleTemplateStatus(tpl) {
      const nextActive = tpl.is_active === 1 ? 0 : 1
      store.updateTemplate(tpl.id, { is_active: nextActive })
    }

    function deleteTemplateLocal(id) {
      if (confirm('Are you sure you want to delete this template from the library?')) {
        store.deleteTemplate(id)
      }
    }

    return {
      storeState,
      activeTab,
      users,
      userSearchQuery,
      userRoleFilter,
      templateSearchQuery,
      templateTagFilter,
      filteredUsers,
      filteredTemplates,
      activeTemplatesCount,
      // User Modal CRUD
      userModalVisible,
      userModalMode,
      userModalError,
      userForm,
      openUserModal,
      saveUser,
      deleteUserLocal,
      // Template Modal CRUD
      templateModalVisible,
      templateModalMode,
      templateModalError,
      templateForm,
      openTemplateModal,
      saveTemplate,
      toggleTemplateStatus,
      deleteTemplateLocal
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
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
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
}
.card-icon.blue { background-color: var(--color-primary-light); color: var(--color-primary); }
.card-icon.green { background-color: var(--color-success-light); color: var(--color-success); }
.card-icon.purple { background-color: #f3e8ff; color: #a855f7; }
.card-icon.orange { background-color: var(--color-warning-light); color: var(--color-warning); }

.card-details {
  display: flex;
  flex-direction: column;
}

.card-details .val {
  font-size: 1.5rem;
  font-weight: 800;
  font-family: var(--font-brand);
  color: var(--color-text-main);
  line-height: 1.1;
}

.card-details .lbl {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 600;
  text-transform: uppercase;
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

/* Admin Filters bar */
.admin-filters-bar {
  display: flex;
  background-color: white;
  border: 1px solid var(--color-border);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  gap: 1.5rem;
  align-items: center;
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

.user-name-cell {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar-initial {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
}

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
}
</style>
