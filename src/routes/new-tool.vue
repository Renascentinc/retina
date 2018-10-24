<template>
  <div class="page new-tool-page">
    <header-card title="New Tool"></header-card>

    <transition name="card-change">
      <div
        v-if="currentState === 1"
        class="new-tool-input-card">

        <div class="input-group-container">
          <v-select
            v-validate:brand="'required'"
            :options="brandOptions"
            v-model="brand"
            name="brand"
            label="name"
            class="dark-input"
            placeholder="Brand">
          </v-select>
          <div class="error-container">
            <span
              v-show="errors.has('brand')"
              class="error">
              {{ errors.first('brand') }}
            </span>
          </div>
        </div>

        <div class="input-group-container">
          <v-select
            v-validate:type="'required'"
            v-model="type"
            :options="typeOptions"
            name="type"
            label="name"
            class="dark-input"
            placeholder="Type">
          </v-select>
          <div class="error-container">
            <span
              v-show="errors.has('type')"
              class="error">
              {{ errors.first('type') }}
            </span>
          </div>
        </div>

        <div class="input-group-container">
          <input
            v-validate="'required|alpha_num'"
            v-model="modelNumber"
            name="modelNumber"
            class="light-input"
            placeholder="Model no.">
          <div class="error-container">
            <span
              v-show="errors.has('modelNumber')"
              class="error">
              {{ errors.first('modelNumber') }}
            </span>
          </div>
        </div>

        <div class="input-group-container">
          <input
            v-validate="'required|alpha_num'"
            v-model="serialNumber"
            name="serialNumber"
            class="light-input"
            placeholder="Serial no.">
          <div class="error-container">
            <span
              v-show="errors.has('serialNumber')"
              class="error">
              {{ errors.first('serialNumber') }}
            </span>
          </div>
        </div>
      </div>
    </transition>

    <transition name="card-change">
      <div
        v-if="currentState === 2"
        class="new-tool-input-card">
        <v-select
          v-model="owner"
          :options="userOptions"
          label="full_name"
          class="dark-input"
          placeholder="Owner">
        </v-select>

        <v-select
          v-model="purchasedFrom"
          :options="purchasedFromOptions"
          label="name"
          class="dark-input"
          placeholder="Purchased from">
        </v-select>

        <v-date-picker
          v-model="purchaseDate"
          mode="single"
          show-caps>
        </v-date-picker>

        <div class="input-group-container">
          <input
            v-validate="'date_format:YYYY|date_between:1950,2030'"
            v-model="modelYear"
            name="modelYear"
            class="light-input"
            placeholder="Model Year"
            type="number">
          <div class="error-container">
            <span
              v-show="errors.has('modelYear')"
              class="error">
              {{ errors.first('modelYear') }}
            </span>
          </div>
        </div>

        <div class="input-group-container">
          <input
            v-model="price"
            name="price"
            class="light-input"
            placeholder="Price"
            type="number">
        </div>
      </div>
    </transition>

    <transition name="card-change">
      <div
        v-if="currentState === 3"
        class="new-tool-input-card">

        <button
          class="dark-input add-photo"
          @click="startTakingPhoto">
          <i class="fas fa-camera"></i>
          <span> Add Photo </span>
        </button>
      </div>
    </transition>

    <transition name="card-change">
      <div
        v-if="currentState === 4"
        class="new-tool-input-card step-4">

        <extended-fab
          :disabled="nfcDisabled"
          :on-click="prepareToEncodeTag"
          :outline-display="true"
          class="encode-efab"
          icon-class="fa-times"
          button-text="ENOCDE TAG">
        </extended-fab>

        <tool-search-result
          :tool="tool"
          :on-select="transitionToToolInfo">
        </tool-search-result>

        <div class="done-action-container">
          <extended-fab
            :on-click="addAnother"
            :outline-display="true"
            class="add-another-efab"
            icon-class="fa-undo"
            button-text="ADD ANOTHER">
          </extended-fab>

          <extended-fab
            :on-click="transitionToTools"
            class="done-efab"
            icon-class="fa-arrow-right"
            button-text="DONE">
          </extended-fab>
        </div>
      </div>
    </transition>

    <transition name="card-change">
      <div
        v-if="currentState !== 4"
        class="pager-container">
        <fab
          :disabled="currentState === 1"
          :on-click="() => --currentState"
          class="page-back"
          icon-class="fa-arrow-left">
        </fab>

        <div class="pager">
          <div
            :class="{ selected: currentState === 1 }"
            class="pager-page">
          </div>
          <div
            :class="{ selected: currentState === 2 }"
            class="pager-page">
          </div>
          <div
            :class="{ selected: currentState === 3 }"
            class="pager-page">
          </div>
          <div
            :class="{ selected: currentState === 4 }"
            class="pager-page">
          </div>
        </div>

        <fab
          :disabled="!!errors.items.length"
          :on-click="advanceStep"
          class="page-forward"
          icon-class="fa-arrow-right">
        </fab>
      </div>
    </transition>
  </div>
</template>

<script>
import PhotoCapture from '../components/photo-capture'
import HeaderCard from '../components/header-card'
import ToolSearchResult from '../components/tool-search-result.vue'
import ExtendedFab from '../components/extended-fab.vue'
import Fab from '../components/fab'
import vSelect from 'vue-select'
import gql from 'graphql-tag'
import ConfigurableItems from '../utils/configurable-items'

export default {
  name: 'NewTool',

  components: {
    PhotoCapture,
    HeaderCard,
    ToolSearchResult,
    ExtendedFab,
    Fab,
    vSelect
  },

  apollo: {
    getAllUser: gql`query {
      getAllUser {
        id
        first_name
        last_name
        role
      }
    }`,

    getAllConfigurableItem: gql`query {
      getAllConfigurableItem {
        id,
        type,
        name
      }
    }`
  },

  data () {
    return {
      brand: null,
      type: null,
      owner: null,
      modelNumber: null,
      serialNumber: null,
      modelYear: null,
      purchasedFrom: null,
      price: null,
      photo: null,
      currentState: 3,
      purchaseDate: new Date(),
      getAllConfigurableItem: [],
      getAllUser: [],

      // tmp
      tool: {
        id: '2',
        type: {
          name: 'Hammer Drill'
        },
        brand: {
          name: 'Bosch'
        },
        status: 'IN_USE',
        user: {
          first_name: 'Colin',
          last_name: 'Pullen'
        }
      }
    }
  },

  computed: {
    userOptions () {
      return this.getAllUser.map(user => {
        user.full_name = `${user.first_name} ${user.last_name}`
        return user
      })
    },

    brandOptions () {
      return this.getConfigurableItemsForType(ConfigurableItems.BRAND)
    },

    typeOptions () {
      return this.getConfigurableItemsForType(ConfigurableItems.TYPE)
    },

    purchasedFromOptions () {
      return this.getConfigurableItemsForType(ConfigurableItems.PURCHASED_FROM)
    },

    nfcDisabled () {
      return !window.nfc
    }
  },

  methods: {
    getConfigurableItemsForType (type) {
      return this.getAllConfigurableItem.filter(item => item.type === type)
    },

    advanceStep () {
      this.$validator.validate().then(result => {
        if (result) {
          ++this.currentState

          if (this.currentState === 3) {
            this.saveTool()
          }
        }
      })
    },

    addAnother () {
      this.resetData()
      this.currentState = 1
    },

    resetData () {
      this.brand = null
      this.type = null
      this.owner = null
      this.modelNumber = null
      this.serialNumber = null
      this.modelYear = null
      this.purchasedFrom = null
      this.price = null
      this.photo = null
      this.purchaseDate = new Date()
    },

    transitionToToolInfo (toolId) {
      this.$router.push({ name: 'toolDetail', params: { toolId } })
    },

    transitionToTools () {
      this.$router.push({ path: '/tools' })
    },

    saveTool () {

    },

    prepareToEncodeTag () {

    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.card-change-enter-active {
  transition: opacity .25s;
}

.card-change-leave-active,
.card-change-leave-to {
  display: none;
  visibility: hidden;
}

.card-change-enter {
  opacity: 0;
}

.new-tool-page {
  display: flex;
  flex-direction: column;
  background-color: $background-light-gray;

  .new-tool-input-card {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    margin: 10px 10px 0 10px;
    background-color: white;
    align-items: center;
    justify-content: space-around;
    padding: 0 20px;

    .dropdown {
      width: 100%;
    }
  }

  .pager-container {
    display: flex;
    flex: 0 0 90px;
    justify-content: space-around;
    align-items: center;

    .pager {
      display: flex;
      justify-content: space-between;
      flex: 0 0 70px;

      .pager-page {
        padding: 0;
        height: 10px;
        width: 10px;
        border-radius: 50%;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        background-color: white;

        &.selected {
          background-color: $renascent-dark-gray;
        }
      }
    }
  }

  .add-another-efab {
    border-color: transparent;
    box-shadow: none;
  }

  .tool-search-result {
    width: 100%;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  }

  .done-action-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .step-4 {
    background: transparent;
    padding: 0 10px;
  }

  .done-efab {
    width: 126px;
  }

  .tool-search-result {
    height: 130px;

    .tool-selection-container {
      display: none;
    }

    .tool-name {
      font-size: 30px;
    }

    .row .tool-id {
      font-size: 23px;
    }

    .tool-status {
      font-size: 22px;
    }

    .row .user-icon {
      font-size: 18px;
    }

    .tool-assignee {
      font-size: 24px;
    }
  }

  .input-group-container {
    display: flex;
    flex-direction: column;
    width: 100%;

    .error-container {
      height: 19px;
      padding-left: 10px;
      color: $renascent-red;
    }
  }

  .add-photo {
    height: 250px;
  }
}
</style>
