<script setup>
const props = {
  collapse: true,
};
</script>

<template>
  <router-link class="layout" key="collapse" to="/">
    <img src="@/assets/images/logo.png" class="layout-logo" />
    北京市突发地质灾害监测预警提升工程运维管理平台
  </router-link>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  align-items: center;
  font-size: 22px;
  
  .layout-logo {
    width: 50px;
    vertical-align: middle;
    display: inline-block;
  }
}
</style>
