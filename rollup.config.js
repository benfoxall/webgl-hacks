import { rollup } from 'rollup'
import string from 'rollup-plugin-string'
import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
    entry: 'current/src/main.js',
    dest: 'current/build.js',
    plugins: [
        string({
            include: '**/*.glsl'
        }),
        buble(),
        nodeResolve({ jsnext: true, main: true }),
        commonjs()
    ],
    sourceMap: true
}
