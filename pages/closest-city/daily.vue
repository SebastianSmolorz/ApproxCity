<script lang="ts">
import { ref } from 'vue';
export default {
  setup() {
    const isLoading = ref(true)
    const gameId = ref(null)
    const round = ref(1)
    const gameState = ref('round')
    const guessText = ref('')
    const score = ref(null)
    const totalScore = ref(0)
    const game = ref(null)
    const { getDailyGame, postGuess } = useFooApi()


    onMounted(async () => {
      game.value = await getDailyGame()
      isLoading.value = false
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
      const data = await postGuess(round.value, guessText.value)
      console.log(data)
      if (data) {
        let roundScore = parseFloat(data)
        score.value = roundScore.toFixed(3)
        totalScore.value += roundScore
        if (isFinalRound.value) {
          gameState.value = 'gameOver'
        } else {
          gameState.value = 'roundResult'
        }
      }

    }


    const nextRound = () => {
      if (isFinalRound.value) {
        gameState.value = 'gameOver'
      } else {
        gameState.value = 'roundGuess'
      }
      score.value = null
      guessText.value = ""
      round.value = round.value + 1
    }

    const hasGuess = computed(() => guessText.value.length >= 3)
    const isGameOver = computed(() => gameState.value === 'gameOver')
    const isRoundResult = computed(() => gameState.value === 'roundResult')
    const isRoundGuess = computed(() => gameState.value === 'round')
    const isFinalRound = computed(() => round.value >= game.value?.guesses.length)

    return {
      isLoading,
      score,
      location,
      guessText,
      round,
      totalScore,
      isGameOver,
      isRoundResult,
      isRoundGuess,
      submitGuess,
      nextRound,
      hasGuess
    }
  }
}
</script>

<template>
  <div class="container">
    <template v-if="isLoading">
      Loading...
    </template>
    <template v-else>
      <template v-if="isGameOver">
        Total score: {{ totalScore.toFixed(3) }}
      </template>
      <template v-else-if="isRoundResult">
        <span v-if="score">{{ score }}km</span>
        <button class="button" :disabled="!hasGuess" v-if="score" type="submit" @click="nextRound">Next round</button>
      </template>
      <template v-else>
        <header>Navigator</header>
        <strong>Round {{ round }}</strong>
        <p>Guess a city, town or village nearest to:</p>
        <h1 class="to-guess-location">{{ location }}</h1>
        <input class="text-input" autofocus type="text" v-model="guessText"/>
        <button class="button" type="submit" @click="submitGuess">Submit guess</button>
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
    }


</style>
