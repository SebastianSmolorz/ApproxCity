<script setup lang="ts">

</script>

<template>
  <div class="h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl m-10" style="min-width: 380px"><font-awesome icon="fas fa-globe" class="fa-spin mr-3"/>Around The Map<font-awesome icon="fas fa-globe" class="fa-spin ml-3"/></h1>
      <h2 class="text-2xl m-10">Play daily, name the nearest city and score big!</h2>
      <NuxtLink to="/closest-city/daily">
        <button class="text-2xl rounded-md p-2 bg-purple-800 text-amber-50 p-5 hover:bg-purple-400">Play Daily Game</button>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>

</style>