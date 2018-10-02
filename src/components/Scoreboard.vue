<template>
  <div class="scoreboard">
    <div class="scoreboard__lines">
      <div class="scoreboard__line"
        v-for="(line,key) in lines" :key="key">
        <span class="scoreboard__score">{{line}}</span>
        <span class="scoreboard__score">{{line}}</span>
      </div>
    </div>
    <div class="scoreboard__players">
      <div class="scoreboard__player"
        v-for="(player,key) in players" :key="key"
        :class="player.color"
        :style="{transform: 'translateY(calc(-'+player.score+' * 1.68vh))'}">
        <div class="scoreboard__player-score">{{player.score}}</div>
        <balloon-score/>
      </div>
    </div>
  </div>
</template>

<script>
  import balloonScore from '@/components/svg/balloon-score.vue';
  export default {
    components: {
      balloonScore
    },
    props: {
      players: Array
    },
    data() {
      return {
        maxScore: 50
      }
    },
    computed: {
      lines() {
        const lines = []
        for (let i=0; i<=this.maxScore; i++) {
          if (i % 5 === 0) {
            lines.push(i)
          }
        }
        return lines;
      }
    }
  }
</script>