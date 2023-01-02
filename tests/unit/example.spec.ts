import { shallowMount, mount } from '@vue/test-utils'
import themeDefault from '../../lib/theme-default'
import { defineComponent, h } from 'vue'

import { NumberField } from '../../lib'

import TestComponent from './utils/TestComponent'

describe('JsonSchemaFrom', () => {
  it('should render correct number field', async () => {
    let value = ''
    const wrapper = mount(TestComponent, {
      props: {
        rootSchema: {
          type: 'number',
        },
        schema: {
          type: 'number',
        },
        value,
        onChange: (v: any) => {
          value = v
        },
        theme: themeDefault as any,
      },
    })

    const numberField = wrapper.findComponent(NumberField)
    expect(numberField.exists()).toBeTruthy()
    // await numberField.props('onChange')('123')
    const input = numberField.find('input')
    input.element.value = '123'
    input.trigger('input')
    console.log(typeof value)
    expect(value).toBe(123)
  })
})
