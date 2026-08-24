import { test, expect } from "@playwright/test";
import { dropFile } from "./support/drop-file.js";

test.describe("Dropzone with zero configuration", () => {
  test("uploads a single file", async ({ page }) => {
    await page.goto("/1-basic/zero_configuration.html");

    const upload = page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        new URL(response.url()).pathname === "/"
    );

    await dropFile(page, ".dropzone", "image.jpg", "image/jpeg");

    const response = await upload;
    expect(JSON.parse(await response.text())).toEqual({ success: true });
  });
});
