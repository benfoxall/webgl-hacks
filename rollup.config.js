import { rollup } from 'rollup'
import string from 'rollup-plugin-string'
import buble from 'rollup-plugin-buble'

export default {
    entry: 'current/src/main.js',
    dest: 'current/build.js',
    plugins: [
        string({
            include: '**/*.glsl'
        }),
        buble()
    ],
    sourceMap: true
}
