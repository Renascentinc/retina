export default {
  beforeRouteEnter (to, from, next) {
    window.localStorage.getItem('token') ? next() : next('/login')
  }
}
