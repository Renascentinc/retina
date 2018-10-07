<template>
  <transition name="fade">
    <div class="page new-tool-page">
      <h1>Add</h1>
      <button @click="goBack">Back</button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'NewTool',
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">
.new-tool-page {

}
</style>
