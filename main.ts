// Worst Superpower — make.fun entry (u-suroto-worst-superpower-461dcdbe).
// One invented superpower, so pointless that naming it is the whole joke:
// a hero who can find any lost sock, but only once a replacement pair has
// already been bought. Writes that single line to stdout and to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt). Stdlib only,
// no network, deterministic on every run.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I can instantly find any lost sock — but only after its owner has already bought a replacement pair.";

// The gate allows 1 to 140 characters on a single line; fail loudly
// instead of shipping a line the sealed scorer would reject.
if (
  ENTRY.length < 1 ||
  ENTRY.length > 140 ||
  !ENTRY.trim() ||
  ENTRY.includes("\n")
) {
  throw new Error(`entry is ${ENTRY.length} characters, outside the 1-140 gate`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8"); // exact bytes, no trailing newline
process.stdout.write(ENTRY + "\n"); // stdout may carry the trailing newline
