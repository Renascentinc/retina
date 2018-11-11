<template>
  <div class="container search-result">
    <div
      v-if="!creating"
      class="default-text"
      @click="startCreating">
      <i class="fas fa-plus"></i>
      NEW {{ text }}
    </div>
    <div
      v-if="creating"
      class="input-group">
      <i
        class="fas fa-save"
        @click="save"></i>
      <input
        :placeholder="`Enter new ${text.toLowerCase()}`"
        v-model="newBrand"/>
      <i
        class="fas fa-times"
        @click="cancelCreating"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddResult',

  props: {
    text: {
      type: String,
      required: true
    },
    onSave: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      creating: false,
      newBrand: ''
    }
  },

  methods: {
    save () {
      this.creating = false
      this.$props.onSave(this.newBrand)
      this.newBrand = ''
    },

    startCreating () {
      this.creating = true
    },

    cancelCreating () {
      this.newBrand = ''
      this.creating = false
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
.container {
  height: 50px;
  color: $renascent-red;
  background-color: #F9F9F9;
  font-weight: 700;

  .default-text {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      padding-right: 7px;
      font-size: 22px;
    }
  }

  .input-group {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    padding-left: 10px;
    padding-right: 10px;
    align-items: center;

    i {
      padding: 0px;
      font-size: 25px;
    }

    input {
      border-radius: 3px;
      border: solid $disabled-gray 1px;
      text-indent: 3px;
      height: 70%;
      width: 70%;
      font-size: 16px;
      font-weight: 600;
    }
  }
}

// MOBILE

.mobile {
  .container {
    font-size: 22px;
    height: 60px;

    input {
      font-size: 20px;
    }

    i {
      font-size: 30px;
    }
  }
}
</style>
