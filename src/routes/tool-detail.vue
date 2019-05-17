<template>
  <div class="page tool-detail-page">
    <transition name="fade">
      <div
        v-if="saving"
        class="overlay"
      >
        <div class="half-circle-spinner">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
        </div>
      </div>
    </transition>

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
        >
        </extended-fab>

        <extended-fab
          v-if="canEdit"
          :on-click="toggleEditState"
          :icon-class="editState ? 'fa-save' : 'fa-pen'"
          :button-text="editState ? 'SAVE CHANGES' : 'EDIT TOOL'"
        >
        </extended-fab>

        <extended-fab
          v-if="editState"
          :on-click="cancelEdit"
          icon-class="fa-times"
          button-text="CANCEL"
        >
        </extended-fab>

        <extended-fab
          v-if="isTransferable"
          :disabled="editState"
          :on-click="toggleTransferStatus"
          :button-text="isToolSelected ? 'DESELECT' : 'TRANSFER'"
          icon-class="fa-exchange-alt"
          class="action-btn transfer-btn"
        >
        </extended-fab>

        <extended-fab
          :disabled="editState"
          :on-click="transitionToHistory"
          :outline-display="false"
          icon-class="fa-book-open"
          button-text="VIEW HISTORY"
        >
        </extended-fab>

        <button-dropdown
          v-if="isTransferable"
          :on-click="updateStatus"
          :options="statusOptions"
          button-text="CHANGE STATUS"
        >
        </button-dropdown>
      </div>

      <div class="header-cards-container">
        <div class="header">
          <router-link
            v-if="$mq === 'mobile'"
            class="fas fa-arrow-left backarrow"
            to="/tools"
          >
          </router-link>

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
            <button-dropdown
              :on-click="updateStatus"
              :options="statusOptions"
              button-text="CHANGE STATUS"
            >
            </button-dropdown>

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
                  class="fas fa-user"
                >
                </i>
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
                >
                </fab>

                <div class="spacer"></div>

                <fab
                  v-if="tool.owner.isUser"
                  :on-click="tool.owner.startEmail"
                  :disabled="!tool.owner.email"
                  class="email-btn"
                  icon-class="fa-envelope"
                >
                </fab>
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
              <nfc-encode :tool-id="tool.id">
              </nfc-encode>

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
              >
              </date-picker>

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
              >
              </extended-fab>
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
            >
            </add-photo>
          </div>
        </div>
      </div>
    </div>

    <fab
      v-if="editState && $mq === 'mobile'"
      :on-click="cancelEdit"
      icon-class="fa-times"
      class="cancel"
    >
    </fab>

    <fab
      v-if="canEdit && $mq === 'mobile'"
      :on-click="toggleEditState"
      :icon-class="editState ? 'fa-save' : 'fa-pen'"
      class="edit"
    >
    </fab>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { configurableItemQuery, toolQuery } from '../utils/gql'
import Fab from '../components/fab.vue'
import ExtendedFab from '../components/extended-fab'
import DatePicker from '../components/date-picker'
import vSelect from '../components/select'
import ConfigurableItems from '../utils/configurable-items.js'
import ButtonDropdown from '../components/button-dropdown.vue'
import NfcEncode from '../components/nfc-encode'
import AddPhoto from '../components/add-photo'
import swal from 'sweetalert2'
import nfcMixin from '../mixins/nfc'
import Platforms from '../utils/platforms'
import imageCompression from 'browser-image-compression'
import Tool from '../models/tool'
import { showInvalidIDMsg, showSuccessMsg, showErrorMsg } from '../utils/swal'

export default {
  name: 'ToolDetail',

  components: {
    Fab,
    ExtendedFab,
    ButtonDropdown,
    vSelect,
    NfcEncode,
    AddPhoto,
    DatePicker
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
      reason: null,
      editState: false,
      image: null,
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
    statusOptions () {
      let statusOptions = ['AVAILABLE', 'IN USE', 'MAINTENANCE']

      if (this.canEdit) {
        statusOptions = statusOptions.concat(['LOST OR STOLEN', 'BEYOND REPAIR'])
      }

      return statusOptions
    },

    isToolSelected () {
      return !!this.$store.state.selectedToolsMap[this.tool.id]
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
      let currentUser = JSON.parse(window.localStorage.getItem('currentUser'))
      return currentUser.role === 'ADMINISTRATOR'
    },

    isTransferable () {
      let currentUser = JSON.parse(window.localStorage.getItem('currentUser'))
      return (
        currentUser.role === 'ADMINISTRATOR' ||
        (this.tool.owner.isLocation && this.tool.status === 'AVAILABLE') ||
        (this.tool.owner.isUser && currentUser.id === this.tool.owner.id)
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
    transitionToHistory () {
      this.$router.push({ name: 'historyDetail', params: { toolId: this.tool.id } })
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

    toggleEditState () {
      if (this.editState) {
        this.$validator.validate().then(result => {
          if (result) {
            this.saveTool()
          }
        })
      } else {
        this.editedTool = new Tool(this.tool)
        this.editState = true
      }
    },

    createNewConfigurableItem (configurableItem) {
      return this.$apollo.mutate({
        mutation: gql`
          mutation newConfigurableItem($newConfigurableItem: NewConfigurableItem!) {
            createConfigurableItem(newConfigurableItem: $newConfigurableItem) {
              id
            }
          }
        `,
        variables: {
          newConfigurableItem: {
            type: configurableItem.type,
            name: configurableItem.name,
            sanctioned: true
          }
        }
      })
    },

    onImageChange (newImage) {
      this.image = newImage
    },

    onDateChange (newDate) {
      this.editedTool.jsDate = newDate
    },

    saveTool () {
      this.saving = true
      let brandRequest =
        this.editedTool.brand.isNewConfigurableItem
          ? this.createNewConfigurableItem(this.editedTool.brand)
          : null
      let typeRequest =
        this.editedTool.type.isNewConfigurableItem
          ? this.createNewConfigurableItem(this.editedTool.type)
          : null
      let purchaseRequest =
        this.editedTool.purchased_from.isNewConfigurableItem
          ? this.createNewConfigurableItem(this.editedTool.purchased_from)
          : null
      let photoRequest = new Promise((resolve) => {
        if (this.image) {
          imageCompression(this.image, 1, 1920).then(compressedImage => {
            let fd = new FormData()

            let key = `tool_preview-${new Date().getTime()}`

            fd.append('key', key)
            fd.append('acl', 'public-read')
            fd.append('Content-Type', compressedImage.type)
            // TODO enable auth for photo upload
            // fd.append('AWSAccessKeyId', 'YOUR ACCESS KEY')
            // fd.append('policy', 'YOUR POLICY')
            // fd.append('signature', 'YOUR SIGNATURE')

            fd.append('file', compressedImage)

            var xhr = new XMLHttpRequest()

            xhr.open('POST', 'https://retina-images.s3.amazonaws.com/', true)

            xhr.onload = () => {
              resolve(`https://s3.us-east-2.amazonaws.com/retina-images/${key}`)
            }

            xhr.send(fd)
          })
        } else {
          resolve(null)
        }
      })

      Promise.all([brandRequest, typeRequest, purchaseRequest, photoRequest]).then(
        responses => {
          let [brandResponse, typeResponse, purchaseResponse, photoResponse] = responses

          if (brandResponse) {
            this.editedTool.brand.id = brandResponse.data.createConfigurableItem.id
          }

          if (typeResponse) {
            this.editedTool.type.id = typeResponse.data.createConfigurableItem.id
          }

          if (purchaseResponse) {
            this.editedTool.purchased_from.id = purchaseResponse.data.createConfigurableItem.id
          }

          if (photoResponse) {
            this.editedTool.photo = photoResponse
          }

          this.$apollo
            .mutate({
              mutation: gql`
                mutation updateTool($tool: UpdatedTool!) {
                  updateTool(updatedTool: $tool) {
                    id
                  }
                }
              `,

              variables: {
                tool: this.editedTool.getState()
              }
            })
            .then(() => {
              this.tool.update(this.editedTool)
              this.$apollo.queries.getAllConfigurableItem.refetch()
              this.editState = false
            })
        }
      ).catch(() => {
        showErrorMsg()
      }).finally(() => {
        this.saving = false
      })
    },

    toggleTransferStatus () {
      this.$store.commit('toggleToolSelection', this.tool.id)
      if (this.$store.state.transferState === 'INITIAL') {
        this.$store.commit('updateTransferStatus', 'SELECTING')
      }
      this.$router.push({ path: '/tools' })
    },

    updateStatus (newStatus) {
      if (newStatus === 'LOST OR STOLEN' || newStatus === 'BEYOND REPAIR') {
        swal({
          type: 'warning',
          title: 'CONFIRM DECOMISSION',
          text: `Are you sure you want to mark this tool as ${newStatus}? This action cannot be undone.`,
          input: 'textarea',
          inputPlaceholder: `Please Explain Why This Tool is Being Marked as ${newStatus}`,
          reverseButtons: true,
          showCancelButton: true,
          cancelButtonText: 'CANCEL',
          confirmButtonText: 'SUBMIT',
          confirmButtonColor: '#404040',
          inputValidator: (value) => !value && 'Decomission Reason is Required'
        }).then(result => {
          newStatus = newStatus.replace(/ /g, '_').toUpperCase()

          if (result.value) {
            this.$apollo.mutate({
              mutation: gql`mutation ($tool_id: ID!, $decomissioned_status: DecomissionedToolStatus!, $decomission_reason: String!) {
                decomissionTool(tool_id: $tool_id, decomissioned_status: $decomissioned_status, decomission_reason: $decomission_reason) {
                  id
                }
              }`,
              variables: {
                tool_id: this.tool.id,
                decomissioned_status: newStatus,
                decomission_reason: result.value
              }
            }).then(() => {
              this.$store.commit('setToolSelection', this.tool.id, false)
              showSuccessMsg()
              this.$router.push({ path: '/tools' })
            }).catch(() => {
              showErrorMsg()
            })
          }
        })
      } else {
        newStatus = newStatus.replace(/ /g, '_').toUpperCase()
        this.saveStatusChange(newStatus)
      }
    },

    saveStatusChange (newStatus) {
      // save current status in case request fails but set the tool status assuming it will succeed
      let currentStatus = this.tool.status
      this.tool.status = newStatus

      this.$apollo
        .mutate({
          mutation: gql`
            mutation update($tool: UpdatedTool!) {
              updateTool(updatedTool: $tool) {
                status
              }
            }
          `,
          variables: {
            tool: this.tool.getState()
          }
        })
        .catch(() => {
          this.tool.status = currentStatus
          showErrorMsg()
        })
    }
  }
}
</script>

<style lang="scss">
@import "../styles/variables";

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
