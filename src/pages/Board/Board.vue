<template>
  <div class="wrapper"
    v-if="game.id">
    <player-list :players="game.players" />
    <transition name="slide-fade"
      mode="out-in">
      <pilot-display :pilot="pilot"
        :key="pilot.index" />
    </transition>
    <cloud-track :cloud="cloud"
      :dice="game.turn.dice" />
    <passengers-display :players="passengers" />
    <scoreboard :players="game.players" />
    <button @click="rollDice">Teste</button>
  </div>
</template>

<script> 
  import { mapGetters } from 'vuex';
  import { mapActions } from 'vuex';
  import { cards } from '@/utils/utils.js'
  import { getRandom } from '@/utils/utils.js'
  import Scoreboard from '@/components/Scoreboard.vue'
  import CloudTrack from '@/components/CloudTrack.vue'
  import PlayerList from '@/components/PlayerList.vue'
  import PassengersDisplay from '@/components/PassengersDisplay.vue'
  import PilotDisplay from '@/components/PilotDisplay.vue'

  export default {
    computed: {
      ...mapGetters(['game', 'pilotIndex', 'cloud']),
      pilot () {
        return this.game.players[this.pilotIndex]
      },
      passengers () {
        return this.game.players.filter(player => player.index !== this.pilotIndex)
      }
    },
    methods: {
      ...mapActions(['updateGame', 'joinExistingGame', 'rollDice']),
      clearDice () {
        let faces = []
        for (let i = 0; i < this.cloud.dice; i++) {
          faces.push('?')
        }
        return faces
      },
      updatePlayer (data) {
        this.$set(this.game.players, [data.playerChanged], data.player)
        if (this.pilotIndex === data.playerChanged) {
          if (data.player.staying === false) {
            this.nextPilot()
          } else {
            this.rollDice()
          }
        }
      },
      setPilotSelection (data) {
        this.$set(this.game.players, [data.index], data.player),
          (this.game.players = this.game.players.map(player => {
            if (player.staying === true) {
              return {
                ...player,
                decided: false
              }
            } else {
              return player
            }
          }))

        if (data.success) {
          if (this.isAlone) {
            this.game.turn.flyingSolo = true
            this.nextCloud(true)
          } else {
            this.nextCloud()
          }
        } else {
          this.nextPilot();
        }
      },
      nextCloud (noDice) {
        this.game.turn.cloud++;

        if (this.game.turn.cloud === 8) {
          const self = this;
          const playersLeft = this.game.players.filter(player => player.staying === false);
          const playersStaying = this.game.players
            .filter(player => player.staying === true)
            .map(player => ({
              ...player,
              score: player.score + self.cloud.points
            }));
          this.game.players = [...playersLeft, ...playersStaying];
          this.nextPilot();
          return false;
        }

        if (!noDice) {
          this.rollDice();
        } else {
          this.game.turn.dice = this.clearDice();
        }
      },
      nextPilot () {
        this.game.turn.pilot++;
        this.game.turn.cloud = 0;
        this.game.turn.flyingSolo = false;
        this.game.players = this.game.players.map(player => {
          const newCard = getRandom(cards, 1);
          let playerCards = player.cards;
          playerCards.push(newCard[0]);
          return {
            ...player,
            cards: playerCards,
            staying: false,
            decided: false
          };
        });
        this.rollDice();
      }
    },
    components: {
      Scoreboard,
      CloudTrack,
      PlayerList,
      PilotDisplay,
      PassengersDisplay
    },
    mounted () {
      this.joinExistingGame(this.$route.params.id)
    }
  };
</script>

<style>
  .players {
    display: flex;
    justify-content: space-around;
  }
  .temp {
    display: flex;
    font-size: 0.5em;
    width: 50%;
    position: relative;
    z-index: 100;
  }

  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateY(10em);
    opacity: 0;
  }
</style>