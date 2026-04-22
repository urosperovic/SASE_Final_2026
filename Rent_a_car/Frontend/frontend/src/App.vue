<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import { useRoute } from 'vue-router';

// Get the current year for the footer
const year = new Date().getFullYear();

// Get the current route
const route = useRoute();
</script>
<template>
  <div>
    <Navbar :key="route.fullPath" />
    <RouterView />
    <footer class="text-center mt-3 mb-3">
      &copy; {{ year }} Singidunum Universty - SDE
    </footer>
  </div>
</template>

