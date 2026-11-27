import { randomBytes, randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Minimal file-based storage for orders, prescriptions and enquiries.
 *
 * Files live in DATA_DIR (default ./.data, git-ignored), outside /public, so
 * nothing here is ever served directly. Prescription images are personal
 * health data: for production, point DATA_DIR at encrypted storage with
 * backups and a retention policy that meets your local pharmacy regulations,
 * or replace these functions with your database / document store.
 */
// turbopackIgnore: these paths are runtime data, not source files, so the build must not trace them.
const DATA_DIR = process.env.DATA_DIR ? path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR) : path.join(/*turbopackIgnore: true*/ process.cwd(), ".data");

export type Kind = "orders" | "prescriptions" | "enquiries";

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Human-friendly reference, e.g. ORD-7KQ2M9XA. Unambiguous characters only. */
export function newReference(prefix: "ORD" | "RX" | "MSG") {
  const bytes = randomBytes(8);
  let out = "";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return `${prefix}-${out}`;
}

export const isReference = (prefix: string, value: unknown): value is string =>
  typeof value === "string" && new RegExp(`^${prefix}-[${ALPHABET}]{8}$`).test(value);

async function dir(kind: Kind, sub = "") {
  const d = path.join(/*turbopackIgnore: true*/ DATA_DIR, kind, sub);
  await mkdir(/*turbopackIgnore: true*/ d, { recursive: true });
  return d;
}

export async function saveRecord<T extends { reference: string }>(kind: Kind, record: T) {
  const d = await dir(kind);
  await writeFile(path.join(/*turbopackIgnore: true*/ d, `${path.basename(record.reference)}.json`), JSON.stringify(record, null, 2), { encoding: "utf8", mode: 0o600 });
}

export async function readRecord<T>(kind: Kind, reference: string): Promise<T | null> {
  try {
    const d = await dir(kind);
    const raw = await readFile(path.join(/*turbopackIgnore: true*/ d, `${path.basename(reference)}.json`), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function listRecords<T extends { createdAt: string }>(kind: Kind): Promise<T[]> {
  const d = await dir(kind);
  const files = (await readdir(/*turbopackIgnore: true*/ d)).filter((f) => f.endsWith(".json"));
  const records = await Promise.all(files.map(async (f) => JSON.parse(await readFile(path.join(/*turbopackIgnore: true*/ d, f), "utf8")) as T));
  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Stores an uploaded file under a random name. Returns the stored file name. */
export async function saveUpload(kind: Kind, buffer: Buffer, ext: string) {
  const d = await dir(kind, "files");
  const name = `${randomUUID()}.${ext}`;
  await writeFile(path.join(/*turbopackIgnore: true*/ d, name), buffer, { mode: 0o600 });
  return name;
}

export async function readUpload(kind: Kind, storedName: string) {
  const d = await dir(kind, "files");
  return readFile(path.join(/*turbopackIgnore: true*/ d, path.basename(storedName)));
}
