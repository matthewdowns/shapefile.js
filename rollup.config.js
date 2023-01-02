const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('@rollup/plugin-typescript')
const { terser } = require('rollup-plugin-terser')
const { resolve } = require('path')
const { dependencies } = require('./package.json')

const input = resolve(__dirname, './src/index.ts')
const external = Object.keys(dependencies)
const globals = {
  'jszip': 'JSZip',
  'moment-timezone': 'moment'
}

const development = {
  input,
  output: [
    {
      dir: resolve(__dirname, `./dist`),
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: resolve(__dirname, `./dist/shapefile.js`),
      format: 'umd',
      name: 'ShapefileJS',
      sourcemap: true,
      globals
    }
  ],
  plugins: [
    typescript({
      declaration: true,
      declarationMap: true,
      removeComments: false,
      sourceMap: true
    }),
    commonjs()
  ],
  external
}

const production = {
  input,
  output: [
    {
      file: resolve(__dirname, `./dist/shapefile.min.js`),
      format: 'umd',
      name: 'ShapefileJS',
      sourcemap: false,
      globals
    }
  ],
  plugins: [
    typescript({
      declaration: false,
      declarationMap: false,
      removeComments: true,
      sourceMap: false
    }),
    commonjs(),
    terser()
  ],
  external
}

module.exports = [
  development,
  production
]
