<template>
  <div
    :class="{ 'no-link': !exitLink }"
    class="header-card"
  >
    <router-link
      v-if="exitLink"
      :to="exitLink"
      class="fas fa-times exit"
    >
    </router-link>

    <span class="main-text">
      {{ title }}
    </span>

    <div
      v-if="exitLink"
      class="spacer"
    >
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderCard',
  props: {
    title: {
      type: String,
      required: true
    },
    exitLink: {
      type: String,
      required: false,
      default: null
    }
  }
}
</script>

<style lang="scss">

.header-card {
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 73px;
  border-bottom-right-radius: 7px;
  border-bottom-left-radius: 7px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.16);
  padding: 0 20px;

  &.no-link {
    justify-content: center;
    padding: 0;
  }

  .exit {
    font-size: 30px;
    color: $renascent-red;
    width: 21px;
  }

  .main-text {
    font-size: 33px;
    font-weight: 900;
  }

  .spacer {
    width: 21px;
  }
}
</style>
