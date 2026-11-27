/** Shared types and labels for orders, prescriptions and enquiries (client + server). */

export const ORDER_STATUSES = ["received", "checking-prescription", "preparing", "ready-for-collection", "out-for-delivery", "completed", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  received: "Received",
  "checking-prescription": "Pharmacist checking prescription",
  preparing: "Being prepared",
  "ready-for-collection": "Ready to collect",
  "out-for-delivery": "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const PRESCRIPTION_STATUSES = ["received", "checked", "query", "rejected"] as const;
export type PrescriptionStatus = (typeof PRESCRIPTION_STATUSES)[number];
export const PRESCRIPTION_STATUS_LABEL: Record<PrescriptionStatus, string> = {
  received: "Received, waiting for a pharmacist",
  checked: "Checked by a pharmacist",
  query: "Pharmacist needs to contact you",
  rejected: "Could not be accepted",
};

export type FulfilmentMethod = "pickup" | "delivery";

export type Address = { line1: string; line2?: string; city: string; postcode: string };

export type OrderRecord = {
  reference: string;
  createdAt: string;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; at: string }[];
  contact: { name: string; email: string; phone: string };
  fulfilment: { method: FulfilmentMethod; address?: Address };
  items: { slug: string; name: string; qty: number; unitPrice: number; requiresPrescription: boolean }[];
  subtotal: number;
  prescriptionReference?: string;
  notes?: string;
};

export type PrescriptionRecord = {
  reference: string;
  createdAt: string;
  status: PrescriptionStatus;
  patient: { name: string; dateOfBirth: string; email: string; phone: string };
  file: { stored: string; type: string; size: number };
  fulfilment: FulfilmentMethod;
  notes?: string;
};

export type EnquiryRecord = {
  reference: string;
  createdAt: string;
  status: "new" | "answered";
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
};

/** What the public order lookup returns. Contact and address details are never echoed back. */
export type OrderSummary = Pick<OrderRecord, "reference" | "createdAt" | "status" | "statusHistory" | "items" | "subtotal"> & {
  fulfilment: FulfilmentMethod;
  prescriptionStatus?: PrescriptionStatus;
};

export const ENQUIRY_TOPICS = ["A product", "An order", "A prescription", "Something else"] as const;
