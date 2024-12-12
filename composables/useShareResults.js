export const useShareResults = () => {
  function distanceToEmojis (input) {
    // Define the minimum and maximum values for the scale
    const minInput = 0;
    const maxInput = 5000;

    // Cap the maximum number of squares at 8
    const maxSquares = 8;

    // If input is less than or equal to 50, draw no squares
    if (input <= 50) {
        return ""; // Return an empty string
    }

    // Calculate the number of squares using an exponential scale
    // Normalize input to a 0-1 range, then scale it exponentially
    let normalized = (input - 50) / (maxInput - 50); // Normalize input to 0-1
    normalized = Math.min(Math.max(normalized, 0), 1); // Clamp to 0-1 range

    // Exponentially scale to determine the number of squares
    const numberOfSquares = Math.ceil(Math.pow(normalized, 0.5) * maxSquares); // Square root scaling

    // Draw the squares
    return '➡️'.repeat(numberOfSquares); // Unicode for a white square
  }


  return {
    distanceToEmojis
  }
}