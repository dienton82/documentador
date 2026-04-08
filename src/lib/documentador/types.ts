export type DocumentTemplate = {
  code: string;
  label: string;
  isDefault?: boolean;
};

export type CorporateNamingStrategy = "legacy-bdo";

export type ClientDocumentRequest = {
  file: File;
  projectName: string;
  templateCode: string;
};

export type ClientDocumentResult = {
  blob: Blob;
  filename: string;
};
