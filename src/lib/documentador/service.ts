import { buildCorporateDocumentFileName } from "./file-name";
import { DOCX_MIME_TYPE } from "./constants";
import { downloadBlobFile } from "./download";
import type { ClientDocumentRequest, ClientDocumentResult } from "./types";

export class DocumentGenerationRequestError extends Error {
  status: number;
  statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.name = "DocumentGenerationRequestError";
    this.status = status;
    this.statusText = statusText;
  }
}

export const isXmlFile = (file: File | null) =>
  !!file && (file.type === "text/xml" || file.name.toLowerCase().endsWith(".xml"));

/**
 * Genera un documento DOCX mock descargando la plantilla base de public/.
 * No realiza conversión real de XML a DOCX.
 * El archivo descargado usa la convención corporativa de nombres.
 */
export const generateDocument = async ({
  file: _file,
  projectName,
  templateCode,
}: ClientDocumentRequest): Promise<ClientDocumentResult> => {
  // Simula un breve delay para UX realista
  await new Promise((resolve) => setTimeout(resolve, 600));

  const response = await fetch("/placeholder.docx");

  if (!response.ok) {
    throw new DocumentGenerationRequestError(
      "No se pudo cargar la plantilla base (placeholder.docx).",
      response.status,
      response.statusText,
    );
  }

  const blob = new Blob([await response.arrayBuffer()], { type: DOCX_MIME_TYPE });

  const filename = buildCorporateDocumentFileName({
    projectName,
    templateCode,
  });

  return { blob, filename };
};

export const downloadGeneratedDocument = (result: ClientDocumentResult) => {
  downloadBlobFile(result.blob, result.filename);
};
