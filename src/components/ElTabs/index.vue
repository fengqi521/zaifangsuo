<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  tabs: {
    type: Array,
    default: () => [],
  },
});
const active = ref(0);
const handleChangeActive = (index) => {
  active.value = index;
};

</script>
<template>
  <div class="tabs">
    <div class="tabs-head">
      <p :class="['tabs-head__item', { 'tabs-head__active': active === index }]" v-for="(tab, index) in props.tabs"
        :key="index" @click="handleChangeActive(index)">
        {{ tab.title }}
      </p>
      <slot name="actions"></slot>
    </div>
    <div class="tabs-main" v-for="({ pannel }, index ) in props.tabs " :key="index">
      <component :is="pannel" v-show="active === index" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.tabs {
  &-head {
    position: relative;
    display: flex;
    line-height: 40px;
    font-size: 14px;
    color: var(--panel-text-color);
    opacity: 0.7;
    cursor: pointer;
    user-select: none;

    &__item {
      width: 145px;
      text-align: center;
      background: var(--panel-bg-color);
    }

    &__active {
      font-weight: bold;
      background: var(--background-color);
      color: var(--panel-active-color);
    }
  }
}
</style>
