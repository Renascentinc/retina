<template>
  <div>
    <div
      v-if="!editState"
      class="photo-box"
    >
      <img
        :src="imageUrl"
        v-if="imageUrl"
        class="image"
      >
      <i
        v-if="!imageUrl"
        class="fas fa-image no-image"
      />
    </div>

    <div
      v-if="editState"
      class="add-photo-container"
    >
      <input
        ref="file"
        name="file"
        type="file"
        id="file"
        style="display: none;"
        accept="image/*"
        capture="camera"
      >

      <label
        v-if="!image"
        for="file"
        class="dark-input add-photo"
      >
        <label
          for="file"
          class="fas fa-camera"
        >
        </label>
        {{ localImageUrl ? 'UPDATE PHOTO' : 'ADD PHOTO' }}
      </label>

      <div
        v-if="image"
        class="image-container"
      >
        <img
          v-if="localImageUrl"
          :src="localImageUrl"
          class="img-preview"
        >
      </div>

      <extended-fab
        v-if="localImageUrl"
        :on-click="deletePhoto"
        :outline-display="true"
        class="delete-photo-efab"
        icon-class="fa-times"
        button-text="REMOVE PHOTO"
      />
    </div>
  </div>
</template>

<script>
import ExtendedFab from '@/components/basic/extended-fab.vue'

export default {
  name: 'AddPhoto',

  components: {
    ExtendedFab
  },

  props: {
    editState: {
      type: Boolean,
      required: true
    },
    onImageChange: {
      type: Function,
      required: true
    },
    imageUrl: {
      type: String,
      required: false,
      default: ''
    }
  },

  data () {
    return {
      image: null
    }
  },

  computed: {
    localImageUrl () {
      if (!this.image) {
        return null
      }
      return window.URL.createObjectURL(this.image)
    }
  },

  methods: {
    deletePhoto () {
      this.$refs.file.value = ''
      this.updateImage(null)
      this.listenForPhotoCapture()
    },

    updateImage (newImage) {
      this.onImageChange(newImage)
      this.image = newImage
    },

    listenForPhotoCapture () {
      if (this.editState) {
        this.$nextTick(() => this.$refs.file.addEventListener('change', () => this.updateImage(this.$refs.file.files[0])))
      }
    }
  },

  mounted () {
    this.listenForPhotoCapture()
  },

  watch: {
    editState () {
      this.listenForPhotoCapture()
    }
  }
}
</script>

<style lang="scss">
.photo-box {
  width: calc(100% - 23px);
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  padding: 10px;
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
</style>
