<template>
  <div class="main-application">
    <vue-drawer-layout
          ref="drawer"
          :drawer-width="200"
          :enable="false"
          :animatable="true"
          :backdrop="true"
          @mask-click="closeDrawer">

          <div class="drawer-content" slot="drawer">
            <avatar username="Josiah Campbell"></avatar>
          </div>

          <div class="main-content" slot="content">
              <router-view />

              <div class="nav-bar">
                <div class="icon-text-container">
                  <button class="material-icons menu-icon" @click="openDrawer">menu</button>
                  <span class="icon-subtext">MENU</span>
                </div>

                <div class="icon-text-container">
                  <router-link class="fas fa-toolbox" to="/tools"></router-link>
                  <span class="icon-subtext">TOOLS</span>
                </div>

                <div class="icon-text-container">
                  <router-link class="material-icons add-icon" :to="{ name: 'newTool' }">add</router-link>
                  <span class="icon-subtext">ADD</span>
                </div>
              </div>
          </div>
    </vue-drawer-layout>
  </div>
</template>

<script>
import Avatar from 'vue-avatar'

export default {
  name: 'application',
  components: {
    Avatar
  },
  methods: {
    closeDrawer() {
      this.$refs.drawer.toggle(false);
    },

    openDrawer() {
      this.$refs.drawer.toggle(true);
    }
  }
}
</script>
