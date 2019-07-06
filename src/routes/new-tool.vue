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
        <nfc-encode :tool-id="newTool.id"/>

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
import { showSuccessMsg, showErrorMsg } from '@/utils/alerts'

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
      query: usersQuery,
      fetchPolicy: 'network-only'
    },

    getAllConfigurableItem: {
      query: configurableItemQuery,
      fetchPolicy: 'network-only'
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
        modelYear: `numeric|date_format:YYYY|date_between:1950,${new Date().getFullYear()},true`
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
          try {
            let response = await this.createNewTool(this.newTool)
            this.newTool = new Tool(response.data.createTool)
            ++this.currentState
            showSuccessMsg()
          } catch {
            showErrorMsg()
          }
          this.isSavingTool = false
          this.$apollo.queries.getAllConfigurableItem.refetch()
        } else {
          ++this.currentState
        }
      }
    },

    addAnother () {
      this.newTool = this.getDefaultTool()
      this.currentState = 1
    },

<<<<<<< HEAD
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
              price: this.price ? (this.price.slice(2) * 100).toFixed(2) : null,
              year: this.modelYear,
              photo: photoResponse
            }
          },
          refetchQueries: [{
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
          }]
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
=======
    getDefaultTool () {
      return new Tool({
        year: '',
        status: Statuses.AVAILABLE,
        model_number: '',
        serial_number: '',
        price: '',
        owner: this.$store.getters['users/currentUser']
>>>>>>> retina-339-refactor
      })
    }
  }
}
</script>

<style lang="scss">

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
    max-height: 500px;
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
