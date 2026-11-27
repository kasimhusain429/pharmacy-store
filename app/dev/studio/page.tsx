import { notFound } from "next/navigation";
import { StudioClient } from "./StudioClient";

export const metadata = { title: "Render studio", robots: { index: false } };

/**
 * Development-only tool: renders catalogue images from the 3D packaging kit
 * so product photos match the WebGL scenes. Not available in production.
 */
export default function StudioPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <StudioClient />;
}
