
import { NextResponse } from "next/server";

import {
  processDocumentRequest,
  toDocumentErrorResponse,
  toDocumentResponse,
} from "@/lib/documentador/server-service";

export async function POST(request: Request) {
  const incomingType = request.headers.get("content-type") || "";

  if (!incomingType.includes("multipart/form-data")) {
    return NextResponse.json(
      { ok: false, message: "Se esperaba multipart/form-data en el endpoint del documentador." },
      { status: 400 },
    );
  }

  try {
    const result = await processDocumentRequest(await request.formData());
    return toDocumentResponse(result);
  } catch (error) {
    return toDocumentErrorResponse(error);
  }
}
