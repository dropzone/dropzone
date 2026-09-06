<script>
  import Actions from '$lib/Actions.svelte'
  import CheckList from '$lib/CheckList.svelte'
  import ContentSection from '$lib/ContentSection.svelte'
  import Dropzone from '$lib/Dropzone.svelte'
  import Heading from '$lib/Heading.svelte'
  import Intro from '$lib/Intro.svelte'
  import MainFeature from '$lib/MainFeature.svelte'
  import MainFeatures from '$lib/MainFeatures.svelte'
  import MenoTeaser from '$lib/MenoTeaser.svelte'
  import Seo from '$lib/Seo.svelte'
  import StyledLink from '$lib/StyledLink.svelte'
  import PlusIcon from '~icons/ion/plus-round'
</script>

<Seo
  title="Dropzone.js"
  description="Dropzone.js is an open source library that provides beautiful and easy to use drag'n'drop file uploads with image previews."
/>

<Intro title="File uploads made easy">
  <p>
    <strong>Dropzone.js</strong> is one of the most popular drag and drop
    JavaScript libraries. It is
    <strong>free</strong>, <strong>fully open source</strong>, and makes it easy
    for you to handle dropped files on your website.
  </p>

  <p>It's meant to look good by default, and is highly customizable.</p>

  <Actions>
    <StyledLink href="https://docs.dropzone.dev/" color="white"
      >Documentation</StyledLink
    >
    <StyledLink
      href="https://docs.dropzone.dev/getting-started/installation/stand-alone"
      color="white"
      variant="text">Download</StyledLink
    >
  </Actions>

  <Dropzone slot="visual" />
</Intro>
<ContentSection backgroundColor="white">
  <MainFeatures>
    <MainFeature title="Source code on GitHub">
      <img slot="icon" src="/images/icons/github.svg" alt="GitHub" />
      <p>
        You can get all the source code on GitHub, as well as installation
        instructions. If you encounter an issue with this library, this is the
        place to create an issue.
      </p>
      <StyledLink slot="actions" href="https://github.com/dropzone/dropzone"
        >GitHub</StyledLink
      >
    </MainFeature>
    <MainFeature title="Documentation">
      <img slot="icon" src="/images/icons/gitbook.svg" alt="GitBook" />
      <p>
        All the documentation about Dropzone, and the multiple ways to configure
        and customise it, can be found on GitBook.
      </p>
      <StyledLink slot="actions" href="https://docs.dropzone.dev"
        >Docs</StyledLink
      >
    </MainFeature>
    <MainFeature title="Questions and Support">
      <div slot="icon">
        <img src="/images/icons/stackoverflow.svg" alt="Stackoverflow" />
        <span class="plus-icon-container"><PlusIcon /></span>
        <img src="/images/icons/github.svg" alt="GitHub" />
      </div>
      <p>
        If you need help, there are{' '}
        <a href="https://github.com/dropzone/dropzone/discussions">
          GitHub Discussions
        </a>{' '}
        and Stackoverflow. Use the tag dropzonejs and there'll be plenty of people
        helping you out.
      </p>
      <StyledLink
        slot="actions"
        href="https://stackoverflow.com/questions/tagged/dropzone.js"
        >Stack Overflow</StyledLink
      >
    </MainFeature>
  </MainFeatures>
</ContentSection>

<MenoTeaser />

<ContentSection backgroundColor="white">
  <Heading subtitle="And it's easy to add the features you want"
    >Dropzone.js comes feature packed</Heading
  >
  <div class="features">
    <div class="features__description">
      <h2>Built to last</h2>
      <p>
        Dropzone is a robust library trusted by millions. It started in 2012
        with compatibility in mind. Whether your users use an outdated browser,
        or have JavaScript enabled, Dropzone got you covered.
      </p>
    </div>
    <div class="features__list">
      <CheckList
        items={[
          'Chunked uploads',
          'Error handling',
          'Well tested',
          'Wide browser support',
          'Fallback without JavaScript',
          'Fully customizable',
          'Open Source',
          'Translation support',
          'jQuery plugin',
          'File queues',
          'Multiple installation options',
        ]}
      />
    </div>
  </div>
  <div class="features">
    <div class="features__description">
      <h2>Looking good by default</h2>
      <p>
        One main goal when creating Dropzone was to have file previews that are
        not only practical, but also look good. That's why the default design of
        Dropzone looks great without you needing to do anything.
      </p>
    </div>
    <div class="features__list">
      <CheckList
        items={[
          'Good looking defaults',
          'Image Previews',
          'Progress Bars',
          'Success & error icons',
          'Themes',
        ]}
      />
    </div>
  </div>
</ContentSection>

<style>
  .plus-icon-container {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    font-size: 1.6em;
    margin: 0 1rem;
    width: 2rem;
    text-align: center;
  }

  .features {
    display: flex;
    flex-direction: column;
    margin-bottom: 3rem;
  }
  @media (min-width: 800px) {
    .features {
      flex-direction: row;
      gap: 3rem;
    }
    .features__list {
      padding-top: 1.5rem;
    }
  }
  .features__description h2 {
    font-weight: bold;
    color: var(--title-color);
  }
  .features__description,
  .features__list {
    flex: 1;
  }
</style>
