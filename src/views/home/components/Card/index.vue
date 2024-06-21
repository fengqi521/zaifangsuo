<template>
  <ul class="card">
    <li
      class="card-item"
      :style="{ background: card.bg }"
      v-for="(card, index) of deviceCardLists"
      :key="index"
    >
      <h4>{{ card.title }}</h4>
      <p class="card-item-count">{{ card.count }}</p>
    </li>
  </ul>
</template>
<script setup>
// 卡片列表
const carLists = defineProps({
  deviceCardLists: {
    type: Array,
    default: () => [],
  },
});
</script>
<style lang="scss" scoped>
.card {
  display: grid;
  grid-template-columns: repeat(3, minmax(176px, calc((100% - 2 * var(--gap-width)) / 3)));

  gap: 16px;
  color: var(--text-color);

  .card-item {
    height: 80px;
    padding-inline: 16px;
    border-radius: 4px;
    .card-item-count {
      font-size: 20px;
      font-weight: bold;
    }
  }
}
</style>
