<template>
  <v-date-picker
    :input-props="{ readonly: true }"
    :attributes="[{ popover: { visibility: 'hidden' } }]"
    :value="date"
    :max-date="new Date()"
    :popover-visibility="visibility"
    popover-direction="top"
    class="general-data"
    mode="single"
    @input="toggleDatepicker"
  >
    <button
      slot-scope="{ inputValue }"
      :class="{ placeholder: !inputValue }"
      class="dark-input purchase-date-input"
      @click="toggleDatepicker"
    >
      {{ inputValue || `eg. ${new Date().toLocaleDateString('en-US')}` }}
    </button>
  </v-date-picker>
</template>

<script>

export default {
  name: 'DatePicker',

  props: {
    date: {
      type: Date,
      required: false,
      default: null
    },
    onDateChange: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      visibility: 'hidden'
    }
  },

  methods: {
    toggleDatepicker (val) {
      if (this.visibility === 'visible') {
        this.onDateChange(val)
        this.visibility = 'hidden'
      } else {
        this.visibility = 'visible'
      }
    }
  }
}
</script>

<style lang="scss">

</style>
