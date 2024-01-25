import {
  computed,
  defineComponent,
  PropType,
  provide,
  ref,
  Ref,
  shallowRef,
  watch,
  watchEffect,
} from 'vue'
import { SchemaFormContextKey } from '../utils/context'
import SchemaItem from './SchemaItem'
import {
  CommonWidgetDefine,
  CustomFormat,
  CustomKeyword,
  Schema,
  UISchema,
} from '../../types/types'
import Ajv, { Options } from 'ajv'
import { ErrorSchema, validateFormData } from '../utils/validator'

interface ContextRef {
  doValidate: () => Promise<{
    errors: any[]
    valid: boolean
  }>
}

const defaultAjvOptions: Options = {
  allErrors: true,
  // jsonPointers: true,
}

export default defineComponent({
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    value: {
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
    contextRef: {
      type: Object as PropType<Ref<ContextRef | undefined>>,
    },
    ajvOptions: {
      type: Object as PropType<Options>,
    },
    locale: {
      type: String,
      default: 'zh',
    },
    customValidate: {
      type: Function as PropType<(data: any, errors: any) => void>,
    },
    customFormats: {
      type: [Array, Object] as PropType<CustomFormat[] | CustomFormat>,
    },
    customKeywords: {
      type: [Array, Object] as PropType<CustomKeyword[] | CustomKeyword>,
    },
    uiSchema: {
      type: Object as PropType<UISchema>,
    },
    // theme: {
    //   type: Object as PropType<Theme>,
    //   required: true,
    // },
  },
  name: 'SchemaForm',
  setup(props) {
    const validatorRef: Ref<Ajv.Ajv> = shallowRef() as any

    watchEffect(() => {
      validatorRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOptions,
      })

      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats]
        customFormats.forEach((format) => {
          validatorRef.value.addFormat(format.name, format.definition)
        })
      }

      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords]
        customKeywords.forEach((keyword) => {
          validatorRef.value.addKeyword(keyword.name, keyword.definition)
        })
      }
    })

    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({})

    const validateResolveRef = ref()
    const validateIndex = ref(0)

    watch(
      () => props.value,
      () => {
        if (validateResolveRef.value) {
          doValidate()
        }
      },
      {
        deep: true,
      },
    )

    async function doValidate() {
      const index = (validateIndex.value += 1)
      const result = await validateFormData(
        validatorRef.value,
        props.value,
        props.schema,
        props.locale,
        props.customValidate,
      )
      if (index !== validateIndex.value) return
      errorSchemaRef.value = result.errorSchema
      validateResolveRef.value(result)
      validateResolveRef.value = undefined
    }

    watch(
      () => props.contextRef,
      () => {
        if (props.contextRef) {
          props.contextRef.value = {
            async doValidate() {
              return new Promise((resolve) => {
                validateResolveRef.value = resolve
                doValidate()
              })
            },
          }
        }
      },
      {
        immediate: true,
      },
    )

    const handleChange = (v: any) => {
      props.onChange(v)
    }

    const formatMapRef = computed(() => {
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats]
        return customFormats.reduce((result, format) => {
          // validatorRef.value.addFormat(format.name, format.definition)
          result[format.name] = format.component
          return result
        }, {} as { [key: string]: CommonWidgetDefine })
      } else {
        return {}
      }
    })

    const transformSchemaRef = computed(() => {
      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords]

        return (s: Schema) => {
          let newSchema = s
          customKeywords.forEach((keyword) => {
            if ((newSchema as any)[keyword.name]) {
              newSchema = keyword.transformSchema(s)
            }
          })
          return newSchema
        }
      }
      return (s: Schema) => s
    })

    const context = {
      SchemaItem,
      formatMapRef,
      transformSchemaRef,
      // theme: props.theme,
    }

    provide(SchemaFormContextKey, context)

    return () => {
      const { schema, value, uiSchema } = props
      return (
        <SchemaItem
          schema={schema}
          rootSchema={schema}
          value={value}
          onChange={handleChange}
          uiSchema={uiSchema || {}}
          errorSchema={errorSchemaRef.value || {}}
        />
      )
    }
  },
})
