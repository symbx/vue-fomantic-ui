import clsx from "clsx";
import { computed, defineComponent, onMounted, onUnmounted, PropType, provide, Ref, ref, watch, withModifiers } from "vue";
import { DropdownMenu, DropdownItem } from ".";
import clickOutside from "../../directives/click-outside";
import { computeKeyOnly, computeKeyOrKeyValue } from "../../utils/classNameHelper";
import { pluck } from "../../utils/underscore";
import DropdownText from "./DropdownText";
import { useDropdown } from "./useDropdown";

interface TDropdownItem {
  text: string,
  value?: string | number,
  flag?: string,
  icon?: string,
  image?: {},
  label?: {
    color?: string,
    circular?: boolean,
    empty?: boolean
  }
}

type DropdownValue = string|number|string[]|number[];

export default defineComponent({
  name: 'SuiDropdown',
  directives: { clickoutside: clickOutside },
  emits: ['update:modelValue'],
  props: {
    button: Boolean,
    clearable: Boolean,
    compact: Boolean,
    floating: Boolean,
    fluid: Boolean,
    icon: String,
    inline: Boolean,
    item: Boolean,
    labeled: Boolean,
    modelValue: [String, Number, Array] as PropType<DropdownValue>,
    multiple: Boolean,
    options: Array as PropType<TDropdownItem[]|string[]>,
    placeholder: String,
    pointing: [Boolean, String],
    scrolling: Boolean,
    selection: Boolean,
    search: Boolean,
    searchInMenu: Boolean,
    simple: Boolean,
    text: String,
    inverted: Boolean
  },
  setup(props, { emit }) {
    const api = useDropdown(props)
    provide('useDropdown', api)

    const {
      state,
      show,
      hide
    } = api

    const computedClass = computed(() => {
      return clsx(
        'ui',
        computeKeyOnly(props.button, 'button'),
        computeKeyOnly(props.clearable, 'clearable'),
        computeKeyOnly(props.compact, 'compact'),
        computeKeyOnly(props.floating, 'floating'),
        computeKeyOnly(props.fluid, 'fluid'),
        computeKeyOnly(!!props.icon, 'icon'),
        computeKeyOnly(props.inline, 'inline'),
        computeKeyOnly(props.item, 'item'),
        computeKeyOnly(props.labeled, 'labeled'),
        computeKeyOnly(props.multiple, 'multiple'),
        computeKeyOnly(props.scrolling, 'scrolling'),
        computeKeyOnly(props.selection, 'selection'),
        computeKeyOnly(props.search, 'search'),
        computeKeyOnly(props.simple, 'simple'),
        computeKeyOnly(props.inverted, 'inverted'),
        computeKeyOrKeyValue(props.pointing, 'pointing'),
        'dropdown',
        computeKeyOnly(state.visible, 'active visible'),
        computeKeyOnly(state.direction === 'up', 'upward')
      )
    })

    const openMenu = () => {
      if (props.search && inputRef.value) {
        inputRef.value.focus() 
      }

      show()
    }

    const closeMenu = () => hide()

    const onClick = () => state.visible ? closeMenu() : openMenu()

    const filteredText = ref('')
    const filteredOptions = computed(() => {
      return (props.options as (string|TDropdownItem)[]).filter((option) => {
        const query = filteredText.value.toLowerCase();
        if (typeof option === 'string') {
          return option.toLowerCase().includes(query)
        }
        if (props.multiple && Array.isArray(props.modelValue)) {
          if (typeof option === 'object') {
            return !(props.modelValue as DropdownValue[]).includes(option.value as DropdownValue) &&
                    option.text.toLowerCase().includes(query)
          }
          return props.modelValue.includes(option)
        }
        return option.text.toLowerCase().includes(filteredText.value.toLowerCase())
      })
    })

    const inputRef: Ref<HTMLElement|null> = ref(null)
    const sizerRef: Ref<HTMLElement|null> = ref(null)
    const searchWidth: Ref<number> = ref(42);
    const onInput = (event: InputEvent) => {
      filteredText.value = (event.target as HTMLInputElement).value
      if (sizerRef.value) {
        searchWidth.value = Math.max(sizerRef.value.getBoundingClientRect().width, 40)
      }
    }
    const onSelect = (event: any) => {
      filteredText.value = ''

      if (typeof event === 'object') {
        event = event.value
      }

      if (props.multiple) {
        let result = Array.isArray(props.modelValue) ? [...props.modelValue, event] : [event]
        return emit('update:modelValue', result)
      }

      return emit('update:modelValue', event)
    }
    const removeItem = (value: string | number | undefined) => {
      if (Array.isArray(props.modelValue)) {
        const index = props.modelValue.findIndex((selected) => selected === value)

        if (index > -1) {
          let copy = Object.assign(props.modelValue)
          copy.splice(index, 1)

          emit('update:modelValue', copy)
        }
      } 
    }

    const selected = computed(() => {
      if (!Array.isArray(props.modelValue) || props.modelValue.length === 0) {
        return []
      }
      return (props.options as (string|TDropdownItem)[]).filter((o: any) => 
        (props.modelValue as (string|number)[]).includes(typeof o === 'object' ? o.value : o))
    })

    provide('selection', props.selection)

    return {
      computedClass,
      onClick,
      openMenu,
      closeMenu,
      filteredText,
      filteredOptions,
      inputRef,
      sizerRef,
      onInput,
      onSelect,
      removeItem,
      selected,
      searchWidth
    }
  },
  render() {
    const renderMultipleSelect = () => {
      if (Array.isArray(this.$props.modelValue)) {
        return (
          this.selected.map((selected) => {
            if (typeof selected === 'object') {
              return <a class="ui label">
                {selected.flag && <i class={`${selected.flag} flag`}></i>}
                {selected.text}
                <i
                  class="delete icon"
                  onClick={withModifiers(() => this.removeItem(selected.value), ["stop"])}
                ></i>
              </a>
            }

            return <a class="ui label">
              {selected}
              <i
                class="delete icon"
                onClick={withModifiers(() => this.removeItem(selected), ["stop"])}
              ></i>
            </a>
          })
        )
      }
    }

    const renderOptions = () => {
      return this.filteredOptions
        .filter((option) => {
          if (this.$props.multiple && Array.isArray(this.$props.modelValue)) {
            return !(this.$props.modelValue as DropdownValue[]).includes((typeof option === 'object' ? option.value : option) as DropdownValue)
          }
          return true
        })
        .map((option: TDropdownItem | string) => {
          return <DropdownItem
            item={option}
            active={this.$props.modelValue && typeof option === 'object' ? option.value === this.$props.modelValue : option === this.$props.modelValue}
            text={typeof option === 'object' ? option.text : option}
            flag={typeof option === 'object'
              ? Object.keys(option as any).includes('flag') ? option.flag : ''
              : ''}
            image={(option as TDropdownItem).image}
            label={(option as TDropdownItem).label}
            icon={(option as TDropdownItem).icon}
            onSelect={this.onSelect}
          />
      })
    }

    const renderText = () => {
      let textProps = {
        clearable: this.clearable,
        filtered: this.filteredText.length > 0,
        icon: this.icon,
        item: (this.$props.options as (string|TDropdownItem)[])?.find((o: any) => typeof o === 'object' ? o.value === this.modelValue : o === this.modelValue) || this.modelValue,
        placeholder: this.placeholder,
        text: this.text
      }

      return (
        <DropdownText
          {...textProps}
          onRemove={() => this.$emit('update:modelValue', null)}
        />
      )
    }

    const renderMenu = () => {
      return (
        <DropdownMenu search={this.$props.searchInMenu} onSearch={this.onInput}>
          {renderOptions()}
        </DropdownMenu>
      )
    }

    return (
      <div
        class={this.computedClass}
        onClick={this.onClick}
        v-clickoutside={this.closeMenu}
      >
        {this.$props.multiple && renderMultipleSelect()}
        {this.search && <input
          ref={(ref) => this.inputRef = ref as HTMLElement}
          type="text"
          class="search"
          autocomplete="off"
          tabindex={0}
          value={this.filteredText}
          onInput={(event) => this.onInput(event as InputEvent)}
          style={{width: this.searchWidth + 'px'}}
        />}
        {this.search && this.multiple && <span 
          class="sizer" 
          ref={(ref) => this.sizerRef = ref as HTMLElement}
          style="position: absolute; top: -2000px; left: -2000px; display: block;"
          >{this.filteredText}</span>}

        {renderText()}
        {this.$slots.default?.() || renderMenu()}
      </div>
    )
  }
})