import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

const baseConfig = {
  external: ['ethers', 'defender-relay-client'],
  plugins: [
    nodeResolve(),
    commonjs(),
    json()
  ]
}

export default [
  {
    ...baseConfig,
    input: 'src/rinkebyHandler.js',
    output: {
      file: 'dist/rinkebyHandler.js',
      format: 'cjs',
      exports: 'named'
    }
  },
  {
    ...baseConfig,
    input: 'src/tokenomicsTestnetHandler.js',
    output: {
      file: 'dist/tokenomicsTestnetHandler.js',
      format: 'cjs',
      exports: 'named'
    }
  }
]
