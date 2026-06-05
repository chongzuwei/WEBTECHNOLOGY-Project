<template>
  <div class="main-content container settings-page-layout">
    <div class="card settings-card">
      <div class="settings-header-title">
        <h2>Account Settings</h2>
        <p>Update your personal login info, email address, or update security credentials.</p>
      </div>

      <div v-if="!user" class="no-user-error">No active account session found.</div>
      
      <div v-else>
        <form class="settings-form-body" @submit.prevent="save">
          
          <div class="form-group">
            <label for="name">Full Name</label>
            <input id="name" v-model="name" class="form-input" placeholder="e.g. Alex Chen" />
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input id="email" v-model="email" class="form-input" placeholder="e.g. alex@example.com" />
          </div>

          <fieldset class="pass-fieldset-group">
            <legend class="fieldset-legend">Change Account Password</legend>
            
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input id="currentPassword" type="password" v-model="currentPassword" class="form-input" placeholder="Enter current password to authorize change" />
            </div>
            
            <div class="form-row-2">
              <div class="form-group">
                <label for="newPassword">New Password</label>
                <input id="newPassword" type="password" v-model="newPassword" class="form-input" placeholder="Min. 6 characters" />
              </div>
              <div class="form-group">
                <label for="confirm">Confirm New Password</label>
                <input id="confirm" type="password" v-model="confirm" class="form-input" placeholder="Re-type new password" />
              </div>
            </div>
          </fieldset>

          <div v-if="msg" class="success-banner-msg">{{ msg }}</div>
          <div v-if="error" class="error-banner-msg">{{ error }}</div>

          <div class="settings-actions-row">
            <button type="submit" class="btn btn-primary btn-save">Save Changes</button>
            <router-link to="/" class="btn btn-secondary btn-cancel">Cancel</router-link>
          </div>

        </form>
      </div>
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
      
      // Validation checks
      if(!name.value) return error.value = 'Name is required'
      if(!email.value || !/^\S+@\S+\.\S+$/.test(email.value)) return error.value = 'Valid email is required'
      if(newPassword.value){
        if(newPassword.value.length < 6) return error.value = 'New password must be at least 6 characters'
        if(newPassword.value !== confirm.value) return error.value = 'Password confirmation does not match'
      }

      try{
        auth.updateProfile({ 
          name: name.value, 
          email: email.value, 
          currentPassword: currentPassword.value || undefined, 
          newPassword: newPassword.value || undefined 
        })
        msg.value = 'Your profile settings have been updated successfully.'
        user.value = auth.getUser()
        
        // Clear password inputs
        currentPassword.value = ''
        newPassword.value = ''
        confirm.value = ''
      }catch(err){ 
        error.value = err.message 
      }
    }

    return { user, name, email, currentPassword, newPassword, confirm, save, msg, error }
  }
}
</script>

<style scoped>
.settings-page-layout {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.settings-card {
  width: 100%;
  max-width: 580px;
  background-color: white;
  padding: 2.25rem 2.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-premium);
}

.settings-header-title {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
}

.settings-header-title h2 {
  font-family: var(--font-brand);
  font-weight: 800;
  font-size: 1.4rem;
  color: var(--color-text-main);
  margin-bottom: 0.25rem;
}

.settings-header-title p {
  color: var(--color-text-muted);
  font-size: 0.82rem;
}

.no-user-error {
  text-align: center;
  color: var(--color-danger);
  padding: 2rem;
  font-weight: 600;
}

.settings-form-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.pass-fieldset-group {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.5rem 1.25rem 0.5rem;
  background-color: #fafbfc;
  margin-bottom: 0.5rem;
}

.fieldset-legend {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  padding: 0 0.5rem;
  letter-spacing: 0.05em;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.success-banner-msg {
  background-color: var(--color-success-light);
  border: 1px solid #a7f3d0;
  color: #047857;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
}

.error-banner-msg {
  background-color: var(--color-danger-light);
  border: 1px solid #fca5a5;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
}

.settings-actions-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  border-top: 1px solid var(--color-border);
  padding-top: 1.5rem;
}

.btn-save {
  flex: 2;
  font-weight: 700;
  font-size: 0.9rem;
}

.btn-cancel {
  flex: 1;
}
</style>
