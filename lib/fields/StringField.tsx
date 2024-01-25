import { computed, defineComponent } from 'vue'

import { FiledPropsDefine, CommonWidgetNames } from '../../types/types'

import { getWidget } from '@schema-form-new/core/theme'

export default defineComponent({
  name: 'StringFeild',
  props: FiledPropsDefine,
  setup(props) {
    const handleChange = (v: string) => {
      props.onChange(v)
    }
    const TextWidgetRef = computed(() => {
      const widgetRef = getWidget(CommonWidgetNames.TextWidget, props)
      return widgetRef.value
    })
    const widgetOptionsRef = computed(() => {
      const { widget, properties, items, ...rest } = props.uiSchema // eslint-disable-line
      return rest
    })
    return () => {
      const { rootSchema, errorSchema, ...rest } = props // eslint-disable-line

      const TextWidget = TextWidgetRef.value
      return (
        <TextWidget
          {...rest}
          errors={errorSchema.__errors}
          onChange={handleChange}
          options={widgetOptionsRef.value}
        />
      )
    }
  },
})
