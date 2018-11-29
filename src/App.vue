<template>
  <div id="app">
    <transition name="page-change">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import './styles/app';
</style>
