<template>
  <nav class="navbar no-print">
    <div class="nav-left">
      <!-- MaxCV Logo -->
      <router-link to="/" class="logo-link">
        <div class="logo-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="4" fill="currentColor"></rect>
          </svg>
        </div>
        <span class="logo-text">MaxCV</span>
      </router-link>

      <!-- Dynamic Page title / context divider -->
      <span class="nav-divider"></span>
      
      <div v-if="isEditorRoute" class="editor-title-container">
        <span class="page-title editor-title">{{ storeState.resumeData.title }}</span>
        <div class="save-status">
          <span class="save-dot"></span>
          <span class="save-text">Saved</span>
        </div>
      </div>
      <span v-else class="page-title">{{ pageTitle }}</span>
    </div>

    <!-- Navigation Right Content -->
    <div class="nav-right" ref="menuRoot">
      <!-- Editor-specific controls -->
      <div v-if="isEditorRoute" class="editor-controls">
        <div class="toggle-container">
          <span class="toggle-label">Live Preview</span>
          <label class="switch">
            <input type="checkbox" v-model="storeState.showLivePreview">
            <span class="slider round"></span>
          </label>
        </div>

        <router-link to="/" class="btn-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back
        </router-link>

        <button @click="triggerPrint" class="btn-export-top">
          Export PDF
        </button>
      </div>

      <!-- General Avatar Dropdown -->
      <div v-else-if="authed" class="user-profile-menu" @click="toggleMenu">
        <span v-if="user" class="greet-name">{{ user.name }}</span>
        <span class="avatar-circle">{{ avatarLetter }}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="dropdown-chevron">
          <path d="m6 9 6 6 6-6"/>
        </svg>

        <!-- Dropdown Menu -->
        <div v-if="showMenu" class="nav-dropdown">
          <a @click.prevent="goTo('/')" class="dropdown-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Dashboard
          </a>
          <a @click.prevent="goTo('/settings')" class="dropdown-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Edit Profile
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" @click.prevent="doLogout" class="dropdown-item logout-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Logout
          </a>
        </div>
      </div>

      <!-- Not Auth Actions -->
      <div v-else class="auth-buttons">
        <router-link to="/login" class="btn btn-secondary">Login</router-link>
        <router-link to="/register" class="btn btn-primary">Register</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import auth from '@/services/auth'
import { store } from '@/services/store'

export default {
  setup() {
    const authed = ref(auth.isAuthenticated())
    const user = ref(auth.getUser())
    const showMenu = ref(false)
    const menuRoot = ref(null)
    const router = useRouter()
    const route = useRoute()
    const storeState = store.state

    function update() {
      authed.value = auth.isAuthenticated()
      user.value = auth.getUser()
    }

    function toggleMenu() {
      showMenu.value = !showMenu.value
    }
    function closeMenu() {
      showMenu.value = false
    }
    function handleDocClick(e) {
      if (menuRoot.value && !menuRoot.value.contains(e.target)) closeMenu()
    }

    function doLogout() {
      auth.logout()
      closeMenu()
      router.push('/login')
    }
    function goTo(path) {
      closeMenu()
      router.push(path)
    }

    function triggerPrint() {
      window.print()
      // Log export action
      store.addExportRecord(`${store.state.resumeData.title}.pdf`, 'PDF')
    }

    onMounted(() => {
      window.addEventListener('auth-change', update)
      document.addEventListener('click', handleDocClick)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('auth-change', update)
      document.removeEventListener('click', handleDocClick)
    })

    const isEditorRoute = computed(() => route.path.startsWith('/editor'))

    const pageTitle = computed(() => {
      switch (route.name) {
        case 'Dashboard':
          return 'My Resume Dashboard'
        case 'Templates':
          return 'Choose Your Style'
        case 'Versions':
          return 'Versions & Export'
        case 'Insights':
          return 'Resume Insights & Activity'
        case 'Settings':
          return 'Account Settings'
        default:
          return 'MaxCV'
      }
    })

    const avatarLetter = computed(() => {
      return user.value?.name ? user.value.name.charAt(0).toUpperCase() : 'U'
    })

    return {
      authed,
      user,
      showMenu,
      menuRoot,
      toggleMenu,
      doLogout,
      goTo,
      storeState,
      isEditorRoute,
      pageTitle,
      avatarLetter,
      triggerPrint
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid var(--color-border);
  height: 64px;
  padding: 0 1.5rem;
  z-index: 100;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

.nav-left {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--color-primary);
  font-family: var(--font-brand);
  font-weight: 800;
  font-size: 1.25rem;
}

.logo-box {
  background-color: var(--color-primary);
  color: white;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  letter-spacing: -0.03em;
}

.nav-divider {
  width: 1px;
  height: 24px;
  background-color: var(--color-border);
  margin: 0 1.25rem;
}

.page-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text-main);
}

.editor-title-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.editor-title {
  color: var(--color-text-main);
  font-weight: 600;
}

.save-status {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background-color: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 50px;
  padding: 0.125rem 0.5rem;
}

.save-dot {
  width: 6px;
  height: 6px;
  background-color: var(--color-success);
  border-radius: 50%;
}

.save-text {
  font-size: 0.7rem;
  color: #047857;
  font-weight: 600;
}

.nav-right {
  position: relative;
}

.user-profile-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50px;
  transition: background-color var(--transition-fast);
}

.user-profile-menu:hover {
  background-color: #f1f5f9;
}

.greet-name {
  font-size: 0.875rem;
  font-weight: 550;
  color: var(--color-text-main);
}

.avatar-circle {
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  font-family: var(--font-brand);
}

.dropdown-chevron {
  color: var(--color-text-muted);
}

.nav-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background: white;
  color: var(--color-text-main);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border);
  min-width: 170px;
  padding: 0.5rem 0;
  z-index: 101;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1rem;
  color: var(--color-text-main);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f1f5f9;
  color: var(--color-primary);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 0.375rem 0;
}

.logout-link {
  color: var(--color-danger);
}
.logout-link:hover {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}

.auth-buttons {
  display: flex;
  gap: 0.5rem;
}

/* Editor Header Controls */
.editor-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 0.5rem;
}

.toggle-label {
  font-size: 0.85rem;
  font-weight: 550;
  color: var(--color-text-muted);
}

/* Switch Styles */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: .2s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .2s;
}
input:checked + .slider {
  background-color: var(--color-primary);
}
input:checked + .slider:before {
  transform: translateX(20px);
}
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  border: 1px solid var(--color-border);
  background-color: white;
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.875rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-back:hover {
  background-color: #f8fafc;
  color: var(--color-text-main);
  border-color: #cbd5e1;
}

.btn-export-top {
  border: none;
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--radius-sm);
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.btn-export-top:hover {
  background-color: var(--color-primary-hover);
}
</style>
