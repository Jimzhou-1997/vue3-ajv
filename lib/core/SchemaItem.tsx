import { computed, defineComponent, PropType } from 'vue'
import { useVJSFContext } from '../utils/context'
import ArrayField from '@schema-form-new/fields/ArrayField'
import NumberField from '@schema-form-new/fields/NumberField'
import ObjectField from '@schema-form-new/fields/ObjectField'
import StringField from '@schema-form-new/fields/StringField'
import { SchemaTypes, FiledPropsDefine } from '../../types/types'
import { retrieveSchema } from '../utils/utils'

export default defineComponent({
  name: 'SchemaItem',
  props: FiledPropsDefine,
  setup(props) {
    const formContext = useVJSFContext()

    const retrievedSchemaRef = computed(() => {
      const { schema, rootSchema, value } = props
      return formContext.transformSchemaRef.value(
        retrieveSchema(schema, rootSchema, value),
      )
    })

    return () => {
      const { schema } = props

      const retrievedSchema = retrievedSchemaRef.value

      // 如果 type 没有指定，我们需要猜测这个 type

      const type = schema.type
      let Component: any

      switch (type) {
        case SchemaTypes.STRING: {
          Component = StringField
          break
        }
        case SchemaTypes.NUMBER: {
          Component = NumberField
          break
        }
        case SchemaTypes.OBJECT: {
          Component = ObjectField
          break
        }
        case SchemaTypes.ARRAY: {
          Component = ArrayField
          break
        }
        default: {
          console.warn(`${type} is not supported`)
        }
      }

      return <Component {...props} schema={retrievedSchema} />
    }
  },
})
