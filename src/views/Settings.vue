<template>
  <div>
    <h1>Manage Setting</h1>
    <div v-if="!user">No user found.</div>
    <div v-else>
      <label>Name</label><br/>
      <input v-model="name" />
      <div style="margin-top:8px">
        <label>Email</label><br/>
        <input v-model="email" />
      </div>

      <fieldset style="margin-top:12px">
        <legend>Change password</legend>
        <label>Current password</label><br/>
        <input type="password" v-model="currentPassword" />
        <label style="margin-top:6px">New password</label><br/>
        <input type="password" v-model="newPassword" />
        <label style="margin-top:6px">Confirm new password</label><br/>
        <input type="password" v-model="confirm" />
      </fieldset>

      <div style="margin-top:10px">
        <button @click="save">Save</button>
      </div>

      <div v-if="msg" class="msg">{{ msg }}</div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import auth from '@/services/auth'

export default {
  setup(){
    const user = ref(auth.getUser())
    const name = ref(user.value?.name || '')
    const email = ref(user.value?.email || '')
    const currentPassword = ref('')
    const newPassword = ref('')
    const confirm = ref('')
    const msg = ref('')
    const error = ref('')

    async function save(){
      error.value = ''
      msg.value = ''
      // basic validation
      if(!name.value) return error.value = 'Name is required'
      if(!email.value || !/^\S+@\S+\.\S+$/.test(email.value)) return error.value = 'Valid email is required'
      if(newPassword.value){
        if(newPassword.value.length < 6) return error.value = 'New password must be at least 6 characters'
        if(newPassword.value !== confirm.value) return error.value = 'Password confirmation does not match'
      }

      try{
        auth.updateProfile({ name: name.value, email: email.value, currentPassword: currentPassword.value || undefined, newPassword: newPassword.value || undefined })
        msg.value = 'Profile updated.'
        // refresh local user reference
        user.value = auth.getUser()
        // clear password fields
        currentPassword.value = ''
        newPassword.value = ''
        confirm.value = ''
      }catch(err){ error.value = err.message }
    }

    return { user, name, email, currentPassword, newPassword, confirm, save, msg, error }
  }
}
</script>

<style scoped>
.msg{color:green;margin-top:8px}
.error{color:red;margin-top:8px}
</style>
