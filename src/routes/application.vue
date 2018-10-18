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
        <span>{{ name }}</span>
        <span>{{ email }}</span>
        <span>{{ role }}</span>
      </div>

      <div
        slot="content"
        class="main-content">
        <transition>
          <router-view />
        </transition>

        <transition>
          <div
            v-if="navbarStatus.isShown"
            class="nav-bar">
            <div class="icon-text-container">
              <button
                class="fas fa-bars menu-icon"
                @click="openDrawer">
                <span class="icon-subtext">MENU</span>
              </button>
            </div>

            <div class="icon-text-container">
              <router-link
                class="fas fa-toolbox menu-icon"
                to="/tools">
                <span class="icon-subtext">TOOLS</span>
              </router-link>
            </div>
          </div>
        </transition>

      </div>
    </vue-drawer-layout>
  </div>
</template>

<script>
import Avatar from 'vue-avatar'
import authenticatedRouteMixin from '../mixins/authenticatedRoute'
import gql from 'graphql-tag'

export default {
  name: 'Application',
  components: {
    Avatar
  },
  mixins: [ authenticatedRouteMixin ],
  // apollo: {
  //   navbarStatus: gql`query {
  //     navbarStatus @client {
  //       isShown
  //     }
  //   }`
  // },
  data () {
    return {
      navbarStatus: {
        isShown: true
      }
    }
  },
  computed: {
    currentUser () {
      return JSON.parse(window.localStorage.getItem('currentUser')) || {}
    },
    name () {
      return this.currentUser.first_name ? `${this.currentUser.first_name} ${this.currentUser.last_name}` : ''
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
