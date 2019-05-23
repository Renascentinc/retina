<template>
  <div class="container search-result">
    <div
      v-if="!creating"
      class="default-text"
      @click="startCreating"
    >
      <i class="fas fa-plus"></i>
      NEW {{ text }}
    </div>
    <div
      v-if="creating"
      class="input-group"
    >
      <button
        class="fas fa-save"
        :disabled="!newItem"
        @click="save"
      />
      <input
        v-model="newItem"
        :placeholder="`Enter new ${text.toLowerCase()}`"
      />
      <button
        class="fas fa-times"
        @click="cancelCreating"
      />
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
      newItem: ''
    }
  },

  methods: {
    save () {
      this.creating = false
      this.$props.onSave(this.newItem)
      this.newItem = ''
    },

    startCreating () {
      this.creating = true
    },

    cancelCreating () {
      this.newItem = ''
      this.creating = false
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/add-button';
</style>
