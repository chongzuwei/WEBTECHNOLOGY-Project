<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="submit">
      <div>
        <label>Name</label><br/>
        <input v-model.trim="name" />
      </div>
      <div>
        <label>Email</label><br/>
        <input v-model.trim="email" />
      </div>
      <div>
        <label>Password</label><br/>
        <input type="password" v-model="password" />
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <button type="submit">Register</button>
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
    const router = useRouter()

    function submit(){
      error.value = ''
      try{
        auth.register({ name:name.value, email:email.value, password:password.value })
        router.push('/')
      }catch(err){ error.value = err.message }
    }

    return { name, email, password, submit, error }
  }
}
</script>

<style scoped>
.error{color:red}
</style>
