<template>
  <div>
    {{player.name}} - {{player.score}}
    <br/>
    <a class="card" v-for="(card, key) in cards" :key="key"
      @click="selectCard(card)">
      {{card.color}} 
    </a>
    <br/>
    ::{{cardsSelected}} ::
    <br/>
    <button :disabled="!canCommit || !isSelectionCommitable"
      @click="commitSelection(true)">Escolher cartas</button>
    <button :disabled="isChoiceMandatory"
      @click="commitSelection(false)">Desistir</button>
    <hr/>
  </div>
</template>

<script>
const numberOfCards = (array, color) => {
  let cards = array.filter(card => {
    if (card && card.color) {
      return card.color === color
    }
    else {
      return card === color 
    }
  });
  return cards.length;
};
export default {
  props: {
    player: Object,
    dice: Array,
    canCommit: Boolean,
    index: Number,
    points:Number
  },
  data() {
    return {
      cardsSelected:[]
    }
  },
  computed: {
    cards() {
        return this.player.cards.map(item => ({color: item, isSelected: false}))
    },
    isChoiceMandatory() {
      if (
        numberOfCards(this.player.cards, "yellow") >=
          numberOfCards(this.dice, "yellow") &&
        numberOfCards(this.player.cards, "purple") >=
          numberOfCards(this.dice, "purple") &&
        numberOfCards(this.player.cards, "red") >=
          numberOfCards(this.dice, "red") &&
        numberOfCards(this.player.cards, "green") >=
          numberOfCards(this.dice, "green")
      )
        return true;
      else return false;
    },
    isChoicePossible() {
      return this.isChoiceMandatory || numberOfCards(this.player.cards, "wild") > 0;
    },
    isChoiceNecessary(){
      return this.cardsToSelect > 0;
    },
    isSelectionCommitable() {
      if (
        numberOfCards(this.cardsSelected, "yellow") >=
          numberOfCards(this.dice, "yellow") &&
        numberOfCards(this.cardsSelected, "purple") >=
          numberOfCards(this.dice, "purple") &&
        numberOfCards(this.cardsSelected, "red") >=
          numberOfCards(this.dice, "red") &&
        numberOfCards(this.cardsSelected, "green") >=
          numberOfCards(this.dice, "green")
      )
        return true;
      else if (numberOfCards(this.cardsSelected, "wild") > 0)
        return true;  
      else return false;      
    },
    cardsToSelect() {
      const number = this.dice.filter(color => color !== null);
      return number.length;
    }
  },
  methods: {
    selectCard(card) {
      if(card.isSelected) {
        card.isSelected = false;
        this.cardsSelected.pop(card)
      } else {
        if (this.cardsSelected.length < this.cardsToSelect &&
            numberOfCards(this.cardsSelected, "wild") === 0) {
          if (numberOfCards(this.cardsSelected, "wild") > 0) {
            return false;
          }
          else if (card.color==="wild" && this.cardsSelected.length > 0) {
            return false;
          }
          card.isSelected = true;
          this.cardsSelected.push(card)
        }
      }
    },
    commitSelection(status) {
      this.cardsSelected = [];
      const cardsRemaining = this.cards.filter(item => item.isSelected === false).map(item => item.color);
      this.$emit('selectionCommited', {
        index : this.index,
        success: status,
        player: {
          ...this.player,
           cards: cardsRemaining
        }
      })
    }
  }
};
</script>

<style>
</style>