// import themeDefault from '../../lib/theme-default'
// import { mount } from '@vue/test-utils'

// import {
//   SelectionWidget,
//   NumberField,
//   StringField,
//   ArrayField,
// } from '../../lib/core'

// import TestComponent from './utils/TestComponent'

// describe('ArrayFiled', () => {
//   it('should render multi type', () => {
//     const schema = {
//       type: 'array',
//       items: [
//         {
//           type: 'string',
//         },
//         {
//           type: 'number',
//         },
//       ],
//     }
//     const wrapper = mount(TestComponent, {
//       props: {
//         schema,
//         rootSchema: schema,
//         value: [],
//         onChange: () => ({}),
//         theme: themeDefault as any,
//       },
//     })

//     const arr = wrapper.findComponent(ArrayField)
//     const str = arr.findComponent(StringField)
//     const num = arr.findComponent(NumberField)

//     expect(str.exists()).toBeTruthy()
//     expect(num.exists()).toBeTruthy()
//   })

//   it('should render single type', () => {
//     const schema = {
//       type: 'array',
//       items: {
//         type: 'string',
//       },
//     }
//     const wrapper = mount(TestComponent, {
//       props: {
//         schema,
//         rootSchema: schema,
//         value: ['1', '2'],
//         onChange: () => ({}),
//         theme: themeDefault as any,
//       },
//     })

//     const arr = wrapper.findComponent(ArrayField)
//     const strs = arr.findAllComponents(StringField)
//     // const num = arr.findComponent(NumberField)

//     expect(strs.length).toBe(2)
//     expect(strs[0].props('value')).toBe('1')
//     // expect(num.exists()).toBeTruthy()
//   })

//   it('should render single type', () => {
//     const schema = {
//       type: 'array',
//       items: {
//         type: 'string',
//         enum: ['1', '2', '3'],
//       },
//     }
//     const wrapper = mount(TestComponent, {
//       props: {
//         schema,
//         rootSchema: schema,
//         value: [],
//         onChange: () => ({}),
//         theme: themeDefault as any,
//       },
//     })

//     const arr = wrapper.findComponent(ArrayField)
//     const select = arr.findComponent(SelectionWidget)
//     // const num = arr.findComponent(NumberField)

//     expect(select.exists()).toBeTruthy()
//     // expect(num.exists()).toBeTruthy()
//   })
// })
