import { DEFAULT_TEMPLATE_CODE } from "./constants";
import type { CorporateNamingStrategy } from "./types";

type BuildCorporateDocumentFileNameInput = {
  projectName: string;
  templateCode?: string;
  corporateNaming?: CorporateNamingStrategy;
};

const sanitizeFileSegment = (value: string) =>
  value.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").trim();

export const buildCorporateDocumentFileName = ({
  projectName,
  templateCode = DEFAULT_TEMPLATE_CODE,
  corporateNaming = "legacy-bdo",
}: BuildCorporateDocumentFileNameInput) => {
  const safeProjectName = sanitizeFileSegment(projectName);

  if (corporateNaming === "legacy-bdo") {
    return `TI – CQ-JiraXXX – Diseño detallado y desarrollo – ${safeProjectName}.docx`;
  }

  return `${sanitizeFileSegment(templateCode)}_${safeProjectName}.docx`;
};
