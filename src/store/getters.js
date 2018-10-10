export default {
  game: state => {
    return state.gameData;
  },
  gameKey: state => {
    return state.gameKeyData;
  },
  pilotIndex: state => {
    if (state.gameData.id) return state.gameData.turn.pilot % state.gameData.players.length;
  },
  cloud: state => {
    if (state.gameData.id) {
      const pointsArray = [1, 2, 4, 6, 9, 12, 15, 20, 25];
      const diceArray = [2, 2, 2, 3, 3, 3, 4, 4, 0];
      return {
        dice: diceArray[state.gameData.turn.cloud],
        points: pointsArray[state.gameData.turn.cloud],
      };
    }
  },
};
