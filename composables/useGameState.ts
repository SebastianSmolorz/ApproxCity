import { useStorage } from '@vueuse/core'

export const useGameState = () => {

    function saveRoundScore (gameId: string, roundNumber: number, roundDistance: number, roundScore: number) {
        let data = `${roundDistance},${roundScore}`
        localStorage.setItem(`${gameId},${roundNumber}`, data)
    }

    function getDailyBreakdown (gameId: string) {
        const round1 = useStorage(`${gameId},1`, '4000,4000')
        const round2 = useStorage(`${gameId},2`, '4000,4000')
        const round3 = useStorage(`${gameId},3`, '4000,4000')
        return {
            round1: parseInt(round1.value.split(',')[0]),
            round2: parseInt(round2.value.split(',')[0]),
            round3: parseInt(round3.value.split(',')[0]),
        }
    }

    function saveDailyGameScore (gameId: string, gameDistance: number, gameScore: number) {
        localStorage.setItem(`${gameId}_final`, `${gameDistance},${gameScore}`)
        setLastDailyDone(gameId)
    }
    function getValue (key: string) {
        return localStorage.getItem(key)
    }

    function setLastDailyDone (daily_id: string) {
        return localStorage.setItem('last_daily', daily_id)
    }

    function getLastDoneDaily () {
        return getValue('last_daily')
    }

    function getLastDailyScore (gameId: string) {
        let val = getValue(`${gameId}_final`)
        if (val) {
            return Number(val.split(',')[1]).toFixed(3)
        }
        return null
    }

    function resetGame() {
        localStorage.clear()
        window.location = window.location
    }


    return {
        saveRoundScore,
        saveDailyGameScore,
        getValue,
        getLastDoneDaily,
        getLastDailyScore,
        resetGame,
        getDailyBreakdown
    }
}