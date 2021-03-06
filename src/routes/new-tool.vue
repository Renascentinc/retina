<template>
  <div class="page new-tool-page">
    <loading-overlay :active="isSavingTool"/>

    <header-card
      title="New Tool"
      exit-link="/tools"
    >
    </header-card>

    <transition name="card-change">
      <div
        v-if="currentState === 1"
        class="new-tool-input-card"
      >
        <div class="input-group-container">
          <span class="form-label">
            BRAND
          </span>
          <v-select
            v-validate="'required|max:40'"
            v-model="newTool.brand"
            :options="brandOptions"
            name="brand"
            label="name"
            class="dark-input"
            placeholder="eg. DeWalt"
          >
            <template
              slot="no-options"
              slot-scope="props"
            >
              <button
                class="option-container"
                @click="() => props.select({ name: props.value, type: 'BRAND', isNewConfigurableItem: true })"
              >
                Set Brand To "{{ props.value }}"
              </button>
            </template>
          </v-select>
          <div class="error-container">
            <span
              v-show="errors.has('brand')"
              class="error"
            >
              {{ errors.first('brand') }}
            </span>
          </div>
        </div>

        <div class="input-group-container">
          <span class="form-label">
            TYPE
          </span>
          <v-select
            v-validate="'required|max:40'"
            v-model="newTool.type"
            :options="typeOptions"
            name="type"
            label="name"
            class="dark-input"
            placeholder="eg. Saw"
          >
            <template
              slot="no-options"
              slot-scope="props"
            >
              <button
                class="no-options-btn"
                @click="() => props.select({ name: props.value, type: 'TYPE', isNewConfigurableItem: true })"
              >
                Set Type To "{{ props.value }}"
              </button>
            </template>
          </v-select>
          <div class="error-container">
            <span
              v-show="errors.has('type')"
              class="error"
            >
              {{ errors.first('type') }}
            </span>
          </div>
        </div>

        <div class="input-group-container">
          <span class="form-label">
            MODEL NUMBER
          </span>
          <input
            v-validate="'required|max:40'"
            v-model="newTool.model_number"
            name="modelNumber"
            class="light-input"
            placeholder="eg. 18392049437"
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
          >
          <div class="error-container">
            <span
              v-show="errors.has('modelNumber')"
              class="error"
            >
              {{ errors.first('modelNumber') }}
            </span>
          </div>
        </div>

        <div class="input-group-container">
          <span class="form-label">
            SERIAL NUMBER
          </span>
          <input
            v-validate="'required|max:40'"
            v-model="newTool.serial_number"
            name="serialNumber"
            class="light-input"
            placeholder="eg. 0348529873023"
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
          >
          <div class="error-container">
            <span
              v-show="errors.has('serialNumber')"
              class="error"
            >
              {{ errors.first('serialNumber') }}
            </span>
          </div>
        </div>

        <div class="input-group-container">
          <span class="form-label">
            MODEL YEAR
          </span>
          <input
            v-validate="validations.modelYear"
            v-model="newTool.year"
            name="modelYear"
            class="light-input"
            placeholder="eg. 2018"
            type="number"
            inputmode="numeric"
            autocomplete="off"
            pattern="[0-9]*"
          >
          <div class="error-container">
            <span
              v-show="errors.has('modelYear')"
              class="error"
            >
              {{ errors.first('modelYear') }}
            </span>
          </div>
        </div>
      </div>
    </transition>

    <transition name="card-change">
      <div
        v-if="currentState === 2"
        class="new-tool-input-card"
      >
        <div class="input-group-container">
          <span class="form-label">
            ASSIGN TO USER
          </span>
          <v-select
            v-model="newTool.owner"
            :options="userOptions"
            label="name"
            class="dark-input"
          />
        </div>

        <div class="input-group-container">
          <span class="form-label">
            PURCHASED FROM
          </span>
          <v-select
            v-model="newTool.purchased_from"
            :options="purchasedFromOptions"
            label="name"
            class="dark-input"
            placeholder="eg. Lowes"
          >
            <template
              slot="no-options"
              slot-scope="props"
            >
              <button
                class="no-options-btn"
                @click="() => props.select({ name: props.value, type: 'PURCHASED_FROM', isNewConfigurableItem: true })"
              >
                Set Purchased From To "{{ props.value }}"
              </button>
            </template>
          </v-select>
        </div>

        <div class="input-group-container">
          <span class="form-label">
            STATUS
          </span>
          <v-select
            v-model="newTool.statusObject"
            :options="statuses"
            :searchable="false"
            label="name"
            class="dark-input"
          >
          </v-select>
        </div>

        <div class="input-group-container">
          <span class="form-label">
            PURCHASE DATE
          </span>
          <date-picker
            :date="newTool.jsDate"
            :on-date-change="onDateChange"
          />
        </div>

        <div class="input-group-container">
          <span class="form-label">
            PRICE
          </span>
          <input
            v-money="moneyInputConfig"
            v-model.lazy="newTool.formattedPrice"
            name="price"
            class="light-input"
          >
        </div>
      </div>
    </transition>

    <transition name="card-change">
      <div
        v-if="currentState === 3"
        class="new-tool-input-card photo-input-card"
      >
        <add-photo
          :on-image-change="onImageChange"
          :edit-state="true"
        />
      </div>
    </transition>

    <transition name="card-change">
      <div
        v-if="currentState === 4"
        class="new-tool-input-card step-4"
      >
        <nfc-encode :tool="newTool"/>

        <tool-search-result
          :tool="newTool"
          :on-select="transitionToToolInfo"
        />

        <div class="done-action-container">
          <extended-fab
            :on-click="addAnother"
            :outline-display="true"
            class="add-another-efab"
            icon-class="fa-undo"
            button-text="ADD ANOTHER"
          />

          <extended-fab
            :on-click="transitionToTools"
            class="done-efab"
            icon-class="fa-arrow-right"
            button-text="DONE"
          />
        </div>
      </div>
    </transition>

    <transition name="card-change">
      <div
        v-if="currentState !== 4"
        class="pager-container"
      >
        <div class="pager-btn-container">
          <fab
            :disabled="currentState === 1"
            :on-click="() => --currentState"
            class="page-back"
            icon-class="fa-arrow-left"
          />
        </div>

        <div class="pager">
          <div
            :class="{ selected: currentState === 1 }"
            class="pager-page"
          >
          </div>
          <div
            :class="{ selected: currentState === 2 }"
            class="pager-page"
          >
          </div>
          <div
            :class="{ selected: currentState === 3 }"
            class="pager-page"
          >
          </div>
          <div
            :class="{ selected: currentState === 4 }"
            class="pager-page"
          >
          </div>
        </div>

        <div class="pager-btn-container">
          <fab
            v-if="currentState !== 3"
            :disabled="!!errors.items.length"
            :on-click="advanceStep"
            class="page-forward"
            icon-class="fa-arrow-right"
          />

          <extended-fab
            v-if="currentState === 3"
            :on-click="advanceStep"
            class="page-forward"
            icon-class=""
            button-text="FINISH"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import HeaderCard from '@/components/header-card'
import ToolSearchResult from '@/components/tool-search-result.vue'
import DatePicker from '@/components/basic/date-picker'
import ExtendedFab from '@/components/basic/extended-fab.vue'
import Fab from '@/components/basic/fab'
import vSelect from '@/components/basic/select'
import ConfigurableItems from '@/utils/configurable-items'
import Statuses from '@/utils/statuses'
import NfcEncode from '@/components/nfc-encode'
import AddPhoto from '@/components/add-photo'
import { configurableItemQuery, usersQuery } from '@/utils/gql'
import Tool from '@/models/tool'
import User from '@/models/user'
import LoadingOverlay from '@/components/basic/loading-overlay'
import { mapActions } from 'vuex'
import { showSuccessMsg } from '@/utils/alerts'

export default {
  name: 'NewTool',

  components: {
    HeaderCard,
    ToolSearchResult,
    ExtendedFab,
    Fab,
    vSelect,
    NfcEncode,
    LoadingOverlay,
    AddPhoto,
    DatePicker
  },

  apollo: {
    getAllUser: {
      query: usersQuery

    },

    getAllConfigurableItem: {
      query: configurableItemQuery

    }
  },

  data () {
    const statuses = [
      {
        name: 'Available',
        id: Statuses.AVAILABLE
      },
      {
        name: 'In Use',
        id: Statuses.IN_USE
      },
      {
        name: 'Maintenance',
        id: Statuses.MAINTENANCE
      }
    ]

    return {
      currentState: 1,
      newTool: this.getDefaultTool(),
      datePickerVisibility: 'hidden',
      isSavingTool: false,
      statuses,
      validations: {
        modelYear: `date_format:YYYY|before:${new Date().getFullYear()},true`
      },
      moneyInputConfig: {
        decimal: '.',
        thousands: '',
        prefix: '$ ',
        suffix: '',
        precision: 2,
        masked: false
      }
    }
  },

  computed: {
    userOptions () {
      if (!this.getAllUser) {
        return []
      }

      return this.getAllUser.map(user => new User(user))
    },

    brandOptions () {
      return this.getConfigurableItemsForType(ConfigurableItems.BRAND)
    },

    typeOptions () {
      return this.getConfigurableItemsForType(ConfigurableItems.TYPE)
    },

    purchasedFromOptions () {
      return this.getConfigurableItemsForType(ConfigurableItems.PURCHASED_FROM)
    }
  },

  methods: {
    ...mapActions('tools', [
      'createNewTool'
    ]),

    transitionToToolInfo (toolId) {
      this.$router.push({ name: 'toolDetail', params: { toolId } })
    },

    transitionToTools () {
      this.$router.push({ path: '/tools' })
    },

    onImageChange (newImage) {
      this.newTool.image = newImage
    },

    onDateChange (newDate) {
      this.newTool.jsDate = newDate
    },

    getConfigurableItemsForType (type) {
      if (!this.getAllConfigurableItem) {
        return []
      }

      return this.getAllConfigurableItem.filter(item => item.type === type && item.sanctioned)
    },

    async advanceStep () {
      let result = await this.$validator.validate()
      if (result) {
        if (this.currentState === 3) {
          this.isSavingTool = true
          let response = await this.createNewTool(this.newTool)
          if (response) {
            this.newTool = new Tool(response.data.createTool)
            ++this.currentState
            showSuccessMsg()
            this.$apollo.queries.getAllConfigurableItem.refetch()
          }
          this.isSavingTool = false
        } else {
          ++this.currentState
        }
      }
    },

    addAnother () {
      this.currentState = 1
      // RETINA-358: only clear a few of the fields. If they are adding a bunch of the same tools it makes the process much faster
      this.newTool.serial_number = undefined
      this.newTool.id = undefined
      this.newTool.photo = undefined
    },

    getDefaultTool () {
      return new Tool({
        year: null,
        status: Statuses.AVAILABLE,
        model_number: '',
        serial_number: '',
        price: '',
        owner: this.$store.state.auth.currentUser
      })
    }
  }
}
</script>

<style lang="scss">
.new-tool-page {
  display: flex;
  flex-direction: column;
  background-color: $background-light-gray;

  .purchase-date-input {
    padding-left: 10px;
    text-align: left;

    &.placeholder {
      color: $form-placeholder-color;
    }
  }

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

  .new-tool-input-card {
    display: flex;
    flex: 1 0 420px;
    max-height: 475px;
    flex-direction: column;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    margin: 10px 10px 0 10px;
    background-color: white;
    align-items: center;
    justify-content: space-around;
    padding: 0 20px;
    border-radius: 3px;

    &.step-4 {
      box-shadow: none;
    }

    &.photo-input-card {
      justify-content: center;

      .image-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 350px;
        width: 100%;
      }
    }

    .dropdown {
      width: 100%;
    }
  }

  .form-label {
    font-weight: 900;
    color: $renascent-dark-gray;
    font-size: 15px;
    padding-left: 20px;
  }

  .pager-container {
    display: flex;
    flex: 0 0 90px;
    justify-content: space-around;
    align-items: center;

    .pager-btn-container {
      width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

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

  .delete-photo-efab {
    border-color: transparent;
    box-shadow: none;
    font-size: 15px;
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

  .search-result {
    height: 130px;
    width: 100%;
    max-width: 400px;
    overflow: hidden;

    .tool-selection-container {
      display: none;
    }

    .tool-name {
      font-size: 30px;
    }

    .row .id {
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
      font-size: 14px;
    }
  }

  .img-preview {
    max-height: 350px;
    max-width: 100%;
  }
}

.black {
  color: black;
}

.no-options-btn {
  min-height: 40px;
  padding: 0;
  display: flex;
  color: black;
  font-size: 23px;
  font-weight: 700;
  word-break: break-word;
  width: 100%;
}

.desktop .new-tool-page {
  .header-card {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    border-radius: 0;
    margin-bottom: 10px;
  }

  .new-tool-input-card {
    padding-top: 5px;
    width: 400px;
    margin-left: auto;
    margin-right: auto;
    max-height: 500px;
    margin-top: auto;
    margin-bottom: auto;
    background-color: white;

    .popover-container {
      height: 45px !important;
      margin-left: auto;
      margin-right: auto;
      text-align: center;

      input {
        width: 320px !important;
        height: 45px;
      }
    }

    .dropdown, .light-input, .purchase-date-input {
      height: 45px !important;
      margin-left: auto;
      margin-right: auto;
      width: 350px;
    }
  }
}
</style>
