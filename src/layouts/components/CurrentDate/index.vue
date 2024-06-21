<script setup>
import { useCurrentDate } from "@/hooks/useCurrentDate";
const { currentDate } = useCurrentDate();
</script>
<template>
  <div class="layout-date">{{ currentDate }}</div>
</template>
<style lang="scss" scoped>
.layout-date {
  display: inline-block;
  width:130px;
  font-size: 14px;
}
</style>
