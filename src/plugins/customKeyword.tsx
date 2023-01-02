import { CustomKeyword } from '../../lib/types'

const keyword: CustomKeyword = {
  name: 'test',
  definition: {
    macro: () => {
      return {
        minLength: 10,
      }
    },
  },
  transformSchema(originSchema) {
    return {
      ...originSchema,
      minLength: 10,
    }
  },
}

export default keyword
