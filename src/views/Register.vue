<template>
  <div class="auth-page-container">
    <div class="card auth-card">
      <div class="auth-header">
        <div class="auth-logo-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="4" fill="currentColor"></rect>
          </svg>
        </div>
        <h2>Create your Account</h2>
        <p>Start building your professional resume template today.</p>
      </div>

      <form @submit.prevent="submit" class="auth-form-body">
        
        <div class="form-group">
          <label for="name">Full Name</label>
          <input id="name" v-model.trim="name" class="form-input" placeholder="e.g. Alex Chen" />
          <div v-if="nameError" class="field-error">{{ nameError }}</div>
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input id="email" v-model.trim="email" class="form-input" placeholder="e.g. alex.chen@example.com" />
          <div v-if="emailError" class="field-error">{{ emailError }}</div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" v-model="password" class="form-input" placeholder="Min. 6 characters" />
          <div v-if="passwordError" class="field-error">{{ passwordError }}</div>
        </div>

        <div v-if="error" class="form-error-banner">{{ error }}</div>
        
        <button type="submit" :disabled="submitting" class="btn btn-primary auth-submit-btn">
          <span v-if="submitting">Creating account...</span>
          <span v-else>Register</span>
        </button>

        <p class="auth-footer-prompt">
          Already have an account? 
          <router-link to="/login" class="auth-link">Log In</router-link>
        </p>

      </form>
    </div>
  </div>
</template>

<script>
import auth from '@/services/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup(){
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const nameError = ref('')
    const emailError = ref('')
    const passwordError = ref('')
    const submitting = ref(false)
    const router = useRouter()

    function validate(){
      nameError.value = ''
      emailError.value = ''
      passwordError.value = ''
      const emailRe = /^\S+@\S+\.\S+$/
      if(!name.value) nameError.value = 'Name is required'
      if(!email.value) emailError.value = 'Email is required'
      else if(!emailRe.test(email.value)) emailError.value = 'Email is invalid'
      if(!password.value) passwordError.value = 'Password is required'
      else if(password.value.length < 6) passwordError.value = 'Password must be at least 6 characters'
      return !nameError.value && !emailError.value && !passwordError.value
    }

    async function submit(){
      error.value = ''
      if(!validate()) return
      submitting.value = true
      try{
        await auth.register({ name:name.value, email:email.value, password:password.value })
        router.push('/')
      }catch(err){ 
        error.value = err.message 
      } finally { 
        submitting.value = false 
      }
    }

    return { name, email, password, submit, error, nameError, emailError, passwordError, submitting }
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
