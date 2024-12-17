<script lang="ts">
import {ref, nextTick} from 'vue';
import {GameState} from "~/pages/closest-city/types";
import { useClipboard, useShare } from '@vueuse/core'
import useAnalytics from "~/composables/useAnalytics";

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
    let {saveDailyGameScore, saveRoundScore, getLastDoneDaily, getLastDailyScore, resetGame, getValue, getDailyBreakdown} = useGameState()
    const { distanceToEmojis } = useShareResults()
    const { captureEvent } = useAnalytics()

    // Round results
    const roundResultImage = ref(null)
    const roundResultLngLat = ref(null)
    const guessLngLat = ref(null)
    const distance = ref(null)

    function getRoundBreakdownString () {
      return `1️⃣${distanceToEmojis(dailyBreakdown.value?.round1)}${dailyBreakdown.value?.round1}\n2️⃣${distanceToEmojis(dailyBreakdown.value?.round2)}${dailyBreakdown.value?.round2}\n3️⃣${distanceToEmojis(dailyBreakdown.value?.round3)}${dailyBreakdown.value?.round3}\n`
    }
    const source = computed(() => `NearCity Daily ${gameId.value}\n${getRoundBreakdownString()}Total distance: ${lastDailyScore.value}km\nhttps://approx-city.vercel.app/?utm_source=share`)
    const { copy } = useClipboard({ source })

    const { share, isSupported } = useShare()

    function shareResult() {
      if (isSupported.value) {
        share({
          title: 'NearCity Daily Score',
          text: source.value
        })
      } else {
        copy()
      }
    }


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

    const dailyBreakdown = computed(() => {
      return getDailyBreakdown(gameId.value)
    })

    const submitGuess = async () => {
      if (!hasGuess.value) {
        return
      }
      isSubmitting.value = true
      let data
      captureEvent('name_closest.submit_round', { guess: guessText.value, round: round.value, gameId: gameId.value })
      try {
        data = await postGuess(round.value, guessText.value)
      } catch (e) {
        if ('message' in e.response) {
          return alert(e?.response?.message || 'Sorry mate, something went awry. Try again in a bit.')
        } else {
          return alert('Sorry mate, something went awry. Try again in a bit.')
        }
      }
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
      shareResult,
      dailyBreakdown,
      source,
      copy
    }
  }
}
</script>

<template>
  <div class="container text-3xl">
    <template v-if="isLoading">
      <div class="text-3xl"><font-awesome icon="fas fa-globe" class="fa-beat-fade mr-1.5"/> Loading</div>
    </template>
    <template v-else>
      <template v-if="hasDoneDaily || isGameOver">
        <font-awesome icon="fas fa-trophy" class="fa-2xl text-purple-950"/>
        <div>Your score today is <strong>{{ lastDailyScore }}</strong></div>
        <div v-if="dailyBreakdown">
          <p><strong>Round 1:</strong> {{dailyBreakdown.round1}}km</p>
          <p><strong>Round 2:</strong> {{dailyBreakdown.round2}}km</p>
          <p><strong>Round 3:</strong> {{dailyBreakdown.round3}}km</p>
        </div>
        <div>
          <button @click="shareResult" class="rounded-md bg-purple-950 text-amber-50 p-5 hover:bg-purple-400 mr-1.5">Share results <font-awesome icon="fas fa-share-nodes" /></button>
          <button @click="copy()" class="rounded-md bg-purple-950 text-amber-50 p-5 hover:bg-purple-400">Copy results</button>
        </div>
        <p>Come back tomorrow for the next daily game.</p>
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
        <header class="text-3xl center-broken-text">Guess a city, town or village nearest to:</header>
        <h1 class="text-8xl to-guess-location center-broken-text">{{ location }}</h1>
        <form class="flex flex-col">
          <input class="text-input text-4xl" type="text" v-model="guessText" placeholder="Your guess">
          <button :class="{'bg-purple-400': isSubmitting}" class="text-4xl rounded-md p-2 bg-purple-950 text-amber-50 p-5 hover:bg-purple-400 mt-10" type="submit" @click="submitGuess" :disabled="isSubmitting">
            <template v-if="!isSubmitting">Submit guess</template>
            <template v-else>Submitting  <font-awesome icon="fas fa-spinner" class="fa-spin"/></template>
          </button>
        </form>
      </template>
    </template>
  </div>
</template>

<style scoped>
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
  min-height: 50px;
  min-width: 240px;
  padding-left: 5px;
}

.button {
  background: #000036;
  color: #b98fb2;
  border: none;
  padding: 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;

  border-radius: 0.5rem;
}

.to-guess-location {
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-weight: bold;
}


</style>
