<script lang="ts">
  export let items: string[]

  import Checkmark from '~icons/ion/md-checkmark'
</script>

<ul>
  {#each items as item}
    <li>
      <span class="icon">
        <Checkmark />
      </span>
      <span class="text">{item}</span>
    </li>
  {/each}
</ul>

<style>
  ul {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 1.5rem;
    grid-row-gap: 0.75rem;
  }
  li {
    display: flex;
    align-items: center;
  }
  .icon {
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 1rem;
  }
  .text {
    flex: 1;
  }
  .icon :global(svg) {
    background: white;
    border-radius: 50%;
    color: var(--primary-color);
  }
</style>
