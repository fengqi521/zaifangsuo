<template>
  <Nav />
  <div class="error-page">
    <img src="@/assets/images/404-page.png" class="error-img" />
    <div class="error-text">
      <p class="error-text-1">很抱歉，您的页面跑丢了！</p>
      <p class="error-text-2">请检查网址是否有误...</p>
    </div>
  </div>
</template>
<script setup>
import Nav from "@/layouts/Nav.vue";
</script>
<style lang="scss" scoped>
.error-page {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.error-img {
  width: 936px;
}

.error-text {
  position: absolute;
  bottom: 100px;
  left: calc((100% - 265px) / 2);
  width: 265px;
  text-align: left;
  line-height: 31px;
}

.error-text-1 {
  color: #4e5a71;
  font-size: 22px;
  font-weight: bold;
}

.error-text-2 {
  color: #4e5a71;
  font-size: 14px;
}
</style>
