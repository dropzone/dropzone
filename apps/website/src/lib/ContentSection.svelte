<script>
  import Backdrop from './Backdrop.svelte'

  export let backgroundColor = 'transparent'
</script>

<section class="wrapper">
  <Backdrop {backgroundColor} />
  <div class="backdrop" style="background-color: {backgroundColor};" />
  <slot />
</section>

<style>
  .wrapper {
    position: relative;
    display: block;
    padding: var(--content-vertical-padding) var(--calculated-content-padding);
  }

  .backdrop {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    transform: skew(0deg, var(--backdrop-skew-rotation));
    z-index: -1;
  }
</style>
