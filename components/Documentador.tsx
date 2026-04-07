
"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { showSuccessAlert, showServerError, showNetworkError } from "@/lib/alerts";
const TemplateSelect = dynamic(() => import("./TemplateSelect"), { ssr: false });
import Image from "next/image";
import styles from "./Documentador.module.css";

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

  // Map template ids to human-friendly labels
  const templateNames: Record<string, string> = {
    CTLS_Template: "Plantilla CTLS (Por defecto)",
    ETL_Template: "Plantilla ETL (Por defecto)",
    Standard_Template: "Plantilla Estándar",
    Custom_Template: "Plantilla Personalizada",
  };
  const templateLabel = (id: string) => (templateNames[id] ?? id);

  // Helpers: estados derivados y utilidades
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

  const buildFilename = () => {
    const configuredName = project.trim();
    return `TI – CQ-JiraXXX – Diseño detallado y desarrollo – ${configuredName}.docx`
      .replace(/[\\/:*?"<>|]/g, "-")
      .replace(/\s+/g, " ")
      .trim();
  };

  function updateStep(newStep: 1 | 2 | 3) {
    setStep(newStep);
    if (onStepChange) onStepChange(newStep);
  }
  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    const isValid = !!f && (f.type === "text/xml" || f.name.toLowerCase().endsWith(".xml"));
    setValidXML(isValid);
    if (isValid) updateStep(2);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    const chosenTemplate = template || "CTLS_Template";
    try {
      const form = new FormData();
      form.append("xml_file", file as File, (file as File).name);
      form.append("project_name", project.trim());
      form.append("template_name", chosenTemplate);

      const res = await fetch("/api/documentar", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        await showServerError(res.status, res.statusText);
        return;
      }

      const blob = await res.blob();
      const filename = buildFilename();

      // Crear URL temporal y descargar
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      await showSuccessAlert(filename);
    } catch (e) {
      console.error(e);
      await showNetworkError();
    } finally {
      setLoading(false);
      resetAll();
    }
  }


  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
      {/* Título principal eliminado, solo secciones limpias */}
      <form onSubmit={onSubmit} className={styles.grid}>
        {step === 1 && (
          <div className={"rounded-xl bg-white/80 backdrop-blur-md p-4 sm:p-6 border border-white/40 shadow-lg " + styles.section}>
            <div className="flex flex-col h-full justify-start">
              <div className="flex flex-col items-center mb-2">
                <Image src="/icons/cargar-archivo.png" alt="Buscar" width={48} height={48} className={`mb-2 ${styles.iconAzulSombra}`} />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 text-center mb-2">Arrastre y suelte el archivo aquí o haga clic</p>
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
                  className="w-full sm:w-auto mt-2 px-4 py-2 rounded-lg bg-[#061224] text-white hover:opacity-90 text-sm sm:text-base"
                >
                  Cargar Archivo
                </button>
                {file && <p className="text-xs text-gray-500 mt-2 break-all">Archivo: {file.name}</p>}
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className={"rounded-xl bg-white/80 backdrop-blur-md p-4 sm:p-6 border border-white/40 shadow-lg " + styles.section}>
            <label className="text-xs sm:text-sm font-medium text-gray-700">Seleccione Plantilla</label>
            <TemplateSelect
              value={template}
              onChange={val => { setTemplate(val); updateStep(3); }}
              disabled={!canSelectTemplate}
            />
            <p className="mt-2 text-xs text-gray-500">
              Seleccione la plantilla para generar el documento.
            </p>
            {file && (
              <p className="mt-2 text-xs sm:text-sm text-gray-600 break-all">
                Archivo seleccionado: {" "}
                <span className="inline-block align-middle rounded px-2 py-0.5  text-[#061224] font-semibold">
                  {file.name}
                </span>
              </p>
            )}
            <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  resetAll();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 bg-white/90 backdrop-blur-sm transition-colors text-sm sm:text-base"
              >
                Cambiar archivo
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className={"rounded-xl bg-white/80 backdrop-blur-md p-4 sm:p-6 border border-white/40 shadow-lg " + styles.section}>
            <label className="text-xs sm:text-sm font-medium text-gray-700">Nombre del Proyecto</label>
            <input
              type="text"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#061224]"
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
                  <Image 
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
                    hasFile && validXML ? "text-gray-700" : "text-gray-600"
                }`}>
                 Archivo cargado: <b>{file?.name || "N/D"}</b>
                </span>
              </li>
              <li className={`flex items-start sm:items-center gap-2 transition-all duration-300 ${
                hasFile && validXML && hasTemplate ? "opacity-100" : "opacity-40"
              }`}>
                <div className="flex-shrink-0">
                  <Image 
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
                  hasFile && validXML && hasTemplate ? "text-gray-700" : "text-gray-600"
                }`}>
                  Plantilla seleccionada: <b>{template ? templateLabel(template) : "N/D"}</b>
                </span>
              </li>
              <li className={`flex items-start sm:items-center gap-2 transition-all duration-300 ${
                  hasFile && validXML && hasProject ? "opacity-100" : "opacity-40"
              }`}>
                <div className="flex-shrink-0">
                  <Image 
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
                    hasFile && validXML && hasProject ? "text-gray-700" : "text-gray-600"
                }`}>
                  Nombre Proyecto: <b>{project || "N/D"}</b>
                </span>
              </li>
            </ul>
            <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-2">
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#061224] text-white disabled:opacity-50 text-sm sm:text-base order-1 sm:order-1"
              >
                {loading ? "Procesando..." : "Enviar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  // Volver a la selección de plantilla sin resetear el archivo ni la plantilla actual
                  updateStep(2);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 bg-white/90 backdrop-blur-sm transition-colors text-sm sm:text-base order-2 sm:order-2"
              >
                Volver a Plantilla
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAll();
                }}
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
