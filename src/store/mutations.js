export default {
  CREATE_NEW_GAME: (state, payload) => {
    state.gameData = payload;
  },
  UPDATE_GAME: (state, payload) => {
    state.gameData = payload;
  },
  SAVE_GAME_KEY: (state, payload) => {
    state.gameKeyData = payload;
  },
  UPDATE_PLAYER: (state, payload) => {
    state.gameData.players[payload.index] = payload.data;
  },
};
