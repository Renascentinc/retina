<template>
  <div class="page history-page">
    <!-- <header-card title="History"> </header-card> -->

    <!-- <div class="history">
      <div class="report-card">
        <span> Tool Transactions Reports </span>
      </div>
      <div class="report-card">
        <span> Weekly Transactions Reports </span>
      </div>
      <div class="report-card">
        <span> Maintenance Report </span>
      </div>
    </div> -->

    <div class="report">
      <div id="export-table">
        <div class="dt-head">
          <div class="dt-cell">
            id
          </div>
          <div class="dt-cell">
            date
          </div>
          <div class="dt-cell">
            action
          </div>
          <div class="dt-cell">
            status
          </div>
          <div class="dt-cell">
            owner
          </div>
        </div>

        <div class="dt-body">
          <div
            v-for="i in range"
            :key="i"
            class="dt-row">
            <div class="dt-cell">
              93378
            </div>
            <div class="dt-cell">
              10/27/2018
            </div>
            <div class="dt-cell">
              Transfer
            </div>
            <div class="dt-cell tool-status available">
              available
            </div>
            <div class="dt-cell">
              <avatar username="Josiah Campbell"></avatar>
              Josiah Campbell
            </div>
          </div>
        </div>
      </div>

      <fab
        :on-click="exportTable"
        class="export-btn"
        icon-class="fa-file-download">
      </fab>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar'
import Fab from '../components/fab'
import html2pdf from 'html2pdf.js'

export default {
  name: 'History',
  components: {
    Avatar,
    Fab
  },

  data () {
    let range = []
    for (let i = 0; i < 100; i++) {
      range.push(i)
    }
    return {
      range
    }
  },

  methods: {
    exportTable () {
      var element = document.getElementById('export-table')

      var opt = {
        filename: 'transactions_export.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
      }

      html2pdf().from(element).set(opt).save()
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.history-page {
  display: flex;
  flex-direction: column;
  max-width: 100vw;

  .report {
    background-color: $background-light-gray;
    display: flex;
    height: 100%;
    overflow: auto;
    padding: 20px;

    .export-btn {
      position: absolute;
      bottom: 80px;
      right: 50px;
    }
  }
}

#export-table {
  width: 1200px;
  min-width: 1200px;

  .dt-head {
    display: flex;
    border-radius: 3px;
    background-color: $renascent-dark-gray;
    font-size: 20px;
    height: 40px;
    align-items: center;
    color: white;
    text-align: left;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
    font-weight: 900;
  }

  .dt-body {
    display: flex;
    flex-direction: column;

    .dt-row {
      display: flex;
      border-radius: 3px;
      margin-top: 10px;
      background-color: white;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);

      .dt-cell {
        display: flex;
        align-items: center;
        height: 50px;
        font-weight: 900;
      }
    }
  }

  .dt-cell {
    flex: 0 0 200px;
    padding-left: 16px;
  }

  .vue-avatar--wrapper {
    background-color: $background-light-gray !important;
    color: $renascent-red !important;
    font-weight: 700 !important;
    width: 30px !important;
    height: 30px !important;
    font-size: 15px !important;
  }
}
</style>
