"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./Header.module.css";

function Tab({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkDesktop = () => setIsDesktop(window.matchMedia("(min-width: 640px)").matches);
    if (typeof window !== "undefined") {
      checkDesktop();
      window.addEventListener("resize", checkDesktop);
      return () => window.removeEventListener("resize", checkDesktop);
    }
  }, []);

  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-2 py-1 text-sm relative text-gray-900 group"
    >
      <span>{label}</span>
      {/* Solo renderizar el subrayado animado en cliente y escritorio */}
      {mounted && active && isDesktop && (
        <motion.span
          className={styles.activeIndicator}
          layoutId="activeSection"
          transition={{ type: "spring", stiffness: 60, damping: 20, mass: 0.5 }}
        />
      )}
    </Link>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 h-[var(--header-h)] flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-6">
           <Image
            src="https://www.bancodeoccidente.com.co/documents/33634/406709/Banco+de+Occidente.png/a8e7e079-bff9-9a05-7d00-25cac54cad32?version=1.0&t=1747756786004"
            width={190} height={30} alt="Banco de Occidente"
            className="h-6 sm:h-8 w-auto object-contain"
            unoptimized
          />
          <nav className="hidden sm:flex items-center gap-4 md:gap-6">
            <Tab href="/" label="Home" />
            <Tab href="/aceleradores" label="Aceleradores" />
          </nav>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="sm:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menú"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-gray-200">
          <nav className="flex flex-col px-4 py-2 gap-2">
            <Tab href="/" label="Home" onClick={() => setMobileMenuOpen(false)} />
            <Tab href="/aceleradores" label="Aceleradores" onClick={() => setMobileMenuOpen(false)} />
          </nav>
        </div>
      )}
    </header>
  );
}
