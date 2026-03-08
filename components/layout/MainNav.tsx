"use client";

import { Button } from "@once-ui-system/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthControls } from "@/components/auth/AuthControls";

const navItems = [
  { href: "/explore", label: "Explore" },
  { href: "/quests", label: "Quests" },
  { href: "/ideas", label: "Ideas" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-semibold text-emerald-200">
            Local Hero
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Button
                key={item.href}
                href={item.href}
                variant={pathname.startsWith(item.href) ? "primary" : "tertiary"}
                size="s"
                className="min-w-[92px]"
              >
                {item.label}
              </Button>
            ))}
            <AuthControls />
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-slate-950/90 p-3 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-2xl grid-cols-5 gap-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              href={item.href}
              variant={pathname.startsWith(item.href) ? "primary" : "tertiary"}
              size="s"
              fillWidth
            >
              {item.label}
            </Button>
          ))}
        </div>
        <div className="mt-2 flex justify-center">
          <AuthControls />
        </div>
      </nav>
    </>
  );
}
