"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const navLinks = [
  { label: "Scenarios", href: "/features/scenarios" },
  { label: "Quizzes", href: "/features/quizzes" },
  { label: "Weekly Quiz", href: "/weekly-quiz" },
  { label: "Decision Lab", href: "/features/decision-lab" },
  { label: "About", href: "/about" },
];

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Backdrop overlay - blurs page behind mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />
    <header className="fixed top-0 left-0 right-0 z-50 px-8 pt-6">
      <div className="nav-blur max-w-[1420px] mx-auto px-9 flex flex-col">
        {/* Top bar */}
        <div className="h-[76px] flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center shrink-0">
            <span className="text-[18px] font-semibold leading-none">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">R</span>
              <span className="text-white">efZone</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-5 py-2 rounded-md text-[16px] transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-white/45 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-5 ml-auto">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-[15px] font-medium bg-white/85 text-black py-2.5 px-5 rounded-xl hover:bg-white transition-colors border border-white/20"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="text-[16px] text-white/45 hover:text-white px-4 py-2 transition-colors">
                  Log in
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="flex items-center gap-2 text-[15px] font-medium bg-white/85 text-black py-2.5 px-5 rounded-xl hover:bg-white transition-colors border border-white/20"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button - animated hamburger */}
          <button
            className="lg:hidden p-2 text-white/60 hover:text-white transition-colors relative w-9 h-9 flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span className="flex flex-col justify-center items-center w-5 h-5 relative">
              <span
                className={`absolute h-[2.5px] w-5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  mobileOpen ? "h-[1.5px] rotate-45 top-[9.5px]" : "top-[4px]"
                }`}
              />
              <span
                className={`absolute h-[1.5px] w-5 bg-current rounded-full top-[9.5px] transition-all duration-200 ease-in-out ${
                  mobileOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
                }`}
              />
              <span
                className={`absolute h-[1.5px] w-5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  mobileOpen ? "-rotate-45 top-[9.5px]" : "top-[15px]"
                }`}
              />
            </span>
          </button>
        </div>

        {/* Mobile menu - expands inside the pill */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-white/[0.06]" />
          <nav className="py-3 flex flex-col gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`py-2.5 px-3 rounded-md text-[14px] transition-colors ${
                    isActive ? "text-white bg-white/[0.08]" : "text-white/45 hover:text-white"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-white/[0.06] mt-2 pt-3 flex flex-col gap-2">
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-1.5 text-[13px] font-medium bg-white text-black py-2.5 px-4 rounded-lg"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-[14px] text-white/45 py-2 px-3">Log in</Link>
                  <Link
                    href="/auth/sign-up"
                    className="flex items-center justify-center gap-1.5 text-[13px] font-medium bg-white text-black py-2.5 px-4 rounded-lg"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
    </>
  );
}
