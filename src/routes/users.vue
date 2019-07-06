<template>
  <div class="page users-page">
    <div class="search-bar">
      <user-search-input :update-tags="updateFilters"></user-search-input>
    </div>
    <div class="users-menu-container">
      <div
        class="floating-action-bar"
      >
        <extended-fab
<<<<<<< HEAD
          v-if="isAdmin && $mq === 'desktop'"
=======
          v-if="isAdminUser"
>>>>>>> retina-339-refactor
          :on-click="transitionToAddUser"
          class="add-user-fab"
          icon-class="fa-plus"
          button-text="ADD USER"
        />
      </div>
      <div class="user-scroll-container">
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
            class="no-users-container"
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

  .search-bar {
    background-color: #fff;
    padding: 10px;
    min-height: 45px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    z-index: 5;
    display: flex;
    min-height: fit-content;
  }

  .users-menu-container {
    height: 100%;
    background-color: $background-light-gray;
  }

  .user-scroll-container {
    background-color: $background-light-gray;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-top: 5px;
    flex: 1 1 auto;
    height: 100%;
  }

  .add-user-btn {
    position: absolute;
    right: 20px;
  }

  .no-users-container {
    display: flex;
    justify-content: center;
    padding-top: 50px;
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

.mobile .users-page {
  .users-menu-container {
    overflow-y: hidden;

    .user-scroll-container {
      height: 100%;
      overflow-y: auto;

      .users {
        padding-bottom: 60px;
      }
    }
  }
}

.desktop .users-page {
  .users-menu-container {
    display: flex;
    flex-direction: row;

    .user-scroll-container {
      padding-bottom: 5px;
      align-content: center;
    }

    .floating-action-bar {
      position: inherit;
      z-index: 100;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      height: auto;
      padding-top: 15px;
      align-items: center;
      flex: 1 1;
      max-width: 300px;

      .extended-fab {
        position: inherit;
        margin-left: 10px;
        margin-top: 20px;
      }
    }
  }
}
</style>
