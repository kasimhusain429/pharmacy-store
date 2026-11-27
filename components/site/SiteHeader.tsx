"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cart, useCart } from "@/lib/cart";
import { Wordmark } from "./Wordmark";
import { Sheet } from "./Sheet";
import { SearchDialog } from "./SearchDialog";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/prescriptions", label: "Prescriptions" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchKey, setSearchKey] = useState(0);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }
  const openSearch = () => {
    setSearchKey((k) => k + 1);
    setSearchOpen(true);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // "/" opens search from anywhere, as on most shops.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !/input|textarea|select/i.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        setSearchKey((k) => k + 1);
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled ? "bg-paper/88 shadow-[0_1px_0_var(--color-paper-3)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="gutter mx-auto flex h-(--header-h) max-w-[96rem] items-center gap-6">
          <Wordmark />

          <nav aria-label="Main" className="ml-auto hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="relative rounded-full px-3.5 py-2 text-sm text-ink-2 transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3.5 aria-[current=page]:after:bottom-1 aria-[current=page]:after:h-px aria-[current=page]:after:bg-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 md:ml-2">
            <button
              type="button"
              onClick={openSearch}
              className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm text-ink-2 transition-colors hover:bg-ink/5 hover:text-ink"
              aria-keyshortcuts="/"
            >
              <svg viewBox="0 0 20 20" className="size-[18px]" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="5.75" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="m13 13 4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="sr-only lg:not-sr-only">Search</span>
              <span className="sr-only"> products</span>
              <kbd aria-hidden="true" className="hidden rounded border border-ink/15 px-1.5 text-2xs text-ink-3 lg:inline">
                /
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => cart.open()}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-ink pr-1.5 pl-4 text-sm text-paper transition-colors hover:bg-night-2"
            >
              Cart
              <span className="tabular grid h-7 min-w-7 place-items-center rounded-full bg-paper/15 px-1.5 text-xs">
                {ready ? count : <span aria-hidden="true">·</span>}
              </span>
              {ready ? <span className="sr-only">{count === 1 ? "item" : "items"}</span> : null}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-ink/5 md:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
                <path d="M3 7h14M3 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} side="full" labelledBy="menu-title">
        <div className="flex h-full flex-col bg-paper">
          <div className="gutter flex h-(--header-h) items-center justify-between">
            <Wordmark onNavigate={() => setMenuOpen(false)} />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="inline-flex size-10 items-center justify-center rounded-full hover:bg-ink/5"
              aria-label="Close menu"
            >
              <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
                <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <h2 id="menu-title" className="sr-only">
            Menu
          </h2>
          <nav aria-label="Mobile" className="gutter mt-6 flex-1">
            <ul className="divide-y divide-paper-3 border-y border-paper-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="stretch-wide flex items-center justify-between py-5 text-xl font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/orders" onClick={() => setMenuOpen(false)} className="flex py-4 text-base text-ink-2">
                  Check an order
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Sheet>

      <SearchDialog key={searchKey} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
