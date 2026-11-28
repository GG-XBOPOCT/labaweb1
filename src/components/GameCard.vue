<script setup>
import { computed } from "vue";
import { gameImages } from "../data/gameImages.js";

const props = defineProps({
  title: { type: String, required: true },
  minPlayers: { type: Number, required: true },
  maxPlayers: { type: Number, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number, required: true },
  isHit: { type: Boolean, default: false }
});

const isDiscounted = computed(() => props.oldPrice > props.price);
const discountPercent = computed(() => {
  if (!isDiscounted.value || props.oldPrice <= 0) return 0;
  return Math.round((1 - props.price / props.oldPrice) * 100);
});
const imageUrl = computed(() => gameImages[props.title] || "/images/colonizers.svg");
const formattedPrice = (value) => `${Number(value).toLocaleString("ru-RU")} ₽`;
</script>

<template>
  <article class="product-card game-card" :class="{ 'game-card_discounted': isDiscounted, 'game-card_hit': props.isHit }">
    <div class="product-card__image">
      <img :src="imageUrl" :alt="`Иллюстрация настольной игры «${props.title}»`" width="520" height="380" loading="lazy">
    </div>
    <div class="product-card__body">
      <span v-if="props.isHit" class="game-card__hit">Хит продаж</span>
      <h3 class="product-card__title">{{ props.title }}</h3>
      <p class="game-card__players">Игроки: {{ props.minPlayers }}–{{ props.maxPlayers }}</p>
      <div class="price-row">
        <span v-if="isDiscounted" class="price-row__old">{{ formattedPrice(props.oldPrice) }}</span>
        <strong class="price-row__current">{{ formattedPrice(props.price) }}</strong>
      </div>
      <p v-if="isDiscounted" class="game-card__discount">Выгода {{ discountPercent }}%</p>
    </div>
  </article>
</template>

<style scoped lang="scss">
.game-card { height: 100%; }
.game-card__hit { margin-bottom: 2px; }
.game-card__discount { margin: 0; }
</style>
