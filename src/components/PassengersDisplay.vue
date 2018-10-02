<template>
  <div class="passengers-display">
    <div class="passengers-display__passenger"
      v-for="(player,key) in players"
      :key="key" :class="[player.color, {'decided':player.decided}]"
      >
      <player-avatar
        class="passengers-display__avatar"
        :avatar="player.avatar"/>
      <div class="passengers-display__choice">
        <check-icon v-if="player.staying"
          class="passengers-display__icon--staying"/>
        <cross-icon v-else
          class="passengers-display__icon--leaving"/>
      </div>
    </div>
  </div>
</template>

<script>
  import PlayerAvatar from '@/components/svg/avatar/player-avatar.vue';
  import CheckIcon from '@/components/svg/CheckIcon.vue';
  import CrossIcon from '@/components/svg/CrossIcon.vue';
  export default {
    props: {
      players: Array,
    },
    components: {
      PlayerAvatar,
      CrossIcon,
      CheckIcon
    }
  }
</script>