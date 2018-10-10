<template>
  <div>
    <form v-if="step===0"
      @submit.prevent="changeStep">
      <label for="players">Número de jogadores: </label>
      <input type="number"
        min="3"
        max="6"
        v-model="playerCount"
        @input="changeNumberOfPlayers" />
      <button>Próximo</button>
    </form>
    <form v-if="step===1"
      @submit.prevent="setupGame">
      <div v-for="(player,key) in players"
        :key="key">
        <input v-model="player.name"
          type="text" />
        <select v-model.lazy="player.color">
          <option v-for="(color,key) in colorsAvailable"
            :disabled="color.available"
            :key="key"
            :value="color.color">{{color.color}}</option>
        </select>
        <select v-model.lazy="player.avatar">
          <option v-for="(avatar,key) in avatars"
            :key="key"
            :value="avatar">{{avatar}}</option>
        </select>
      </div>
      <button>começar</button>
    </form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { mapActions } from 'vuex'
  import { cards } from '../utils/utils.js'
  import { getRandom } from '../utils/utils.js'
  export default {
    data () {
      return {
        step: 0,
        colors: ['green', 'red', 'purple', 'blue', 'yellow', 'beige'],
        avatars: [1, 2, 3, 4, 5, 6, 7, 8],
        playerCount: 3,
        players: []
      }
    },
    computed: {
      ...mapGetters(['game']),
      colorsUsed () {
        return this.players.map(player => player.color);
      },
      colorsAvailable () {
        return this.colors.map(item => ({
          color: item,
          available: this.colorsUsed.indexOf(item) > -1
        }));
      },
    },
    methods: {
      ...mapActions(['createNewGame', 'joinExistingGame']),
      //
      changeStep () {
        this.step++
      },
      changeNumberOfPlayers () {
        if (this.players.length > this.playerCount) {
          this.players = this.players.slice(0, this.playerCount)
        }
        else if (this.players.length < this.playerCount) {
          const difference = this.playerCount - this.players.length;
          for (let i = 0; i < difference; i++) {
            this.players.push({
              name: 'player ' + (i + 1),
              avatar: this.avatars[i],
              color: this.colors[i],
            })
          }
        }
      },
      async setupGame () {
        const players = this.players.map((player, index) => ({
          ...player,
          index: index,
          score: 0,
          staying: true,
          decided: false,
          cards: getRandom(cards, 6)
        }))
        const game = {
          id: Math.random().toString(36).substr(2, 5),
          players,
          turn: {
            pilot: 0,
            flyingSolo: false,
            cloud: 0,
            dice: ['?', '?']
          }
        }
        await this.createNewGame(game)
        this.$router.push('/game/' + game.id)
      }
    },
    mounted () {
      this.changeNumberOfPlayers();
    }
  }
</script>