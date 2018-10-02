<template>
  <div id="app" class="base">
    <Board/>
  </div>
</template>

<script>
import Board from './pages/Board.vue';
export default {
  name: 'app',
  components: {
    Board
  }
}
</script>