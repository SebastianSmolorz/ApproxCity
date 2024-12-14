<script setup lang="ts">
const mapRef = useMapboxRef('map');

const currentGuess = ref(null)
const placeToGuess = ref('New York')
const lngLatToGuess = ref({lng: -74.0060, lat: 40.7128})
const reveal = ref(false)


function onClick(e) {
  console.log(e.lngLat)
  currentGuess.value = e.lngLat;
}

function onSubmit() {
  console.log('submit', currentGuess.value)
  reveal.value = true
  mapRef.value.fitBounds([
    lngLatToGuess.value,
    currentGuess.value
  ], {
    padding: {top: 50, bottom: 50, left: 50, right: 50}
  })

}
</script>

<template>
  <div>
    <MapboxMap
        map-id="map"
        style="position: absolute; top: 0; bottom: 0;width: 100%;"
        @click="onClick"
        :options="{
        style: 'mapbox://styles/navigator-game/cm4oetl34005n01qtg94sga3e', // style URL
        center: [-68.137343, 45.137451], // starting position
        zoom: 5 // starting zoom
      }"
    >
      <MapboxDefaultMarker
          v-if="currentGuess"
          marker-id="guess"
          :options="{}"
          :lnglat="currentGuess"
      >
      </MapboxDefaultMarker>
      <MapboxDefaultMarker
          v-if="reveal"
          marker-id="location"
          :options="{ color: '#b40219'}"
          :lnglat="lngLatToGuess"
      >
      </MapboxDefaultMarker>
    </MapboxMap>
    <div class="absolute text-7xl top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 backdrop-blur backdrop-contrast-125 text-amber-50">
      Place {{ placeToGuess }} on the map
    </div>
    <div class="absolute top-3 right-3">
      <PrimaryButton @click="onSubmit">Submit guess</PrimaryButton>
    </div>
  </div>
</template>

<style scoped>

</style>