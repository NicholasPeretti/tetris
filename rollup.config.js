import rimraf from 'rimraf'
import html from '@rollup/plugin-html'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import OMT from '@surma/rollup-plugin-off-main-thread'
import postcss from 'rollup-plugin-postcss'
import tailwind from 'tailwindcss'
import purgecss from '@fullhuman/postcss-purgecss'
import cssnano from 'cssnano'
import { uglify } from 'rollup-plugin-uglify'
import replace from '@rollup/plugin-replace'
import minify from 'rollup-plugin-babel-minify'

import typescript from './lib/rollup-typescript'
import renderHtmlTemplate from './lib/render-html-template'
import svgResolver from './lib/rollup-svg-resolver'
import assets from './lib/rollup-assets'

rimraf.sync('./dist/')
rimraf.sync('./.ts-tmp/')

const isProd = process.env.NODE_ENV === 'production'

export default ({ watch }) => ({
  input: {
    main: './src/bootstrap.ts',
  },
  output: {
    dir: 'dist',
    format: 'amd',
    chunkFileNames: '[name]-[hash].js',
    entryFileNames: '[name]-[hash].js',
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        isProd ? 'production' : 'development'
      ),
    }),
    typescript('./', { watch }),
    nodeResolve(),
    commonjs(),
    OMT(),
    svgResolver(),
    assets('./src/assets/'),
    postcss({
      minimize: isProd,
      extract: true,
      plugins: [
        //  Generate tailwind styles
        tailwind,

        //  Apply minifiers (prod only)
        ...(isProd
          ? [
              purgecss({
                content: [
                  './src/**/*.tsx',
                  './src/*.tsx',
                  './src/template.ejs',
                ],
                defaultExtractor: content =>
                  content.match(/[\w-/:]+(?<!:)/g) || [],
              }),
              cssnano,
              uglify,
            ]
          : []),
      ],
    }),
    minify({
      comments: false,
    }),
    html({
      title: 'Tetris',
      template: options => {
        return renderHtmlTemplate('./src/template.ejs', options)
      },
    }),
  ],
})
