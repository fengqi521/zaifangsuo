<script setup>
const props = defineProps({
  title: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <div :class="`tag tag-${type}`">{{ title }}</div>
</template>
<style lang="scss" scoped>
.tag {
  display: inline-flex;
  line-height: 20px;
  justify-content: center;
  padding: 0 9px;
  white-space: nowrap;
  font-size: 12px;
  color: var(--offline-text-color);
  background: var(--offline-bg-color);
  border-radius: 6px;
}

.tag-online {
    color:var(--online-text-color)
}
</style>
