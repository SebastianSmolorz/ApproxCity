export const useShareResults = () => {
 function distanceToEmojis(distance) {
    // Bullseyes: 0–150 km
    if (distance >= 0 && distance <= 50) {
        return "🎯🎯🎯🎯🎯"; // 5 bullseyes
    } else if (distance > 50 && distance <= 75) {
        return "🎯🎯🎯🎯"; // 4 bullseyes
    } else if (distance > 75 && distance <= 100) {
        return "🎯🎯🎯"; // 3 bullseyes
    } else if (distance > 100 && distance <= 125) {
        return "🎯🎯"; // 2 bullseyes
    } else if (distance > 125 && distance <= 150) {
        return "🎯"; // 1 bullseye
    }

    // Stars (Reversed): 151–500 km
    else if (distance > 150 && distance <= 175) {
        return "⭐⭐⭐⭐⭐"; // 5 stars
    } else if (distance > 175 && distance <= 200) {
        return "⭐⭐⭐⭐"; // 4 stars
    } else if (distance > 200 && distance <= 225) {
        return "⭐⭐⭐"; // 3 stars
    } else if (distance > 225 && distance <= 250) {
        return "⭐⭐"; // 2 stars
    } else if (distance > 250 && distance <= 500) {
        return "⭐"; // 1 star
    }

    // Airplane: 501–5,000 km
    else if (distance > 500 && distance <= 5000) {
        return "✈️";
    }

    // Rocket: 5,001+ km
    else if (distance > 5000) {
        return "🚀";
    }

    // Fallback for invalid input
    return "🚀";
}


  return {
    distanceToEmojis
  }
}