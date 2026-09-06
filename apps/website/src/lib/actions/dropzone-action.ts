import type { DropzoneFile } from 'dropzone'
import type Dropzone from 'dropzone'

import { browser } from '$app/env'
import type { Action } from './type'

interface DropzoneWithSubmit extends Dropzone {
  submitRequest: (
    xhr: XMLHttpRequest,
    formData: FormData,
    files: DropzoneFile[]
  ) => void
}

/// If this runs in the browser, this will load the library, and return a Svelte
/// action that can be used on an element.
export default async function loadDropzoneAction(): Promise<
  Action<undefined, HTMLDivElement>
> {
  if (browser) {
    const pkg = await import('dropzone')
    const Dropzone = pkg.default
    Dropzone.autoDiscover = false

    return (node) => {
      const destroy = setupDropzone(Dropzone, node)

      return {
        destroy: destroy,
      }
    }
  }
}

/// Sets up dropzone, and returns a destroy function.
function setupDropzone(DropzoneClass: typeof Dropzone, node: HTMLDivElement) {
  const dropzone = new DropzoneClass(node, {
    url: '/',
    maxFiles: 4,
    parallelUploads: 1,
    uploadMultiple: false,
  }) as DropzoneWithSubmit

  // Prevent more than 4 files to be added.
  const originalAddFile = dropzone.addFile.bind(dropzone)
  dropzone.addFile = (...params) => {
    if (dropzone.files.length < 4) {
      originalAddFile(...params)
    }
  }

  const timeouts: NodeJS.Timeout[] = []

  dropzone.submitRequest = (_, __, files) => {
    const steps = 8
    const totalMs = 2000

    for (let i = 0; i < steps; i++) {
      timeouts.push(
        setTimeout(() => {
          dropzone.emit(
            'uploadprogress',
            files[0],
            (100 / (steps - 1)) * i,
            (files[0].size / (steps - 1)) * i
          )
          if (i === steps - 1) {
            files[0].status = 'success'

            dropzone.emit('success', files[0], 'success')
            dropzone.emit('complete', files[0])
            dropzone.processQueue()

            if (dropzone.getFilesWithStatus('success').length == 4) {
              dropzone.disable()
            }
          }
        }, (totalMs / steps) * i)
      )
    }
  }
  return () => {
    timeouts.forEach((tid) => clearTimeout(tid))
    dropzone.destroy()
  }
}
