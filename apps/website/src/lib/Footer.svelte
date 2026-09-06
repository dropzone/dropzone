<script>
  import WhiteLogoSvg from './WhiteLogoSvg.svelte'
</script>

<footer>
  <nav>
    <div class="dropzone-home">
      <a href="/" class="logo"><WhiteLogoSvg /></a>
    </div>
    <div class="dropzone-js">
      <h3>Dropzone.js</h3>
      <ul>
        <li>
          <a sveltekit:prefetch href="/js/">Overview</a>
        </li>
        <li>
          <a class="secondary" href="https://docs.dropzone.dev">Documentation</a
          >
        </li>
        <li>
          <a class="secondary" href="https://github.com/dropzone/dropzone"
            >GitHub</a
          >
        </li>
      </ul>
    </div>
    <div class="social">
      <h3>Social</h3>
      <ul>
        <li>
          <a href="https://twitter.com/dropzonedev">Twitter</a>
        </li>
        <li>
          <a href="https://blog.dropzone.dev">Blog</a>
        </li>
      </ul>
    </div>
    <div class="projects">
      <h3>Other projects</h3>
      <ul>
        <li>
          <a href="https://www.pausly.app/">Pausly</a><br />
          <small
            >Take short (stretch) breaks with your friends and colleagues.</small
          >
        </li>
        <li>
          <a href="https://melodle.yesmeno.com">Melodle</a><br />
          <small>Like wordle, but for music.</small>
        </li>
      </ul>
    </div>
  </nav>
</footer>

<style>
  footer :global(svg) {
    height: 2rem;
  }
  footer {
    color: var(--title-color);
    text-align: center;
    margin-top: 9rem;
    padding: 0 var(--calculated-content-padding) 4rem;
    background: linear-gradient(
      to bottom,
      transparent,
      hsl(225deg 100% 70% / 10%)
    );
  }
  a {
    color: inherit;
  }
  .logo {
    display: block;
    margin-bottom: 3rem;
  }

  nav {
    /* max-width: 40rem; */
    margin: 0 auto;
    text-align: left;
    font-size: 0.875rem;
    display: grid;
    gap: 1.5rem;
    line-height: 1.5;

    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      'home     home'
      'js       social'
      'projects projects';
  }
  nav small {
    line-height: 1.2;
    display: inline-block;
  }
  nav li {
    margin: 0.5rem 0;
  }
  @media (min-width: 800px) {
    nav {
      grid-template-columns: repeat(5, 1fr);
      grid-template-areas: 'home js social projects';
    }
  }
  .dropzone-home {
    grid-area: home;
  }
  .dropzone-js {
    grid-area: js;
  }
  .social {
    grid-area: social;
  }

  h3 {
    font-size: 1rem;
    margin: 0;
  }

  li {
    display: block;
  }
</style>
