// Worst Superpower — make.fun v2 resubmit (u-suroto-worst-superpower-461dcdbe).
//
// The joke, restated as data: a "power" is only a power if it lets you do
// something you could not already do. X-ray vision restricted to glass
// walls fails that test completely — glass is already transparent — so
// the ability is worthless, which is exactly what the prompt asks for.
// The program below assembles that one-liner from its clauses, checks it
// against the 1-140 character single-line gate, and writes it verbatim
// to $MAKEFUN_OUTPUT_DIR/entry.txt. Stdlib only, no network, deterministic.

import * as fs from "node:fs";
import * as path from "node:path";

type GateResult = { ok: true } | { ok: false; reason: string };

function checkGate(text: string): GateResult {
  const chars = [...text];
  if (chars.length === 0) return { ok: false, reason: "entry is empty" };
  if (chars.length > 140) {
    return { ok: false, reason: `entry is ${chars.length} chars, over the 140 limit` };
  }
  if (text !== text.trim()) {
    return { ok: false, reason: "entry has leading or trailing whitespace" };
  }
  for (const ch of text) {
    if (ch === "\n" || ch === "\r") {
      return { ok: false, reason: "entry must be a single line" };
    }
  }
  return { ok: true };
}

function buildEntry(): string {
  // Clauses in narrative order: claim, restriction, punchline.
  const clauses: string[] = [
    "I can see through walls",
    " — but only walls made of glass,",
    " which I could already see through.",
  ];
  return clauses.reduce((acc, clause) => acc + clause, "");
}

function resolveOutDir(): string {
  const raw = process.env.MAKEFUN_OUTPUT_DIR;
  if (raw !== undefined && raw.length > 0) return raw;
  return path.resolve("/output");
}

function main(): void {
  const entry = buildEntry();
  const gate = checkGate(entry);
  if (!gate.ok) {
    throw new Error(`entry failed the 1-140 gate: ${gate.reason}`);
  }

  const outDir = resolveOutDir();
  fs.mkdirSync(outDir, { recursive: true });
  const target = path.join(outDir, "entry.txt");
  const payload = Buffer.from(entry, "utf8");
  const handle = fs.openSync(target, "w");
  try {
    fs.writeSync(handle, payload, 0, payload.length, 0);
  } finally {
    fs.closeSync(handle);
  }
  // Read-back: the file on disk must be byte-identical to the entry.
  const written = fs.readFileSync(target);
  if (!written.equals(payload)) {
    throw new Error("entry.txt on disk does not match the entry text");
  }
  process.stdout.write(entry + "\n");
}

main();
