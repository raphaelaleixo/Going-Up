<template>
    <li class="player-list__item" :class="player.color">
      <span class="player-list__name">{{player.name}} {{player.score}}</span>
      <span class="player-list__cards"> {{numberOfCards}} cards</span>
    </li>
</template>

<script>
  export default {
    props: {
      player: Object
    },
    computed: {
      numberOfCards() {
        return this.player.cards.length;
      }
    }
  }
</script>