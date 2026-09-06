# Upload Queue

When a file gets added to the dropzone, its `status` gets set to `Dropzone.QUEUED`\(after the `accept` function check passes\) which means that the file is now in the queue.

If you have the option `autoProcessQueue` set to `true` then the queue is immediately processed, after a file is dropped or an upload finished, by calling`.processQueue()` which checks how many files are currently uploading, and if it’s less than `options.parallelUploads`, `.processFile(file)` is called.

If you set `autoProcessQueue` to `false`, then `.processQueue()` is never called implicitly. This means that you have to call it yourself when you want to upload all files currently queued.

