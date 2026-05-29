<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="submit">
      <div>
        <label>Email</label><br/>
        <input v-model.trim="email" />
      </div>
      <div>
        <label>Password</label><br/>
        <input type="password" v-model="password" />
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <button type="submit">Login</button>
    </form>
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
    const router = useRouter()
    const route = useRoute()

    async function submit(){
      error.value = ''
      try{
        auth.login({ email: email.value, password: password.value })
        const redirect = route.query.redirect || '/'
        router.push(redirect)
      }catch(err){ error.value = err.message }
    }

    return { email, password, submit, error }
  }
}
</script>

<style scoped>
.error{ color: red }
</style>
