<template>
  <div class="loading-prev">
    <ul class="loading-prev-box">
      <li v-for="item of 9" class="loading-prev-box-item" :key="item"></li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
.loading-prev {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: var(--body-bg-color);

  .loading-prev-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
  }
}

.loading-prev .loading-prev-box-item {
  width: calc(100% / 3);
  height: calc(100% / 3);
  background: rgba(0, 237, 231, 0.5);
  float: left;
  animation: loading-prev-animation 1.2s ease infinite;
  border-radius: 1px;
}

.loading-prev .loading-prev-box-item:nth-child(7) {
  animation-delay: 0s;
}

.loading-prev .loading-prev-box-item:nth-child(4),
.loading-prev .loading-prev-box-item:nth-child(8) {
  animation-delay: 0.1s;
}

.loading-prev .loading-prev-box-item:first-child,
.loading-prev .loading-prev-box-item:nth-child(5),
.loading-prev .loading-prev-box-item:nth-child(9) {
  animation-delay: 0.2s;
}

.loading-prev .loading-prev-box-item:nth-child(2),
.loading-prev .loading-prev-box-item:nth-child(6) {
  animation-delay: 0.3s;
}

.loading-prev .loading-prev-box-item:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes loading-prev-animation {
  0%,
  70%,
  to {
    transform: scaleX(1);
  }

  35% {
    transform: scale3D(0, 0, 1);
  }
}
</style>
