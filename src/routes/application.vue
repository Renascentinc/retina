<template>
  <div class="main-application">
    <vue-drawer-layout
      ref="drawer"
      :drawer-width="250"
      :enable="false"
      :animatable="true"
      :backdrop="true"
      @mask-click="closeDrawer">

      <div
        slot="drawer"
        class="drawer-content">
        <div class="account-info">
          <avatar :username="firstname+' '+lastname"/>
          <span class="username">{{ firstname }} <br> {{ lastname }}</span>
          <span class="role">{{ role }}</span>
          <span class="email">{{ email }}</span>
          <hr class="line">
        </div>

        <div class="menu-buttons">
          <button class="change-password menu-btn"> <span class="fas menu-btn-icon fa-key"></span> CHANGE PASSWORD </button>
          <button class="sign-out menu-btn"> <span class="fas menu-btn-icon fa-sign-out-alt"></span> SIGN OUT </button>
        </div>
      </div>

      <div
        slot="content"
        class="main-content">
        <transition>
          <router-view />
        </transition>

        <div class="nav-bar">
          <div class="icon-text-container">
            <button
              class="material-icons menu-icon"
              @click="openDrawer">menu</button>
            <span class="icon-subtext">MENU</span>
          </div>

          <div class="icon-text-container">
            <router-link
              class="fas fa-toolbox"
              to="/tools"/>
            <span class="icon-subtext">TOOLS</span>
          </div>

          <div class="icon-text-container">
            <router-link
              :to="{ name: 'newTool' }"
              class="material-icons add-icon">add</router-link>
            <span class="icon-subtext">ADD</span>
          </div>
        </div>
      </div>
    </vue-drawer-layout>
  </div>
</template>

<script>
import Avatar from 'vue-avatar'
import authenticatedRouteMixin from '../mixins/authenticatedRoute'

export default {
  name: 'Application',
  components: {
    Avatar
  },
  mixins: [authenticatedRouteMixin],
  computed: {
    currentUser () {
      return JSON.parse(window.localStorage.getItem('currentUser')) || {}
    },
    firstname () {
      return this.currentUser.first_name ? `${this.currentUser.first_name}` : ''
    },
    lastname () {
      return this.currentUser.last_name ? `${this.currentUser.last_name}` : ''
    },
    email () {
      return this.currentUser.email
    },
    role () {
      return this.currentUser.role
    }
  },
  methods: {
    closeDrawer () {
      this.$refs.drawer.toggle(false)
    },

    openDrawer () {
      this.$refs.drawer.toggle(true)
    }
  }
}
</script>
