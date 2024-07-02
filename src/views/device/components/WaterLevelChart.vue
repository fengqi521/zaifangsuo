<script setup>
import { inject, ref } from "vue";
import LineChart from "@/components/LineChart/index.vue";
const collectOption = inject("waterCollectOption");
const changeOption = inject("waterChangeOption");
</script>
<template>
  <LineChart :option="collectOption" />
  <LineChart :option="changeOption" />
</template>
