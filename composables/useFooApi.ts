import axios from "axios";

const useDevModeApi = () => {
  return {
    getDailyGame: () => {
      return Promise.resolve({
            "gameId": "2024-11-19",
            "guesses": [
              {
                "city": "Sydney",
                "hints": null
              },
              {
                "city": "Zadar",
                "hints": null
              },
              {
                "city": "Frankfurt",
                "hints": null
              }
            ]
          }
      )
    },
    postGuess: async () => {
      return new Promise((resolve) => resolve(666.666))
    }
  }
}

export const useFooApi = () => {
  // useState('foo', () => 'bar')
  const DEV_MODE = true
  if (DEV_MODE) {
    return useDevModeApi()
  }

  const getDailyGame = async (): Promise<any> => {
    const url = `${process.env.APPROXCITY_LAMBDA_URL}test/daily`
    let response
    try {
      response = await axios.get(url)
    } catch (e) {
      throw Error("Couldn't fetch the game. Try again")
    }
    return response.data
  }

  const postGuess = async (round: number, guessText: string): Promise<any> => {
    const url = `${process.env.APPROXCITY_LAMBDA_URL}test/submit-guess/?guess=${guessText}&round=${round}`
    let response
    try {
      response = await axios.post(url)
    } catch (e) {
      throw Error("Couldn't submit your guess. Try again")
    }
    return response.data
  }

  return {
    getDailyGame,
    postGuess
  }
}