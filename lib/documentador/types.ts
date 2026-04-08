export type DocumentadorMode = "mock" | "real";

export type DocumentadorBackendTarget = "python" | "express";

export type DocumentTemplate = {
  code: string;
  label: string;
  isDefault?: boolean;
};

export type CorporateNamingStrategy = "legacy-bdo";

export type DocumentGenerationPayload = {
  fileName: string;
  fileBase64: string;
  fileMimeType: string;
  projectName: string;
  templateCode: string;
  requestedFormat: "docx";
  corporateNaming: CorporateNamingStrategy;
};

export type DocumentGenerationResult = {
  ok: true;
  filename: string;
  mimeType: string;
  fileBase64: string;
  metadata?: {
    mode: DocumentadorMode;
    backendTarget?: DocumentadorBackendTarget;
    templateCode: string;
    sourceFileName: string;
  };
};

export type ClientDocumentRequest = {
  file: File;
  projectName: string;
  templateCode: string;
};

export type ClientDocumentResult = {
  blob: Blob;
  filename: string;
};
