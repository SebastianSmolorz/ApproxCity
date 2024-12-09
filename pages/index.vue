<script setup lang="ts">

</script>

<template>
  <div class="intro-page h-screen flex items-center justify-center">
    <div class="text-center">
      <img src="/images/logo.png" width="200" style="margin: 0 auto">
      <h1 class="text-5xl m-10" style="min-width: 380px"><font-awesome icon="fas fa-globe" class="fa-spin mr-3"/>Around The Map<font-awesome icon="fas fa-globe" class="fa-spin ml-3"/></h1>
      <p class="text-3xl m-10 center-broken-text">Play daily, name the nearest city and score big!</p>
      <NuxtLink to="/closest-city/daily">
        <button class="text-3xl rounded-md p-2 bg-purple-800 text-amber-50 p-5 hover:bg-purple-400">Play Daily Game</button>
      </NuxtLink>
    </div>
  </div>
</template>

<style>
.center-broken-text {
  text-align: center; /* Centers the text */
  word-wrap: break-word; /* Ensures long words break to the next line */
  overflow-wrap: break-word; /* Ensures consistent word breaking across browsers */
  white-space: normal; /* Allows text to wrap naturally */
}
</style>