<template>
  <div class="user-search-result">
    <div class="element-container">
      <avatar :username="`${ user.first_name } ${ user.last_name }`"/>
      <div
        class="main-container"
        @click="onClick">
        <div class="row">
          <span class="user-name">{{ user.first_name }} {{ user.last_name }}</span>
        </div>
        <div class="row">
          <span class="user-role">{{ user.role }}</span>
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
  @import '../styles/variables';
  $tool-search-result-border-radius: 3px;

  .user-search-result {
    cursor: pointer;
    display: flex;
    height: 75px;
    min-height: 75px;
    margin: 5px 10px;
    border-radius: $tool-search-result-border-radius;
    text-transform: capitalize;
    background-color: #fff;

    .element-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 10px;

      .vue-avatar--wrapper {
        background-color: $background-light-gray !important;
        color: $renascent-red !important;
        font-weight: 700 !important;
      }

      .main-container {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        margin: 5px;
        padding-left: 5px;

        .row {
          display: flex;
          align-items: center;
          flex: 1 1 auto;

          .user-name {
            font-size: 22px;
            font-weight: 900;
          }

          .user-role {
            margin-right: 8px;
            font-weight: 900;
            font-size: 15px;
          }
        }
      }
    }
  }
</style>
