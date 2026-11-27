import Link from "next/link";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
  PRESCRIPTION_STATUSES,
  PRESCRIPTION_STATUS_LABEL,
  type EnquiryRecord,
  type OrderRecord,
  type PrescriptionRecord,
} from "@/lib/orders";
import { isStaff, staffEnabled } from "@/lib/server/staff";
import { listRecords } from "@/lib/server/storage";
import { formatPrice } from "@/lib/store";
import { btn } from "@/components/ui/buttons";

const fmt = (iso: string) => new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

function StatusForm({ kind, reference, value, options }: { kind: string; reference: string; value: string; options: [string, string][] }) {
  return (
    <form action="/api/staff/update" method="post" className="flex items-center gap-2">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="reference" value={reference} />
      <label className="sr-only" htmlFor={`s-${reference}`}>
        Status for {reference}
      </label>
      <select id={`s-${reference}`} name="status" defaultValue={value} className="h-9 rounded-md border border-ink/20 bg-studio px-2 text-sm">
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <button type="submit" className="h-9 rounded-full bg-ink px-3 text-xs text-paper">
        Update
      </button>
    </form>
  );
}

export async function StaffArea({ searchParams }: { searchParams: Promise<{ tab?: string; error?: string }> }) {
  const { tab = "orders", error } = await searchParams;

  if (!staffEnabled()) {
    return (
      <div className="max-w-xl">
        <h1 className="stretch-wide text-3xl font-medium">Staff area</h1>
        <p className="mt-4 text-base text-ink-2">
          The staff area is switched off. To use it, set a <code className="rounded bg-paper-2 px-1">STAFF_ACCESS_KEY</code> environment variable of at least 16
          characters and restart the site.
        </p>
      </div>
    );
  }

  if (!(await isStaff())) {
    return (
      <form action="/api/staff/session" method="post" className="max-w-sm space-y-5">
        <h1 className="stretch-wide text-3xl font-medium">Staff sign in</h1>
        <div>
          <label htmlFor="key" className="block text-sm font-medium">
            Access key
          </label>
          <input id="key" name="key" type="password" required autoComplete="current-password" className="mt-2 h-12 w-full rounded-md border border-ink/20 bg-studio px-4" />
        </div>
        {error ? (
          <p role="alert" className="text-sm text-rx">
            That key didn’t match. Try again.
          </p>
        ) : null}
        <button type="submit" className={btn.primary}>
          Sign in
        </button>
      </form>
    );
  }

  const [orders, prescriptions, enquiries] = await Promise.all([
    listRecords<OrderRecord>("orders"),
    listRecords<PrescriptionRecord>("prescriptions"),
    listRecords<EnquiryRecord>("enquiries"),
  ]);
  const tabs = [
    ["orders", `Orders (${orders.filter((o) => !["completed", "cancelled"].includes(o.status)).length} open)`],
    ["prescriptions", `Prescriptions (${prescriptions.filter((p) => p.status === "received").length} to check)`],
    ["enquiries", `Messages (${enquiries.filter((e) => e.status === "new").length} new)`],
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="stretch-wide text-3xl font-medium">Pharmacy inbox</h1>
        <form action="/api/staff/session" method="post">
          <input type="hidden" name="action" value="logout" />
          <button type="submit" className={btn.secondary}>
            Sign out
          </button>
        </form>
      </div>
      <nav aria-label="Inbox" className="mt-8 flex flex-wrap gap-2 border-b border-paper-3 pb-3">
        {tabs.map(([id, label]) => (
          <Link
            key={id}
            href={`/staff?tab=${id}`}
            aria-current={tab === id ? "page" : undefined}
            className="rounded-full px-4 py-2 text-sm text-ink-2 hover:bg-ink/5 aria-[current=page]:bg-ink aria-[current=page]:text-paper"
          >
            {label}
          </Link>
        ))}
      </nav>

      {tab === "orders" ? (
        <ul className="mt-6 space-y-4">
          {orders.length === 0 ? <li className="text-sm text-ink-3">No orders yet.</li> : null}
          {orders.map((o) => (
            <li key={o.reference} className="rounded-md bg-studio p-5 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="tabular text-base font-medium">{o.reference}</p>
                  <p className="text-ink-3">{fmt(o.createdAt)}</p>
                </div>
                <StatusForm kind="orders" reference={o.reference} value={o.status} options={ORDER_STATUSES.map((s) => [s, ORDER_STATUS_LABEL[s]])} />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-ink-3">Customer</p>
                  <p>{o.contact.name}</p>
                  <p>{o.contact.email}</p>
                  <p>{o.contact.phone}</p>
                </div>
                <div>
                  <p className="text-ink-3">{o.fulfilment.method === "pickup" ? "Collect in store" : "Delivery"}</p>
                  {o.fulfilment.address ? (
                    <p>
                      {o.fulfilment.address.line1}
                      {o.fulfilment.address.line2 ? `, ${o.fulfilment.address.line2}` : ""}, {o.fulfilment.address.city} {o.fulfilment.address.postcode}
                    </p>
                  ) : null}
                  {o.prescriptionReference ? (
                    <p className="mt-2">
                      Prescription{" "}
                      <Link className="underline" href={`/staff?tab=prescriptions#${o.prescriptionReference}`}>
                        {o.prescriptionReference}
                      </Link>
                    </p>
                  ) : null}
                  {o.notes ? <p className="mt-2 text-ink-2">Note: {o.notes}</p> : null}
                </div>
                <ul>
                  {o.items.map((i) => (
                    <li key={i.slug} className="flex justify-between gap-3">
                      <span>
                        {i.name} {i.requiresPrescription ? <span className="text-rx">(Rx)</span> : `× ${i.qty}`}
                      </span>
                      <span className="tabular">{formatPrice(i.unitPrice * i.qty)}</span>
                    </li>
                  ))}
                  <li className="mt-1 flex justify-between border-t border-paper-3 pt-1 font-medium">
                    <span>Subtotal</span>
                    <span className="tabular">{formatPrice(o.subtotal)}</span>
                  </li>
                </ul>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {tab === "prescriptions" ? (
        <ul className="mt-6 space-y-4">
          {prescriptions.length === 0 ? <li className="text-sm text-ink-3">No prescriptions yet.</li> : null}
          {prescriptions.map((p) => (
            <li key={p.reference} id={p.reference} className="rounded-md bg-studio p-5 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="tabular text-base font-medium">{p.reference}</p>
                  <p className="text-ink-3">{fmt(p.createdAt)}</p>
                </div>
                <StatusForm
                  kind="prescriptions"
                  reference={p.reference}
                  value={p.status}
                  options={PRESCRIPTION_STATUSES.map((s) => [s, PRESCRIPTION_STATUS_LABEL[s]])}
                />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-ink-3">Patient</p>
                  <p>{p.patient.name}</p>
                  <p>Born {p.patient.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-ink-3">Contact</p>
                  <p>{p.patient.email}</p>
                  <p>{p.patient.phone}</p>
                  <p className="mt-1">{p.fulfilment === "pickup" ? "Collect in store" : "Delivery"}</p>
                </div>
                <div>
                  <a className="underline" href={`/api/staff/prescriptions/${p.reference}`} target="_blank" rel="noreferrer">
                    Open prescription ({p.file.type.split("/")[1].toUpperCase()}, {(p.file.size / 1024).toFixed(0)} KB)
                  </a>
                  {p.notes ? <p className="mt-2 text-ink-2">Note: {p.notes}</p> : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {tab === "enquiries" ? (
        <ul className="mt-6 space-y-4">
          {enquiries.length === 0 ? <li className="text-sm text-ink-3">No messages yet.</li> : null}
          {enquiries.map((m) => (
            <li key={m.reference} className="rounded-md bg-studio p-5 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="tabular text-base font-medium">
                    {m.reference} <span className="font-normal text-ink-3">· {m.topic}</span>
                  </p>
                  <p className="text-ink-3">{fmt(m.createdAt)}</p>
                </div>
                <StatusForm
                  kind="enquiries"
                  reference={m.reference}
                  value={m.status}
                  options={[
                    ["new", "New"],
                    ["answered", "Answered"],
                  ]}
                />
              </div>
              <p className="mt-3">
                {m.name}, {m.email}
                {m.phone ? `, ${m.phone}` : ""}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-ink-2">{m.message}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
