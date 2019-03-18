<template>
  <div class="page users-page">
    <div class="search-bar">
      <user-search-input :update-tags="updateFilters"></user-search-input>
    </div>
    <div class="menu-container">
      <div
        class="action-sidebar"
        v-if="$mq === 'desktop'"
      >
        <extended-fab
          v-if="isAdmin"
          :on-click="transitionToAddUser"
          class="add-user-fab"
          icon-class="fa-plus"
          button-text="ADD USER"
        >
        </extended-fab>
      </div>
      <div class="scroll-container">
        <add-button
          v-if="$mq === 'mobile' && isAdmin"
          :key="0"
          :on-click="transitionToAddUser"
          text="USER"
        >
        </add-button>

        <transition name="list-loading">
          <div
            v-if="$apollo.queries.searchUser.loading"
            class="loading-container"
          >
            <div class="half-circle-spinner">
              <div class="circle circle-1"></div>
              <div class="circle circle-2"></div>
            </div>
          </div>
        </transition>

        <transition name="fade">
          <div
            v-if="!$apollo.queries.searchUser.loading && !users.length"
            class="no-results-container"
          >
            <span class="no-users-text">
              No Users To Display
            </span>
          </div>
        </transition>

        <transition-group
          name="list-element"
          class="users"
          tag="div"
        >
          <user-search-result
            v-for="user in users"
            :key="user.id"
            :user="user"
            :on-select="transitionToUserInfo"
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import UserSearchInput from '../components/user-search-input'
import UserSearchResult from '../components/user-search-result'
import gql from 'graphql-tag'
import Roles from '../utils/roles'
import ExtendedFab from '../components/extended-fab'
import AddButton from '../components/add-button'

export default {
  name: 'Users',

  components: {
    UserSearchInput,
    UserSearchResult,
    ExtendedFab,
    AddButton
  },

  apollo: {
    getAllUser: {
      query: gql`
        query {
          getAllUser {
            id
            first_name
            last_name
            role
          }
        }
      `,
      fetchPolicy: 'network-only'
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
        }
      `,
      variables () {
        let options = {
          query: ''
        }

        if (this.searchString) {
          options.query = this.searchString
        }

        return options
      },
      fetchPolicy: 'network-only'
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
    isAdmin () {
      return (
        JSON.parse(window.localStorage.getItem('currentUser')).role === Roles.ADMIN
      )
    },

    users () {
      if (!this.searchString) {
        return this.getAllUser || []
      }

      return this.searchUser || []
    }
  },

  methods: {
    transitionToAddUser () {
      this.$router.push({ name: 'newUser' })
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
@import "../styles/variables";

.users-page {
  display: flex;
  flex-direction: column;
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
