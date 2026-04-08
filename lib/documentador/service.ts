import { buildCorporateDocumentFileName } from "./file-name";
import { DOCUMENTADOR_ROUTE } from "./constants";
import { downloadBlobFile, getFilenameFromContentDisposition } from "./download";
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

export const generateDocument = async ({
  file,
  projectName,
  templateCode,
}: ClientDocumentRequest): Promise<ClientDocumentResult> => {
  const formData = new FormData();

  formData.append("xml_file", file, file.name);
  formData.append("project_name", projectName.trim());
  formData.append("template_name", templateCode);

  const response = await fetch(DOCUMENTADOR_ROUTE, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message =
      (await response.json().catch(() => null))?.message ||
      "No se pudo generar el documento.";

    throw new DocumentGenerationRequestError(
      message,
      response.status,
      response.statusText,
    );
  }

  const blob = await response.blob();
  const filename =
    getFilenameFromContentDisposition(response.headers.get("content-disposition")) ||
    buildCorporateDocumentFileName({ projectName, templateCode });

  return {
    blob,
    filename,
  };
};

export const downloadGeneratedDocument = (result: ClientDocumentResult) => {
  downloadBlobFile(result.blob, result.filename);
};
