<template>
  <div class="wrapper">
    <div class="temp">
      <div>
        Nuvem: {{game.turn.cloud}} / {{cloud.points}} ponto(s) / {{cloud.dice}} dados<br/> Dados: {{game.turn.dice}}
      </div>
      <pilot @selectionCommited="setPilotSelection($event)"
        @playerChanged="updatePlayer($event)"
        :index="pilotIndex"
        :dice="game.turn.dice"
        :points="cloud.points"
        :is-alone="game.turn.flyingSolo"
        :player="pilot"
        :can-commit="isDecisionMade" />
      <div class="players">
        <player-screen v-for="(player,key) in passengers"
          @playerChanged="updatePlayer($event)"
          :points="cloud.points"
          :key="key"
          :index="player.index"
          :player="player" />
      </div>
    </div>
    <player-list :players="game.players" />
    <cloud-track :cloud="cloud"
      :dice="game.turn.dice" />
    <passengers-display :players="passengers" />
    <scoreboard :players="game.players" />
  </div>
</template>

<script>
import { cards } from "../utils/utils.js"
import { getRandom } from "../utils/utils.js"
import PlayerScreen from "../pages/PlayerScreen.vue"
import Pilot from "../components/Pilot.vue"
import Scoreboard from "../components/Scoreboard.vue"
import CloudTrack from "../components/CloudTrack.vue"
import PlayerList from "../components/PlayerList.vue"
import PassengersDisplay from "../components/PassengersDisplay.vue"

export default { 
  data() {
    return {
      game: {
        players: [
          {
            index: 0,
            inRoom: false,
            name: "Raphael",
            avatar: 2,
            color: "green",
            score: 0,
            staying: true,
            decided: false,
            cards: []
          },
          {
            index: 1,
            inRoom: false,
            name: "Paula",
            avatar: 6,
            color: "red",
            score: 0,
            staying: true,
            decided: false,
            cards: []
          },
          {
            index: 2,
            inRoom: false,
            name: "Marina",
            avatar: 5,
            color: "yellow",
            score: 0,
            staying: true,
            decided: false,
            cards: []
          }
        ],
        turn: {
          pilot: 0,
          flyingSolo: false,
          cloud: 0,
          dice: []
        }
      }
    }
  },
  computed: {
    pilot() {
      return this.game.players[this.pilotIndex]
    },
    passengers() {
      return this.game.players.filter(player => player.index !== this.pilotIndex)
    },
    pilotIndex() {
      return this.game.turn.pilot % this.game.players.length
    },
    cloud() {
      const pointsArray = [1, 2, 4, 6, 9, 12, 15, 20, 25]
      const diceArray = [2, 2, 2, 3, 3, 3, 4, 4, 0]
      return {
        dice: diceArray[this.game.turn.cloud],
        points: pointsArray[this.game.turn.cloud]
      }
    },
    isDecisionMade() {
      const playersWhoDecided = this.game.players.filter(
        (item, index) =>
          index != this.game.turn.pilot % this.game.players.length &&
          item.decided === true
      )
      return playersWhoDecided.length === this.game.players.length - 1
    },
    isAlone() {
      const playersWhoStay = this.game.players.filter(
        (item, index) => index != this.pilotIndex && item.staying === false
      )
      return playersWhoStay.length === this.game.players.length - 1
    }
  },
  methods: {
    dealStartingHand() {
      this.game.players = this.game.players.map(player => ({
        ...player,
        cards: getRandom(cards, 6)
      }))
    },
    rollDice() {
      const randomValue = () => {
        const value = Math.floor(Math.random() * 6) + 1
        if (value === 3) return "purple"
        else if (value === 4) return "yellow"
        else if (value === 5) return "red"
        else if (value === 6) return "green"
        else return null
      }
      let diceValues = []
      for (let i = 0; i < this.cloud.dice; i++) {
        diceValues.push(randomValue())
      }
      this.game.turn.dice = diceValues
    },
    clearDice() {
      let faces = []
      for (let i = 0; i < this.cloud.dice; i++) {
        faces.push("null")
      }
      return faces
    },
    updatePlayer(data) {
      this.$set(this.game.players, [data.playerChanged], data.player)
      if (this.pilotIndex === data.playerChanged) {
        if (data.player.staying === false) {
          this.nextPilot()
        } else {
          this.rollDice()
        }
      }
    },
    setPilotSelection(data) {
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
    nextCloud(noDice) {
      this.game.turn.cloud++;

      if (this.game.turn.cloud === 8) {
        const self = this;
        const playersLeft = this.game.players.filter(player => player.staying===false);
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
    nextPilot() {
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
    Pilot,
    PlayerScreen,
    Scoreboard,
    CloudTrack,
    PlayerList,
    PassengersDisplay
  },
  created() {
    this.dealStartingHand();
    this.rollDice();
  }
};
</script>

<style>
  .players {
    display: flex;
    justify-content: space-around;
  }
  .temp {
    display: none;
    font-size: 0.5em;
    width: 50%;
    position: relative;
    z-index: 100;
  }
</style>