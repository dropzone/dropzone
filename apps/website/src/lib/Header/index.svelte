<script type="ts">
  import Menu from './Menu.svelte'
  import MobileMenu from './MobileMenu.svelte'
</script>

<header>
  <div class="menu">
    <Menu />
  </div>
  <div class="menu--mobile">
    <MobileMenu />
  </div>
</header>

<style>
  header {
    position: relative;
    padding-left: var(--calculated-content-padding);
    padding-right: var(--calculated-content-padding);
    height: var(--header-height);
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: var(--button-font-size);
    font-family: var(--font-header);
    font-weight: 600;
    color: white;

    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.25),
      rgba(0, 0, 0, 0)
    );
  }

  .menu,
  .menu--mobile {
    width: 100%;
  }

  @media (max-width: 900px) {
    .menu {
      display: none;
    }
    .menu--mobile {
      display: block;
    }
  }
  @media (min-width: 900px) {
    .menu {
      display: block;
    }
    .menu--mobile {
      display: none;
    }
  }
</style>
