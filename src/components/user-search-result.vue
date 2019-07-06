<template>
  <div class="search-result">
    <div
      class="element-container"
      @click="onClick"
    >
      <avatar :username="`${ user.first_name } ${ user.last_name }`"></avatar>
      <div
        class="main-container"
      >
        <div class="row">
          <span class="title">
            {{ user.first_name }} {{ user.last_name }}
          </span>
        </div>
        <div class="row">
          <span class="subtitle">
            {{ user.role }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar'

export default {
  name: 'UserSearchResult',

  components: {
    Avatar
  },

  props: {
    user: {
      type: Object,
      required: true
    },
    onSelect: {
      type: Function,
      required: true
    }
  },

  methods: {
    onClick () {
      this.onSelect(this.user.id)
    }
  }
}
</script>

<style lang="scss">

@import "../styles/search-result";
$tool-search-result-border-radius: 3px;

.element-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
  flex: 1 1 auto;
  max-width: 100%;

  .vue-avatar--wrapper {
    min-width: 50px;
    background-color: $background-light-gray !important;
    color: $renascent-red !important;
    font-weight: 700 !important;
  }
}
</style>
