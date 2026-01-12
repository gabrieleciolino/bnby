import dotenv from "dotenv";
import { randomUUID } from "node:crypto";

dotenv.config({ path: ".env.local" });

const argKey = process.argv.find((arg) => arg.startsWith("--key="));
const key =
  argKey?.split("=")[1] ??
  `r2-test-${Date.now()}-${randomUUID().slice(0, 8)}.txt`;
const shouldDelete = process.argv.includes("--delete");

const body = `R2 upload test ${new Date().toISOString()}\n`;

async function main() {
  const { deleteObject, getPublicUrl, putObject } = await import("../lib/r2");
  const result = await putObject({
    key,
    body,
    contentType: "text/plain; charset=utf-8",
  });

  console.log(`Uploaded: ${result.key}`);
  if (process.env.R2_PUBLIC_BASE_URL) {
    console.log(`Public URL: ${getPublicUrl(result.key)}`);
  }

  if (shouldDelete) {
    await deleteObject(result.key);
    console.log("Deleted test object.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
