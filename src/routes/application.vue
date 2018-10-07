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
        <avatar :username="name"/>
        <span>{{name}}</span>
        <span>{{email}}</span>
        <span>{{role}}</span>
      </div>

      <div slot="content" class="main-content">
        <router-view />

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
  computed: {
    currentUser() {
      return JSON.parse(window.localStorage.getItem('currentUser')) || {}
    },
    name() {
      return this.currentUser.first_name ? `${this.currentUser.first_name} ${this.currentUser.last_name}` : ''
    },
    email() {
      return this.currentUser.email
    },
    role() {
      return this.currentUser.role
    }
  },
  mixins: [authenticatedRouteMixin],
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
