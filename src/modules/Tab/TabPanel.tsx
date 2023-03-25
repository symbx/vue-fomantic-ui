import clsx from "clsx";
import { computed, defineComponent } from "vue";
import { computeKeyOnly, computeKeyOrKeyValue } from "../../utils/classNameHelper";

export default defineComponent({
  name: 'SuiTabPanel',
  props: {
    active: Boolean,
    attached: [Boolean, String],
    header: String,
    inverted: Boolean
  },
  setup(props) {
    const computedClass = computed(() => {
      return clsx(
        'ui tab segment',
        computeKeyOnly(props.active, 'active'),
        computeKeyOnly(props.inverted, 'inverted'),
        computeKeyOrKeyValue(props.attached, 'attached')
      )
    })

    return {
      computedClass
    }
  },
  render() {
    return (
      <div class={this.computedClass}>
        {this.$slots.default?.()}
      </div>
    )
  }
})