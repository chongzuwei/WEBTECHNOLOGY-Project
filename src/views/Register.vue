<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="submit" class="auth-form">
      <div class="form-group">
        <label for="name">Name</label>
        <input id="name" v-model.trim="name" />
        <div v-if="nameError" class="field-error">{{ nameError }}</div>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model.trim="email" />
        <div v-if="emailError" class="field-error">{{ emailError }}</div>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" />
        <div v-if="passwordError" class="field-error">{{ passwordError }}</div>
      </div>

      <div v-if="error" class="error">{{ error }}</div>
      <button type="submit" :disabled="submitting">Register</button>
    </form>
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
        auth.register({ name:name.value, email:email.value, password:password.value })
        router.push('/')
      }catch(err){ error.value = err.message }
      finally{ submitting.value = false }
    }

    return { name, email, password, submit, error, nameError, emailError, passwordError, submitting }
  }
}
</script>

<style scoped>
.error{color:red}
.auth-form{ max-width:420px }
.form-group{ display:flex; flex-direction:column; margin-bottom:10px }
.field-error{ color:#b00020; font-size:0.9rem; margin-top:6px }
button[disabled]{ opacity:0.6 }
</style>
