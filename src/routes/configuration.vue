<template>
  <div class="page configuration-page">
    <header-card
      :title="title"
      exit-link="/">
    </header-card>

    <div class="navigation">
      <i
        class="fas fa-arrow-left"
        @click="decrementTab"></i>
      <i
        class="fas fa-arrow-right"
        @click="incrementTab"></i>
    </div>

    <div class="config-menu-container">
      <div
        class="spacer"
        v-if="$mq === 'desktop'">
      </div>
      <div class="configs">
        <config-item
          v-for="config in configs.unsanctioned"
          :key="config.id"
          :config-item="config"
          :on-delete="() => 0"
          :on-sanction-toggle="toggleSanction"
          :on-save="() => 0">
        </config-item>

        <config-item
          v-for="config in configs.sanctioned"
          :key="config.id"
          :config-item="config"
          :on-delete="() => 0"
          :on-sanction-toggle="toggleSanction"
          :on-save="() => 0">
        </config-item>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderCard from "../components/header-card";
import ConfigItem from "../components/config-item";
import ConfigurableItems from "../utils/configurable-items";
import gql from "graphql-tag";

export default {
  name: "Configuration",

  components: {
    HeaderCard,
    ConfigItem,
    ConfigurableItems
  },

  data() {
    return {
      getAllConfigurableItem: null,
      tab: 0
    };
  },

  computed: {
    titles() {
      return {
        BRAND: "Brands",
        TYPE: "Types",
        PURCHASED_FROM: "Suppliers"
      };
    },

    title() {
      var pages = [
        ConfigurableItems.BRAND,
        ConfigurableItems.TYPE,
        ConfigurableItems.PURCHASED_FROM
      ];
      return this.titles[pages[this.tab]];
    },

    page() {
      var pages = [
        ConfigurableItems.BRAND,
        ConfigurableItems.TYPE,
        ConfigurableItems.PURCHASED_FROM
      ];
      return pages[this.tab];
    },

    configs() {
      if (this.page === "BRAND") {
        return this.brands;
      } else if (this.page === "TYPE") {
        return this.types;
      } else if (this.page === "PURCHASED_FROM") {
        return this.suppliers;
      }
    },

    brands() {
      var sanctionedBrands = [];
      var unsanctionedBrands = [];

      if (this.getAllConfigurableItem) {
        this.getAllConfigurableItem.forEach(item => {
          if (
            item["type"] === ConfigurableItems.BRAND &&
            item["sanctioned"] === true
          ) {
            sanctionedBrands.push(item);
          } else if (
            item["type"] === ConfigurableItems.BRAND &&
            item["sanctioned"] === false
          ) {
            unsanctionedBrands.push(item);
          }
        });
      }
      return {
        sanctioned: sanctionedBrands,
        unsanctioned: unsanctionedBrands
      };
    },

    types() {
      var sanctionedTypes = [];
      var unsanctionedTypes = [];

      if (this.getAllConfigurableItem) {
        this.getAllConfigurableItem.forEach(item => {
          if (
            item["type"] === ConfigurableItems.TYPE &&
            item["sanctioned"] === true
          ) {
            sanctionedTypes.push(item);
          } else if (
            item["type"] === ConfigurableItems.TYPE &&
            item["sanctioned"] === false
          ) {
            unsanctionedTypes.push(item);
          }
        });
      }
      return {
        sanctioned: sanctionedTypes,
        unsanctioned: unsanctionedTypes
      };
    },

    suppliers() {
      var sanctionedSuppliers = [];
      var unsanctionedSuppliers = [];

      if (this.getAllConfigurableItem) {
        this.getAllConfigurableItem.forEach(item => {
          if (
            item["type"] === ConfigurableItems.PURCHASED_FROM &&
            item["sanctioned"] === true
          ) {
            sanctionedSuppliers.push(item);
          } else if (
            item["type"] === ConfigurableItems.PURCHASED_FROM &&
            item["sanctioned"] === false
          ) {
            unsanctionedSuppliers.push(item);
          }
        });
      }
      return {
        sanctioned: sanctionedSuppliers,
        unsanctioned: unsanctionedSuppliers
      };
    }
  },

  methods: {
    toggleSanction(config) {
      this.$apollo.mutate({
        mutation: gql`
          mutation updateConfigurableItem($item: UpdatedConfigurableItem!) {
            updateConfigurableItem(updatedConfigurableItem: $item) {
              id
              type
              name
              sanctioned
            }
          }
        `,
        variables: {
          item: {
            id: config.id,
            name: config.name,
            sanctioned: !config.sanctioned
          }
        }
      });
    },

    incrementTab() {
      this.tab = ++this.tab % 3;
    },

    decrementTab() {
      this.tab = (this.tab + 2) % 3;
    }
  },

  apollo: {
    getAllConfigurableItem: {
      query: gql`
        query getAllConfigurableItem {
          getAllConfigurableItem {
            id
            type
            name
            sanctioned
          }
        }
      `,
      fetchPolicy: "cache-and-network"
    }
  }
};
</script>

<style lang="scss">
@import "../styles/variables";

.configuration-page {
  display: flex;
  flex-direction: column;
  background-color: $background-light-gray;
  overflow-y: hidden;

  .navigation {
    position: absolute;
    z-index: 5;
    height: 73px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    i {
      padding-right: 40px;
      padding-left: 40px;
      color: $renascent-red;
      cursor: pointer;
    }
  }

  .header-card {
    z-index: 1;
  }

  .config-menu-container {
    display: flex;
    flex-direction: row;
    width: 100%;

    .spacer {
      min-width: 158px;
      flex: 1 1 auto;
      max-width: 300px;
    }

    .configs {
      overflow-y: auto;
      z-index: 0;
      flex: 1 1 auto;
    }
  }
}

// MOBILE

.mobile {
  .navigation {
    width: 100%;

    i {
      font-size: 30px;
    }
  }
}

// DESKTOP

.desktop {
  .navigation {
    width: calc(100% - 60px);

    i {
      font-size: 25px;
    }
  }
}
</style>
