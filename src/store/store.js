import Vue from 'vue';
import Vuex from 'vuex';
import database from '@/utils/database';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    game: {},
    key: '',
  },
  getters: {
    getNewGame: state => {
      return state.game;
    },
    getGameKey: state => {
      return state.key;
    },
    pilotIndex: state => {
      return state.game.turn.pilot % state.game.players.length;
    },
  },
  mutations: {
    CREATE_NEW_GAME: (state, payload) => {
      state.game = payload;
    },
    UPDATE_GAME: (state, payload) => {
      state.game = payload;
    },
    SAVE_GAME_KEY: (state, payload) => {
      state.key = payload;
    },
    UPDATE_PLAYER: (state, payload) => {
      state.game.players[payload.index] = payload.data;
    },
  },
  actions: {
    createNewGame: async (context, payload) => {
      const gamesRef = database.ref();
      const newGame = gamesRef.push();
      await newGame.set({
        ...payload,
      });
      context.commit('CREATE_NEW_GAME', payload);
      context.commit('SAVE_GAME_KEY', newGame.key);
    },
    joinExistingGame: async (context, payload) => {
      const gameRef = database
        .ref()
        .orderByChild('id')
        .equalTo(payload);
      gameRef.on('child_added', snapshot => {
        context.commit('CREATE_NEW_GAME', snapshot.val());
        context.commit('SAVE_GAME_KEY', snapshot.key);
      });
      gameRef.on('child_changed', snapshot => {
        context.commit('UPDATE_GAME', snapshot.val());
      });
    },
    updateGame: async (context, payload) => {
      const gameRef = database.ref(context.state.key);
      await gameRef.update({
        ...payload,
      });
      context.commit('UPDATE_GAME', payload);
    },
    updatePlayer: async (context, player) => {
      const gameRef = database.ref(context.state.key + '/players/' + player.index);
      await gameRef.update(player.data);
      context.commit('UPDATE_PLAYER', player);
    },
  },
});
