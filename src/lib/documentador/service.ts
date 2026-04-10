import { DOCX_MIME_TYPE } from "./constants";
import { downloadBlobFile } from "./download";
import type { ClientDocumentRequest, ClientDocumentResult } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

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
 * Envía el XML al backend FastAPI y recibe el DOCX generado.
 */
export const generateDocument = async ({
  file,
  projectName,
  templateCode,
}: ClientDocumentRequest): Promise<ClientDocumentResult> => {
  const form = new FormData();
  form.append("file", file);
  form.append("project_name", projectName.trim());
  form.append("template_code", templateCode);

  const response = await fetch(`${API_BASE}/documentar`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const json = await response.json();
      detail = json.detail ?? detail;
    } catch { /* ignore */ }
    throw new DocumentGenerationRequestError(detail, response.status, response.statusText);
  }

  const blob = new Blob([await response.arrayBuffer()], { type: DOCX_MIME_TYPE });

  const disposition = response.headers.get("Content-Disposition") ?? "";
  const match = disposition.match(/filename="?([^"]+)"?/);
  const filename = match?.[1] ?? `Documentador_${projectName.trim()}.docx`;

  return { blob, filename };
};

export const downloadGeneratedDocument = (result: ClientDocumentResult) => {
  downloadBlobFile(result.blob, result.filename);
};
