<template>
  <div class="page reports-page">
    <header-card title="Reports"> </header-card>

    <div class="reports">
      <div class="report-card">
        <span> Tool Transactions Reports </span>
      </div>
      <div class="report-card">
        <span> Weekly Transactions Reports </span>
      </div>
      <div class="report-card">
        <span> Maintenance Report </span>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderCard from '../components/header-card'

export default {
  name: 'Reports',
  components: {
    HeaderCard
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.reports-page {
  display: flex;
  flex-direction: column;
  background-color: $background-light-gray;

  .reports {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 30px;
    flex: 1 1 auto;
    overflow-y: auto;

    .report-card {
      display: flex;
      flex-wrap: wrap;
      color: white;
      background-color: $renascent-dark-gray;
      height: 15vh;
      flex: 0 0 250px;
      margin: 10px;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      font-weight: 700;
      text-align: center;
      padding: 20px 10px;
      border-radius: 3px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    }
  }
}
</style>
