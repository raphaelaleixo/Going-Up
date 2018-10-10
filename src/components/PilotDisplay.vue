<template>
  <div class="pilot-display">
    <div class="pilot-display__pilot"
      :class="pilot.color">
      <player-avatar class="pilot-display__avatar"
        :avatar="pilot.avatar" />
      <balloon-pilot class="pilot-display__balloon" />
    </div>
  </div>
</template>

<script>
  import BalloonPilot from '@/components/svg/BalloonPilot.vue'
  import PlayerAvatar from '@/components/svg/avatar/PlayerAvatar.vue';
  export default {
    props: {
      pilot: Object
    },
    components: {
      BalloonPilot,
      PlayerAvatar
    }
  }
</script>