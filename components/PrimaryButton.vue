<script setup lang="ts">
</script>

<template>
  <button class="rounded-md text-2xl bg-purple-950 text-amber-50 p-5 hover:bg-purple-400" @click="$emit('click')"><slot></slot></button>
</template>

<style scoped>

</style>