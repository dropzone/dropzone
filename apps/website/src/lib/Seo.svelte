<script>
  export let title = 'Dropzone'
  export let description = 'Tools to build great forms.'
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />

  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="/images/opengraph.jpg" />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content="/images/opengraph.jpg" />

  <meta
    name="keywords"
    content="javascript dragndrop drag and drop drag'n'drop file upload image preview"
  />
</svelte:head>
