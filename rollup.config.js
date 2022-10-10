import resolve from 'rollup-plugin-node-resolve'; // plugin configuration
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';

import pkg from './package.json';

export default [{
		input: 'src/index.js',
		external: ['react', 'prop-types'],
		output: {
			name: 'ReactGraph',
			file: pkg.browser,
			format: 'umd',
			sourcemaps: true,
			globals: {
				react: 'React',
			}
		},
		plugins: [
			postcss({
				plugins: [autoprefixer()]
			}),
			resolve(),
			babel({
				exclude: 'node_modules/**'
			}),
			commonjs({
				include: /node_modules/
			})
		]
	}
];
