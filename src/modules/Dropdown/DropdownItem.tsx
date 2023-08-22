import clsx from "clsx";
import { computed, defineComponent, inject, PropType, withModifiers, resolveComponent } from "vue";
import { Image } from "../../elements/Image";
import { Label } from "../../elements/Label";
import { computeKeyOnly } from "../../utils/classNameHelper";

export default defineComponent({
  name: 'SuiDropdownItem',
  emits: ['select'],
  props: {
    active: Boolean,
    flag: String,
    description: String,
    icon: String,
    image: Object,
    item: [Object, String, Number],
    label: Object,
    text: String,
    onSelect: Function as PropType<(event: InputEvent) => void>,
    as: String,
    disabled: Boolean,
  },
  setup(props, { emit }) {
    const { state, hide } = inject('useDropdown') as any

    let elementType: any = props.as || 'a'

    if (props.as === 'router-link') {
      elementType = resolveComponent(props.as)
    }

    const computedClass = computed(() => {
      return clsx(
        computeKeyOnly(props.active, 'active'),
        computeKeyOnly(props.disabled, 'disabled'),
        'item'
      )
    })

    const onClick = () => {
      if (!state.multiple) hide()
      emit('select', props.item ? (typeof props.item === 'object' ? props.item.value : props.item) : props.text)
    }

    return () => (
      <elementType
        class={computedClass.value}
        onClick={withModifiers(onClick, ['stop'])}
      >
        {props.flag && <i class={`${props.flag} flag`}></i>}
        {props.icon && <i class={`${props.icon} icon`}></i>}
        {props.image && <Image {...props.image}></Image>}
        {props.label && <Label {...props.label}></Label>}
        {props.description && <span class="description">{props.description}</span>}
        {props.text}
      </elementType>
    )
  }
})