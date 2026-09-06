<script lang="ts">
  export let title: string
</script>

<section class="main-feature">
  <div class="main-feature__icon-header">
    <slot name="icon" />
  </div>
  <h3>{title}</h3>
  <slot />
  <div class="main-feature__actions">
    <slot name="actions" />
  </div>
</section>

<style>
  .main-feature {
    flex: 1;
    min-width: 12em;
    max-width: 26em;
    margin-bottom: 1.5rem;
  }
  .main-feature__actions {
    text-align: right;
  }
  .main-feature__icon-header {
    margin-bottom: 1rem;
  }
</style>
