<template>
  <div class="page new-tool-page">
    <header-card
      title="New Tool"
      exit-link="/tools">
    </header-card>

    <transition name="fade">
      <div
        v-if="isSavingTool"
        class="overlay">
        <div class="half-circle-spinner">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
        </div>
      </div>
    </transition>

    <transition name="card-change">
      <div
        v-if="currentState === 1"
        class="new-tool-input-card">

        <div class="input-group-container">
          <span class="form-label">BRAND</span>
          <v-select
            v-validate:brand="'required|max:40'"
            :options="brandOptions"
            v-model="brand"
            name="brand"
            label="name"
            class="dark-input"
            placeholder="eg. DeWalt">
            <template
              slot="no-options"
              slot-scope="props">
              <button
                class="option-container"
                @click="() => props.select({ name: props.value, type: 'BRAND', isNewConfigurableItem: true })">
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

        <div class="input-group-container">
          <span class="form-label">TYPE</span>
          <v-select
            v-validate:type="'required|max:40'"
            v-model="type"
            :options="typeOptions"
            name="type"
            label="name"
            class="dark-input"
            placeholder="eg. Saw">
            <template
              slot="no-options"
              slot-scope="props">
              <button
                class="no-options-btn"
                @click="() => props.select({ name: props.value, type: 'TYPE', isNewConfigurableItem: true })">
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

        <div class="input-group-container">
          <span class="form-label">MODEL NUMBER</span>
          <input
            v-validate="'required|max:40'"
            v-model="modelNumber"
            name="modelNumber"
            class="light-input"
            placeholder="eg. 18392049437"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false">
          <div class="error-container">
            <span
              v-show="errors.has('modelNumber')"
              class="error">
              {{ errors.first('modelNumber') }}
            </span>
          </div>
        </div>

        <div class="input-group-container">
          <span class="form-label">SERIAL NUMBER</span>
          <input
            v-validate="'required|max:40'"
            v-model="serialNumber"
            name="serialNumber"
            class="light-input"
            placeholder="eg. 0348529873023"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false">
          <div class="error-container">
            <span
              v-show="errors.has('serialNumber')"
              class="error">
              {{ errors.first('serialNumber') }}
            </span>
          </div>
        </div>

        <div class="input-group-container">
          <span class="form-label">MODEL YEAR</span>
          <input
            v-validate="validations.modelYear"
            v-model="modelYear"
            name="modelYear"
            class="light-input"
            placeholder="eg. 2018"
            type="number"
            inputmode="numeric"
            pattern="[0-9]*">
          <div class="error-container">
            <span
              v-show="errors.has('modelYear')"
              class="error">
              {{ errors.first('modelYear') }}
            </span>
          </div>
        </div>
      </div>
    </transition>

    <transition name="card-change">
      <div
        v-if="currentState === 2"
        class="new-tool-input-card">

        <div class="input-group-container">
          <span class="form-label">OWNER</span>
          <v-select
            v-model="owner"
            :options="userOptions"
            label="full_name"
            class="dark-input">
          </v-select>
        </div>

        <div class="input-group-container">
          <span class="form-label">PURCHASED FROM</span>
          <v-select
            v-model="purchasedFrom"
            :options="purchasedFromOptions"
            label="name"
            class="dark-input"
            placeholder="eg. Lowes">
            <template
              slot="no-options"
              slot-scope="props">
              <button
                class="no-options-btn"
                @click="() => props.select({ name: props.value, type: 'PURCHASED_FROM', isNewConfigurableItem: true })">
                Set Purchased From To "{{ props.value }}"
              </button>
            </template>
          </v-select>
        </div>

        <div class="input-group-container">
          <span class="form-label">STATUS</span>
          <v-select
            v-model="status"
            :options="statuses"
            label="name"
            class="dark-input">
          </v-select>
        </div>

        <div class="input-group-container">
          <span class="form-label">PURCHASE DATE</span>
          <v-date-picker
            v-model="purchaseDate"
            :input-props="{ readonly: true }"
            :attributes="[{ popover: { visibility: 'hidden' } }]"
            :max-date="new Date()"
            :popover-visibility="datePickerVisibility"
            popover-direction="top"
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
        </div>

        <div class="input-group-container">
          <span class="form-label">PRICE</span>
          <input
            v-money="moneyInputConfig"
            v-model="price"
            name="price"
            class="light-input">
        </div>
      </div>
    </transition>

    <transition name="card-change">
      <div
        v-if="currentState === 3"
        class="new-tool-input-card photo-input-card">

        <input
          id="file"
          ref="file"
          name="file"
          style="display: none;"
          type="file"
          accept="image/*"
          capture="camera">

        <label
          v-if="!imgSrc"
          for="file"
          class="dark-input add-photo">
          <label
            for="file"
            class="fas fa-camera"></label>
          Add Photo
        </label>

        <div
          v-if="imgSrc"
          class="image-container">
          <img
            :src="imgSrc"
            class="img-preview">
        </div>

        <extended-fab
          v-if="imgSrc"
          :on-click="deletePhoto"
          :outline-display="true"
          class="delete-photo-efab"
          icon-class="fa-times"
          button-text="REMOVE PHOTO">
        </extended-fab>
      </div>
    </transition>

    <transition name="card-change">
      <div
        v-if="currentState === 4"
        class="new-tool-input-card step-4">

        <nfc-encode :tool-id="tool ? tool.id : ''"> </nfc-encode>

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
        <div class="pager-btn-container">
          <fab
            :disabled="currentState === 1"
            :on-click="() => --currentState"
            class="page-back"
            icon-class="fa-arrow-left">
          </fab>
        </div>

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

        <div class="pager-btn-container">
          <fab
            v-if="currentState !== 3"
            :disabled="!!errors.items.length"
            :on-click="advanceStep"
            class="page-forward"
            icon-class="fa-arrow-right">
          </fab>

          <extended-fab
            v-if="currentState === 3"
            :on-click="advanceStep"
            class="page-forward"
            icon-class=""
            button-text="FINISH">
          </extended-fab>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import HeaderCard from '../components/header-card'
import ToolSearchResult from '../components/tool-search-result.vue'
import ExtendedFab from '../components/extended-fab.vue'
import Fab from '../components/fab'
import vSelect from '../components/select'
import gql from 'graphql-tag'
import ConfigurableItems from '../utils/configurable-items'
import Statuses from '../utils/statuses'
import NfcEncode from '../components/nfc-encode'
import swal from 'sweetalert2'
import imageCompression from 'browser-image-compression'

export default {
  name: 'NewTool',

  components: {
    HeaderCard,
    ToolSearchResult,
    ExtendedFab,
    Fab,
    vSelect,
    NfcEncode
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
        id
        type
        name
        sanctioned
      }
    }`
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
      brand: null,
      type: null,
      owner: JSON.parse(window.localStorage.getItem('currentUser')),
      modelNumber: null,
      serialNumber: null,
      modelYear: null,
      purchasedFrom: null,
      price: null,
      photo: null,
      status: statuses[1],
      currentState: 1,
      purchaseDate: null,
      datePickerVisibility: 'hidden',
      getAllConfigurableItem: [],
      getAllUser: [],
      tool: null,
      imgSrc: null,
      isSavingTool: false,
      statuses,
      validations: {
        modelYear: `numeric|date_format:YYYY|date_between:1950,${new Date().getFullYear() + 1}`
      },
      moneyInputConfig: {
        decimal: '.',
        thousands: ',',
        prefix: '$ ',
        suffix: '',
        precision: 2,
        masked: false
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
    showSuccessMsg () {
      swal({
        type: 'success',
        title: 'SUCCESS',
        text: 'Successfully Added Tool',
        timer: 1500,
        showConfirmButton: false
      })
    },
    showErrorMsg () {
      swal({
        type: 'error',
        title: 'SAVE FAILURE',
        text: 'There was an issue saving new tool. Please try again or contact support',
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

    updateImageDisplay () {
      this.imgSrc = window.URL.createObjectURL(this.$refs.file.files[0])
    },

    deletePhoto () {
      this.$refs.file.value = ''
      this.imgSrc = null
      this.$nextTick(() => this.$refs.file.addEventListener('change', () => this.updateImageDisplay()))
    },

    getConfigurableItemsForType (type) {
      return this.getAllConfigurableItem.filter(item => item.type === type && item.sanctioned)
    },

    advanceStep () {
      this.$validator.validate().then(result => {
        if (result) {
          if (this.currentState === 3) {
            this.saveTool()
          } else if (this.currentState === 2) {
            ++this.currentState
            this.$nextTick(() => this.$refs.file.addEventListener('change', () => this.updateImageDisplay()))
          } else {
            ++this.currentState
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
      this.owner = JSON.parse(window.localStorage.getItem('currentUser'))
      this.modelNumber = null
      this.serialNumber = null
      this.modelYear = null
      this.purchasedFrom = null
      this.price = null
      this.photo = null
      this.tool = null
      this.status = this.statuses[0]
      this.purchaseDate = null
      this.imgSrc = null
    },

    transitionToToolInfo (toolId) {
      this.$router.push({ name: 'toolDetail', params: { toolId } })
    },

    transitionToTools () {
      this.$router.push({ path: '/tools' })
    },

    createNewConfigurableItem (configurableItem) {
      return this.$apollo.mutate({
        mutation: gql`mutation newConfigurableItem($newConfigurableItem: NewConfigurableItem!) {
          createConfigurableItem(newConfigurableItem: $newConfigurableItem) {
            id
          }
        }`,
        variables: {
          newConfigurableItem: {
            type: configurableItem.type,
            name: configurableItem.name,
            sanctioned: false
          }
        }
      })
    },

    saveTool () {
      this.isSavingTool = true
      let brandRequest = this.brand && this.brand.isNewConfigurableItem ? this.createNewConfigurableItem(this.brand) : null
      let typeRequest = this.type && this.type.isNewConfigurableItem ? this.createNewConfigurableItem(this.type) : null
      let purchaseRequest = this.purchasedFrom && this.purchasedFrom.isNewConfigurableItem ? this.createNewConfigurableItem(this.purchasedFrom) : null
      let purchaseDate = this.purchaseDate && new Date(this.purchaseDate).toISOString()
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

      Promise.all([brandRequest, typeRequest, purchaseRequest, photoRequest]).then(responses => {
        let [brandResponse, typeResponse, purchaseResponse, photoResponse] = responses

        if (brandResponse) {
          this.brand.id = brandResponse.data.createConfigurableItem.id
        }

        if (typeResponse) {
          this.type.id = typeResponse.data.createConfigurableItem.id
        }

        if (purchaseResponse) {
          this.purchasedFrom.id = purchaseResponse.data.createConfigurableItem.id
        }

        this.$apollo.mutate({
          mutation: gql`mutation newTool($newTool: NewTool!) {
            createTool(newTool: $newTool) {
              id
              type {
                name
              }
              brand {
                name
              }
              status
              owner {
                ... on Location {
                   name
                   type
                }
                ... on User {
                   first_name
                   last_name
                   type
                }
              }
            }
          }`,
          variables: {
            newTool: {
              type_id: this.type.id,
              brand_id: this.brand.id,
              model_number: this.modelNumber,
              serial_number: this.serialNumber,
              purchased_from_id: this.purchasedFrom && this.purchasedFrom.id,
              date_purchased: purchaseDate,
              status: this.status ? this.status.id : Statuses.AVAILABLE,
              owner_id: this.owner ? this.owner.id : JSON.parse(window.localStorage.getItem('currentUser')).id,
              price: this.price ? this.price.slice(2) * 100 : null,
              year: this.modelYear,
              photo: photoResponse
            }
          }
        }).then(response => {
          this.tool = response.data.createTool
          ++this.currentState
          this.showSuccessMsg()
        }).catch(() => {
          this.showErrorMsg()
        })
      }).catch(() => {
        this.showErrorMsg()
      }).finally(() => {
        this.isSavingTool = false
        this.$apollo.queries.getAllConfigurableItem.refetch()
      })
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

  .purchase-date-input {
    padding-left: 10px;
    text-align: left;

    &.placeholder {
      color: $form-placeholder-color;
    }
  }

  .new-tool-input-card {
    display: flex;
    flex: 1 0 434px;
    flex-direction: column;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    margin: 10px 10px 0 10px;
    background-color: white;
    align-items: center;
    justify-content: space-around;
    padding: 0 20px;
    border-radius: 3px;

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

  .add-photo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 250px;

    .fa-camera {
      margin-right: 5px;
    }
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

.desktop {
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
    max-height: 400px;
    margin-top: auto;
    margin-bottom: auto;
    background-color: white;

    * {
      font-size: 16px;
    }

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

    .dark-input, .light-input {
      height: 45px !important;
      margin-left: auto;
      margin-right: auto;
      width: 350px;
    }
  }
}
</style>
