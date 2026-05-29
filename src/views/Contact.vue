<template>
  <div>
    <h1>Contact</h1>
    <form @submit.prevent="submit">
      <div>
        <label>Name</label><br/>
        <input v-model.trim="form.name" />
        <div v-if="errors.name" class="error">{{ errors.name }}</div>
      </div>
      <div>
        <label>Email</label><br/>
        <input v-model.trim="form.email" />
        <div v-if="errors.email" class="error">{{ errors.email }}</div>
      </div>
      <div>
        <label>Message</label><br/>
        <textarea v-model.trim="form.message"></textarea>
        <div v-if="errors.message" class="error">{{ errors.message }}</div>
      </div>
      <button type="submit">Send</button>
    </form>
    <div v-if="submitted" class="success">Thanks — your message was submitted locally.</div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
export default {
  setup(){
    const form = reactive({ name:'', email:'', message:'' })
    const errors = reactive({})
    const submitted = ref(false)

    function validate(){
      errors.name = !form.name ? 'Name required' : ''
      errors.email = !form.email ? 'Email required' : (/^\S+@\S+\.\S+$/.test(form.email) ? '' : 'Email invalid')
      errors.message = form.message.length < 10 ? 'Message must be at least 10 characters' : ''
      return !errors.name && !errors.email && !errors.message
    }

    function submit(){
      submitted.value = false
      if(validate()){
        setTimeout(()=> { submitted.value = true; form.name=''; form.email=''; form.message='' }, 500)
      }
    }
    return { form, errors, submit, submitted }
  }
}
</script>

<style scoped>.error{color:red}.success{color:green;margin-top:1rem}</style>
