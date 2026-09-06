<script type="ts">
  // Once the dropzone library is loaded (in the browser) we set the action
  // that is going to be used on the dropzone element.
  let dropzoneAction: (node: HTMLDivElement) => void

  import loadDropzoneAction from './actions/dropzone-action'
  ;(async function () {
    dropzoneAction = await loadDropzoneAction()
  })()
</script>

<div class="dropzone-container">
  {#if dropzoneAction}
    <div class="dropzone" use:dropzoneAction>
      <div class="dz-message">
        <h1>Try it out!</h1>
        <p>Drag and drop files here</p>
        <p class="comment">
          This is just a demo Dropzone.
          <br />
          Dropped files are <strong>not</strong> actually uploaded.
        </p>
      </div>
    </div>
  {/if}
</div>

<style>
  .dropzone-container {
    border-radius: 2.5rem;
    border: 3px solid white;
    background: white;
    width: 21.875rem;
    height: 21.875rem;
    width: 100%;
    max-width: 21.875rem;
    margin: auto;
    box-shadow: 0 0.625rem 1.25rem rgba(0, 0, 0, 0.1);
  }
  .dropzone {
    height: 100%;
    width: 100%;
    border-radius: 2.5rem;
    padding: 1rem;
    border-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
  }

  .dropzone:global(.dz-drag-hover) {
    border-style: dashed;
    border-color: var(--primary-color);
  }

  .dropzone-container :global(.dropzone.dz-started) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    /* grid-gap: 1rem; */
  }
  .dropzone-container :global(.dropzone .dz-preview) {
    margin: 0.5rem;
    justify-self: center;
    align-self: center;
  }
  .dropzone-container :global(.dropzone .dz-preview.dz-image) {
    background: transparent;
  }

  .dz-message {
    text-align: center;
  }
  .dz-message h1 {
    font-size: 2.375rem;
    font-weight: bold;
    color: var(--title-color);
  }

  .dropzone .comment {
    font-size: 0.75rem;
    opacity: 0.5;
    margin-bottom: 0;
  }
</style>
