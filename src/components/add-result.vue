<template>
  <div class="container search-result">
    <div
      v-if="!creating"
      class="default-text"
      @click="startCreating">
      <i class="fas fa-plus"></i>
      NEW {{ text }}
    </div>
    <div
      v-if="creating"
      class="input-group">
      <i
        class="fas fa-save"
        @click="save"></i>
      <input
        :placeholder="`Enter new ${text.toLowerCase()}`"
        v-model="newBrand"/>
      <i
        class="fas fa-times"
        @click="cancelCreating"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddResult',

  props: {
    text: {
      type: String,
      required: true
    },
    onSave: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      creating: false,
      newBrand: ''
    }
  },

  methods: {
    save () {
      this.creating = false
      this.$props.onSave(this.newBrand)
      this.newBrand = ''
    },

    startCreating () {
      this.creating = true
    },

    cancelCreating () {
      this.newBrand = ''
      this.creating = false
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/add-button';
</style>
