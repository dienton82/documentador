import Hero from "../components/Hero";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Hero />

      <section className="card">
        <div className="card-body flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-[#3a3b3d]">
             
            </h2>

            <p className="mt-2 text-[15px] sm:text-base md:text-lg text-[#5d5e60] leading-relaxed">
              Herramienta documental con enfoque en automatización inteligente. Flujo de carga, validación y descarga en una experiencia simple y clara.
            </p>
          </div>

          <Link
            to="/aceleradores"
            className="shrink-0 w-full sm:w-auto px-4 py-2 rounded-lg bg-[#5d5e60] text-white text-center text-sm sm:text-base hover:bg-[#3a3b3d] transition-colors whitespace-nowrap"
          >
            Ir al Panel
          </Link>
        </div>
      </section>
    </div>
  );
}
