const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('@rollup/plugin-typescript')
const path = require('path')
const { dependencies } = require('./package.json')

const srcPath = path.resolve(__dirname, './src')
const distPath = path.resolve(__dirname, './dist')

const input = path.join(srcPath, 'index.ts')
const external = [
  'path',
  ...Object.keys(dependencies)
]

module.exports = {
  input,
  output: {
    dir: distPath,
    format: 'cjs',
    exports: 'named',
    sourcemap: true
  },
  plugins: [
    typescript(),
    commonjs()
  ],
  external
}
