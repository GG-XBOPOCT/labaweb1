<script setup>
const props = defineProps({
  variant: { type: String, default: "primary" },
  href: { type: String, default: "#catalog" }
});
</script>

<template>
  <a class="button" :class="`button_${props.variant}`" :href="props.href">
    <slot></slot>
  </a>
</template>

<style scoped lang="scss">
.button { text-decoration: none; }
</style>
