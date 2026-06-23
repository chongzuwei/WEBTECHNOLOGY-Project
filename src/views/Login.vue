<template>
  <div class="auth-page-container">
    <div class="card auth-card">
      <div class="auth-header">
        <div class="auth-logo-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="4" fill="currentColor"></rect>
          </svg>
        </div>
        <h2>Welcome Back to MaxCV</h2>
        <p>Log in to access your resumes and track your applications.</p>
      </div>

      <form @submit.prevent="submit" class="auth-form-body">
        
        <div class="form-group">
          <label for="email">Email Address</label>
          <div class="input-icon-wrapper">
            <input id="email" v-model.trim="email" class="form-input" placeholder="e.g. alex.chen@example.com" />
          </div>
          <div v-if="emailError" class="field-error">{{ emailError }}</div>
        </div>

        <div class="form-group">
          <div class="label-row">
            <label for="password">Password</label>
            <a href="#" @click.prevent="forgotPassword" class="forgot-pass-link">Forgot password?</a>
          </div>
          <div class="input-icon-wrapper">
            <input id="password" type="password" v-model="password" class="form-input" placeholder="••••••••" />
          </div>
          <div v-if="passwordError" class="field-error">{{ passwordError }}</div>
        </div>

        <div v-if="error" class="form-error-banner">{{ error }}</div>
        
        <button type="submit" :disabled="submitting" class="btn btn-primary auth-submit-btn">
          <span v-if="submitting">Logging you in...</span>
          <span v-else>Log In</span>
        </button>

        <p class="auth-footer-prompt">
          Don't have an account? 
          <router-link to="/register" class="auth-link">Sign Up</router-link>
        </p>

      </form>
    </div>
  </div>
</template>

<script>
import auth from '@/services/auth'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  setup(){
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const emailError = ref('')
    const passwordError = ref('')
    const submitting = ref(false)
    const router = useRouter()
    const route = useRoute()

    function validate(){
      emailError.value = ''
      passwordError.value = ''
      const emailRe = /^\S+@\S+\.\S+$/
      if(!email.value) emailError.value = 'Email is required'
      else if(!emailRe.test(email.value)) emailError.value = 'Email is invalid'
      if(!password.value) passwordError.value = 'Password is required'
      return !emailError.value && !passwordError.value
    }

    async function submit(){
      error.value = ''
      if(!validate()) return
      submitting.value = true
      try{
        await auth.login({ email: email.value, password: password.value })
        const redirect = route.query.redirect || '/'
        router.push(redirect)
      }catch(err){ 
        error.value = err.message 
      } finally { 
        submitting.value = false 
      }
    }

    function forgotPassword() {
      alert('Mock password reset instructions sent to your email!')
    }

    return { email, password, submit, error, emailError, passwordError, submitting, forgotPassword }
  }
}
</script>

<style scoped>
.auth-page-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  padding: 2rem 1rem;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  background-color: white;
  box-shadow: var(--shadow-premium);
  border-radius: var(--radius-lg);
  padding: 2.5rem 2.25rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-logo-box {
  background-color: var(--color-primary);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 4px 12px rgba(37,99,235,0.2);
}

.auth-header h2 {
  font-family: var(--font-brand);
  font-weight: 800;
  font-size: 1.35rem;
  color: var(--color-text-main);
  margin-bottom: 0.375rem;
}

.auth-header p {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.auth-form-body {
  display: flex;
  flex-direction: column;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-pass-link {
  font-size: 0.75rem;
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}
.forgot-pass-link:hover {
  text-decoration: underline;
}

.field-error {
  color: var(--color-danger);
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.25rem;
}

.form-error-banner {
  background-color: var(--color-danger-light);
  border: 1px solid #fca5a5;
  color: #b91c1c;
  padding: 0.625rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  text-align: center;
}

.auth-submit-btn {
  width: 100%;
  padding: 0.75rem;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
}

.auth-footer-prompt {
  text-align: center;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.auth-link {
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: none;
}
.auth-link:hover {
  text-decoration: underline;
}
</style>
