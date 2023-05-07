import clsx from "clsx";
import { computed, defineComponent, h } from "vue";
import { computeKeyOnly } from "../../utils/classNameHelper";

export default defineComponent({
  name: 'SuiCard',
  props: {
    centered: Boolean,
    color: String,
    fluid: Boolean,
    horizontal: Boolean,
    href: String,
    link: Boolean,
    raised: Boolean,
    loading: Boolean,
  },
  setup(props) {
    const computedClass = computed(() => {
      return clsx(
        'ui',
        props.color,
        computeKeyOnly(props.centered, 'centered'),
        computeKeyOnly(props.fluid, 'fluid'),
        computeKeyOnly(props.horizontal, 'horizontal'),
        computeKeyOnly(props.link, 'link'),
        computeKeyOnly(props.raised, 'raised'),
        computeKeyOnly(props.loading, 'loading'),
        'card'
      )
    })

    return { computedClass }
  },
  render() {
    if (this.$props.href || this.$props.link) {
      return h(
        'a',
        {
          class: this.computedClass,
          href: this.$slots.href
        },
        this.$slots.default?.()
      )
    }

    return h('div', { class: this.computedClass }, this.$slots.default?.())
  }
})