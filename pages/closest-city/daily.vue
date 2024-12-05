<script lang="ts">
import {ref, nextTick} from 'vue';
import {GameState} from "~/pages/closest-city/types";
import { useClipboard } from '@vueuse/core'

export default {
  setup() {
    const isLoading = ref(true)
    const isSubmitting = ref(false)
    const gameId = ref(null)
    const round = ref(1)
    const gameState = ref('round')
    const guessText = ref('')
    const totalDistance = ref(0)
    const game = ref(null)
    const lastDoneDaily = ref('')
    const lastDailyScore = ref(0)
    const {getDailyGame, postGuess} = useFooApi()
    let {saveDailyGameScore, saveRoundScore, getLastDoneDaily, getLastDailyScore, resetGame, getValue} = useGameState()

    // Round results
    const roundResultImage = ref(null)
    const roundResultLngLat = ref(null)
    const guessLngLat = ref(null)
    const distance = ref(null)

    const source = computed(() => `NearCity Daily ${gameId.value}\nTotal distance: ${lastDailyScore.value}km`)
    const { copy } = useClipboard({ source })


    onMounted(async () => {
      try {
        game.value = await getDailyGame()
      } catch (e) {
        alert('Failed to load the game.')
      }
      gameId.value = game.value?.gameId
      if (gameId.value) {
        isLoading.value = false
      }
      lastDoneDaily.value = getLastDoneDaily()
      lastDailyScore.value = getLastDailyScore(gameId.value)
      if (getValue(`${gameId.value},2`)) {
        round.value = 3
      } else if (getValue(`${gameId.value},1`)) {
        round.value = 2
      }
    })

    const location = computed(() => {
      if (!isLoading.value) {
        return game.value?.guesses[round.value - 1]?.city
      }
    })

    const submitGuess = async () => {
      if (!hasGuess.value) {
        return
      }
      isSubmitting.value = true
      const data = await postGuess(round.value, guessText.value)
      if (data) {
        let roundScore = parseFloat(data?.distance)
        roundResultImage.value = data?.roundImageUrl
        roundResultLngLat.value = data?.resultLngLat
        guessLngLat.value = data?.guessLngLat
        distance.value = roundScore.toFixed(3)
        totalDistance.value += roundScore
        saveRoundScore(gameId.value, round.value, distance.value.toString(), distance.value.toString())
        if (isFinalRound.value) {
          gameState.value = GameState.RoundResult
          saveDailyGameScore(gameId.value, totalDistance.value, totalDistance.value)
          lastDailyScore.value = getLastDailyScore(gameId.value)
        } else {
          gameState.value = GameState.RoundResult
          focusNextFoundBtn()
        }
        isSubmitting.value = false
      }
    }


    const nextRound = () => {
      if (isFinalRound.value) {
        gameState.value = GameState.GameOver
      } else {
        gameState.value = GameState.RoundGuess
      }
      distance.value = null
      guessText.value = ""
      round.value = round.value + 1
    }

    const hasGuess = computed(() => guessText.value.length >= 3)
    const isGameOver = computed(() => gameState.value === GameState.GameOver)
    const isRoundResult = computed(() => gameState.value === GameState.RoundResult)
    const isRoundGuess = computed(() => gameState.value === GameState.RoundGuess)
    const isFinalRound = computed(() => round.value >= game.value?.guesses.length)
    const hasDoneDaily = computed(() => gameId.value === lastDoneDaily.value)
    const nextRoundBtn = ref(null)

    const focusNextFoundBtn = () => {
      nextTick(() => {
        nextRoundBtn.value?.focus()
      })
    }

    return {
      isLoading,
      score: distance,
      location,
      guessText,
      round,
      totalDistance,
      isGameOver,
      isRoundResult,
      isRoundGuess,
      submitGuess,
      nextRound,
      hasGuess,
      getLastDailyScore,
      hasDoneDaily,
      resetGame,
      gameId,
      lastDoneDaily,
      nextRoundBtn,
      roundResultImage,
      lastDailyScore,
      isSubmitting,
      copy
    }
  }
}
</script>

<template>
  <div class="container">
    <template v-if="isLoading">
      <div class="text-2xl"><font-awesome icon="fas fa-globe" class="fa-beat-fade mr-1.5"/> Loading</div>
    </template>
    <template v-else>
      <template v-if="hasDoneDaily || isGameOver">
        <font-awesome icon="fas fa-trophy" class="fa-2xl text-purple-950"/>
        <div class="font-bold">Your score today is {{ lastDailyScore }}</div>
        <button @click="copy()" class="rounded-md bg-purple-950 text-amber-50 p-5 hover:bg-purple-400">Share results <font-awesome icon="fas fa-share-nodes" /></button>
        <p class="text-lg">Come back tomorrow for the next daily game.</p>
<!--        <button type="button" @click="resetGame">Retry</button>-->
      </template>
      <template v-else-if="isRoundResult">
        <img :src="roundResultImage">
        <div v-if="score">{{ score }}km</div>
        <button ref="nextRoundBtn" class="button" :disabled="!hasGuess" v-if="score" type="submit" @click="nextRound">
          Next round
        </button>
      </template>
      <template v-else>
<!--        <header>{{ gameId }}</header>-->
<!--        <strong>Round {{ round }}</strong>-->
        <header class="text-lg">Guess a city, town or village nearest to:</header>
        <h1 class="to-guess-location">{{ location }}</h1>
        <form class="flex flex-col">
          <input class="text-input" type="text" v-model="guessText"/>
          <button :class="{'bg-purple-400': isSubmitting}" class="text-2xl rounded-md p-2 bg-purple-950 text-amber-50 p-5 hover:bg-purple-400 mt-10" type="submit" @click="submitGuess" :disabled="isSubmitting">
            <template v-if="!isSubmitting">Submit guess</template>
            <template v-else>Submitting  <font-awesome icon="fas fa-spinner" class="fa-spin"/></template>
          </button>
        </form>
      </template>
    </template>
  </div>
</template>

<style scoped>
html, body {
  margin: 0;
}

.app {
  background: #b98fb2;
  width: 100vw;
  height: 100vh;
  color: #000036;
  font-family: Fahkwang;
  font-size: 2vw;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 25px;

  position: absolute;
  left: 50%;
  top: 40%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.text-input {
  border: 5px solid #000036;
  border-radius: 4px;
  height: 4vw;
  width: 20vw;
  font-size: 2rem;
  min-height: 50px;
  min-width: 200px;
}

.button {
  background: #000036;
  color: #b98fb2;
  border: none;
  padding: 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;

  border-radius: 0.5rem;
}

.to-guess-location {
  font-size: 4vw;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-weight: bold;
}


</style>
