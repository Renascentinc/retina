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
          v-if="isAdminUser"
          :on-click="transitionToAddUser"
          class="add-user-fab"
          icon-class="fa-plus"
          button-text="ADD USER"
        />
      </div>
      <div class="scroll-container">
        <add-button
          v-if="$mq === 'mobile' && isAdminUser"
          :key="0"
          :on-click="transitionToAddUser"
          text="USER"
        />

        <div
          class="list-loading-container loading-container"
          :class="{ 'active': $apollo.queries.searchUser.loading }"
        >
          <loading-spinner/>
        </div>

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
import UserSearchInput from '@/components/user-search-input'
import UserSearchResult from '@/components/user-search-result'
import ExtendedFab from '@/components/basic/extended-fab'
import AddButton from '@/components/add-button'
import LoadingSpinner from '@/components/basic/loading-spinner'
import { usersQuery, searchUserQuery } from '@/utils/gql'
import { mapGetters } from 'vuex'

export default {
  name: 'Users',

  components: {
    LoadingSpinner,
    UserSearchInput,
    UserSearchResult,
    ExtendedFab,
    AddButton
  },

  apollo: {
    getAllUser: {
      query: usersQuery,
      fetchPolicy: 'network-only'
    },

    searchUser: {
      query: searchUserQuery,
      variables () {
        let options = {
          query: this.searchString
        }

        return options
      },
      fetchPolicy: 'network-only'
    }
  },

  data () {
    return {
      searchString: ''
    }
  },

  computed: {
    ...mapGetters('users', [
      'isAdminUser'
    ]),

    users () {
      let users = this.searchString ? this.searchUser : this.getAllUser
      return users || []
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
