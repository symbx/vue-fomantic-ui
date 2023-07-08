import clsx from "clsx";
import { computed, defineComponent, resolveComponent } from "vue";
import { computeKeyOnly, computeKeyOrKeyValue, computeKeyValue } from "../../utils/classNameHelper";

export default defineComponent({
  name: 'SuiMenuItem',
  props: {
    action: Boolean,
    active: Boolean,
    as: String,
    browse: Boolean,
    color: String,
    disabled: Boolean,
    fitted: [Boolean, String],
    header: Boolean,
    icon: Boolean,
    index: Number,
    link: Boolean,
    name: String,
    position: String,
    stackable: Boolean,
  },
  setup(props, { slots }) {
    let elementType: any = props.as || 'a'

    if (props.header) {
      elementType = 'div'
    }

    if (props.as === 'router-link') {
      elementType = resolveComponent(props.as)
    }

    const computedClass = computed(() => {
      return clsx(
        props.color,
        props.position,
        computeKeyOnly(props.action, 'action'),
        computeKeyOnly(props.active, 'active'),
        computeKeyOnly(props.browse, 'browse'),
        computeKeyOnly(props.disabled, 'disabled'),
        computeKeyOnly(props.header, 'header'),
        computeKeyOnly(props.link, 'link'),
        computeKeyOnly(props.icon, 'icon'),
        computeKeyOrKeyValue(props.fitted, 'fitted'),
        'item'
      )
    })

    return () => (
      <elementType
        class={computedClass.value}
      >{props.name || slots.default?.()}</elementType>
    )
  }
})