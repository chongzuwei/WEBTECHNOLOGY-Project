<template>
  <nav class="nav">
    <div class="nav-left">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/contact">Contact</router-link>
    </div>

    <div class="nav-right" ref="menuRoot">
      <div class="user" @click="toggleMenu">
        <span class="greet">Hi, {{ displayName }}</span>
        <span class="avatar">{{ avatarLetter }}</span>
      </div>

      <div v-if="showMenu" class="dropdown">
        <template v-if="!authed">
          <a @click.prevent="goTo('/register')">Register</a>
          <a @click.prevent="goTo('/login')">Login</a>
        </template>
        <template v-else>
          <a @click.prevent="goTo('/settings')">Edit Profile</a>
          <a href="#" @click.prevent="doLogout">Logout</a>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav { display:flex; justify-content:space-between; align-items:center; background:#2c3e50; color:#fff; padding:0.5rem 0.75rem; }
.nav-left a { color:#fff; margin-right:1rem; text-decoration:none; }
.nav-left a.router-link-active { font-weight:bold; text-decoration:underline; }
.nav-right { position:relative; }
.user { display:flex; align-items:center; gap:0.5rem; cursor:pointer; }
.greet{ color:#fff }
.avatar{ background:#fff; color:#2c3e50; border-radius:50%; width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; font-weight:bold }
.dropdown{ position:absolute; right:0; top:calc(100% + 6px); background:#fff; color:#222; border-radius:4px; box-shadow:0 6px 18px rgba(0,0,0,0.12); min-width:140px; padding:0.5rem 0; }
.dropdown a{ display:block; padding:0.5rem 1rem; color:#222; text-decoration:none }
.dropdown a:hover{ background:#f2f2f2 }
</style>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import auth from '@/services/auth'

export default {
  setup(){
    const authed = ref(auth.isAuthenticated())
    const user = ref(auth.getUser())
    const showMenu = ref(false)
    const menuRoot = ref(null)
    const router = useRouter()

    function update(){
      authed.value = auth.isAuthenticated()
      user.value = auth.getUser()
    }

    function toggleMenu(){ showMenu.value = !showMenu.value }
    function closeMenu(){ showMenu.value = false }
    function handleDocClick(e){ if(menuRoot.value && !menuRoot.value.contains(e.target)) closeMenu() }

    function doLogout(){ auth.logout(); closeMenu(); router.push('/') }
    function goTo(path){ closeMenu(); router.push(path) }

    onMounted(()=>{
      window.addEventListener('auth-change', update)
      document.addEventListener('click', handleDocClick)
    })
    onBeforeUnmount(()=>{
      window.removeEventListener('auth-change', update)
      document.removeEventListener('click', handleDocClick)
    })

    const displayName = computed(()=> user.value?.name ? user.value.name : 'there! :)')
    const avatarLetter = computed(()=> user.value?.name ? user.value.name.charAt(0).toUpperCase() : 'U')

    return { authed, user, showMenu, menuRoot, toggleMenu, doLogout, goTo, displayName, avatarLetter }
  }
}
</script>
