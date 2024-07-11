<script setup>
import LoginForm from "./LoginForm/index.vue";

</script>
<template>
  <div class="login-container">
    <div class="login-wrapper">
      <a class="logo"
        ><img
          class="logo-avatar"
          src="@/assets/images/beijingDiKan.png"
          alt="北京地勘"
      /></a>
      <div class="login-bg"></div>
      <LoginForm />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.login-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background: var(--login-bg-color);
  overflow: hidden;

  .login-wrapper {
    position: relative;
    width: 70%;
    height: 75%;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .logo {
    position: absolute;
    top: -8.5%;
    left: 5%;
    width: 110px;

    .logo-avatar {
      width: 100%;
      height: auto;
    }
  }

  .login-bg {
    width: 100%;
    height: 100%;
    background: url(@/assets/images/login-bg.png) right 50% / contain no-repeat;
  }
}
</style>
