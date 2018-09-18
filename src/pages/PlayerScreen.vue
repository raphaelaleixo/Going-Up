<template>
  <div>
    {{player.name}} - {{player.score}}
    <br/>
    <a class="card" v-for="(card, key) in player.cards" :key="key"
      @click="selectCard(card)">
      {{card}} 
    </a>
    <br/>
    ::
    <span v-if="player.decided && player.staying">Fica</span>
    <span v-if="player.decided && !player.staying">Sai</span>
    ::
    <hr/>
    <div>
      <button @click="stay()"
        :disabled="player.decided===true">Ficar</button>
      <button @click="leave()"
        :disabled="player.decided===true">Sair</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    player: Object,
    points:Number,
    index: Number
  },
  methods: {
    stay() {
      this.$emit("playerChanged", {
        playerChanged: this.index,
        player: {
          ...this.player,
          staying: true,
          decided: true
        }
      });
    },
    leave() {
      this.$emit("playerChanged", {
        playerChanged: this.index,
        addScore: true,
        player: {
          ...this.player,
          score: this.player.score + this.points,
          staying: false,
          decided: true
        }
      });
    },
  }
};
</script>

<style>
</style>