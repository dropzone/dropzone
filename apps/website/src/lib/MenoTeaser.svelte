<script>
  import ContentSection from './ContentSection.svelte'
  import Heading from './Heading.svelte'
</script>

<ContentSection>
  <Heading subtitle="New music video">Don’t look back</Heading>

  <p>
    I just released a new music video: <strong>Don’t look back</strong>. Maybe
    you want to check it out.
  </p>

  <iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/zZ3tTxN7imk"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  />
</ContentSection>

<style lang="postcss">
  iframe {
    display: block;
    max-width: 100%;
  }
</style>
