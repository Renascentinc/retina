<template>
  <div class="page tool-detail-page">
    <loading-overlay :active="saving"/>

    <div class="info-menu-container">
      <div
        class="action-sidebar"
        v-if="$mq === 'desktop'"
      >
        <extended-fab
          :on-click="transitionToTools"
          :outline-display="true"
          icon-class="fa-arrow-left"
          class="action-btn transfer-btn"
          button-text="BACK"
        />

        <extended-fab
          v-if="canEdit"
          :on-click="toggleEditState"
          :icon-class="editState ? 'fa-save' : 'fa-pen'"
          :button-text="editState ? 'SAVE CHANGES' : 'EDIT TOOL'"
        />

        <extended-fab
          v-if="editState"
          :on-click="cancelEdit"
          icon-class="fa-times"
          button-text="CANCEL"
        />

        <extended-fab
          v-if="isTransferable"
          :disabled="editState"
          :on-click="toggleTransferStatus"
          :button-text="isToolSelected ? 'DESELECT' : 'TRANSFER'"
          icon-class="fa-exchange-alt"
          class="action-btn transfer-btn"
        />

        <extended-fab
          :disabled="editState"
          :on-click="transitionToHistory"
          :outline-display="false"
          icon-class="fa-book-open"
          button-text="VIEW HISTORY"
        />

        <dropdown
          v-if="isTransferable"
          :on-click="updateStatus"
          :options="statusOptions"
          button-text="CHANGE STATUS"
        />
      </div>

      <div class="header-cards-container">
        <div class="header">
          <router-link
            v-if="$mq === 'mobile'"
            class="fas fa-arrow-left backarrow"
            to="/tools"
          />

          <span class="toolid">
            {{ tool.formattedId }}
          </span>

          <div
            v-if="!editState"
            class="name"
          >
            {{ tool.brand.name }} {{ tool.type.name }}
          </div>

          <div
            v-if="editState"
            class="input-group-container"
          >
            <v-select
              v-validate="'required'"
              v-model="editedTool.brand"
              :options="brandOptions"
              name="brand"
              label="name"
              class="dark-input"
              placeholder="Brand"
            >
              <template
                slot="no-options"
                slot-scope="props"
              >
                <button
                  class="no-options-btn"
                  @click="() => editedTool.brand = { name: props.value, type: 'BRAND', isNewConfigurableItem: true }"
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

          <div
            v-if="editState"
            class="input-group-container"
          >
            <v-select
              v-validate="'required'"
              v-model="editedTool.type"
              :options="typeOptions"
              name="type"
              label="name"
              class="dark-input"
              placeholder="Type"
            >
              <template
                slot="no-options"
                slot-scope="props"
              >
                <button
                  class="no-options-btn"
                  @click="() => editedTool.type = { name: props.value, type: 'TYPE', isNewConfigurableItem: true }"
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

          <span
            :class="tool.statusClass"
            class="tool-status"
          >
            {{ tool.formattedStatus }}
          </span>

          <div
            v-if="isTransferable && $mq === 'mobile'"
            class="actions"
          >
            <dropdown
              :on-click="updateStatus"
              :options="statusOptions"
              button-text="CHANGE STATUS"
            />

            <button
              class="action-btn transfer-btn"
              @click="toggleTransferStatus"
            >
              <i class="fas fa-exchange-alt action-icon"></i>
              <span class="action-title">
                {{ isToolSelected ? 'DESELECT' : 'TRANSFER' }}
              </span>
            </button>
          </div>
        </div>
        <div class="cards">
          <div class="card owner-card">
            <div class="card-title">
              Assigned To
            </div>
            <div class="card-details owner-details">
              <div class="user-symbol">
                <i
                  :class="{ 'fa-user': tool.owner.isUser, 'fa-map-marker-alt': tool.owner.isLocation }"
                  class="fas"
                />
              </div>
              <div class="owner-name">
                <div
                  v-if="tool.owner.isLocation"
                  class="owner-location"
                >
                  {{ tool.owner.name }}
                </div>
                <div
                  v-if="tool.owner.isUser"
                  class="owner-user"
                >
                  <span> {{ tool.owner.first_name }} </span>
                  <span> {{ tool.owner.last_name }} </span>
                </div>
              </div>
              <div class="contact-buttons">
                <fab
                  v-if="tool.owner.isUser"
                  :on-click="tool.owner.startPhoneCall"
                  :disabled="!tool.owner.phone_number"
                  class="call-btn"
                  icon-class="fa-phone"
                />

                <div class="spacer"></div>

                <fab
                  v-if="tool.owner.isUser"
                  :on-click="tool.owner.startEmail"
                  :disabled="!tool.owner.email"
                  class="email-btn"
                  icon-class="fa-envelope"
                />
              </div>
            </div>
          </div>
          <div
            class="card general-card"
          >
            <div class="card-title">
              General
            </div>
            <div class="card-details general-details">
              <span class="general-label">
                Retina ID
              </span>
              <span class="general-data">
                {{ tool.id }}
              </span>
              <nfc-encode :tool-id="tool.id"/>

              <span class="general-label">
                Serial Number
              </span>
              <span
                v-if="!editState"
                class="general-data"
              >
                {{ tool.serial_number }}
              </span>

              <input
                v-validate="'required'"
                v-if="editState"
                v-model="editedTool.serial_number"
                name="serial"
                class="general-data light-input"
              >
              <div class="error-container">
                <span
                  v-show="errors.has('serial')"
                  class="error"
                >
                  {{ errors.first('serial') }}
                </span>
              </div>

              <span class="general-label">
                Model Number
              </span>
              <span
                v-if="!editState"
                class="general-data"
              >
                {{ tool.model_number }}
              </span>

              <input
                v-validate="'required'"
                v-if="editState"
                v-model="editedTool.model_number"
                name="model"
                class="general-data light-input"
              >
              <div class="error-container">
                <span
                  v-show="errors.has('model')"
                  class="error"
                >
                  {{ errors.first('model') }}
                </span>
              </div>

              <span class="general-label">
                Model Year
              </span>
              <span
                v-if="!editState"
                class="general-data"
              >
                {{ tool.year }}
              </span>

              <input
                v-validate="validations.modelYear"
                v-if="editState"
                v-model="editedTool.year"
                name="year"
                type="number"
                class="general-data light-input"
              >
              <div class="error-container">
                <span
                  v-show="errors.has('year')"
                  class="error"
                >
                  {{ errors.first('year') }}
                </span>
              </div>

              <span class="general-label">
                Purchased From
              </span>
              <span
                v-if="!editState"
                class="general-data"
              >
                {{ tool.purchased_from.name }}
              </span>

              <v-select
                v-if="editState"
                v-model="editedTool.purchased_from"
                :options="purchasedFromOptions"
                label="name"
                class="general-data dark-input"
                placeholder="Purchased From"
              >
                <template
                  slot="no-options"
                  slot-scope="props"
                >
                  <button
                    class="no-options-btn"
                    @click="() => editedTool.purchased_from = { name: props.value, type: 'PURCHASED_FROM', isNewConfigurableItem: true }"
                  >
                    Set Type To "{{ props.value }}"
                  </button>
                </template>
              </v-select>

              <span class="general-label">
                Purchase Date
              </span>
              <span
                v-if="!editState"
                class="general-data"
              >
                {{ tool.formattedDate }}
              </span>

              <date-picker
                v-if="editState"
                :date="editedTool.jsDate"
                :on-date-change="onDateChange"
              />

              <span class="general-label">
                Purchase Price
              </span>
              <span
                v-if="!editState"
                class="general-data"
              >
                {{ tool.formattedPrice }}
              </span>

              <input
                v-money="moneyInputConfig"
                v-if="editState"
                v-model="editedTool.formattedPrice"
                name="newPrice"
                class="light-input"
                placeholder="Price"
              >

              <extended-fab
                v-if="$mq === 'mobile'"
                :on-click="transitionToHistory"
                :outline-display="false"
                icon-class="fa-book-open"
                button-text="VIEW HISTORY"
              />
            </div>
          </div>

          <div
            class="card photo-card"
          >
            <div class="card-title">
              Photo
            </div>

            <add-photo
              :on-image-change="onImageChange"
              :edit-state="editState"
              :image-url="editState ? editedTool.photo : tool.photo"
            />
          </div>
        </div>
      </div>
    </div>

    <fab
      v-if="editState && $mq === 'mobile'"
      :on-click="cancelEdit"
      icon-class="fa-times"
      class="cancel"
    />

    <fab
      v-if="canEdit && $mq === 'mobile'"
      :on-click="toggleEditState"
      :icon-class="editState ? 'fa-save' : 'fa-pen'"
      class="edit"
    />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex'
import Fab from '@/components/basic/fab.vue'
import ExtendedFab from '@/components/basic/extended-fab'
import DatePicker from '@/components/basic/date-picker'
import vSelect from '@/components/basic/select'
import Dropdown from '@/components/basic/dropdown'
import NfcEncode from '@/components/nfc-encode'
import AddPhoto from '@/components/add-photo'
import LoadingOverlay from '@/components/basic/loading-overlay'
import nfcMixin from '@/mixins/nfc'
import Platforms from '@/utils/platforms'
import ConfigurableItems from '@/utils/configurable-items.js'
import { configurableItemQuery, toolQuery } from '@/utils/gql'
import { showInvalidIDMsg, showSuccessMsg } from '@/utils/alerts'
import Tool from '@/models/tool'

export default {
  name: 'ToolDetail',

  components: {
    Fab,
    ExtendedFab,
    Dropdown,
    vSelect,
    NfcEncode,
    AddPhoto,
    DatePicker,
    LoadingOverlay
  },

  mixins: [
    nfcMixin
  ],

  apollo: {
    getAllConfigurableItem: {
      query: configurableItemQuery,
      fetchPolicy: 'network-only'
    },

    getTool: {
      query: toolQuery,
      variables () {
        return {
          'tool_id': this.$router.currentRoute.params.toolId
        }
      },
      result (apiResult) {
        let tool = apiResult.data.getTool
        if (tool) {
          this.tool.update(tool)
        } else {
          showInvalidIDMsg()
          this.$router.push({ path: '/tools' })
        }
      },
      fetchPolicy: 'network-only'
    }
  },

  data () {
    return {
      tool: new Tool(),
      editedTool: null,
      editState: false,
      saving: false,
      validations: {
        modelYear: `date_format:YYYY|date_between:1950,${new Date().getFullYear()}`
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
    ...mapState('tools', [
      'transferState',
      'selectedToolsMap'
    ]),

    ...mapGetters('users', [
      'currentUser'
    ]),

    statusOptions () {
      let statusOptions = ['AVAILABLE', 'IN USE', 'MAINTENANCE']

      if (this.canEdit) {
        statusOptions = statusOptions.concat(['LOST OR STOLEN', 'BEYOND REPAIR'])
      }

      return statusOptions
    },

    isToolSelected () {
      return !!this.selectedToolsMap[this.tool.id]
    },

    brandOptions () {
      return this.getConfigurableItemsForType(ConfigurableItems.BRAND)
    },

    purchasedFromOptions () {
      return this.getConfigurableItemsForType(ConfigurableItems.PURCHASED_FROM)
    },

    typeOptions () {
      return this.getConfigurableItemsForType(ConfigurableItems.TYPE)
    },

    canEdit () {
      return this.currentUser.role === 'ADMINISTRATOR'
    },

    isTransferable () {
      return (
        this.currentUser.role === 'ADMINISTRATOR' ||
        (this.tool.owner.isLocation && this.tool.status === 'AVAILABLE') ||
        (this.tool.owner.isUser && this.currentUser.id === this.tool.owner.id)
      )
    }
  },

  mounted () {
    if (this.checkIsNfcEnabled() && window.device.platform === Platforms.ANDROID) {
      // add a noop nfc listener to keep nfc scans on android from bubbling up to the OS
      window.nfc.addNdefListener(() => 0)
    }
  },

  methods: {
    ...mapActions('tools', [
      'updateTool',
      'saveStatusChange',
      'decomissionTool'
    ]),

    ...mapMutations('tools', [
      'toggleToolSelection',
      'updateTransferStatus'
    ]),

    transitionToHistory () {
      this.$router.push({ name: 'history', query: { toolId: this.tool.id } })
    },

    transitionToTools () {
      this.$router.push({ name: 'tools' })
    },

    getConfigurableItemsForType (type) {
      return this.getAllConfigurableItem.filter(item => item.type === type && item.sanctioned)
    },

    cancelEdit () {
      this.editState = false
    },

    async toggleEditState () {
      if (this.editState) {
        let result = await this.$validator.validate()
        if (result) {
          this.saving = true
          await this.updateTool(this.editedTool)
          this.tool.update(this.editedTool)
          this.$apollo.queries.getAllConfigurableItem.refetch()
          this.editState = false
          this.saving = false
        }
      } else {
        this.editedTool = new Tool(this.tool)
        this.editState = true
      }
    },

    onImageChange (newImage) {
      this.editedTool.image = newImage
      this.editedTool.photo = null
    },

    onDateChange (newDate) {
      this.editedTool.jsDate = newDate
    },

    toggleTransferStatus () {
      this.toggleToolSelection(this.tool.id)
      if (this.transferState === 'INITIAL') {
        this.updateTransferStatus('SELECTING')
      }
      this.transitionToTools()
    },

    async updateStatus (newStatus) {
      newStatus = newStatus.replace(/ /g, '_').toUpperCase()

      if (newStatus === 'LOST_OR_STOLEN' || newStatus === 'BEYOND_REPAIR') {
        await this.decomissionTool({ tool: this.tool, newStatus })
        showSuccessMsg()
        this.transitionToTools()
      } else {
        this.saveStatusChange({ tool: this.tool, newStatus })
      }
    }
  }
}
</script>

<style lang="scss">
.tool-detail-page {
  background-color: $background-light-gray;
  display: flex;
  flex-direction: column;

  .info-menu-container {
    height: 100%;
    background-color: $background-light-gray;

    .nfc-encode {
      position: absolute;
      right: 15px;
      width: 120px;
      height: 30px;
      top: 9px;

      .fab-icon-container {
        height: 18px;
        width: 18px;
      }

      .efab-text {
        font-size: 10px;
      }
    }

    .header-cards-container {
      height: 100%;
      overflow-y: hidden;
      display: flex;
      flex-direction: column;
    }

    .header {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding-bottom: 12px;
      background-color: white;
      border-radius: 0px 0px 7px 7px;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.16);
      color: $dark-text;
      position: relative;
      z-index: 1;
      flex-shrink: 0;

      .backarrow {
        position: absolute;
        top: 9px;
        left: 23px;
        color: $renascent-red;
        font-size: 30px;
        width: 27px;
        z-index: -10;
      }

      .toolid {
        display: flex;
        flex: 1 0 auto;
        font-size: 25px;
        font-weight: 600;
        justify-content: center;
        padding-top: 9px;
        margin-left: auto;
        margin-right: auto;
        z-index: 4;
      }

      .name {
        word-break: break-word;
        font-size: 33px;
        font-weight: 900;
        text-align: center;
        margin-top: 4px;
        z-index: 4;
      }

      .tool-status {
        text-align: center;
        margin-left: auto;
        margin-right: auto;
        z-index: 4;
      }

      .input-group-container {
        width: 300px;
        margin-left: auto;
        margin-right: auto;

        .dark-input {
          height: 50px;

          .dropdown-toggle {
            margin: 10px;
            font-size: 22px;
            height: 50px;
          }
        }
      }

      .actions {
        display: flex;
        flex: 0 1 auto;
        margin-top: 10px;
        z-index: 1;

        .action-btn {
          background-color: $renascent-red;
          height: 43px;
          width: 154px;
          border: none !important;
          border-radius: 5px;
          color: white;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          padding: 0px;
          display: flex;
          align-items: center;
          z-index: -10;
          padding-left: 10px;
          font-size: 13px;
          justify-content: center;

          .action-title {
            flex: 1 1 auto;
          }

          .action-icon {
            font-size: 18px;
          }
        }

        .transfer-btn {
          z-index: -6;
        }
      }
    }
  }

  .cards {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .card {
      position: relative;
      width: calc(100% - 15px);
      margin-left: auto;
      margin-right: auto;
      background-color: white;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      z-index: 0;
      margin-top: 6px;
      margin-bottom: 10px;
      border-radius: 3px;

      .card-title {
        font-size: 25px;
        font-weight: 900;
        color: $dark-text;
        padding-left: 14px;
        padding-top: 6px;
      }

      .card-details {
        padding-left: 14px;
        padding-right: 14px;
        padding-top: 10px;
      }
    }

    .general-card {
      padding-bottom: 10px;

      .general-details {
        display: flex;
        flex-direction: column;
        font-size: 16px;

        .extended-fab {
          border-radius: 3px;
          margin-top: 12px;
        }

        .general-label {
          padding-top: 10px;
          color: $dark-avatar;
          font-weight: 400;
        }

        .general-data {
          color: $dark-text;
          font-weight: 600;
        }

        .error-container {
          height: auto;
          padding-left: 10px;
          color: $renascent-red;
          font-size: 14px;
        }

        .light-input {
          font-size: 16px;
          height: 30px;
        }

        .dark-input,
        .popover-container {
          font-size: 18px;
          height: 40px;

          input {
            font-size: 18px;
            height: 40px;
          }
        }
      }
    }

    .photo-card {
      padding-bottom: 11px;
      margin-bottom: 80px;
    }

    .owner-card {
      padding-bottom: 17px;

      .owner-details {
        display: flex;
        flex-direction: row;
        align-items: center;

        .owner-name {
          display: flex;
          flex-direction: column;
          font-size: 23px;
          font-weight: 800;
          color: $renascent-dark-gray;
          margin-left: 11px;
          max-width: calc(100% - 165px);

          .owner-user {
            display: flex;
            flex-direction: column;

            span {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }

        .user-symbol {
          height: 44px;
          width: 44px;
          border-radius: 50%;
          background-color: $dark-avatar;
          color: white;
          margin: 0px;
          font-size: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
        }
      }

      .contact-buttons {
        margin-left: auto;
        display: flex;
        justify-content: flex-end;
        flex-direction: row;
        flex-wrap: wrap;

        .fab {
          margin: 11px;
        }

        .email-btn {
          margin-left: 11px;
          margin-top: 5px;
          margin-bottom: 5px;
        }

        .call-btn {
          margin-right: 11px;
          margin-bottom: 5px;
          margin-top: 5px;
        }
      }
    }
  }

  .edit {
    position: absolute;
    bottom: 70px;
    bottom: calc(70px + constant(safe-area-inset-bottom));
    bottom: calc(70px + env(safe-area-inset-bottom));
    right: 20px;
  }

  .cancel {
    position: absolute;
    bottom: 70px;
    bottom: calc(70px + constant(safe-area-inset-bottom));
    bottom: calc(70px + env(safe-area-inset-bottom));
    right: 80px;
  }
}

.mobile .tool-detail-page {
  .actions {
    justify-content: space-around;
  }
}

.desktop .tool-detail-page {
  .info-menu-container {
    display: flex;
    flex-direction: row;
    overflow: hidden;

    .dark-input,
    .popover-container {
      width: 300px !important;
    }

    .dark-input,
    .dropdown-toggle {
      height: 40px !important;
      * {
        font-size: 14px !important;
      }
    }

    .header {
      width: 500px;
      padding: 0px;
      border-radius: 3px 3px 3px 3px;
      margin-left: 28px;
      margin-right: 28px;
      margin-top: 10px;
      padding-bottom: 12px;

      .actions {
        justify-content: center;

        .action-btn {
          margin-left: 10px;
          margin-right: 10px;
        }
      }
    }
    .cards {
      .card {
        width: 500px;
      }
    }

    .add-photo {
      font-size: 19px;

      .fa-camera {
        font-size: 18px !important;
      }
    }
  }
}
</style>
