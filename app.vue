<script setup lang="ts">
useHead({
  title: 'Around The Map',
  meta: [
    { name: 'description', content: 'Daily geography game..' }
  ],
  bodyAttrs: {
    class: 'bubblegum-font'
  },
})
</script>


<template>
  <NuxtLoadingIndicator />
<!--  <ul>-->
<!--  <li><NuxtLink to="/">Home page</NuxtLink></li>-->
<!--  <li><NuxtLink to="/about">About page</NuxtLink></li>-->
<!--  </ul>-->
  <div class="app-container bg-purple-300 w-screen h-screen font-sans">
      <NuxtPage />
  </div>

</template>

<style>
</style>
