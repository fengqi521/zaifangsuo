<script setup>

const props = {
  collapse: true,
};

</script>

<template>
  <div
    class="layout-logo"
    :class="{ collapse: props.collapse, 'layout-mode-top': true }"
  >
    <transition name="layout-logo-fade">
      <router-link v-if="props.collapse" key="collapse" to="/">
        <!-- <img :src="logo" class="layout-logo" /> -->
        地质监测系统
      </router-link>
      <router-link v-else key="expand" to="/">
        <img :src="logoText1" class="layout-logo-text" />
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.layout-logo {
  font-size: 22px;
  .layout-logo-text {
    height: 100%;
    vertical-align: middle;
  }
}

.collapse {
  .layout-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    display: inline-block;
  }
  .layout-logo-text {
    display: none;
  }
}
</style>
