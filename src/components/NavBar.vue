<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-link to="/contact">Contact</router-link>
  </nav>
</template>

<style scoped>
nav { background:#2c3e50; color:#fff; padding:0.75rem; }
nav a { color:#fff; margin-right:1rem; text-decoration:none; }
nav a.router-link-active { font-weight:bold; text-decoration:underline; }
</style>
