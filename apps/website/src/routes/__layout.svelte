<script lang="ts">
  import '../style/reset.css'
  import '../style/fonts.css'
  import '../style/app.css'

  import { page } from '$app/stores'
  import Footer from '$lib/Footer.svelte'
  import Header from '$lib/Header/index.svelte'
  import '@fontsource/heebo/400.css'
  import '@fontsource/heebo/700.css'
  import { onMount } from 'svelte'
  import { env } from '$lib/env'

  let section: string
  let headerImage: string
  $: {
    section = $page.url.pathname.split('/')[1]

    if (['js', 'plus'].includes(section))
      headerImage = `url(/images/backdrops/${section}.jpg)`
    else headerImage = `url(/images/backdrops/default.jpg)`
  }

  onMount(() => {
    document.body.classList.add('hydrated')
    new Image().src = '/images/backdrops/default.jpg'
    new Image().src = '/images/backdrops/plus.jpg'
    new Image().src = '/images/backdrops/js.jpg'
  })
</script>

<Header --header-backdrop-image={headerImage} />

<main data-variant={env.variant}>
  <slot />
</main>

<Footer />

<style>
  :global(:root) {
    font-family: 'Heebo', sans-serif;
    --font-header: 'BespokeSans-Variable', sans-serif;

    --button-font-size: 0.94rem;
    --button-contained-background: rgba(255, 255, 255, 0.2);
    --button-contained-background-hover: rgba(255, 255, 255, 0.3);

    --max-content-width: 68rem;
    --content-padding: linearClamp(tiny, medium, 1.5, 3);
    --calculated-content-padding: max(
      var(--content-padding),
      calc((100vw - var(--max-content-width)) / 2)
    );
    --content-vertical-padding: linearClamp(tiny, huge, 3, 9);

    --menu-item-height: 2.25rem;

    --header-height: 6rem;

    /* Colors */
    --background-color: #f2f4f6;

    --primary-color: hsl(225, 100%, 50%);
    --primary-bg-color: hsla(225, 100%, 50%, 0.05);

    --secondary-color: hsl(239, 100%, 11%);
    --secondary-bg-color: hsla(239, 100%, 11%, 0.05);

    --white-color: hsl(0, 0%, 100%);
    --white-bg-color: hsla(0, 0%, 100%, 0.05);

    --text-color: #4d4d4d;
    --title-color: #000000;

    --intro-title-color: white;

    --backdrop-position: 'center bottom';
    --backdrop-skew-rotation: -5deg;
    /* https://ddg.gg/?q=tan(5+*+pi+%2F+180)&ia=calculator */
    --backdrop-skew-tan: 0.08748866353;
  }
  main {
    position: relative;
    flex: 1;
  }
</style>
