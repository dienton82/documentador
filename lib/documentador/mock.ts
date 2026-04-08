import { readFile } from "node:fs/promises";
import path from "node:path";

import { DOCX_MIME_TYPE } from "./constants";
import { buildCorporateDocumentFileName } from "./file-name";
import type { DocumentGenerationPayload, DocumentGenerationResult } from "./types";

const getPlaceholderPath = () => path.join(process.cwd(), "public", "placeholder.docx");

export const generateMockDocument = async (
  payload: DocumentGenerationPayload,
): Promise<DocumentGenerationResult> => {
  const placeholderPath = getPlaceholderPath();
  const placeholderBuffer = await readFile(placeholderPath);

  return {
    ok: true,
    filename: buildCorporateDocumentFileName({
      projectName: payload.projectName,
      templateCode: payload.templateCode,
      corporateNaming: payload.corporateNaming,
    }),
    mimeType: DOCX_MIME_TYPE,
    fileBase64: placeholderBuffer.toString("base64"),
    metadata: {
      mode: "mock",
      templateCode: payload.templateCode,
      sourceFileName: payload.fileName,
    },
  };
};

export const mockDocumentExists = async () => {
  try {
    await readFile(getPlaceholderPath());
    return true;
  } catch {
    return false;
  }
};
