import type { DropzoneFile } from "dropzone";
import { Dropzone } from "dropzone";
// From the workspace too, so the stylesheet cannot drift from the code.
import "dropzone/dist/dropzone.css";

import type { Attachment } from "svelte/attachments";

/**
 * Sets up dropzone on given HTML element.
 */
export const dropzone = (): Attachment<HTMLElement> => {
  return (node: HTMLElement) => {
    const dropzone = new Dropzone(node, {
      url: "/",
      maxFiles: 4,
      parallelUploads: 1,
      uploadMultiple: false,
    });

    // Prevent more than 4 files to be added.
    const originalAddFile = dropzone.addFile.bind(dropzone);
    dropzone.addFile = (...params) => {
      if (dropzone.files.length < 4) {
        originalAddFile(...params);
      }
    };

    const timeouts: NodeJS.Timeout[] = [];

    (dropzone as any).submitRequest = (_: XMLHttpRequest, __: FormData, files: DropzoneFile[]) => {
      const steps = 8;
      const totalMs = 2000;

      for (let i = 0; i < steps; i++) {
        timeouts.push(
          setTimeout(
            () => {
              dropzone.emit(
                "uploadprogress",
                files[0],
                (100 / (steps - 1)) * i,
                (files[0].size / (steps - 1)) * i,
              );
              if (i === steps - 1) {
                files[0].status = "success";

                dropzone.emit("success", files[0], "success");
                dropzone.emit("complete", files[0]);
                dropzone.processQueue();

                if (dropzone.getFilesWithStatus("success").length == 4) {
                  dropzone.disable();
                }
              }
            },
            (totalMs / steps) * i,
          ),
        );
      }
    };
    return () => {
      timeouts.forEach((tid) => clearTimeout(tid));
      dropzone.destroy();
    };
  };
};
