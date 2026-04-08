import { NextResponse } from "next/server";

import {
  CORPORATE_NAMING_STRATEGY,
  DEFAULT_TEMPLATE_CODE,
  DOCX_MIME_TYPE,
} from "./constants";
import { buildCorporateDocumentFileName } from "./file-name";
import { generateMockDocument, mockDocumentExists } from "./mock";
import { getFilenameFromContentDisposition } from "./download";
import type {
  DocumentadorBackendTarget,
  DocumentadorMode,
  DocumentGenerationPayload,
  DocumentGenerationResult,
} from "./types";

class DocumentadorRequestError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "DocumentadorRequestError";
    this.status = status;
    this.code = code;
  }
}

const getBackendTarget = (): DocumentadorBackendTarget =>
  process.env.DOCUMENTADOR_BACKEND_TARGET === "express" ? "express" : "python";

const getExplicitMode = () => {
  const mode = process.env.DOCUMENTADOR_MODE || process.env.NEXT_PUBLIC_DOCUMENTADOR_MODE;
  return mode === "mock" || mode === "real" ? mode : null;
};

const getBackendUrl = () =>
  (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "").trim();

const isLocalBackendUrl = (backendUrl: string) =>
  /^(https?:\/\/)?(127\.0\.0\.1|localhost)(:\d+)?/i.test(backendUrl);

const resolveDocumentadorMode = (): DocumentadorMode => {
  const explicitMode = getExplicitMode();

  if (explicitMode) {
    return explicitMode;
  }

  const backendUrl = getBackendUrl();

  if (backendUrl && !isLocalBackendUrl(backendUrl)) {
    return "real";
  }

  return "mock";
};

const buildPayloadFromFormData = async (
  requestFormData: FormData,
): Promise<DocumentGenerationPayload> => {
  const xml = requestFormData.get("xml_file");
  const projectName = (requestFormData.get("project_name") || "").toString().trim();
  const templateCode =
    (requestFormData.get("template_name") || DEFAULT_TEMPLATE_CODE).toString().trim() ||
    DEFAULT_TEMPLATE_CODE;

  if (!(xml instanceof Blob) || !projectName) {
    throw new DocumentadorRequestError(
      "Parámetros incompletos (xml_file y project_name requeridos).",
      400,
    );
  }

  const fileName = "name" in xml && typeof xml.name === "string" ? xml.name : "archivo.xml";
  const fileBase64 = Buffer.from(await xml.arrayBuffer()).toString("base64");

  return {
    fileName,
    fileBase64,
    fileMimeType: xml.type || "text/xml",
    projectName,
    templateCode,
    requestedFormat: "docx",
    corporateNaming: CORPORATE_NAMING_STRATEGY,
  };
};

const generateDocumentWithRealBackend = async (
  payload: DocumentGenerationPayload,
): Promise<DocumentGenerationResult> => {
  const backendUrl = getBackendUrl();

  if (!backendUrl || isLocalBackendUrl(backendUrl)) {
    throw new DocumentadorRequestError(
      "DOCUMENTADOR_MODE=real requiere un BACKEND_URL publico y valido en Vercel.",
      500,
      "DOCUMENTADOR_BACKEND_CONFIG",
    );
  }

  const form = new FormData();
  const xmlBuffer = Buffer.from(payload.fileBase64, "base64");
  const xmlBlob = new Blob([xmlBuffer], { type: payload.fileMimeType });
  const endpointUrl = `${backendUrl}/GFTReportGenerator/api/documentar`;

  form.append("xml_file", xmlBlob, payload.fileName);
  form.append("project_name", payload.projectName);
  form.append("template_name", payload.templateCode);

  const response = await fetch(endpointUrl, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new DocumentadorRequestError(
      `Backend error ${response.status}: ${text || response.statusText}`,
      502,
    );
  }

  const fileBuffer = Buffer.from(await response.arrayBuffer());
  const resolvedFilename =
    getFilenameFromContentDisposition(response.headers.get("content-disposition")) ||
    buildCorporateDocumentFileName({
      projectName: payload.projectName,
      templateCode: payload.templateCode,
      corporateNaming: payload.corporateNaming,
    });

  return {
    ok: true,
    filename: resolvedFilename,
    mimeType: response.headers.get("content-type") || DOCX_MIME_TYPE,
    fileBase64: fileBuffer.toString("base64"),
    metadata: {
      mode: "real",
      backendTarget: getBackendTarget(),
      templateCode: payload.templateCode,
      sourceFileName: payload.fileName,
    },
  };
};

export const processDocumentRequest = async (
  requestFormData: FormData,
): Promise<DocumentGenerationResult> => {
  const payload = await buildPayloadFromFormData(requestFormData);
  const mode = resolveDocumentadorMode();

  if (mode === "mock") {
    const hasMockFile = await mockDocumentExists();

    if (!hasMockFile) {
      throw new DocumentadorRequestError(
        "No se encontro public/placeholder.docx para responder en modo mock.",
        500,
        "DOCUMENTADOR_MOCK_FILE_MISSING",
      );
    }

    return generateMockDocument(payload);
  }

  return generateDocumentWithRealBackend(payload);
};

export const toDocumentResponse = (result: DocumentGenerationResult) => {
  const fileBuffer = Buffer.from(result.fileBase64, "base64");
  const encodedFilename = encodeURIComponent(result.filename);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": result.mimeType || DOCX_MIME_TYPE,
      "Content-Disposition": `attachment; filename*=UTF-8''${encodedFilename}`,
      "X-Documentador-Mode": result.metadata?.mode || "real",
      "X-Documentador-Template": result.metadata?.templateCode || DEFAULT_TEMPLATE_CODE,
    },
  });
};

export const toDocumentErrorResponse = (error: unknown) => {
  if (error instanceof DocumentadorRequestError) {
    return NextResponse.json(
      { ok: false, message: error.message, code: error.code || "DOCUMENTADOR_REQUEST_ERROR" },
      { status: error.status },
    );
  }

  console.error("[Documentador] unexpected error", error);

  return NextResponse.json(
    { ok: false, message: "Error contactando el backend del documentador." },
    { status: 500 },
  );
};
