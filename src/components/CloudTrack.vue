<template>
  <div class="cloud-track">
    <div class="cloud-track__actual-cloud cloud">
      <div class="cloud__number">{{cloud.points}}</div>
      <cloud-icon />
      <div class="cloud__dice dice">
        <div class="cloud__die"
          v-for="(cloud, key) in cloud.dice"
          :key="key">
          <balloon-dice-icon class="dice-icon"
            v-if="dice[key] !== '?'"
            :class="dice[key] || 'clear'" />
          <span class="dice__secret"
            v-else>?</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CloudIcon from '@/components/svg/CloudIcon.vue'
  import BalloonDiceIcon from '@/components/svg/BalloonDiceIcon.vue'
  export default {
    props: {
      cloud: Object,
      dice: Array,
    },
    components: {
      CloudIcon,
      BalloonDiceIcon
    }
  }
</script>