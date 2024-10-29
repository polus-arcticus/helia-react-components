/** @type {import('aegir').PartialOptions} */
export default {
  dependencyCheck: {
    ignore: [
      // until https://github.com/ipfs/aegir/pull/1661 is merged:
      '@testing-library/react',
      'helia',
      'p-defer'
    ]
  },
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
