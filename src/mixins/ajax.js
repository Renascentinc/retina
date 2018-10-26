module.exports = {
  props: {
    loading: {
      type: Boolean,
      default: false
    },

    onSearch: {
      type: Function,
      default: function (search, loading) {}
    }
  },

  data () {
    return {
      mutableLoading: false
    }
  },

  watch: {
    search () {
      if (this.search.length > 0) {
        this.onSearch(this.search, this.toggleLoading)
        this.$emit('search', this.search, this.toggleLoading)
      }
    },

    loading (val) {
      this.mutableLoading = val
    }
  },

  methods: {
    toggleLoading (toggle = null) {
      if (toggle == null) {
        this.mutableLoading = !this.mutableLoading
      }
      this.mutableLoading = toggle
    }
  }
}
