<script setup>
import GameCard from "./GameCard.vue";

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="catalog-grid" aria-label="Каталог настольных игр">
    <GameCard
      v-for="item in props.items"
      :key="item.id"
      :title="item.title"
      :min-players="item.minPlayers"
      :max-players="item.maxPlayers"
      :price="Number(item.price)"
      :old-price="Number(item.oldPrice)"
      :is-hit="item.isHit"
    />
  </div>
</template>
