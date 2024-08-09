<template>
  <div class="card">
    <slot />
    <span
      v-for="(num, index) of 4"
      :class="`point point-${num}`"
      :key="index"
    ></span>
  </div>
</template>
<script setup></script>
<style lang="css" scoped>
.card {
  position: relative;
  padding:16px;
  border: 1px solid var(--screen-card-border);
  background: var(--screen-card-bg);

  .point {
    position: absolute;
    width: 15px;
    height: 14px;
    background: url("@/assets/images/point.png") no-repeat;
    background-size: cover;
  }

  .point-1 {
    left: -1px;
    top: -1px;
  }

  .point-2 {
    right: -1px;
    top: -1px;
    transform: rotateY(180deg);
  }

  .point-3 {
    right: -1px;
    bottom: -1px;
    transform: rotate(180deg);
  }

  .point-4 {
    left: -1px;
    bottom: -1px;
    transform: rotateX(180deg);
  }
}
</style>
