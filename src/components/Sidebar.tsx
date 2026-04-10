import styles from "./Documentador.module.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Sidebar({ onDocumentadorClick }: { onDocumentadorClick?: () => void }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(pathname === "/aceleradores");
  }, [pathname]);

  return (
    <aside className={`transition-all duration-300 relative ${open ? "sm:w-64" : "w-14 sm:w-16"} bg-white rounded-xl sm:rounded-2xl shadow-card border border-gray-100`}>
      <div className="h-10 sm:h-12 flex items-center justify-between px-2 sm:px-4 border-b">
        {open && (
          <div className="flex items-center gap-2">
            <img src="/icons/panel.png" alt="Aceleradores" width={25} height={25} className={`sm:w-6 sm:h-6 ${styles.iconAzulSombra}`} />
            <span className="text-xs sm:text-sm font-medium text-[#3a3b3d]">Panel</span>
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-md border px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-bold ml-auto bg-white text-[#5d5e60] shadow-md hover:bg-gray-100 transition-all duration-200"
          aria-label="Alternar panel"
          style={{ filter: "drop-shadow(0 1px 1px #3a3b3d88)", fontWeight: "bold", letterSpacing: "1px" }}
        >
          {open ? "×" : "≡"}
        </button>
      </div>
      <div className="p-2 sm:p-3 space-y-2">
        <div
          className="flex items-center sm:justify-start gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={onDocumentadorClick}
        >
          <div className="flex-shrink-0" style={{ width: "23px", height: "23px" }}>
            <img
              src="/file-stack.svg"
              alt="Documentador"
              width={28}
              height={28}
              style={{ width: "28px", height: "28px", objectFit: "contain", color: "#5d5e60" }}
              className={styles.iconAzulSombra}
            />
          </div>
          {open && <span className="text-xs sm:text-sm text-[#5d5e60]">Documentador</span>}
        </div>
      </div>
      {open && (
        <div className="absolute bottom-4 sm:bottom-7 right-4">
          <img src="/icons/doc.png" alt="Documentador" width={18} height={18} className="h-4 w-auto" />
        </div>
      )}
    </aside>
  );
}
