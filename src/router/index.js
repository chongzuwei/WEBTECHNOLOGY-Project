import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Editor from '../views/Editor.vue'
import Templates from '../views/Templates.vue'
import Versions from '../views/Versions.vue'
import Insights from '../views/Insights.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Settings from '../views/Settings.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import auth from '@/services/auth'
import { store } from '@/services/store'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/editor', name: 'Editor', component: Editor, meta: { requiresAuth: true } },
  { path: '/templates', name: 'Templates', component: Templates, meta: { requiresAuth: true } },
  { path: '/versions', name: 'Versions', component: Versions, meta: { requiresAuth: true } },
  { path: '/insights', name: 'Insights', component: Insights, meta: { requiresAuth: true } },
  { path: '/admin', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/settings', name: 'Settings', component: Settings, meta: { requiresAuth: true } },
  { path: '/about', name: 'About', component: About },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = auth.isAuthenticated()
  const user = auth.getUser()

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (isAuthenticated && user) {
    // Initialize the store for this user
    store.initForUser(user.id)

    // Redirect admin to admin dashboard if accessing home page
    if (user.role === 'admin' && to.path === '/') {
      return next({ path: '/admin' })
    }
    // Block non-admin from admin page
    if (to.meta.requiresAdmin && user.role !== 'admin') {
      return next({ path: '/' })
    }
  }

  next()
})

export default router
