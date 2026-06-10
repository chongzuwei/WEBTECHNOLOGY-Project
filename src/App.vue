<template>
  <div id="app">
    <NavBar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
export default {
  components: { NavBar }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary-color: #3b82f6; /* Modern Blue */
  --primary-color-dark: #2563eb;
  --primary-color-light: #eff6ff;
  --bg-color: #f1f5f9;
  --card-bg: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --input-bg: #f8fafc;
}

body { 
  font-family: 'Inter', Arial, sans-serif; 
  margin: 0; 
  padding: 0; 
  background-color: var(--bg-color);
  color: var(--text-primary);
}

.main-content { 
  padding: 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

nav { 
  background: white; 
  color: var(--text-primary); 
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
nav a { 
  color: var(--text-secondary); 
  margin-right: 1.5rem; 
  text-decoration: none; 
  font-weight: 500;
  transition: color 0.2s;
}
nav a:hover {
  color: var(--primary-color);
}
nav a.router-link-active { 
  color: var(--primary-color);
  font-weight: 600; 
}

@media print {
  /* Force exact color printing for background colors, text, and borders */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Hide navigation header, sidebar form panel, and preview toolbar options */
  nav,
  .nav,
  .builder-sidebar,
  .preview-toolbar {
    display: none !important;
  }

  /* Reset outer layout containers to prevent shifting and cropping */
  body, 
  #app, 
  .main-content, 
  .resume-builder, 
  .builder-preview, 
  .preview-scroll, 
  .resume-preview-wrapper {
    background: none !important;
    background-color: white !important;
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    height: auto !important;
    min-height: 0 !important;
    box-shadow: none !important;
    display: block !important;
    overflow: visible !important;
  }

  /* Force print alignment and sizing for A4 resume container */
  .resume-preview-container {
    box-shadow: none !important;
    border: none !important;
    margin: 0 auto !important;
    width: 210mm !important;
    min-height: 297mm !important;
    page-break-after: avoid;
    page-break-before: avoid;
  }
}
</style>
