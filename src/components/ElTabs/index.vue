<script setup>
import { ref, watch, nextTick } from "vue";
import eventBus from "@/utils/eventBus";
const props = defineProps({
  tabs: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: [String, Number],
    default: 0,
  },
  componentRef: {
    type: Object,
    default: ()=>({}),
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const active = ref(props.modelValue);

const handleChangeActive = (index) => {
  active.value = index;
  nextTick(() => {
    emit("update:modelValue", index);
    emit("change", index);
  });
};

watch(
  () => props.modelValue,
  (newValue) => {
    active.value = newValue;
  }
);
</script>
<template>
  <div class="tabs">
    <div class="tabs-head">
      <p
        :class="['tabs-head__item', { 'tabs-head__active': active === index }]"
        v-for="(tab, index) in props.tabs"
        :key="index"
        @click="handleChangeActive(index)"
      >
        {{ tab.title }}
      </p>
      <slot name="actions"></slot>
    </div>
    <div
      class="tabs-main"
      style="width: 100%"
      v-for="({ component }, index) in props.tabs"
      :key="index"
    >
      <component
        :is="component"
        v-if="active === index"
        :ref="tabs[active].props.componentRef"
      />
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
    cursor: pointer;
    user-select: none;

    &__item {
      width: 145px;
      text-align: center;
      background: var(--panel-bg-color);
    }

    &__active {
      font-weight: bold;
      color: var(--text-color);
      background: var(--btn-bg-color);
    }
  }
}
</style>
