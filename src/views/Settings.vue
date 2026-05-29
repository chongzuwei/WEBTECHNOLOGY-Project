<template>
  <div>
    <h1>Manage Setting</h1>
    <div v-if="!user">No user found.</div>
    <div v-else>
      <form class="settings-form" @submit.prevent="save">
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" v-model="name" />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="email" />
        </div>

        <fieldset class="pass-fieldset">
          <legend>Change password</legend>
          <div class="form-group">
            <label for="currentPassword">Current password</label>
            <input id="currentPassword" type="password" v-model="currentPassword" />
          </div>
          <div class="form-group">
            <label for="newPassword">New password</label>
            <input id="newPassword" type="password" v-model="newPassword" />
          </div>
          <div class="form-group">
            <label for="confirm">Confirm new password</label>
            <input id="confirm" type="password" v-model="confirm" />
          </div>
        </fieldset>

        <div class="actions">
          <button type="submit">Save</button>
        </div>

        <p v-if="msg" class="msg">{{ msg }}</p>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
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
.settings-form{ max-width:480px }
.form-group{ display:flex; flex-direction:column; margin-bottom:10px }
.form-group label{ font-weight:600; margin-bottom:6px }
.form-group input{ padding:8px 10px; border:1px solid #ccc; border-radius:4px }
.pass-fieldset{ border:1px solid #ddd; padding:12px; border-radius:6px }
.pass-fieldset legend{ padding:0 6px }
.actions{ margin-top:12px }
.actions button{ padding:8px 14px; border-radius:4px; background:#2c3e50; color:#fff; border:none }
.msg{color:green;margin-top:8px}
.error{color:red;margin-top:8px}
</style>
