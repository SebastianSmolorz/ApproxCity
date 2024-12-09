<script setup lang="ts">
import {useScreenSafeArea} from '@vueuse/core'
import { UseScreenSafeArea } from '@vueuse/components'
useHead({
  title: 'Around The Map',
  meta: [
    {name: 'description', content: 'Daily geography game..'},
    {name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit="cover"'}
  ],
  bodyAttrs: {
    class: 'bubblegum-font'
  },
})

const {
  top,
  right,
  bottom,
  left
} = useScreenSafeArea()
</script>


<template>
  <div class="bg-purple-300 w-screen h-screen">
    <UseScreenSafeArea top right bottom left>
      <NuxtPage/>
    </UseScreenSafeArea>
  </div>
</template>

<style>
</style>
