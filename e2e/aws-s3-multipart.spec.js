import { test, expect } from "@playwright/test";
import { dropFile } from "./support/drop-file.js";

const IMAGE_SIZE = 373282;
const CHUNK_SIZE = 100 * 1024;
const PART_COUNT = Math.ceil(IMAGE_SIZE / CHUNK_SIZE);

test.describe("Dropzone with AWS S3 multipart upload", () => {
  test("uploads every part and then completes the upload", async ({ page }) => {
    await page.goto("/2-integrations/aws-s3-multipart.html");

    // parallelChunkUploads is off, so parts arrive in order.
    const parts = [];
    page.on("response", (response) => {
      if (response.url().includes("/amazon-multipart-upload")) parts.push(response);
    });
    const completion = page.waitForRequest((request) =>
      request.url().includes("/amazon-complete")
    );

    await dropFile(page, ".dropzone", "image.jpg", "image/jpeg");

    await expect.poll(() => parts.length).toBe(PART_COUNT);

    const etags = [];
    let remaining = IMAGE_SIZE;
    for (const part of parts) {
      const headers = await part.request().allHeaders();
      expect(headers["content-type"]).toBe("image/jpeg");
      expect(headers["content-length"]).toBe(
        String(Math.min(remaining, CHUNK_SIZE))
      );
      expect(JSON.parse(await part.text())).toEqual({ success: true });

      etags.push(part.headers()["etag"].replaceAll('"', ""));
      remaining -= CHUNK_SIZE;
    }

    // The finalise request has to list every part, with the ETags the server
    // handed back for each one.
    const request = await completion;
    expect(JSON.parse(request.postData())).toEqual({
      UploadId: "demo-id", // the demo id defined in the html
      MultipartUpload: {
        Parts: etags.map((etag, index) => ({
          PartNumber: index + 1,
          ETag: etag,
        })),
      },
    });
  });
});
