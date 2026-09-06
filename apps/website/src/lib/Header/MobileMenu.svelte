<script type="ts">
  import { page } from '$app/stores'
  import WhiteLogoSvg from '$lib/WhiteLogoSvg.svelte'
  import { onDestroy, onMount } from 'svelte'
  import CloseIcon from '~icons/ion/close'
  import MenuIcon from '~icons/ion/menu'
  import Menu from './Menu.svelte'

  let isOpen = false
  let hydrated = false

  function toggle() {
    isOpen = !isOpen
  }

  onMount(() => {
    hydrated = true
  })

  let unsubscribe = page.subscribe(() => (isOpen = false))
  onDestroy(unsubscribe)
</script>

<div class:hydrated class="mobile-menu">
  <a href="/"><WhiteLogoSvg /></a>

  <button class="toggle" aria-label="Open Menu" on:click={toggle}
    ><MenuIcon /></button
  >
</div>

<nav class:open={isOpen}>
  <button
    class="close"
    aria-label="Close Menu"
    on:click={() => (isOpen = false)}><CloseIcon /></button
  >

  <Menu
    mobile
    --menu-color="black"
    --menu-hover-bg-color="rgba(0, 0, 0, 0.1)"
    --menu-border-color="black"
    --button-contained-background="black"
    --button-contained-background-hover="rgba(0, 0, 0, 0.8)"
    --color="black"
  />
</nav>

<style>
  a {
    color: inherit;
  }
  .mobile-menu {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;

    height: var(--menu-item-height);
  }
  .mobile-menu a {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  button {
    display: inline-block;
    padding: 0;
    outline: none;
    border: none;
    background: none;
    color: white;
    cursor: pointer;
  }
  .toggle {
    height: 1.5rem;
    width: 1.5rem;
    font-size: 1.5em;
    opacity: 0;
    transition: opacity 500ms ease;
  }
  .hydrated .toggle {
    opacity: 1;
  }
  nav {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    padding: 3rem;
    background: white;
    justify-content: center;
    align-items: center;
  }
  nav.open {
    display: flex;
    z-index: 10000;
  }
  .close {
    color: black;
    font-size: 3em;
    height: 3rem;
    width: 3rem;
    position: absolute;
    top: 1.5rem;
    right: 2.25rem;
  }
</style>
