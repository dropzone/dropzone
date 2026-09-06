<div class="actions"><slot /></div>

<style>
  .actions {
    margin: 1.5rem -0.2rem 0;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .actions :global(a) {
    margin: 0 0.2rem 0.5rem;
    font-weight: bold;
  }

  @media (min-width: 600px) {
    .actions {
      justify-content: flex-start;
    }
  }
</style>
