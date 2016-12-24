import { rollup } from 'rollup'
import string from 'rollup-plugin-string'

export default {
    entry: 'current/src/main.js',
    dest: 'current/build.js',
    plugins: [
        string({
            include: '**/*.glsl'
        })
    ]
}
