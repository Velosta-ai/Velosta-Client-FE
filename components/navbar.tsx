"use client";
import velostaLogo from "../public/VelostaLogo.png";
import Link from "next/link";
import Image from "next/image";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DestinationsModal } from "./destinations-modal";
import { useUser } from "@/app/utils/context";
import { UserProfileMenu } from "./user-profile-menu";

function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        height={100}
        width={100}
        alt="logo"
        className="rounded-xl h-14 w-14"
        src={velostaLogo}
      />
    </Link>
  );
}

const navLinks = [
  { href: "/velosta-ai", label: "Velosta AI" },
  { href: "/travel-blogs", label: "HowNotToTravel" },
  { href: "/expense-tracker", label: "Expense Tracker" },
];
type NavbarProps = {
  className?: string;
};

export default function Navbar({ className = "" }: NavbarProps) {
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, setUser, setAccessToken, accessToken } = useUser();

  const handleLogout = () => {
    setUser(null);
    setAccessToken(null);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      role="navigation"
      aria-label="Main"
    >
      {/* container */}
      <div className={` ${className ? className : "mx-auto"}  max-w-6xl px-6`}>
        {/* bar */}
        <div className="mt-4 flex items-center justify-between rounded-full border border-black/5 bg-white/80 px-5 py-2.5 shadow-sm backdrop-blur-md">
          {/* left: brand */}
          <div className="flex items-center gap-4">
            <BrandMark />

            <nav className="hidden lg:flex items-center gap-4 pl-0 text-sm lg:gap-6 lg:pl-4">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
                  onClick={() =>
                    l.label === "Destinations"
                      ? setDestinationsOpen(true)
                      : null
                  }
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* right: desktop auth + mobile hamburger */}
          <div className="flex items-center gap-2">
            {/* Desktop only - auth section */}
            {accessToken ? (
              <div className="hidden lg:block">
                <UserProfileMenu />
              </div>
            ) : (
              <Button
                asChild
                className="h-9 rounded-full px-4 text-sm font-semibold text-[color:var(--color-brand-contrast)] hidden lg:flex"
                style={{
                  background:
                    "linear-gradient(180deg, var(--color-brand-start), var(--color-brand))",
                }}
              >
                <Link href="sign-in">Get Started</Link>
              </Button>
            )}

            {/* Hamburger menu - always visible on tablet/mobile */}
            <div className="lg:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 w-9 rounded-full"
                    aria-label="Open menu"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-neutral-700"
                      aria-hidden="true"
                    >
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] sm:w-[380px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <BrandMark />
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 flex flex-col gap-6">
                    <nav className="flex flex-col gap-1">
                      {/* User Info at top if logged in */}
                      {accessToken && user && (
                        <div className="mb-4 rounded-lg px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand-start)] to-[var(--color-brand)] text-sm font-semibold text-[color:var(--color-brand-contrast)]">
                              {user.name?.charAt(0).toUpperCase() ||
                                user.email?.charAt(0).toUpperCase() ||
                                "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-neutral-900 truncate">
                                {user.name || "User"}
                              </p>
                              <p className="text-xs text-neutral-600 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Navigation Links */}
                      {navLinks.map((l) => (
                        <Link
                          key={l.href}
                          onClick={() => {
                            if (l.label === "Destinations") {
                              setDestinationsOpen(true);
                            }
                            setMobileMenuOpen(false);
                          }}
                          href={l.href}
                          className="group relative overflow-hidden rounded-lg px-4 py-3 text-[15px] font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-50 hover:text-neutral-900 active:scale-[0.98]"
                        >
                          <span className="relative z-10">{l.label}</span>
                          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-neutral-100/50 to-transparent transition-transform duration-300 group-hover:translate-x-0" />
                        </Link>
                      ))}

                      {/* User Section */}
                      <div className="mt-6 border-t border-neutral-100 pt-6">
                        {accessToken && user ? (
                          <div className="flex flex-col gap-3">
                            {/* Logout Button */}
                            <button
                              onClick={handleLogout}
                              className="group relative overflow-hidden rounded-lg px-4 py-3 text-[15px] font-medium text-red-600 transition-all duration-200 hover:bg-red-50 active:scale-[0.98]"
                            >
                              <span className="relative z-10 flex items-center gap-2">
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  className="text-red-600"
                                >
                                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                  <polyline points="16 17 21 12 16 7" />
                                  <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Log out
                              </span>
                              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-red-100/50 to-transparent transition-transform duration-300 group-hover:translate-x-0" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <Button
                              asChild
                              className="h-11 w-1/2 rounded-full px-6 text-[15px] font-semibold text-[color:var(--color-brand-contrast)] shadow-lg shadow-[var(--color-brand)]/20 transition-all duration-200 hover:shadow-xl hover:shadow-[var(--color-brand)]/30 active:scale-[0.97]"
                              style={{
                                background:
                                  "linear-gradient(180deg, var(--color-brand-start), var(--color-brand))",
                              }}
                            >
                              <Link
                                href="/sign-in"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                Get Started
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
      <DestinationsModal
        open={destinationsOpen}
        onOpenChange={setDestinationsOpen}
      />
    </header>
  );
}
