<script setup>
import { isExternal } from "@/utils/validate";
const props = defineProps({
  path: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <a v-if="isExternal(props.path)" :href="props.path" target="__blank">
    <slot />
  </a>
  <router-link v-else :to="props.path">
    <slot />
  </router-link>
</template>
