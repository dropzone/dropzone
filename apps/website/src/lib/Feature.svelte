<script lang="ts">
  export let title: string
</script>

<div class="feature">
  <h3>{title}</h3>

  <slot />
</div>

<style>
  h3 {
    margin-bottom: 0.5rem;
  }
</style>
