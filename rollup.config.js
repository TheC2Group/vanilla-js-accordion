import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const pjson = require('./package.json');
const filename = pjson['jsnext:main'];

const banner = `/*!
 * ${pjson.name}
 * ${pjson.homepage}
 * @version ${pjson.version}
 * @license ${pjson.license} ${pjson.copyright}
 */`;

export default {
    input: pjson['jsnext:main'],
    output: [
        {
            banner,
            file: `cjs/${filename}`,
            format: 'cjs',
            name: pjson['export']
        },
        {
            banner,
            file: `iife/${filename}`,
            format: 'iife',
            name: pjson['export']
        },
        {
            banner,
            file: `umd/${filename}`,
            format: 'umd',
            name: pjson['export'],
        }
    ],
    plugins: [
        babel(),
        resolve(),
        commonjs()
    ]
};
