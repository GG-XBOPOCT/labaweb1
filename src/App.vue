<script setup>
import { onMounted, ref } from "vue";
import { getGames } from "./api.js";
import { gamesData } from "./data/games.js";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import ItemList from "./components/ItemList.vue";
import PageSection from "./components/PageSection.vue";
import BaseButton from "./components/BaseButton.vue";

// Начальные данные импортируются из отдельного модуля.
// При доступном json-server каталог обновляется ответом GET /games.
const games = ref(gamesData);
const loading = ref(true);
const errorMessage = ref("");

onMounted(async () => {
  try {
    games.value = await getGames();
  } catch (error) {
    // Каталог остаётся доступным на основе исходного массива из db.json.
    errorMessage.value = `Не удалось обновить каталог с сервера: ${error.message}. Показаны исходные данные.`;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="page">
    <AppHeader />
    <main class="main" id="main-content" tabindex="-1">
      <PageSection id="catalog">
        <template #header>
          <p class="section__eyebrow">Ассортимент</p>
          <h2 class="section__title">Каталог настольных игр</h2>
        </template>
        <p v-if="loading" class="app-status" role="status">Загрузка каталога настольных игр...</p>
        <p v-else-if="errorMessage" class="app-status app-status_error" role="status">{{ errorMessage }}</p>
        <p v-if="!loading" class="section__text text">В каталоге представлено игр: {{ games.length }}.</p>
        <ItemList v-if="!loading" :items="games" />
        <template #footer>
          <p class="section__text text">Цены указаны в рублях. Процент выгоды рассчитывается по старой и текущей цене.</p>
        </template>
      </PageSection>
      <PageSection id="about">
        <template #header>
          <p class="section__eyebrow">О магазине</p>
          <h2 class="section__title">Игры для разных компаний</h2>
        </template>
        <p class="section__text text">«ИгроМир» — учебный интернет-магазин настольных игр. В каталоге собраны игры разных жанров и для разного количества участников.</p>
        <BaseButton href="#catalog" variant="secondary">Вернуться к каталогу</BaseButton>
      </PageSection>
    </main>
    <aside class="page__sidebar sidebar" aria-label="Подсказки по каталогу">
      <section class="sidebar__panel section section_note">
        <h2 class="sidebar__title">Как выбрать игру</h2>
        <p class="section__text text">Обратите внимание на количество игроков и жанр. Эти характеристики помогут подобрать игру для вашей компании.</p>
        <BaseButton href="#catalog">Посмотреть каталог</BaseButton>
      </section>
    </aside>
    <AppFooter />
  </div>
</template>
