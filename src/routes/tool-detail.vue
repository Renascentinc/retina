<template>
  <div class="page tool-detail-page">
    <transition name="fade">
      <div
        v-if="saving"
        class="overlay">
        <div class="half-circle-spinner">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
        </div>
      </div>
    </transition>

    <div class="info-menu-container">
      <div
        class="floating-action-bar">
        <extended-fab
          v-if="$mq === 'desktop'"
          :on-click="transitionToTools"
          :outline-display="true"
          icon-class="fa-arrow-left"
          class="action-btn transfer-btn"
          button-text="BACK">
        </extended-fab>

        <extended-fab
          v-if="canEdit && $mq === 'desktop'"
          :on-click="toggleEditState"
          :disabled="changingStatus"
          :icon-class="editState ? 'fa-save' : 'fa-pen'"
          :button-text="editState ? 'SAVE CHANGES' : 'EDIT TOOL'">
        </extended-fab>

        <extended-fab
          v-if="editState && $mq === 'desktop'"
          :on-click="cancelEdit"
          :disabled="changingStatus"
          icon-class="fa-times"
          button-text="CANCEL">
        </extended-fab>

        <extended-fab
          v-if="$mq === 'desktop' && isTransferable"
          :disabled="editState || changingStatus"
          :on-click="toggleTransferStatus"
          :button-text="isToolSelected ? 'DESELECT' : 'TRANSFER'"
          icon-class="fa-exchange-alt"
          class="action-btn transfer-btn">
        </extended-fab>

        <extended-fab
          v-if="$mq === 'desktop'"
          :disabled="editState || changingStatus"
          :on-click="transitionToHistory"
          :outline-display="false"
          icon-class="fa-book-open"
          button-text="VIEW HISTORY">
        </extended-fab>

        <button-dropdown
          v-if="$mq === 'desktop' && isTransferable"
          :on-click="updateStatus"
          :options="statusOptions"
          button-text="CHANGE STATUS">
        </button-dropdown>
      </div>

      <div class="header-cards-container">
        <div class="header">
          <router-link
            v-if="$mq === 'mobile'"
            class="fas fa-arrow-left backarrow"
            to="/tools">
          </router-link>

          <span class="toolid">#{{ getTool.id }} </span>

          <div
            v-if="!editState"
            class="name">
            {{ brand }} {{ type }}
          </div>

          <div
            v-if="editState"
            class="input-group-container">
            <v-select
              v-validate="'required'"
              :options="brandOptions"
              v-model="newBrand"
              name="brand"
              label="name"
              class="dark-input"
              placeholder="Brand">
              <template
                slot="no-options"
                slot-scope="props">
                <button
                  class="no-options-btn"
                  @click="() => newBrand = { name: props.value, type: 'BRAND', isNewConfigurableItem: true }">
                  Set Brand To "{{ props.value }}"
                </button>
              </template>
            </v-select>
            <div class="error-container">
              <span
                v-show="errors.has('brand')"
                class="error">
                {{ errors.first('brand') }}
              </span>
            </div>
          </div>

          <div
            v-if="editState"
            class="input-group-container">
            <v-select
              v-validate="'required'"
              v-model="newType"
              :options="typeOptions"
              name="type"
              label="name"
              class="dark-input"
              placeholder="Type">
              <template
                slot="no-options"
                slot-scope="props">
                <button
                  class="no-options-btn"
                  @click="() => newType = { name: props.value, type: 'TYPE', isNewConfigurableItem: true }">
                  Set Type To "{{ props.value }}"
                </button>
              </template>
            </v-select>
            <div class="error-container">
              <span
                v-show="errors.has('type')"
                class="error">
                {{ errors.first('type') }}
              </span>
            </div>
          </div>

          <span
            :class="statusClass"
            class="tool-status">
            {{ formattedStatus }}
          </span>

          <div
            v-if="isTransferable"
            class="actions">
            <button-dropdown
              v-if="$mq === 'mobile'"
              :on-click="updateStatus"
              :options="statusOptions"
              button-text="CHANGE STATUS">
            </button-dropdown>

            <button
              v-if="$mq === 'mobile'"
              class="action-btn transfer-btn"
              @click="toggleTransferStatus">
              <i class="fas fa-exchange-alt action-icon"></i>
              <span class="action-title">{{ isToolSelected ? 'DESELECT' : 'TRANSFER' }}</span>
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
                  :class="{ 'fa-user': owner.type === 'USER', 'fa-map-marker-alt': owner.type === 'LOCATION' }"
                  class="fas fa-user">
                </i>
              </div>
              <div class="owner-name">
                <div
                  v-if="owner.type === 'LOCATION'"
                  class="owner-location">
                  {{ owner.name }}
                </div>
                <div
                  v-if="owner.type === 'USER'"
                  class="owner-user">
                  <span> {{ owner.first_name }} </span>
                  <span> {{ owner.last_name }} </span>
                </div>
              </div>
              <div class="contact-buttons">
                <fab
                  :on-click="phoneCall"
                  :disabled="!phoneNumber"
                  class="call-btn"
                  icon-class="fa-phone">
                </fab>

                <div class="spacer"></div>

                <fab
                  :on-click="sendEmail"
                  :disabled="!email"
                  class="email-btn"
                  icon-class="fa-envelope">
                </fab>
              </div>
            </div>
          </div>
          <div
            class="card general-card">
            <div class="card-title">
              General
            </div>
            <div class="card-details general-details">
              <span class="general-label">Retina ID</span>
              <span class="general-data"> {{ getTool.id }} </span>
              <nfc-encode :tool-id="getTool && getTool.id ? getTool.id : ''"> </nfc-encode>

              <span class="general-label">Serial Number</span>
              <span
                v-if="!editState"
                class="general-data"> {{ getTool.serial_number || '-' }} </span>

              <input
                v-validate="'required'"
                v-if="editState"
                v-model="newSerial"
                name="serial"
                class="general-data light-input">
              <div class="error-container">
                <span
                  v-show="errors.has('serial')"
                  class="error">
                  {{ errors.first('serial') }}
                </span>
              </div>

              <span class="general-label">Model Number</span>
              <span
                v-if="!editState"
                class="general-data"> {{ getTool.model_number || '-' }} </span>

              <input
                v-validate="'required'"
                v-if="editState"
                v-model="newModel"
                name="model"
                class="general-data light-input">
              <div class="error-container">
                <span
                  v-show="errors.has('model')"
                  class="error">
                  {{ errors.first('model') }}
                </span>
              </div>

              <span class="general-label">Model Year</span>
              <span
                v-if="!editState"
                class="general-data"> {{ getTool.year || '-' }} </span>

              <input
                v-validate="validations.modelYear"
                v-if="editState"
                v-model="newYear"
                name="year"
                type="number"
                class="general-data light-input">
              <div class="error-container">
                <span
                  v-show="errors.has('year')"
                  class="error">
                  {{ errors.first('year') }}
                </span>
              </div>

              <span class="general-label">Purchased From</span>
              <span
                v-if="!editState"
                class="general-data"> {{ purchasedFrom }} </span>

              <v-select
                v-if="editState"
                v-model="newPurchasedFrom"
                :options="purchasedFromOptions"
                label="name"
                class="general-data dark-input"
                placeholder="Purchased From">
                <template
                  slot="no-options"
                  slot-scope="props">
                  <button
                    class="no-options-btn"
                    @click="() => newPurchasedFrom = { name: props.value, type: 'PURCHASED_FROM', isNewConfigurableItem: true }">
                    Set Type To "{{ props.value }}"
                  </button>
                </template>
              </v-select>

              <span class="general-label">Purchase Date</span>
              <span
                v-if="!editState"
                class="general-data"> {{ formattedDate(getTool.date_purchased) }} </span>

              <v-date-picker
                v-if="editState"
                v-model="newPurchaseDate"
                :input-props="{ readonly: true }"
                :attributes="[{ popover: { visibility: 'hidden' } }]"
                :max-date="new Date()"
                :popover-visibility="datePickerVisibility"
                popover-direction="top"
                class="general-data"
                mode="single"
                @input="toggleDatepicker">
                <button
                  slot-scope="{ inputValue, updateValue }"
                  :class="{ placeholder: !inputValue }"
                  class="dark-input purchase-date-input"
                  @click="toggleDatepicker">
                  {{ inputValue || `eg. ${new Date().toLocaleDateString('en-US')}` }}
                </button>
              </v-date-picker>

              <span class="general-label">Purchase Price</span>
              <span
                v-if="!editState"
                class="general-data"> ${{ formattedPrice }} </span>

              <input
                v-money="moneyInputConfig"
                v-if="editState"
                v-model="newPrice"
                name="newPrice"
                class="light-input"
                placeholder="Price">

              <extended-fab
                v-if="$mq === 'mobile'"
                :on-click="transitionToHistory"
                :outline-display="false"
                icon-class="fa-book-open"
                button-text="VIEW HISTORY">
              </extended-fab>
            </div>
          </div>

          <div
            class="card photo-card">
            <div class="card-title">
              Photo
            </div>
            <div
              v-if="!editState"
              class="photo-box">
              <img
                v-lazy="`${getTool.photo}`"
                v-if="getTool.photo"
                class="image">
              <i
                v-if="!getTool.photo"
                class="fas fa-image no-image">
              </i>
            </div>

            <div
              v-if="editState"
              class="add-photo-container">
              <input
                id="file"
                ref="file"
                name="file"
                style="display: none;"
                type="file"
                accept="image/*"
                capture="camera">

              <label
                v-if="!newImgSrc"
                for="file"
                class="dark-input add-photo">
                <label
                  for="file"
                  class="fas fa-camera"></label>
                {{ getTool.photo ? 'UPDATE PHOTO' : 'Add Photo' }}
              </label>

              <div
                v-if="newImgSrc"
                class="image-container">
                <img
                  v-if="newImgSrc"
                  :src="newImgSrc"
                  class="img-preview">
              </div>

              <extended-fab
                v-if="newImgSrc"
                :on-click="deletePhoto"
                :outline-display="true"
                class="delete-photo-efab"
                icon-class="fa-times"
                button-text="REMOVE PHOTO">
              </extended-fab>
            </div>
          </div>
        </div>
      </div>
    </div>

    <fab
      v-if="editState && $mq === 'mobile'"
      :on-click="cancelEdit"
      icon-class="fa-times"
      class="cancel">
    </fab>

    <fab
      v-if="canEdit && $mq === 'mobile'"
      :on-click="toggleEditState"
      :icon-class="editState ? 'fa-save' : 'fa-pen'"
      class="edit">
    </fab>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Avatar from 'vue-avatar'
import Fab from '../components/fab.vue'
import ExtendedFab from '../components/extended-fab.vue'
import vSelect from '../components/select'
import ConfigurableItems from '../utils/configurable-items.js'
import ButtonDropdown from '../components/button-dropdown.vue'
import NfcEncode from '../components/nfc-encode'
import swal from 'sweetalert2'
import nfcMixin from '../mixins/nfc'
import Platforms from '../utils/platforms'
import imageCompression from 'browser-image-compression'

export default {
  name: 'ToolDetail',

  components: {
    Avatar,
    Fab,
    ExtendedFab,
    ButtonDropdown,
    vSelect,
    NfcEncode
  },

  mixins: [ nfcMixin ],

  apollo: {
    getAllConfigurableItem: {
      query: gql`
        query {
          getAllConfigurableItem {
            id
            type
            name
            sanctioned
          }
        }
      `
    },

    getTool: {
      query: gql`
        query tool($tool_id: ID!) {
          getTool(tool_id: $tool_id) {
            id
            brand {
              id
              name
            }
            type {
              id
              name
            }
            year
            status
            model_number
            serial_number
            purchased_from {
              id
              name
            }
            date_purchased
            price
            photo

            owner {
              ... on Location {
                id
                name
                type
              }
              ... on User {
                id
                first_name
                last_name
                email
                phone_number
                type
              }
            }
          }
        }
      `,
      variables () {
        let options = {}
        options.tool_id = this.$router.currentRoute.params.toolId
        return options
      },
      result (apiResult) {
        if (!apiResult.data.getTool) {
          this.showInvalidIDMsg()
          this.$router.push({ path: '/tools' })
        }
      }
    }
  },

  data () {
    return {
      newImgSrc: null,
      reason: null,
      changingStatus: false,
      getTool: {},
      editState: false,
      newBrand: null,
      newType: null,
      newSerial: null,
      newModel: null,
      newYear: null,
      newPurchasedFrom: null,
      newPurchaseDate: null,
      newPrice: null,
      oosStatus: null,
      saving: false,
      datePickerVisibility: 'hidden',
      validations: {
        modelYear: `date_format:YYYY|date_between:1950,${new Date().getFullYear() + 1}`
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

    statusClass () {
      return (
        this.getTool.status &&
        this.getTool.status
          .split('_')
          .join('-')
          .toLowerCase()
      )
    },

    isToolSelected () {
      return !!this.$store.state.selectedToolsMap[this.getTool.id]
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

    owner () {
      return this.getTool.owner || {}
    },

    brand () {
      let brand = this.getTool.brand
      return brand && brand.name
    },

    type () {
      let type = this.getTool.type
      return type && type.name
    },

    purchasedFrom () {
      let purchasedFrom = this.getTool.purchased_from
      return purchasedFrom ? purchasedFrom.name : '-'
    },

    formattedStatus () {
      let status = this.getTool.status
      return status && status.replace(/_/g, ' ').toUpperCase()
    },

    formattedPrice () {
      let priceString = this.getTool.price
      return priceString ? `${priceString / 100}` : ' -'
    },

    isTransferable () {
      let currentUser = JSON.parse(window.localStorage.getItem('currentUser'))
      return (
        currentUser.role === 'ADMINISTRATOR' ||
        (this.owner.type === 'LOCATION' && this.status === 'AVAILABLE') ||
        (this.owner.type === 'USER' && currentUser.id === this.owner.id)
      )
    },

    phoneNumber () {
      if (this.owner.type === 'USER') {
        return this.owner.phone_number
      } else if (this.owner.type === 'LOCATION') {
        return this.owner.phone_number
      }
    },

    email () {
      if (this.owner.type === 'USER') {
        return this.owner.email
      } else if (this.owner.type === 'LOCATION') {
        return this.owner.email
      }
    }
  },

  mounted () {
    if (this.checkIsNfcEnabled() && window.device.platform === Platforms.ANDROID) {
      // add a noop nfc listener to keep nfc scans on android from bubbling up to the OS
      window.nfc.addNdefListener(() => 0)
    }
  },

  methods: {
    showInvalidIDMsg () {
      swal({
        type: 'error',
        title: 'ERROR',
        text: 'Invalid Tool ID',
        timer: 2000,
        showConfirmButton: false
      })
    },

    showSuccessMsg () {
      swal({
        type: 'success',
        title: 'TOOL DECOMISSIONED',
        text: 'Successfully Decomissioned Tool',
        timer: 1500,
        showConfirmButton: false
      })
    },

    showDecomissionErrorMsg () {
      swal({
        type: 'error',
        title: 'ERROR',
        text: 'An Error Occurred Trying to Decomission Tool. Please Try Again or Contact Support',
        timer: 2000,
        showConfirmButton: false
      })
    },

    showSaveErrorMsg () {
      swal({
        type: 'error',
        title: 'ERROR',
        text: 'An Error Occurred Trying to Save Tool. Please Try Again or Contact Support',
        timer: 2000,
        showConfirmButton: false
      })
    },

    toggleDatepicker () {
      if (this.datePickerVisibility === 'visible') {
        this.datePickerVisibility = 'hidden'
      } else {
        this.datePickerVisibility = 'visible'
      }
    },

    deletePhoto () {
      this.$refs.file.value = ''
      this.newImgSrc = null
      this.$nextTick(() => this.$refs.file.addEventListener('change', () => this.updateImageDisplay()))
    },

    toggleChangingStatus () {
      this.changingStatus = !this.changingStatus
    },

    transitionToHistory () {
      this.$router.push({ name: 'historyDetail', params: { toolId: this.getTool.id } })
    },

    transitionToTools () {
      this.$router.push({ name: 'tools' })
    },

    formattedDate (date) {
      let datePurchased = date
      return datePurchased ? new Date(datePurchased).toLocaleDateString('en-US') : '-'
    },

    getConfigurableItemsForType (type) {
      return this.getAllConfigurableItem.filter(
        item => item.type === type && item.sanctioned
      )
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
        this.newBrand = this.getTool.brand
        this.newType = this.getTool.type
        this.newSerial = this.getTool.serial_number
        this.newModel = this.getTool.model_number
        this.newYear = this.getTool.year
        this.newPurchasedFrom = this.getTool.purchased_from
        this.newPurchaseDate = this.getTool.date_purchased && new Date(this.getTool.date_purchased)
        this.newPrice = this.getTool.price ? this.getTool.price : null
        this.editState = true
        this.$nextTick(() => this.$refs.file.addEventListener('change', () => this.updateImageDisplay()))
      }
    },

    createNewConfigurableItem (configurableItem) {
      return this.$apollo.mutate({
        mutation: gql`
          mutation newConfigurableItem(
            $newConfigurableItem: NewConfigurableItem!
          ) {
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

    updateImageDisplay () {
      this.newImgSrc = window.URL.createObjectURL(this.$refs.file.files[0])
    },

    saveTool () {
      this.saving = true
      let brandRequest =
        this.newBrand && this.newBrand.isNewConfigurableItem
          ? this.createNewConfigurableItem(this.newBrand)
          : null
      let typeRequest =
        this.newType && this.newType.isNewConfigurableItem
          ? this.createNewConfigurableItem(this.newType)
          : null
      let purchaseRequest =
        this.newPurchasedFrom && this.newPurchasedFrom.isNewConfigurableItem
          ? this.createNewConfigurableItem(this.newPurchasedFrom)
          : null
      let photoRequest = new Promise((resolve) => {
        let file = this.$refs.file.files[0]

        if (file) {
          imageCompression(file, 1, 1920).then(compressedImage => {
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
            this.newBrand.id = brandResponse.data.createConfigurableItem.id
          }

          if (typeResponse) {
            this.newType.id = typeResponse.data.createConfigurableItem.id
          }

          if (purchaseResponse) {
            this.newPurchasedFrom.id = purchaseResponse.data.createConfigurableItem.id
          }

          let photo = this.getTool.photo
          if (photoResponse) {
            photo = photoResponse
            this.newImgSrc = null
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
                tool: {
                  id: this.getTool.id,
                  type_id: this.newType.id,
                  brand_id: this.newBrand.id,
                  model_number: this.newModel,
                  serial_number: this.newSerial,
                  status: this.getTool.status,
                  owner_id: this.getTool.owner.id,
                  purchased_from_id: this.newPurchasedFrom && this.newPurchasedFrom.id,
                  date_purchased: this.newPurchaseDate ? new Date(this.newPurchaseDate).toISOString() : null,
                  price: this.newPrice ? (this.newPrice.slice(2) * 100).toPrecision(2) : null,
                  year: this.newYear ? this.newYear : null,
                  photo
                }
              }
            })
            .then(result => {
              this.$apollo.queries.getTool.refetch()
              this.$apollo.queries.getAllConfigurableItem.refetch()
              this.editState = false
            })
        }
      ).catch(() => {
        this.showSaveErrorMsg()
      }).finally(() => {
        this.saving = false
      })
    },

    toggleTransferStatus () {
      this.$store.commit('toggleToolSelection', this.getTool.id)
      if (this.$store.state.transferState === 'INITIAL') {
        this.$store.commit('updateTransferStatus', 'SELECTING')
      }
      this.$router.push({ path: '/tools' })
    },

    phoneCall () {
      window.location.href = `tel:${this.owner.phone_number}`
    },

    sendEmail () {
      window.location = `mailto:${this.owner.email}`
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
          inputValidator: (value) => {
            return !value && `Decomission Reason is Required`
          }
        }).then(result => {
          newStatus = newStatus.replace(/ /g, '_').toUpperCase()

          if (result.value) {
            this.$apollo.mutate({
              mutation: gql`mutation decomission($tool_id: ID!, $decomissioned_status: DecomissionedToolStatus!, $decomission_reason: String!) {
                decomissionTool(tool_id: $tool_id, decomissioned_status: $decomissioned_status, decomission_reason: $decomission_reason) {
                  id
                }
              }`,
              variables: {
                tool_id: this.getTool.id,
                decomissioned_status: newStatus,
                decomission_reason: result.value
              },
              refetchQueries: [
                {
                  query: gql`query tools($pagingParameters: PagingParameters) {
                    searchTool(pagingParameters: $pagingParameters) {
                      id
                      type {
                        id
                        name
                      }
                      brand {
                        id
                        name
                      }
                      status
                      owner {
                        ... on Location {
                           id
                           name
                           type
                        }
                        ... on User {
                           id
                           first_name
                           last_name
                           type
                        }
                      }
                    }
                  }`,

                  variables: {
                    pagingParameters: {
                      page_size: 15,
                      page_number: 0
                    }
                  }
                }
              ]
            }).then(() => {
              this.$apollo.provider.clients.defaultClient.writeFragment({
                id: `${this.getTool.id}Tool`,
                fragment: gql`
                 fragment patchToolStatus on Tool {
                   status
                   __typename
                 }
                `,
                data: {
                  status: newStatus,
                  __typename: 'Tool'
                }
              })
              this.$store.commit('setToolSelection', this.getTool.id, false)
              this.showSuccessMsg()
              this.$router.push({ path: '/tools' })
            }).catch(() => {
              this.showDecomissionErrorMsg()
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
      let currentStatus = this.getTool.status
      this.getTool.status = newStatus

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
            tool: {
              id: this.getTool.id,
              type_id: this.getTool.type.id,
              brand_id: this.getTool.brand.id,
              model_number: this.getTool.model_number,
              serial_number: this.getTool.serial_number,
              status: newStatus,
              purchased_from_id: this.getTool.purchased_from && this.getTool.purchased_from.id,
              date_purchased: this.getTool.date_purchased,
              owner_id: this.owner.id,
              photo: this.getTool.photo,
              price: this.getTool.price,
              year: this.getTool.year
            }
          }
        })
        .then(status => {
          this.getTool.status = status.data.updateTool.status
          this.$apollo.provider.clients.defaultClient.writeFragment({
            id: `${this.getTool.id}Tool`,
            fragment: gql`
             fragment patchToolStatus on Tool {
               status
               __typename
             }
            `,
            data: {
              status: this.getTool.status,
              __typename: 'Tool'
            }
          })
        })
        .catch(() => {
          this.getTool.status = currentStatus
          this.showSaveErrorMsg()
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

      .purchase-date-input {
        padding-left: 10px;
        text-align: left;

        &.placeholder {
          color: $form-placeholder-color;
        }
      }

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

      .photo-box {
        width: calc(100% - 23px);
        margin-left: auto;
        margin-right: auto;
        margin-top: 10px;
        overflow: hidden;

        .image {
          height: 100%;
          width: 100%;
          border-radius: 2px;
        }

        .no-image {
          color: $background-dark-gray;
          font-size: 60px;
          width: 100%;
          text-align: center;
          margin-top: 20px;
          margin-bottom: 20px;
        }
      }

      .add-photo-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 275px;
        padding: 0 20px;

        .img-preview {
          max-height: 175px;
          max-width: 100%;
        }

        .add-photo {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100px;

          .fa-camera {
            margin-right: 5px;
          }
        }

        .delete-photo-efab {
          border-color: transparent;
          box-shadow: none;
          font-size: 15px;
        }

        .image-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 175px;
          width: 100%;
        }
      }
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

          .owner-user {
            display: flex;
            flex-direction: column;
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
    // TODO: upgrade parcel version (when it become available) so we can uncomment this
    // handle iPhone X style screens
    bottom: calc(70px + constant(safe-area-inset-bottom));
    bottom: calc(70px + env(safe-area-inset-bottom));
    right: 20px;
  }

  .cancel {
    position: absolute;
    bottom: 70px;
    // TODO: upgrade parcel version (when it become available) so we can uncomment this
    // handle iPhone X style screens
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

    .floating-action-bar {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      max-width: 300px;
      flex: 1 1;
      padding-top: 80px;
      overflow-y: auto;

      .container,
      .extended-fab {
        margin-left: 10px;
        margin-top: 20px;
      }
    }

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
