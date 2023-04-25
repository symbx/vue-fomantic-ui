import clsx from 'clsx'
import { computed, defineComponent } from 'vue'
import { computeKeyOnly } from '../../utils/classNameHelper'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Label } from '../Label'

export default defineComponent({
  name: 'SuiInput',
  emits: ['update:modelValue'],
  props: {
    action: String,
    disabled: Boolean,
    error: Boolean,
    fluid: Boolean,
    focus: Boolean,
    icon: String,
    iconPosition: String,
    inverted: Boolean,
    label: String,
    labeled: Boolean,
    loading: Boolean,
    modelValue: String,
    placeholder: String,
    size: String,
    transparent: Boolean,
    type: String,
    min: {
      type: Number,
      required: false,
      default: null
    },
    max: {
      type: Number,
      required: false,
      default: null
    },
    step: {
      type: Number,
      required: false,
      default: null
    },
    maxLength: {
      type: Number,
      required: false,
      default: null
    },
    minLength: {
      type: Number,
      required: false,
      default: null
    },
    readOnly: {
      type: Boolean,
      required: false,
      default: false
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    },
    autocomplete: {
      type: String,
      required: false,
      default: null
    }
  },
  setup (props, { emit }) {
    const hasIcon = computed(() => {
      return ((typeof props.icon === 'string') || props.loading)
    })

    const hasLabel = computed(() => {
      return (!!props.label || props.labeled)
    })

    const computedClass = computed(() => {
      return clsx(
        'ui',
        props.size,
        props.action && 'action',
        computeKeyOnly(props.disabled, 'disabled'),
        computeKeyOnly(props.error, 'error'),
        computeKeyOnly(props.fluid, 'fluid'),
        computeKeyOnly(props.focus, 'focus'),
        props.iconPosition,
        computeKeyOnly(hasIcon.value, 'icon'),
        computeKeyOnly(props.inverted, 'inverted'),
        computeKeyOnly(props.loading, 'loading'),
        computeKeyOnly(props.transparent, 'transparent'),
        computeKeyOnly(hasLabel.value, 'labeled'),
        'input'
      )
    })

    const onInput = (event: any) => emit('update:modelValue', event.target.value)

    return () => (
      <div class={computedClass.value}>
        {props.label && <Label>{props.label}</Label>}
        <input
          type={props.type || 'text'}
          placeholder={props.placeholder}
          value={props.modelValue}
          onInput={(event) => onInput(event)}
          min={props.min}
          max={props.max}
          step={props.step}
          maxlength={props.maxLength}
          minlength={props.minLength}
          readonly={props.readOnly}
          required={props.required}
          autocomplete={props.autocomplete}
        />
        {hasIcon.value && <Icon name={(props.icon || 'spinner')} />}
        {props.action && <Button>{props.action}</Button>}
      </div>
    )
  }
})
