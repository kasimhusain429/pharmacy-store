"use client";

import { useId, useMemo, useRef, useState, useSyncExternalStore, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

const control =
  "w-full rounded-md border border-ink/20 bg-studio px-4 text-base text-ink transition-[border-color,box-shadow] placeholder:text-ink-3/60 hover:border-ink/35 focus:border-ink focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-amber-deep/30 aria-[invalid=true]:border-rx";

export function Field({
  label,
  hint,
  error,
  className = "",
  ...props
}: { label: string; hint?: ReactNode; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {props.required ? null : <span className="font-normal text-ink-3"> (optional)</span>}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-ink-3">
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined}
        className={`${control} mt-2 h-12`}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-rx">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextArea({
  label,
  hint,
  error,
  className = "",
  ...props
}: { label: string; hint?: ReactNode; error?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {props.required ? null : <span className="font-normal text-ink-3"> (optional)</span>}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-ink-3">
          {hint}
        </p>
      ) : null}
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined}
        className={`${control} mt-2 min-h-28 py-3`}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-rx">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Select({ label, error, children, className = "", ...props }: { label: string; error?: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <select id={id} aria-invalid={error ? true : undefined} className={`${control} mt-2 h-12`} {...props}>
        {children}
      </select>
      {error ? <p className="mt-1.5 text-sm text-rx">{error}</p> : null}
    </div>
  );
}

export function Choice({
  name,
  value,
  checked,
  onChange,
  title,
  description,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  title: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-md border border-ink/15 bg-studio/60 p-4 transition-colors hover:border-ink/40 has-[:checked]:border-ink has-[:checked]:bg-studio has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-deep/40">
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="peer sr-only" />
      <span aria-hidden="true" className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border border-ink/40 peer-checked:border-ink">
        <span className={`size-2 rounded-full bg-ink transition-transform ${checked ? "scale-100" : "scale-0"}`} />
      </span>
      <span>
        <span className="block text-sm font-medium">{title}</span>
        {description ? <span className="mt-0.5 block text-sm text-ink-2">{description}</span> : null}
      </span>
    </label>
  );
}

export function Checkbox({ name, children, error, required }: { name: string; children: ReactNode; error?: string; required?: boolean }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-ink-2">
        <input
          id={id}
          name={name}
          type="checkbox"
          required={required}
          className="mt-0.5 size-5 shrink-0 accent-[var(--color-ink)]"
          aria-invalid={error ? true : undefined}
        />
        <span>{children}</span>
      </label>
      {error ? <p className="mt-1.5 ml-8 text-sm text-rx">{error}</p> : null}
    </div>
  );
}

/** Hidden field that only bots fill in. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

const ACCEPT = "application/pdf,image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif";

/** Prescription file picker with drag and drop and an image preview. */
export function FileDrop({ name = "file", error, onFile }: { name?: string; error?: string; onFile?: (f: File | null) => void }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [over, setOver] = useState(false);

  const pick = (f: File | null) => {
    setFile(f);
    onFile?.(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f && f.type.startsWith("image/") && !/heic|heif/.test(f.type) ? URL.createObjectURL(f) : null);
  };

  return (
    <div>
      <p id={`${id}-label`} className="text-sm font-medium">
        Prescription
      </p>
      <p className="mt-1 text-xs text-ink-3">A clear photo or scan showing the whole prescription. PDF, JPG, PNG, WEBP or HEIC, up to 10 MB.</p>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f && input.current) {
            const dt = new DataTransfer();
            dt.items.add(f);
            input.current.files = dt.files;
            pick(f);
          }
        }}
        className={`guilloche mt-2 flex min-h-36 cursor-pointer items-center gap-5 rounded-md border border-dashed p-5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-deep/40 ${
          over ? "border-ink bg-paper-2" : error ? "border-rx" : "border-ink/30 hover:border-ink/60"
        }`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="size-24 shrink-0 rounded-sm object-cover" />
        ) : (
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-studio text-ink-2" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="size-7">
              <path
                d="M12 16V4m0 0-4.5 4.5M12 4l4.5 4.5M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
        <span className="text-sm">
          {file ? (
            <>
              <span className="block font-medium break-all">{file.name}</span>
              <span className="text-ink-3">{(file.size / 1024 / 1024).toFixed(1)} MB. Choose another file to replace it.</span>
            </>
          ) : (
            <>
              <span className="block font-medium">Choose a file or drag it here</span>
              <span className="text-ink-3">On a phone you can take a photo directly.</span>
            </>
          )}
        </span>
        <input
          ref={input}
          id={id}
          name={name}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          aria-labelledby={`${id}-label`}
          aria-invalid={error ? true : undefined}
          onChange={(e) => pick(e.target.files?.[0] ?? null)}
        />
      </label>
      {error ? <p className="mt-1.5 text-sm text-rx">{error}</p> : null}
    </div>
  );
}

type HistoryKey = "ps-orders" | "ps-prescriptions";
const historyListeners = new Set<() => void>();

/** Reads the device history without a hydration mismatch (empty on the server). */
export function useDeviceHistory(key: HistoryKey) {
  const raw = useSyncExternalStore(
    (cb) => {
      historyListeners.add(cb);
      window.addEventListener("storage", cb);
      return () => {
        historyListeners.delete(cb);
        window.removeEventListener("storage", cb);
      };
    },
    () => {
      try {
        return localStorage.getItem(key) ?? "[]";
      } catch {
        return "[]";
      }
    },
    () => "[]",
  );
  return useMemo(() => {
    try {
      return JSON.parse(raw) as { reference: string; at: string }[];
    } catch {
      return [];
    }
  }, [raw]);
}

/** Browser-only record of references created on this device, so customers can find them again. */
export const deviceHistory = {
  add(key: HistoryKey, reference: string) {
    try {
      const list = JSON.parse(localStorage.getItem(key) ?? "[]") as { reference: string; at: string }[];
      const next = [{ reference, at: new Date().toISOString() }, ...list.filter((x) => x.reference !== reference)].slice(0, 10);
      localStorage.setItem(key, JSON.stringify(next));
      historyListeners.forEach((l) => l());
    } catch {
      /* storage unavailable */
    }
  },
  list(key: HistoryKey) {
    try {
      return JSON.parse(localStorage.getItem(key) ?? "[]") as { reference: string; at: string }[];
    } catch {
      return [];
    }
  },
};
