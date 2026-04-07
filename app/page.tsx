"use client";
import Hero from "@/components/Hero";
import Link from "next/link";

export default function Page() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Hero />

      <section className="card">
        <div className="card-body flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-slate-900">
              GFT
              <span className="inline-block h-3 w-3 rounded-sm bg-slate-900" aria-hidden />
            </h2>

            <p className="mt-2 text-[15px] sm:text-base md:text-lg text-slate-700 leading-relaxed">
              GFT: desbloqueamos el valor de tus datos y generamos impacto empresarial sostenible con IA y tecnología.
            </p>
          </div>

          <Link
            href="/aceleradores"
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#061224] text-white text-center text-sm sm:text-base hover:opacity-90 transition-opacity"
          >
            Ir a Aceleradores
          </Link>
        </div>
      </section>
    </div>
  );
}
