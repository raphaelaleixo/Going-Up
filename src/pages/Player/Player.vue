<template>
  <div v-if="game.id">
    <gui-passenger v-if="!playerIsPilot"
      :points="cloud.points"
      :index="player.index"
      :player="player" />
    <gui-pilot v-else
      @selectionCommited="setPilotSelection($event)"
      @playerChanged="updatePlayer($event)"
      :index="pilotIndex"
      :dice="game.turn.dice"
      :points="cloud.points"
      :is-alone="game.turn.flyingSolo"
      :player="player"
      :can-commit="isDecisionMade" />
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { mapGetters } from 'vuex'
  import GuiPassenger from '@/components/GuiPassenger.vue'
  import GuiPilot from '@/components/GuiPilot.vue'
  export default {
    computed: {
      ...mapGetters(['game', 'pilotIndex', 'cloud']),
      player () {
        return this.game.players[this.$route.params.player]
      },
      playerIsPilot () {
        return this.$route.params.player == this.pilotIndex
      },
      isDecisionMade () {
        const playersWhoDecided = this.game.players.filter(
          (item, index) =>
            index != this.game.turn.pilot % this.game.players.length &&
            item.decided === true
        )
        return playersWhoDecided.length === this.game.players.length - 1
      },
      isAlone () {
        const playersWhoStay = this.game.players.filter(
          (item, index) => index != this.pilotIndex && item.staying === false
        )
        return playersWhoStay.length === this.game.players.length - 1
      }
    },
    methods: {
      ...mapActions(['joinExistingGame']),
    },
    components: {
      GuiPassenger,
      GuiPilot
    },
    created () {
      this.joinExistingGame(this.$route.params.id)
    }
  }
</script>