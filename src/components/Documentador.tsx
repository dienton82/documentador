import { lazy, Suspense, useRef, useState } from "react";
import { showSuccessAlert, showServerError, showNetworkError } from "@/lib/alerts";
import {
  DEFAULT_TEMPLATE_CODE,
  getTemplateLabel,
} from "@/lib/documentador/constants";
import {
  DocumentGenerationRequestError,
  downloadGeneratedDocument,
  generateDocument,
  isXmlFile,
} from "@/lib/documentador/service";
import styles from "./Documentador.module.css";

const TemplateSelect = lazy(() => import("./TemplateSelect"));

type DocumentadorProps = {
  onStepChange?: (step: number) => void;
};

export default function Documentador({ onStepChange }: DocumentadorProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [project, setProject] = useState("");
  const [template, setTemplate] = useState("");
  const [validXML, setValidXML] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasFile = !!file;
  const hasTemplate = !!template;
  const hasProject = project.trim().length > 0;
  const canSelectTemplate = validXML;
  const canSubmit = hasFile && validXML && hasTemplate && hasProject && !loading;

  const resetAll = () => {
    if (inputRef.current) inputRef.current.value = "";
    setFile(null);
    setValidXML(false);
    setProject("");
    setTemplate("");
    updateStep(1);
  };

  function updateStep(newStep: 1 | 2 | 3) {
    setStep(newStep);
    if (onStepChange) onStepChange(newStep);
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    const isValid = isXmlFile(f);
    setValidXML(isValid);
    if (isValid) updateStep(2);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    const chosenTemplate = template || DEFAULT_TEMPLATE_CODE;

    try {
      const result = await generateDocument({
        file: file as File,
        projectName: project.trim(),
        templateCode: chosenTemplate,
      });

      downloadGeneratedDocument(result);
      await showSuccessAlert(result.filename);
    } catch (error) {
      console.error(error);

      if (error instanceof DocumentGenerationRequestError) {
        await showServerError(error.status, error.statusText);
      } else {
        await showNetworkError();
      }
    } finally {
      setLoading(false);
      resetAll();
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
      <form onSubmit={onSubmit} className={styles.grid}>
        {step === 1 && (
          <div className={"rounded-xl bg-white/80 backdrop-blur-md p-4 sm:p-6 border border-white/40 shadow-lg " + styles.section}>
            <div className="flex flex-col h-full justify-start">
              <div className="flex flex-col items-center mb-2">
                <img src="/icons/cargar-archivo.png" alt="Buscar" width={48} height={48} className={`mb-2 ${styles.iconAzulSombra}`} />
              </div>
              <p className="text-xs sm:text-sm text-[#5d5e60] text-center mb-2">Arrasque y suelte el archivo aquí o haga clic</p>
              <div className="mt-2 flex flex-col items-center">
                <input
                  ref={inputRef}
                  type="file"
                  accept=".xml,text/xml"
                  onChange={onPick}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="w-full sm:w-auto mt-2 px-4 py-2 rounded-lg bg-[#5d5e60] text-white hover:bg-[#3a3b3d] text-sm sm:text-base transition-colors"
                >
                  Cargar Archivo
                </button>
                {file && <p className="text-xs text-gray-500 mt-2 break-all">Archivo: {file.name}</p>}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200/60">
                <p className="text-[10px] sm:text-xs text-[#8a8b8d] text-center mb-1.5">¿No tienes un XML? Prueba con uno de ejemplo:</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3">
                  <a
                    href="/samples/sample-documentador.xml"
                    download="sample-documentador.xml"
                    className="text-[10px] sm:text-xs text-[#5d5e60] hover:text-[#3a3b3d] underline underline-offset-2 transition-colors"
                  >
                    XML Básico
                  </a>
                  <span className="hidden sm:inline text-[#8a8b8d]">·</span>
                  <a
                    href="/samples/sample-documentador-profesional.xml"
                    download="sample-documentador-profesional.xml"
                    className="text-[10px] sm:text-xs text-[#5d5e60] hover:text-[#3a3b3d] underline underline-offset-2 transition-colors"
                  >
                    XML Profesional
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className={"rounded-xl bg-white/80 backdrop-blur-md p-4 sm:p-6 border border-white/40 shadow-lg " + styles.section}>
            <label className="text-xs sm:text-sm font-medium text-[#3a3b3d]">Seleccione Plantilla</label>
            <Suspense fallback={<div className="mt-2 text-sm text-gray-400">Cargando...</div>}>
              <TemplateSelect
                value={template}
                onChange={val => { setTemplate(val); updateStep(3); }}
                disabled={!canSelectTemplate}
              />
            </Suspense>
            <p className="mt-2 text-xs text-gray-500">
              Seleccione la plantilla para generar el documento.
            </p>
            {file && (
              <p className="mt-2 text-xs sm:text-sm text-[#5d5e60] break-all">
                Archivo seleccionado:{" "}
                <span className="inline-block align-middle rounded px-2 py-0.5 text-[#5d5e60] font-semibold">
                  {file.name}
                </span>
              </p>
            )}
            <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-2">
              <button
                type="button"
                onClick={resetAll}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 bg-white/90 backdrop-blur-sm transition-colors text-sm sm:text-base"
              >
                Cambiar archivo
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className={"rounded-xl bg-white/80 backdrop-blur-md p-4 sm:p-6 border border-white/40 shadow-lg " + styles.section}>
            <label className="text-xs sm:text-sm font-medium text-[#3a3b3d]">Nombre del Proyecto</label>
            <input
              type="text"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5d5e60]"
              placeholder="Escribe el nombre del proyecto"
              value={project}
              onChange={e => setProject(e.target.value)}
              disabled={!canSelectTemplate}
            />
            <p className="mt-2 text-xs text-gray-500">
              {validXML
                ? template
                  ? "Archivo XML y plantilla válidos. Complete el nombre del proyecto."
                  : "Archivo XML válido. Seleccione una plantilla."
                : "El campo se habilita cuando el archivo seleccionado sea XML válido."
              }
            </p>
            <ul className="mt-4 space-y-2 text-xs sm:text-sm">
              <li className={`flex items-start sm:items-center gap-2 transition-all duration-300 ${
                hasFile && validXML ? "opacity-100" : "opacity-40"
              }`}>
                <div className="flex-shrink-0">
                  <img
                    src="/icons/aprobacion-bien.png"
                    alt=""
                    width={18}
                    height={18}
                    className={`transition-all duration-300 ${styles.iconAzulSombra} ${
                      hasFile && validXML ? "grayscale-0" : "grayscale"
                    }`}
                  />
                </div>
                <span className={`break-all ${
                  hasFile && validXML ? "text-[#3a3b3d]" : "text-[#8a8b8d]"
                }`}>
                  Archivo cargado: <b>{file?.name || "N/D"}</b>
                </span>
              </li>
              <li className={`flex items-start sm:items-center gap-2 transition-all duration-300 ${
                hasFile && validXML && hasTemplate ? "opacity-100" : "opacity-40"
              }`}>
                <div className="flex-shrink-0">
                  <img
                    src="/icons/aprobacion-bien.png"
                    alt=""
                    width={18}
                    height={18}
                    className={`transition-all duration-300 ${styles.iconAzulSombra} ${
                      hasFile && validXML && hasTemplate ? "grayscale-0" : "grayscale"
                    }`}
                  />
                </div>
                <span className={`break-all ${
                  hasFile && validXML && hasTemplate ? "text-[#3a3b3d]" : "text-[#8a8b8d]"
                }`}>
                  Plantilla seleccionada: <b>{template ? getTemplateLabel(template) : "N/D"}</b>
                </span>
              </li>
              <li className={`flex items-start sm:items-center gap-2 transition-all duration-300 ${
                hasFile && validXML && hasProject ? "opacity-100" : "opacity-40"
              }`}>
                <div className="flex-shrink-0">
                  <img
                    src="/icons/aprobacion-bien.png"
                    alt=""
                    width={18}
                    height={18}
                    className={`transition-all duration-300 ${styles.iconAzulSombra} ${
                      hasFile && validXML && hasProject ? "grayscale-0" : "grayscale"
                    }`}
                  />
                </div>
                <span className={`break-all ${
                  hasFile && validXML && hasProject ? "text-[#3a3b3d]" : "text-[#8a8b8d]"
                }`}>
                  Nombre Proyecto: <b>{project || "N/D"}</b>
                </span>
              </li>
            </ul>
            <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-2">
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#5d5e60] text-white disabled:opacity-50 text-sm sm:text-base order-1 sm:order-1 hover:bg-[#3a3b3d] transition-colors"
              >
                {loading ? "Procesando..." : "Enviar"}
              </button>
              <button
                type="button"
                onClick={() => updateStep(2)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 bg-white/90 backdrop-blur-sm transition-colors text-sm sm:text-base order-2 sm:order-2"
              >
                Volver a Plantilla
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 bg-white/90 backdrop-blur-sm transition-colors text-sm sm:text-base order-3 sm:order-3"
                aria-label="Cambiar archivo y volver al primer paso"
              >
                Cambiar archivo
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
