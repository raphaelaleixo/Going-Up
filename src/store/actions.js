import database from '@/utils/database';

export default {
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
    const gameRef = await database
      .ref()
      .orderByChild('id')
      .equalTo(payload);
    await gameRef.on('child_added', snapshot => {
      context.commit('CREATE_NEW_GAME', snapshot.val());
      context.commit('SAVE_GAME_KEY', snapshot.key);
    });
    gameRef.on('child_changed', snapshot => {
      context.commit('UPDATE_GAME', snapshot.val());
    });
  },
  updateGame: async (context, payload) => {
    const gameRef = database.ref(context.state.gameKeyData);
    await gameRef.update({
      ...payload,
    });
    context.commit('UPDATE_GAME', payload);
  },
  updatePlayer: async (context, player) => {
    const gameRef = database.ref(context.state.gameKeyData + '/players/' + player.index);
    await gameRef.update(player.data);
    context.commit('UPDATE_PLAYER', player);
  },
  rollDice: async context => {
    const randomValue = () => {
      const value = Math.floor(Math.random() * 6) + 1;
      if (value === 3) return 'purple';
      else if (value === 4) return 'yellow';
      else if (value === 5) return 'red';
      else if (value === 6) return 'green';
      else return '';
    };
    let diceValues = [];
    for (let i = 0; i < context.getters.cloud.dice; i++) {
      diceValues.push(randomValue());
    }
    const updateValue = {
      ...context.state.gameData,
      turn: {
        ...context.state.gameData.turn,
        dice: diceValues,
      },
    };
    context.dispatch('updateGame', updateValue);
  },
};
