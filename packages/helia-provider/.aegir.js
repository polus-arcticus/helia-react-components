/** @type {import('aegir').PartialOptions} */
const options = {
  build: {
    config: {
      loader: {
        '.js': 'jsx',
        '.css': 'css',
        '.svg': 'file',
      }
    }
  },
  test: {
    before: async () => {
    },
    after: async (_, beforeResult) => {
    }
  }
}
