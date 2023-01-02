const commonjs = require('@rollup/plugin-commonjs')
const nodeResolve = require('@rollup/plugin-node-resolve')
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
      sourcemap: true
    },
    {
      file: resolve(__dirname, `./dist/shapefile.js`),
      format: 'umd',
      name: 'ShapefileJS',
      sourcemap: true
    }
  ],
  plugins: [
    typescript({
      declaration: true,
      declarationMap: true,
      removeComments: false,
      sourceMap: true
    }),
    nodeResolve({ browser: true }),
    commonjs()
  ]
}

const production = {
  input,
  output: [
    {
      file: resolve(__dirname, `./dist/shapefile.min.js`),
      format: 'umd',
      name: 'ShapefileJS',
      sourcemap: false
    }
  ],
  plugins: [
    typescript({
      declaration: false,
      declarationMap: false,
      removeComments: true,
      sourceMap: false
    }),
    nodeResolve({ browser: true }),
    commonjs(),
    terser()
  ]
}

module.exports = [
  development,
  production
]
