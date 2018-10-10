<template>
  <div class="page new-tool-page">
    <h1>Add</h1>
    <button @click="goBack">Back</button>
  </div>
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
