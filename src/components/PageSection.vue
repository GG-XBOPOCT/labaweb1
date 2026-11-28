<template>
  <section class="main__section section">
    <div class="section__heading">
      <slot name="header"></slot>
    </div>
    <div class="section__content">
      <slot></slot>
    </div>
    <div class="section__footer">
      <slot name="footer"></slot>
    </div>
  </section>
</template>

<style scoped lang="scss">
.section__heading:empty, .section__footer:empty { display: none; }
</style>
