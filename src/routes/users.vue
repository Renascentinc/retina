<template>
  <div class="page users-page">
    <div class="search-bar">
      <user-search-input :update-tags="updateFilters"></user-search-input>
    </div>
    <div class="user-scroll-container">
      <transition>
        <div
          v-if="$apollo.queries.searchUser.loading"
          class="loading-container">
          <div class="loading"/>
        </div>
      </transition>
      <transition>
        <div
          v-if="!$apollo.queries.searchUser.loading && !users.length"
          class="no-users-container">
          <span class="no-users-text">No Users To Display</span>
        </div>
      </transition>

      <transition-group
        name="list"
        tag="div">
        <user-search-result
          v-for="user in users"
          :user="user"
          :key="user.id"
          :on-select="transitionToUserInfo"/>
      </transition-group>

      <fab
        v-if="isAdmin()"
        :on-click="transitionToAddUser"
        class="add-user-btn"
        icon-class="fa-plus"/>

    </div>
  </div>
</template>

<script>
import UserSearchInput from '../components/user-search-input.vue'
import UserSearchResult from '../components/user-search-result.vue'
import Fab from '../components/fab.vue'
import gql from 'graphql-tag'

export default {
  name: 'Users',

  components: {
    UserSearchInput,
    UserSearchResult,
    Fab
  },

  apollo: {
    getAllUser: {
      query: gql`query {
        getAllUser {
          id
          first_name
          last_name
          role
        }
      }`,
      fetchPolicy: 'cache-and-network'
    },

    searchUser: {
      query: gql`
        query users($query: String!) {
          searchUser(query: $query) {
            id
            first_name
            last_name
            role
          }
        }`,
      variables () {
        let options = {
          query: ''
        }

        if (this.searchString) {
          options.query = this.searchString
        }

        return options
      }
    }
  },

  data () {
    return {
      searchUser: [],
      getAllUser: [],
      searchString: null
    }
  },

  computed: {
    users () {
      if (this.searchUser.length > 0) {
        return this.searchUser
      } else {
        return this.getAllUser
      }
    }
  },

  methods: {
    isAdmin () {
      return JSON.parse(window.localStorage.getItem('currentUser')).role === 'ADMINISTRATOR'
    },

    transitionToAddUser () {
      // transfer to 'add user'
    },

    transitionToUserInfo (userId) {
      this.$router.push({ name: 'userDetail', params: { userId } })
    },

    updateFilters (fuzzySearch) {
      this.searchString = fuzzySearch
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.users-page {
  display: flex;
  flex-direction: column;

  .search-bar {
    padding: 10px;
    min-height: 45px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    z-index: 5;
    display: flex;
  }

  .user-scroll-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: $background-light-gray;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-top: 5px;

    .add-user-btn {
      position: absolute;
      bottom: 75px;
      right: 20px;
    }
  }

  .no-users-container {
    display: flex;
    justify-content: center;
    padding-top: 50px;
  }

  .loading-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
    top: 100px;
    left: 0;
    width: 100vw;
  }
}

.dark-dropdown {
  width: 243px;
  height: 45px;
  background-color: $renascent-dark-gray;
  border-radius: 3px;
  color: white;
  font-family: Lato;
  font-weight: 700;
  padding-left: 7px;
  padding-bottom: 5px;
  font-size: 28px;
}
</style>
