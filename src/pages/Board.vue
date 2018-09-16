<template>
  <div>
    <div>
      Nuvem: {{cloud.points}} ponto(s) / {{cloud.dice}} dados<br/>
      Dados: {{game.turn.dice}}
    </div>
    <hr/>
    <pilot       
        @selectionCommited="setPilotSelection($event)"
        :index="game.turn.pilot"
        :dice="game.turn.dice"
        :points="cloud.points"
        :player="game.players[game.turn.pilot]"
        :canCommit="isDecisionMade"/>
    <hr/>
    <div class="players">
      <player-screen v-for="(player,key) in game.players"
        v-if="key !== game.turn.pilot"      
        @playerChanged="updatePlayer($event)"
        :points="cloud.points"
        :key="key" :index="key"
        :dice="game.turn.dice"
        :player="player"/>
    </div>
  </div>
</template>

<script>
import { cards } from "../utils/utils.js";
import { getRandom } from "../utils/utils.js";
import PlayerScreen from "../pages/PlayerScreen.vue";
import Pilot from "../components/Pilot.vue";

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
            staying: false,
            decided: true,
            cards: getRandom(cards, 6)
          },
          {
            index: 1,
            inRoom: false,
            name: "Paula",
            avatar: 1,
            color: "red",
            score: 0,
            staying: true,
            decided: false,
            cards: getRandom(cards, 6)
          },
          {
            index: 2,
            inRoom: false,
            name: "Marina",
            avatar: 1,
            color: "blue",
            score: 0,
            staying: true,
            decided: false,
            cards: getRandom(cards, 6)
          }
        ],
        turn: {
          pilot: 0,
          phase: 0,
          // 0: Players decision
          // 1: Pilot cards
          // 2: Solo flight
          // 3: Solo cards
          cloud: 0,
          dice: []
        }
      }
    };
  },
  computed: {
    pilot() {
      return this.game.players[this.game.turn.pilot % this.game.players.length];
    },
    cloud() {
      const pointsArray = [1, 2, 4, 6, 9, 12, 15, 20, 25];
      const diceArray = [2, 2, 2, 3, 3, 3, 4, 4, 0];
      return {
        dice: diceArray[this.game.turn.cloud],
        points: pointsArray[this.game.turn.cloud]
      };
    },
    isDecisionMade() {
      const playersWhoDecided = this.game.players.filter(
        (item, index) =>
          index != this.game.turn.pilot % this.game.players.length &&
          item.decided === true
      );
      return playersWhoDecided.length === this.game.players.length - 1;
    }
  },
  methods: {
    dealStartingHand() {
      this.game.players.map(player => ({
        ...player,
        cards: getRandom(cards, 6)
      }));
    },
    rollDice() {
      const randomValue = () => {
        const value = Math.floor(Math.random() * 6) + 1;
        if (value === 3) return "purple";
        else if (value === 4) return "yellow";
        else if (value === 5) return "red";
        else if (value === 6) return "green";
        else return null;
      };
      let diceValues = [];
      for (let i = 0; i < this.cloud.dice; i++) {
        diceValues.push(randomValue());
      }
      this.game.turn.dice = diceValues;
    },
    changeCloud() {
      this.game.turn.cloud++;
    },
    updatePlayer(data) {
      this.$set(this.game.players, [data.playerChanged], data.player);
    },
    setPilotSelection(data) {
      this.$set(this.game.players, [data.index], data.player),
        (this.game.players = this.game.players.map(player => {
          if (player.staying === true) {
            return {
              ...player,
              decided: false
            };
          } else {
            return player;
          }
        }));

      if (data.success) {
        this.nextCloud();
      } else {
        this.nextPilot();
      }
    },
    nextCloud() {
      this.game.turn.cloud++;
      this.rollDice();
    },
    nextPilot() {
      this.game.turn.pilot++;
      this.game.turn.cloud = 0;
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
    PlayerScreen
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
</style>