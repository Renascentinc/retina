<template>
  <div class="main-application">
    <vue-drawer-layout
      ref="drawer"
      :drawer-width="200"
      :enable="false"
      :animatable="true"
      :backdrop="true"
      @mask-click="closeDrawer">

      <div
        slot="drawer"
        class="drawer-content">
        <avatar username="Josiah Campbell"/>
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
