<template>
  <div class="loading-spinner half-circle-spinner">
    <div class="circle circle-1"></div>
    <div class="circle circle-2"></div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner'
}
</script>

<style lang="scss">

$spinner-size: 30px;
$tenth-spinner-size: $spinner-size / 10;

.half-circle-spinner, .half-circle-spinner * {
  box-sizing: border-box;
}

.half-circle-spinner {
  width: $spinner-size;
  height: $spinner-size;
  border-radius: 100%;
  position: relative;
}

.half-circle-spinner .circle {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: $tenth-spinner-size solid transparent;
}

.half-circle-spinner .circle.circle-1 {
  border-top-color: $renascent-dark-gray;
  animation: half-circle-spinner-animation 1s infinite;
}

.half-circle-spinner .circle.circle-2 {
  border-bottom-color: $renascent-dark-gray;
  animation: half-circle-spinner-animation 1s infinite;
}

@keyframes half-circle-spinner-animation {
  0% {
    transform: rotate(0deg);

  }
  100%{
    transform: rotate(360deg);
  }
}
</style>
