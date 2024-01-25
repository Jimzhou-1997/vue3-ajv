import { defineComponent, PropType } from 'vue'
import { createUseStyles } from 'vue-jss'
import { useVJSFContext } from '../utils/context'
import {
  FiledPropsDefine,
  Schema,
  SelectionWidgetNames,
} from '../../types/types'
import { getWidget } from '../core/theme'
// import SelectionWidget from '../widgets/Selection'

const useStyles = createUseStyles({
  container: {
    border: '1px solid #eee',
  },
  actions: {
    background: '#eee',
    padding: 10,
    textAlign: 'right',
  },
  action: {
    '& + &': {
      marginLeft: 10,
    },
  },
  content: {
    padding: 10,
  },
})

const ArrayItemWrapper = defineComponent({
  name: 'ArrayItemWarpper',
  props: {
    onAdd: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onDelete: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onUp: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onDown: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props, { slots }) {
    const classesRef = useStyles()

    const handleAdd = () => props.onAdd(props.index)
    const handleDown = () => props.onDown(props.index)
    const handleUp = () => props.onUp(props.index)
    const handleDelete = () => props.onDelete(props.index)
    return () => {
      const classes = classesRef.value

      return (
        <div class={classes.container}>
          <div class={classes.actions}>
            <button class={classes.action} onClick={handleAdd}>
              新增
            </button>
            <button class={classes.action} onClick={handleDelete}>
              删除
            </button>
            <button class={classes.action} onClick={handleUp}>
              上移
            </button>
            <button class={classes.action} onClick={handleDown}>
              下移
            </button>
          </div>
          <div class={classes.content}>{slots.default && slots.default()}</div>
        </div>
      )
    }
  },
})

export default defineComponent({
  name: 'ArrayField',
  props: FiledPropsDefine,
  setup(props) {
    const context = useVJSFContext()
    const handleArrayItemChange = (v: any, index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []

      arr[index] = v
      props.onChange(arr)
    }

    const handleAdd = (index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []

      arr.splice(index + 1, 0, undefined)

      props.onChange(arr)
    }
    const handleDelete = (index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []

      arr.splice(index, 1)

      props.onChange(arr)
    }
    const handleUp = (index: number) => {
      if (index === 0) return

      const { value } = props
      const arr = Array.isArray(value) ? value : []

      const item = arr.splice(index, 1)[0]
      arr.splice(index - 1, 0, item)

      props.onChange(arr)
    }
    const handleDown = (index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []

      if (index === arr.length - 1) return

      const item = arr.splice(index + 1, 1)[0]
      arr.splice(index, 0, item)

      props.onChange(arr)
    }

    const SelectionWidgetRef = getWidget(SelectionWidgetNames.SelectionWidget)

    return () => {
      const { schema, rootSchema, value, errorSchema, uiSchema } = props
      const SchemaItem = context.SchemaItem

      const isMultiType = Array.isArray(schema.items)
      const isSelect = schema.items && (schema.items as any).enum

      const SelectionWidget = SelectionWidgetRef.value

      // 多种类型的数组定义
      // items: [{ type: string }, { type: array }]
      if (isMultiType) {
        const items: Schema[] = schema.items as any
        const arr = Array.isArray(value) ? value : []
        return (items || []).map((s: Schema, index) => (
          <SchemaItem
            schema={s}
            uiSchema={uiSchema.items ? uiSchema.items[index] || {} : {}}
            key={index}
            rootSchema={rootSchema}
            value={arr[index]}
            errorSchema={errorSchema[index] || {}}
            onChange={(v: any) => handleArrayItemChange(v, index)}
          ></SchemaItem>
        ))
      } else if (!isSelect) {
        // 单一类型的数组定义
        // items: { type: string }
        const arr = Array.isArray(value) ? value : []

        return arr.map((v: any, index: number) => {
          return (
            <ArrayItemWrapper
              index={index}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onDown={handleDown}
              onUp={handleUp}
            >
              <SchemaItem
                schema={schema.items as Schema}
                uiSchema={(uiSchema.items as any) || {}}
                rootSchema={rootSchema}
                value={v}
                key={index}
                errorSchema={errorSchema[index] || {}}
                onChange={(v: any) => handleArrayItemChange(v, index)}
              ></SchemaItem>
            </ArrayItemWrapper>
          )
        })
      } else {
        // 多选数组的渲染
        // items: { type: string, enum: ['1', '2'] }
        const enumOptions = (schema as any).items.enum
        const options = enumOptions.map((e: any) => ({
          key: e,
          value: e,
        }))
        return (
          <SelectionWidget
            onChange={props.onChange}
            value={props.value}
            options={options}
            errors={errorSchema.__errors}
            schema={schema}
          />
        )
      }
    }
  },
})
