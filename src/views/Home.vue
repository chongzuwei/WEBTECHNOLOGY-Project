<template>
  <div>
    <h1>Home</h1>
    <p>Welcome to the SPA demo.</p>
    <section>
      <h2>Posts (async fetch)</h2>
      <div v-if="loading">Loading posts...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <ul v-else>
        <li v-for="post in posts" :key="post.id">
          <strong>{{ post.title }}</strong>
        </li>
      </ul>
      <button @click="refresh">Refresh</button>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
export default {
  setup(){
    const posts = ref([])
    const loading = ref(false)
    const error = ref(null)

    async function load(){
      loading.value = true
      error.value = null
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
        if(!res.ok) throw new Error('Network response not ok')
        posts.value = await res.json()
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
    function refresh(){ load() }
    onMounted(load)
    return { posts, loading, error, refresh }
  }
}
</script>

<style scoped>
.error{ color: red; }
</style>
