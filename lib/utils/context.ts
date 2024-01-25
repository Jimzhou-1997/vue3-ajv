import { inject, Ref } from 'vue'
import {
  CommonFieldType,
  CommonWidgetDefine,
  Schema,
  Theme,
} from '../../types/types'

export const SchemaFormContextKey = Symbol()

export function useVJSFContext() {
  const context:
    | {
        SchemaItem: CommonFieldType
        formatMapRef: Ref<{ [key: string]: CommonWidgetDefine }>
        transformSchemaRef: Ref<(schema: Schema) => Schema>
        // theme: Theme
      }
    | undefined = inject(SchemaFormContextKey)

  if (!context) {
    throw Error('SchemaForm needed')
  }

  return context
}
