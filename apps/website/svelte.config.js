import postcssFunctions from 'postcss-functions'
import preprocess from 'svelte-preprocess'
import linearClamp from './postcss-linear-clamp.js'
import adapter from '@sveltejs/adapter-static'
import Icons from 'unplugin-icons/vite'
/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    postcss: {
      plugins: [
        postcssFunctions({
          functions: { linearClamp },
        }),
      ],
    },
  }),

  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    trailingSlash: 'always',
    adapter: adapter({
      // default options are shown
      pages: 'build',
      assets: 'build',
      fallback: null,
    }),
    vite: {
      build: {
        target: ['es2020'],
      },
      plugins: [
        Icons({
          compiler: 'svelte',
        }),
      ],
    },
  },
}

export default config
