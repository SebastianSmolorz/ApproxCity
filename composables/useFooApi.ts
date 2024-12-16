import axios from "axios";

const useDevModeApi = () => {
  const config = useRuntimeConfig()
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
      return new Promise((resolve) => resolve({
        distance: 666.666,
        score: 666.666,
        roundImageUrl: `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+319832(-2,51),pin-s+aa0100(-2.1122,51.2289)/auto/307x200?access_token=${config.public.mapboxToken}`,
        guessLngLat: {lng: 51.2, lat: 2.0},
        resultLngLat: {lng: 51.2, lat: 2.0}
      }))
    }
  }
}

export const useFooApi = () => {
  const config = useRuntimeConfig()
  const DEV_MODE = false
  if (DEV_MODE) {
    return useDevModeApi()
  }

  const getDailyGame = async (): Promise<any> => {
    const url = `${config.public.gameUrl}/daily-game`
    let response
    try {
      response = await axios.get(url)
    } catch (e) {
      throw Error("Couldn't fetch the game. Try again")
    }
    return response.data
  }

  const postGuess = async (round: number, guessText: string): Promise<any> => {
    const url = `${config.public.gameUrl}/daily-guess/?guess=${guessText}&round=${round}`
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


export const usePinTheCityApi = () => {
  const config = useRuntimeConfig()
  return {
    getDailyGame: () => {
      return Promise.resolve({
            "gameId": "2024-11-19",
            "guesses": [
              {
                "city": "Sydney",
                "hints": null,
                "lat": -33.8688,
                "lon": 151.2093,
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
      return new Promise((resolve) => resolve({
        distance: 666.666,
        score: 666.666,
        roundImageUrl: `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+319832(-2,51),pin-s+aa0100(-2.1122,51.2289)/auto/307x200?access_token=${config.public.mapboxToken}`,
        guessLngLat: {lng: 51.2, lat: 2.0},
        resultLngLat: {lng: 51.2, lat: 2.0}
      }))
    }
  }
}