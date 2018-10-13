<template>
  <div class="page tool-detail-page">
    <div id="header">
      <router-link
      class="fas fa-arrow-left"
      id="backarrow"
      to="/tools"/>

      <span id="toolid">#{{ getTool.id }} </span>
      <div id="name">
        {{ getTool.brand.name }} {{ getTool.type.name }}
      </div>

      <div id="actions">
        <button class="action-btn">
          <i class="fas fa-pen action-icon"/>
          {{ formattedStatus(getTool.status) }}
        </button>
        <button class="action-btn">
          <i class="fas fa-check action-icon"/>
          select
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
export default {

  name: 'ToolDetail',

  apollo: {
    getTool: {
      query: gql`query namedthing($tool_id: ID!) {
	                getTool(tool_id: $tool_id)
                  {
                    id
                    brand { name }
                    type { name }
                    year
                    status
                    model_number
                    serial_number
                    purchased_from { name }
                    date_purchased
                    price
                    photo

                    user {
                      first_name
                      last_name
                      email
                      phone_number
                    }
                  }
                }`,
      variables () {
        let options = {}
        options.tool_id = 11
        return options
      }
    }
  },

  data () {
    return {
      getTool: {}
    }
  },

  methods: {
    formattedStatus (status) {
      return status.replace(/\_/g, ' ').toLowerCase()
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.tool-detail-page {
  background-color: $background-light-gray;

  #header {
    width: 100%;
    height: 148px;
    background-color: white;
    border-radius: 0px 0px 7px 7px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.16);
    color: $dark-text;

    #backarrow {
      position: absolute;
      top: 9px;
      left: 23px;
      color: $renascent-red;
      font-size: 30px;
    }

    #toolid {
      display: flex;
      flex: 1 0 auto;
      font-size: 25px;
      font-weight: 600;
      justify-content: center;
      padding-top: 9px;
    }

    #name {
      font-size: 33px;
      font-weight: 900;
      text-align: center;
      margin-top: 4px;
    }

    #actions {
      display: flex;
      flex: 0 1 auto;
      justify-content: space-around;
      margin-top: 10px;

      .action-btn {
        background-color: $renascent-red;
        height: 43px;
        width: 154px;
        border: none !important;
        border-radius: 5px;
        color: white;
        font-size: 18px;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        display: flex;

        .action-icon {
          align-self: flex-start;
        }
      }
    }
  }
}
</style>
