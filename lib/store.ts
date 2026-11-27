/**
 * Business information for the pharmacy.
 *
 * Only facts the pharmacy has confirmed belong here. Anything left as `null`
 * is simply not shown on the site (in development a small reminder appears
 * where the information would go). Do not fill these with guesses: customers
 * rely on them to reach the pharmacy and to understand how orders work.
 */

export type OpeningHours = {
  /** e.g. "Monday to Friday" */
  days: string;
  /** e.g. "9:00 – 18:00" */
  hours: string;
}[];

export type StoreInfo = {
  name: string;
  /** One sentence used in metadata and the footer. */
  description: string;
  currency: "USD";
  locale: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    region?: string;
    postcode: string;
    country: string;
    /** Optional link to the store on a map provider. */
    mapUrl?: string;
  } | null;
  phone: string | null;
  email: string | null;
  openingHours: OpeningHours | null;
  /** How customers can receive orders placed on the site. */
  fulfilment: {
    pickup: boolean;
    delivery: boolean;
    /** Optional, factual note about delivery areas or fees, written by the pharmacy. */
    deliveryNote: string | null;
  };
  payment: {
    /** No payment gateway is connected, so orders are placed as requests. */
    online: false;
    /** Shown at checkout so customers know what happens after they order. */
    note: string;
  };
  /** Shown in the footer. Keep it to emergency guidance. */
  emergencyNotice: string;
};

export const store: StoreInfo = {
  name: "Pharmacy Store",
  description:
    "Prescriptions, everyday medicines, vitamins, skincare and health devices from your local pharmacy.",
  currency: "USD",
  locale: "en-US",
  address: null,
  phone: null,
  email: null,
  openingHours: null,
  fulfilment: {
    pickup: true,
    delivery: true,
    deliveryNote: null,
  },
  payment: {
    online: false,
    note: "You don't pay online. The pharmacy confirms your order, the total and how to pay before anything is prepared.",
  },
  emergencyNotice:
    "If you or someone else is having a medical emergency, call 911 now. This website is for ordering pharmacy products and is not monitored for urgent medical questions.",
};

export const formatPrice = (value: number) =>
  new Intl.NumberFormat(store.locale, { style: "currency", currency: store.currency }).format(value);
