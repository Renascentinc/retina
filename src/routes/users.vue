<template>
  <div class="page users-page">
    <div class="search-bar">
      <user-search-input :update-tags="updateFilters"></user-search-input>
    </div>
    <div class="users-menu-container">
        <div
          class="floating-action-bar">
          <extended-fab
            v-if="isAdmin && $mq === 'desktop'"
            :on-click="transitionToAddUser"
            class="add-user-fab"
            icon-class="fa-plus"
            button-text="ADD USER">
          </extended-fab>

          <fab
          v-if="isAdmin && $mq === 'mobile'"
          :on-click="transitionToAddUser"
          class="add-user-btn"
          icon-class="fa-plus"/>
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
          class="users"
          tag="div">
          <user-search-result
            v-for="user in users"
            :user="user"
            :key="user.id"
            :on-select="transitionToUserInfo"/>
        </transition-group>
    </div>
      </div>
  </div>
</template>

<script>
import UserSearchInput from "../components/user-search-input";
import UserSearchResult from "../components/user-search-result";
import Fab from "../components/fab";
import gql from "graphql-tag";
import Roles from "../utils/roles";
import ExtendedFab from "../components/extended-fab";

export default {
  name: "Users",

  components: {
    UserSearchInput,
    UserSearchResult,
    Fab,
    ExtendedFab
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
      fetchPolicy: "cache-and-network"
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
      variables() {
        let options = {
          query: ""
        };

        if (this.searchString) {
          options.query = this.searchString;
        }

        return options;
      }
    }
  },

  data() {
    return {
      searchUser: [],
      getAllUser: [],
      searchString: null
    };
  },

  computed: {
    isAdmin() {
      return (
        JSON.parse(window.localStorage.getItem("currentUser")).role ===
        Roles.ADMIN
      );
    },

    users() {
      if (this.searchUser.length > 0) {
        return this.searchUser;
      } else {
        return this.getAllUser;
      }
    }
  },

  methods: {
    transitionToAddUser() {
      this.$router.push({ name: "newUser" });
    },

    transitionToUserInfo(userId) {
      this.$router.push({ name: "userDetail", params: { userId } });
    },

    updateFilters(fuzzySearch) {
      this.searchString = fuzzySearch;
    }
  }
};
</script>

<style lang="scss">
@import "../styles/variables";

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
    padding-left: 15px;
    padding-right: 15px;
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

// MOBILE

.mobile {
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

// DESKTOP

.desktop {
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
