<script setup>
import { isExternal } from "@/utils/validate";
const props = defineProps({
  path: {
    type: String,
    default: "",
  },
  meta: {
    type: Object,
    default: () => ({}),
  },
});
</script>
<template>
  <a
    v-if="isExternal(props.path)"
    :href="props.path"
    target="__blank"
  >
    <slot />
  </a>

  <router-link class="menu-item-link" v-else :to="props.path" :target="props?.meta?.newWindow ? '_blank' : '_self'" >
    <slot />
  </router-link>
</template>
<style lang="scss" scoped>
.menu-item-link {
  display: block;
  margin-bottom: 14px;
}
</style>
