import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./Header.module.css";

function Tab({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick?: () => void;
}) {
  const { pathname } = useLocation();
  const active = pathname === to;
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkDesktop = () => setIsDesktop(window.matchMedia("(min-width: 640px)").matches);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return (
    <Link
      to={to}
      onClick={onClick}
      className="px-2 py-1 text-sm relative text-[#3a3b3d] group"
    >
      <span>{label}</span>
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
          <img
            src="/icons/docuement.png"
            width={32}
            height={32}
            alt="Documentador"
            className="h-6 sm:h-8 w-auto object-contain"
          />
          <nav className="hidden sm:flex items-center gap-4 md:gap-6">
            <Tab to="/" label="Home" />
            <Tab to="/aceleradores" label="Panel" />
          </nav>
        </div>

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

      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-gray-200">
          <nav className="flex flex-col px-4 py-2 gap-2">
            <Tab to="/" label="Home" onClick={() => setMobileMenuOpen(false)} />
            <Tab to="/aceleradores" label="Panel" onClick={() => setMobileMenuOpen(false)} />
          </nav>
        </div>
      )}
    </header>
  );
}
