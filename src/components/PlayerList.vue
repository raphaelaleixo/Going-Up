<template>
  <div class="player-list">
    <div class="going-up__logo">
      <img src="@/assets/logo.png" />
    </div>
    <ul class="player-list__list">
      <player-list-item v-for="(player,key) in players"
        :key="key"
        :player="player" />
    </ul>
  </div>
</template>
 
<script>
  import PlayerListItem from './PlayerListItem.vue'
  export default {
    components: {
      PlayerListItem
    },
    props: {
      players: Array
    }
  }
</script>