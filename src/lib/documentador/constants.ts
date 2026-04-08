import type { DocumentTemplate } from "./types";

export const DOCX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const DEFAULT_TEMPLATE_CODE = "ETL_Template";

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    code: DEFAULT_TEMPLATE_CODE,
    label: "Plantilla ETL (Por defecto)",
    isDefault: true,
  },
];

export const getTemplateLabel = (code: string) =>
  DOCUMENT_TEMPLATES.find((template) => template.code === code)?.label ?? code;
