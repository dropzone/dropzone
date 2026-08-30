import fs from "node:fs";
import path from "node:path";

// Playwright runs with the cwd set to the directory holding its config.
const fixtures = path.join(process.cwd(), "e2e", "fixtures");

// Dropzone's whole point is drag-and-drop, so the e2e tests exercise a real
// drop event rather than setting the hidden file input. Playwright has no
// built-in for this: the File has to be constructed inside the page and handed
// back as a DataTransfer.
export async function dropFile(page, selector, fixture, type) {
  const base64 = fs.readFileSync(path.join(fixtures, fixture)).toString("base64");

  const dataTransfer = await page.evaluateHandle(
    ({ base64, name, type }) => {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      const transfer = new DataTransfer();
      transfer.items.add(new File([bytes], name, { type }));
      return transfer;
    },
    { base64, name: fixture, type },
  );

  await page.locator(selector).dispatchEvent("drop", { dataTransfer });
}
