import { existsSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && !extname(new URL(specifier, "file:///").pathname)) {
    const parentDir = dirname(fileURLToPath(context.parentURL));
    const asTs = join(parentDir, `${specifier}.ts`);
    if (existsSync(asTs)) {
      return { shortCircuit: true, url: pathToFileURL(asTs).href };
    }
  }
  return nextResolve(specifier, context);
}
