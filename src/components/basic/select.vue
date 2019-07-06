<template>
  <div
    :dir="dir"
    :class="dropdownClasses"
    class="dropdown v-select"
  >
    <div
      ref="toggle"
      class="dropdown-toggle"
      @click="toggleDropdown"
    >
      <div
        ref="selectedOptions"
        class="vs__selected-options"
      >
        <slot
          v-for="option in valueAsArray"
          :option="(typeof option === 'object')?option:{[label]: option}"
          :deselect="deselect"
          :multiple="multiple"
          :disabled="disabled"
          name="selected-option-container"
        >
          <span
            :key="option.index"
            class="selected-tag"
          >
            <slot
              v-bind="(typeof option === 'object') ? option:{ [label]: option }"
              name="selected-option"
            >
              {{ getOptionLabel(option) }}
            </slot>
            <button
              v-if="multiple"
              :disabled="disabled"
              type="button"
              class="close"
              aria-label="Remove option"
              @click="deselect(option)"
            >
              <span aria-hidden="true">
                &times;
              </span>
            </button>
          </span>
        </slot>

        <input
          ref="search"
          :id="inputId"
          v-model="search"
          :disabled="disabled"
          :placeholder="searchPlaceholder"
          :tabindex="tabindex"
          :readonly="!searchable"
          :aria-expanded="dropdownOpen"
          type="search"
          class="form-control"
          autocomplete="custom-info"
          role="combobox"
          aria-label="Search for option"
          @keydown.delete="maybeDeleteValue"
          @keyup.esc="onEscape"
          @keydown.tab="onTab"
          @blur="onSearchBlur"
          @focus="onSearchFocus"
        >
      </div>
      <div class="vs__actions">
        <button
          v-show="showClearButton"
          :disabled="disabled"
          type="button"
          class="clear"
          title="Clear selection"
          @click="clearSelection"
        >
          <span aria-hidden="true">
            &times;
          </span>
        </button>

        <i
          v-if="!noDrop"
          ref="openIndicator"
          role="presentation"
          class="open-indicator"
        ></i>

        <slot name="spinner">
          <div
            v-show="mutableLoading"
            class="spinner"
          >
            Loading...
          </div>
        </slot>
      </div>
    </div>

    <transition :name="transition">
      <ul
        v-if="dropdownOpen"
        ref="dropdownMenu"
        :style="{ 'max-height': maxHeight }"
        class="dropdown-menu"
        role="listbox"
        @mousedown="onMousedown"
      >
        <li
          v-for="(option, idx) in filteredOptions"
          :key="idx"
          :class="{ active: isOptionSelected(option) }"
          role="option"
        >
          <button
            class="option-container"
            @click="select(option)"
          >
            <slot
              v-bind="(typeof option === 'object') ? option : { [label] : option }"
              name="option"
            >
              {{ getOptionLabel(option) }}
            </slot>
          </button>
        </li>
        <li
          v-if="!filteredOptions.length"
          class="no-options"
          role="option"
        >
          <slot
            v-bind="{ value: search, select }"
            name="no-options"
          >
            Sorry, no matching options.
          </slot>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    /**
       * Contains the currently selected value. Very similar to a
       * `value` attribute on an <input>. You can listen for changes
       * using 'change' event using v-on
       * @type {Object||String||null}
       */
    value: {
      type: Object,
      default: null
    },

    /**
       * An array of strings or objects to be used as dropdown choices.
       * If you are using an array of objects, vue-select will look for
       * a `label` key (eg. [{label: 'This is Foo', value: 'foo'}]). A
       * custom label key can be set with the `label` prop.
       * @type {Array}
       */
    options: {
      type: Array,
      default () {
        return []
      }
    },

    /**
       * Disable the entire component.
       * @type {Boolean}
       */
    disabled: {
      type: Boolean,
      default: false
    },

    /**
       * Can the user clear the selected property.
       * @type {Boolean}
       */
    clearable: {
      type: Boolean,
      default: true
    },

    /**
       * Sets the max-height property on the dropdown list.
       * @deprecated
       * @type {String}
       */
    maxHeight: {
      type: String,
      default: '400px'
    },

    /**
       * Enable/disable filtering the options.
       * @type {Boolean}
       */
    searchable: {
      type: Boolean,
      default: true
    },

    /**
       * Equivalent to the `multiple` attribute on a `<select>` input.
       * @type {Boolean}
       */
    multiple: {
      type: Boolean,
      default: false
    },

    /**
       * Equivalent to the `placeholder` attribute on an `<input>`.
       * @type {String}
       */
    placeholder: {
      type: String,
      default: ''
    },

    /**
       * Sets a Vue transition property on the `.dropdown-menu`. vue-select
       * does not include CSS for transitions, you'll need to add them yourself.
       * @type {String}
       */
    transition: {
      type: String,
      default: 'fade'
    },

    /**
       * Enables/disables clearing the search text when an option is selected.
       * @type {Boolean}
       */
    clearSearchOnSelect: {
      type: Boolean,
      default: true
    },

    /**
       * Close a dropdown when an option is chosen. Set to false to keep the dropdown
       * open (useful when combined with multi-select, for example)
       * @type {Boolean}
       */
    closeOnSelect: {
      type: Boolean,
      default: true
    },

    /**
       * Tells vue-select what key to use when generating option
       * labels when each `option` is an object.
       * @type {String}
       */
    label: {
      type: String,
      default: 'label'
    },

    /**
       * Tells vue-select what key to use when generating option
       * values when each `option` is an object.
       * @type {String}
       */
    index: {
      type: String,
      default: null
    },

    /**
       * Callback to generate the label text. If {option}
       * is an object, returns option[this.label] by default.
       *
       * Label text is used for filtering comparison and
       * displaying. If you only need to adjust the
       * display, you should use the `option` and
       * `selected-option` slots.
       *
       * @type {Function}
       * @param  {Object || String} option
       * @return {String}
       */
    getOptionLabel: {
      type: Function,
      default (option) {
        if (this.index) {
          option = this.findOptionByIndexValue(option)
        }

        if (typeof option === 'object') {
          // if (!option.hasOwnProperty(this.label)) {
          //   return
          // }
          return option[this.label]
        }
        return option
      }
    },

    /**
       * An optional callback function that is called each time the selected
       * value(s) change. When integrating with Vuex, use this callback to trigger
       * an action, rather than using :value.sync to retreive the selected value.
       * @type {Function}
       * @param {Object || String} val
       */
    onChange: {
      type: Function,
      default: function (val) {
        this.$emit('input', val)
      }
    },

    /**
       * Select the current value if selectOnTab is enabled
       */
    onTab: {
      type: Function,
      default: function () {
        if (this.selectOnTab) {
          this.typeAheadSelect()
        }
      }
    },

    /**
       * Enable/disable creating options from searchInput.
       * @type {Boolean}
       */
    taggable: {
      type: Boolean,
      default: false
    },

    /**
       * Set the tabindex for the input field.
       * @type {Number}
       */
    tabindex: {
      type: Number,
      default: null
    },

    /**
       * When true, newly created tags will be added to
       * the options list.
       * @type {Boolean}
       */
    pushTags: {
      type: Boolean,
      default: false
    },

    /**
       * When true, existing options will be filtered
       * by the search text. Should not be used in conjunction
       * with taggable.
       * @type {Boolean}
       */
    filterable: {
      type: Boolean,
      default: true
    },

    /**
       * Callback to determine if the provided option should
       * match the current search text. Used to determine
       * if the option should be displayed.
       * @type   {Function}
       * @param  {Object || String} option
       * @param  {String} label
       * @param  {String} search
       * @return {Boolean}
       */
    filterBy: {
      type: Function,
      default (option, label, search) {
        return (label || '').toLowerCase().indexOf(search.toLowerCase()) > -1
      }
    },

    /**
       * Callback to filter results when search text
       * is provided. Default implementation loops
       * each option, and returns the result of
       * this.filterBy.
       * @type   {Function}
       * @param  {Array} list of options
       * @param  {String} search text
       * @param  {Object} vSelect instance
       * @return {Boolean}
       */
    filter: {
      'type': Function,
      default (options, search) {
        return options.filter((option) => {
          let label = this.getOptionLabel(option)
          if (typeof label === 'number') {
            label = label.toString()
          }
          return this.filterBy(option, label, search)
        })
      }
    },

    /**
       * User defined function for adding Options
       * @type {Function}
       */
    createOption: {
      type: Function,
      default (newOption) {
        if (typeof this.mutableOptions[0] === 'object') {
          newOption = { [this.label]: newOption }
        }
        this.$emit('option:created', newOption)
        return newOption
      }
    },

    /**
       * When false, updating the options will not reset the select value
       * @type {Boolean}
       */
    resetOnOptionsChange: {
      type: Boolean,
      default: false
    },

    /**
       * Disable the dropdown entirely.
       * @type {Boolean}
       */
    noDrop: {
      type: Boolean,
      default: false
    },

    /**
       * Sets the id of the input element.
       * @type {String}
       * @default {null}
       */
    inputId: {
      type: String,
      default: 'search-input'
    },

    /**
       * Sets RTL support. Accepts 'ltr', 'rtl', 'auto'.
       * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir
       * @type {String}
       * @default 'auto'
       */
    dir: {
      type: String,
      default: 'auto'
    },
    /**
       * When true, hitting the 'tab' key will select the current select value
       * @type {Boolean}
       */
    selectOnTab: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      search: '',
      open: false,
      mutableValue: null,
      mutableOptions: []
    }
  },

  computed: {

    /**
       * Classes to be output on .dropdown
       * @return {Object}
       */
    dropdownClasses () {
      return {
        open: this.dropdownOpen,
        single: !this.multiple,
        searching: this.searching,
        searchable: this.searchable,
        unsearchable: !this.searchable,
        loading: this.mutableLoading,
        rtl: this.dir === 'rtl', // This can be removed - styling is handled by `dir="rtl"` attribute
        disabled: this.disabled
      }
    },

    /**
       * If search text should clear on blur
       * @return {Boolean} True when single and clearSearchOnSelect
       */
    clearSearchOnBlur () {
      return this.clearSearchOnSelect && !this.multiple
    },

    /**
       * Return the current state of the
       * search input
       * @return {Boolean} True if non empty value
       */
    searching () {
      return !!this.search
    },

    /**
       * Return the current state of the
       * dropdown menu.
       * @return {Boolean} True if open
       */
    dropdownOpen () {
      return this.noDrop ? false : this.open && !this.mutableLoading
    },

    /**
       * Return the placeholder string if it's set
       * & there is no value selected.
       * @return {String} Placeholder text
       */
    searchPlaceholder () {
      if (this.isValueEmpty && this.placeholder) {
        return this.placeholder
      }
      return ''
    },

    /**
       * The currently displayed options, filtered
       * by the search elements value. If tagging
       * true, the search text will be prepended
       * if it doesn't already exist.
       *
       * @return {array}
       */
    filteredOptions () {
      if (!this.filterable && !this.taggable) {
        return this.mutableOptions.slice()
      }
      let options = this.search.length ? this.filter(this.mutableOptions, this.search, this) : this.mutableOptions
      if (this.taggable && this.search.length && !this.optionExists(this.search)) {
        options.unshift(this.search)
      }
      return options
    },

    /**
       * Check if there aren't any options selected.
       * @return {Boolean}
       */
    isValueEmpty () {
      if (this.mutableValue) {
        if (typeof this.mutableValue === 'object') {
          return !Object.keys(this.mutableValue).length
        }
        return !this.valueAsArray.length
      }

      return true
    },

    /**
       * Return the current value in array format.
       * @return {Array}
       */
    valueAsArray () {
      if (this.multiple && this.mutableValue) {
        return this.mutableValue
      } else if (this.mutableValue) {
        return [].concat(this.mutableValue)
      }

      return []
    },

    /**
       * Determines if the clear button should be displayed.
       * @return {Boolean}
       */
    showClearButton () {
      return !this.multiple && this.clearable && !this.open && this.mutableValue != null
    }
  },

  watch: {
    /**
       * When the value prop changes, update
       * the internal mutableValue.
       * @param  {mixed} val
       * @return {void}
       */
    value (val) {
      this.mutableValue = val
    },

    /**
       * Maybe run the onChange callback.
       * @param  {string|object} val
       * @param  {string|object} old
       * @return {void}
       */
    mutableValue (val, old) {
      if (this.multiple) {
        return this.onChange ? this.onChange(val) : null
      } else {
        return this.onChange && val !== old ? this.onChange(val) : null
      }
    },

    /**
       * When options change, update
       * the internal mutableOptions.
       * @param  {array} val
       * @return {void}
       */
    options (val) {
      this.mutableOptions = val
    },

    /**
       * Maybe reset the mutableValue
       * when mutableOptions change.
       * @return {[type]} [description]
       */
    mutableOptions () {
      if (!this.taggable && this.resetOnOptionsChange) {
        this.mutableValue = this.multiple ? [] : null
      }
    },

    /**
       * Always reset the mutableValue when
       * the multiple prop changes.
       * @param  {Boolean} val
       * @return {void}
       */
    multiple (val) {
      this.mutableValue = val ? [] : null
    }
  },

  /**
     * Clone props into mutable values,
     * attach any event listeners.
     */
  created () {
    this.mutableValue = this.value
    this.mutableOptions = this.options.slice(0)
    this.mutableLoading = this.loading

    this.$on('option:created', this.maybePushTag)
  },

  methods: {

    /**
       * Select a given option.
       * @param  {Object|String} option
       * @return {void}
       */
    select (option) {
      if (!this.isOptionSelected(option)) {
        if (this.taggable && !this.optionExists(option)) {
          option = this.createOption(option)
        }
        if (this.index) {
          if (!option.hasOwnProperty(this.index)) {
            return window.console.warn(
              `[vue-select warn]: Index key "option.${this.index}" does not` +
                  ` exist in options object ${JSON.stringify(option)}.`
            )
          }
          option = option[this.index]
        }
        if (this.multiple && !this.mutableValue) {
          this.mutableValue = [option]
        } else if (this.multiple) {
          this.mutableValue.push(option)
        } else {
          this.mutableValue = option
        }
      }

      this.onAfterSelect(option)
    },

    /**
       * De-select a given option.
       * @param  {Object|String} option
       * @return {void}
       */
    deselect (option) {
      if (this.multiple) {
        let ref = -1
        this.mutableValue.forEach((val) => {
          if (val === option || (this.index && val === option[this.index]) || (typeof val === 'object' && val[this.label] === option[this.label])) {
            ref = val
          }
        })
        let index = this.mutableValue.indexOf(ref)
        this.mutableValue.splice(index, 1)
      } else {
        this.mutableValue = null
      }
    },

    /**
       * Clears the currently selected value(s)
       * @return {void}
       */
    clearSelection () {
      this.mutableValue = this.multiple ? [] : null
    },

    /**
       * Called from this.select after each selection.
       * @param  {Object|String} option
       * @return {void}
       */
    onAfterSelect (option) {
      if (this.closeOnSelect) {
        this.open = !this.open
        this.$refs.search.blur()
      }

      if (this.clearSearchOnSelect) {
        this.search = ''
      }
    },

    /**
       * Toggle the visibility of the dropdown menu.
       * @param  {Event} e
       * @return {void}
       */
    toggleDropdown () {
      this.open = !this.open
      if (this.searchable) {
        if (this.open) {
          this.$refs.search.focus()
        } else {
          this.$refs.search.blur()
        }
      }
    },

    /**
       * Check if the given option is currently selected.
       * @param  {Object|String}  option
       * @return {Boolean}        True when selected | False otherwise
       */
    isOptionSelected (option) {
      let selected = false
      this.valueAsArray.forEach(value => {
        if (typeof value === 'object') {
          selected = this.optionObjectComparator(value, option)
        } else if (value === option || value === option[this.index]) {
          selected = true
        }
      })
      return selected
    },

    /**
       * Determine if two option objects are matching.
       *
       * @param value {Object}
       * @param option {Object}
       * @returns {boolean}
       */
    optionObjectComparator (value, option) {
      if (this.index && value === option[this.index]) {
        return true
      } else if ((value[this.label] === option[this.label]) || (value[this.label] === option)) {
        return true
      } else if (this.index && value[this.index] === option[this.index]) {
        return true
      }
      return false
    },

    /**
       * Finds an option from this.options
       * where option[this.index] matches
       * the passed in value.
       *
       * @param value {Object}
       * @returns {*}
       */
    findOptionByIndexValue (value) {
      this.options.forEach(_option => {
        if (JSON.stringify(_option[this.index]) === JSON.stringify(value)) {
          value = _option
        }
      })
      return value
    },

    /**
       * If there is any text in the search input, remove it.
       * Otherwise, blur the search input to close the dropdown.
       * @return {void}
       */
    onEscape () {
      if (!this.search.length) {
        this.$refs.search.blur()
      } else {
        this.search = ''
      }
    },

    /**
       * Close the dropdown on blur.
       * @emits  {search:blur}
       * @return {void}
       */
    onSearchBlur () {
      if (this.mousedown && !this.searching) {
        this.mousedown = false
      } else {
        if (this.clearSearchOnBlur) {
          setTimeout(() => {
            this.search = ''
            this.open = false
          }, 100)
        }
        this.$emit('search:blur')
      }
    },

    /**
       * Open the dropdown on focus.
       * @emits  {search:focus}
       * @return {void}
       */
    onSearchFocus () {
      this.$emit('search:focus')
    },

    /**
       * Delete the value on Delete keypress when there is no
       * text in the search input, & there's tags to delete
       * @return {this.value}
       */
    maybeDeleteValue () {
      if (!this.$refs.search.value.length && this.mutableValue) {
        if (this.multiple) {
          return this.mutableValue.pop()
        } else {
          this.mutableValue = null
        }
      }
    },

    /**
       * Determine if an option exists
       * within this.mutableOptions array.
       *
       * @param  {Object || String} option
       * @return {boolean}
       */
    optionExists (option) {
      let exists = false

      this.mutableOptions.forEach(opt => {
        if (typeof opt === 'object' && opt[this.label] === option) {
          exists = true
        } else if (opt === option) {
          exists = true
        }
      })

      return exists
    },

    /**
       * If push-tags is true, push the
       * given option to mutableOptions.
       *
       * @param  {Object || String} option
       * @return {void}
       */
    maybePushTag (option) {
      if (this.pushTags) {
        this.mutableOptions.push(option)
      }
    },

    /**
       * Event-Handler to help workaround IE11 (probably fixes 10 as well)
       * firing a `blur` event when clicking
       * the dropdown's scrollbar, causing it
       * to collapse abruptly.
       * @return {void}
       */
    onMousedown () {
      this.mousedown = true
    }
  }

}
</script>

<style>
  .v-select {
    position: relative;
    font-family: inherit;
  }
  .v-select,
  .v-select * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  /* Rtl support - Because we're using a flexbox-based layout, the `dir="rtl"` HTML
     attribute does most of the work for us by rearranging the child elements visually.
   */
  .v-select[dir="rtl"] .vs__actions {
    padding: 0 3px 0 6px;
  }
  .v-select[dir="rtl"] .dropdown-toggle .clear {
    margin-left: 6px;
    margin-right: 0;
  }
  .v-select[dir="rtl"] .selected-tag .close {
    margin-left: 0;
    margin-right: 2px;
  }
  .v-select[dir="rtl"] .dropdown-menu {
    text-align: right;
  }

  /* Open Indicator */
  .v-select .open-indicator {
    display: flex;
    align-items: center;
    cursor: pointer;
    pointer-events: all;
    transition: all 150ms cubic-bezier(1.000, -0.115, 0.975, 0.855);
    transition-timing-function: cubic-bezier(1.000, -0.115, 0.975, 0.855);
    opacity: 1;
    width: 12px; /* To account for extra width from rotating. */
  }
  .v-select .open-indicator:before {
    border-color: rgba(60, 60, 60, .5);
    border-style: solid;
    border-width: 3px 3px 0 0;
    content: '';
    display: inline-block;
    height: 10px;
    width: 10px;
    vertical-align: text-top;
    transform: rotate(133deg);
    transition: all 150ms cubic-bezier(1.000, -0.115, 0.975, 0.855);
    transition-timing-function: cubic-bezier(1.000, -0.115, 0.975, 0.855);
    box-sizing: inherit;
  }
  /* Open Indicator States */
  .v-select.open .open-indicator:before {
    transform: rotate(315deg);
  }
  .v-select.loading .open-indicator {
    opacity: 0;
  }

  /* Dropdown Toggle */
  .v-select .dropdown-toggle {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: flex;
    padding: 0 0 4px 0;
    background: none;
    border: 1px solid rgba(60, 60, 60, .26);
    border-radius: 4px;
    white-space: normal;
  }
  .v-select .vs__selected-options {
    display: flex;
    flex: 1 1 auto;
    max-width: calc(100% - 50px);
    align-items: center;
    padding: 0 2px;
    position: relative;
  }
  .v-select .vs__actions {
    display: flex;
    align-items: stretch;
    padding: 0 6px 0 3px;
  }

  /* Clear Button */
  .v-select .dropdown-toggle .clear {
    font-size: 23px;
    font-weight: 700;
    line-height: 1;
    color: rgba(60, 60, 60, 0.5);
    padding: 0;
    border: 0;
    background-color: transparent;
    cursor: pointer;
    margin-right: 6px;
  }

  /* Dropdown Toggle States */
  .v-select.searchable .dropdown-toggle {
    cursor: text;
  }
  .v-select.unsearchable .dropdown-toggle {
    cursor: pointer;
  }
  .v-select.open .dropdown-toggle {
    border-bottom-color: transparent;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  /* Dropdown Menu */
  .v-select .dropdown-menu {
    display:block;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    min-width: 160px;
    padding: 5px 0;
    margin: 0;
    width: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    border: 1px solid rgba(0, 0, 0, .26);
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,.15);
    border-top: none;
    border-radius: 0 0 4px 4px;
    text-align: left;
    list-style: none;
    background: #fff;
  }
  .v-select .no-options {
    text-align: center;
  }
  /* Selected Tags */
  .v-select .selected-tag {
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    align-items: center;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    color: #333;
    line-height: 1.42857143; /* Normalize line height */
    margin: 4px 2px 0px 2px;
    padding: 0 0.25em;
    transition: opacity .25s;
  }
  .v-select.single .selected-tag {
    background-color: transparent;
    border-color: transparent;
  }
  .v-select.single.open .selected-tag {
    position: absolute;
    opacity: .4;
  }
  .v-select.single.searching .selected-tag {
    display: none;
  }
  .v-select .selected-tag .close {
    margin-left: 2px;
    font-size: 1.25em;
    appearance: none;
    padding: 0;
    cursor: pointer;
    background: 0 0;
    border: 0;
    font-weight: 700;
    line-height: 1;
    color: #000;
    text-shadow: 0 1px 0 #fff;
    filter: alpha(opacity=20);
    opacity: .2;
  }
  .v-select.single.searching:not(.open):not(.loading) input[type="search"] {
    opacity: .2;
  }
  /* Search Input */
  .v-select input[type="search"]::-webkit-search-decoration,
  .v-select input[type="search"]::-webkit-search-cancel-button,
  .v-select input[type="search"]::-webkit-search-results-button,
  .v-select input[type="search"]::-webkit-search-results-decoration {
    display: none;
  }
  .v-select input[type="search"]::-ms-clear {
    display: none;
  }
  .v-select input[type="search"],
  .v-select input[type="search"]:focus {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    line-height: 1.42857143;
    font-size: 1em;
    display: inline-block;
    border: 1px solid transparent;
    border-left: none;
    outline: none;
    margin: 4px 0 0 0;
    padding: 0 7px;
    max-width: 100%;
    background: none;
    box-shadow: none;
    flex-grow: 1;
    width: 0;
  }
  .v-select.unsearchable input[type="search"] {
    opacity: 0;
  }
  .v-select.unsearchable input[type="search"]:hover {
    cursor: pointer;
  }

  /* List Items */
  .v-select li > a {
    display: block;
    padding: 3px 20px;
    clear: both;
    color: #333; /* Overrides most CSS frameworks */
    white-space: nowrap;
  }
  .v-select li:hover {
    cursor: pointer;
  }
  .v-select .dropdown-menu .active > a {
    color: #333;
    background: rgba(50, 50, 50, .1);
  }

  .v-select .option-container {
    min-height: 40px;
    width: 100%;
    text-align: left;
    font-size: 20px;
    font-weight: 700;
  }

  .v-select li.active {
    /* background-color: #CE352F; */
  }

  .v-select li.active .option-container{
    color: white;
    background-color: #CE352F;
  }

  /* Disabled state */
  .v-select.disabled .dropdown-toggle,
  .v-select.disabled .dropdown-toggle .clear,
  .v-select.disabled .dropdown-toggle input,
  .v-select.disabled .selected-tag .close,
  .v-select.disabled .open-indicator {
    cursor: not-allowed;
    background-color: rgb(248, 248, 248);
  }
</style>
