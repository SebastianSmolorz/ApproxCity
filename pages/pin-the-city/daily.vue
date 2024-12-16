<script setup lang="ts">
import {usePinTheCityApi} from "~/composables/useFooApi";

const mapRef = useMapboxRef('map');

const currentGuess = ref(null)
const placeToGuess = ref('New York')
const lngLatToGuess = ref({lng: -74.0060, lat: 40.7128})
const reveal = ref(false)
const gameId = ref(null)
const game = ref({})

const {
  getDailyGame,
  postGuess
} = usePinTheCityApi()

const crowData = computed(() => {
  if (currentGuess.value?.lat && currentGuess.value?.lat) {
    return {
      'type': 'LineString',
      'coordinates': [
        [lngLatToGuess.value.lat, lngLatToGuess.value.lng],
        [currentGuess.value.lat, currentGuess.value.lng],
      ]
    }
  }
  return {}
})

function onClick(e) {
  console.log(e.lngLat)
  currentGuess.value = e.lngLat;
}

function nextRound() {

}

async function loadGame() {
  const response = await getDailyGame()
  game.value = response.guesses
  gameId.value = response.gameId
}

function onSubmit() {
  console.log('submit', currentGuess.value)
  reveal.value = true
  mapRef.value.fitBounds([
    lngLatToGuess.value,
    currentGuess.value
  ], {
    padding: {top: 200, bottom: 200, left: 200, right: 200}
  })

  mapRef.value?.addSource('crow', {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [lngLatToGuess.value.lng, lngLatToGuess.value.lat],
          [currentGuess.value.lng, currentGuess.value.lat]
        ]
      }
    }
  })
}

onMounted(async () => {
    await loadGame()
    placeToGuess.value = game.value[0].city
    lngLatToGuess.value = {lat: game.value[0].lat, lng: game.value[0].lon}
})
</script>

<template>
  <div>
    <MapboxMap
        map-id="map"
        style="position: absolute; top: 0; bottom: 0;width: 100%;"
        @click="onClick"
        :options="{
        style: 'mapbox://styles/navigator-game/cm4oetl34005n01qtg94sga3e', // style URL
        center: [0, 0], // starting position
        zoom: 3 // starting zoom
      }"
    >
      <MapboxDefaultMarker
          v-if="currentGuess"
          marker-id="guess"
          :options="{ color: '#aa5fe0'}"
          :lnglat="currentGuess"
      >
      </MapboxDefaultMarker>
      <MapboxDefaultMarker
          v-if="reveal"
          marker-id="location"
          :options="{ color: '#fc3737'}"
          :lnglat="lngLatToGuess"
      >
      </MapboxDefaultMarker>
      <MapboxLayer
          :layer="{
            'id': 'route',
            'type': 'line',
            'source': 'crow',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#8600d9',
                'line-width': 12
            }
        }"
      />
    </MapboxMap>
    <div
        class="absolute bg-black backdrop-blur text-3xl top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-amber-50 text-center p-1">
      Place {{ placeToGuess }} on the map
    </div>
    <div class="absolute left-1/2 transform -translate-x-1/2 bottom-5">
      <PrimaryButton @click="onSubmit">Submit guess</PrimaryButton>
    </div>
  </div>
</template>

<style scoped>

</style>