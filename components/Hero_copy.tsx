import Documentador from "@/components/Documentador";
import styles from "./Documentador.module.css";
import { useState } from "react";
import Image from "next/image";

type HeroCopyProps = {
  showApp: boolean;
  onHide?: () => void;
  isHomePage?: boolean;
};

export default function HeroCopy({ showApp, onHide, isHomePage = false }: HeroCopyProps) {
  const [step, setStep] = useState(1);
  const sectionTitles = [
    "Seleccione el archivo XML a importar",
    "Seleccione la plantilla para el documento",
    "Ingrese el nombre del proyecto"
  ];
  const handleStepChange = (newStep: number) => setStep(newStep);
  return (
    <section className="relative h-auto min-h-[280px] sm:min-h-[360px] w-full overflow-hidden rounded-lg sm:rounded-2xl shadow-card border border-gray-100">
      <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline
        src="https://www.gft.com/img/motion_loop_home.mp4" />
      <div className="absolute inset-0 bg-white/70 " />
      <div className="relative z-10 w-full px-4 sm:px-6 py-4 sm:py-6 bg-white/9 ">
        <div className="max-w-6xl mx-auto">
          <div
            className={`transition-all duration-500 ease-out overflow-hidden ${
              showApp
                ? " translate-y-2 pointer-events-none max-h-0"
                : "opacity-100 translate-y-0 max-h-[600px]"
            }`}
          >
            <div className="py-2 mb-3 sm:mb-4">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-gray-900 mb-2 sm:mb-3">GFT ■</h2>
              {isHomePage ? (
                <p className="text-2xl sm:text-3xl lg:text-4xl font-light leading-snug text-slate-800 max-w-4xl">
  Socio global en IA y banca.<br />
  Creamos impacto real con tecnología y datos.<br />
  <span className="font-semibold text-slate-900">
    Transformamos tu negocio con resultados medibles.
  </span>
</p>
              ) : (
                <p className="text-2xl sm:text-3xl lg:text-4xl font-light leading-snug text-slate-800 max-w-4xl">
  Esta herramienta genera la documentación del Banco de Occidente, incluida ETL, a partir de un archivo XML.<br />
  <span className="font-semibold text-slate-900">
    Sube el XML, valida su tipo y obtén un documento Word con los datos.
  </span>
</p>
              )}
            </div>
          </div>
          <div
            className={`transition-all duration-500 ease-out overflow-hidden ${
              showApp
                ? "opacity-100 translate-y-0 scale-[1.0] max-h-[4000px]"
                : "opacity-0 -translate-y-2 scale-[0.99] pointer-events-none max-h-0"
            }`}
          >
           
            <div className="bg-white/95 rounded-lg sm:rounded-xl shadow-2xl backdrop-blur-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                  {/* Icon for each step */}
                  {step === 1 && (
                    <Image
                      src="/xls.svg"
                      alt="Nombre del proyecto"
                      width={24}
                      height={24}
                      className={styles.iconAzulSombra}
                    />
                  )}
                  {step === 2 && (
                    <Image
                      src="/plantilla.svg"
                      alt="Plantilla"
                      width={24}
                      height={24}
                      className={styles.iconAzulSombra}
                    />
                  )}
                  {step === 3 && (
                    <Image
                      src="/Projecto.svg"
                      alt="Archivo XML"
                      width={24}
                      height={24}
                      className={styles.iconAzulSombra}
                    />
                  )}
                  <span style={{ color: '#061224' }}>{sectionTitles[step - 1]}</span>
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 hidden sm:block">GFT ■</span>
                  {onHide && (
                    <button
                      type="button"
                      onClick={onHide}
                      className="rounded-md border px-2 py-1 text-sm font-bold text-[#061224] bg-white shadow-md hover:bg-gray-100 transition-all duration-200"
                      aria-label="Ocultar aplicación"
                      style={{ filter: 'drop-shadow(0 1px 1px #06122488)', fontWeight: 'bold', letterSpacing: '1px' }}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <Documentador onStepChange={handleStepChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
