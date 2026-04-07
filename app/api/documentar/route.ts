
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const incomingType = req.headers.get("content-type") || "";
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://127.0.0.1:8000";
  const url = `${backendUrl}/GFTReportGenerator/api/documentar`;

  try {
    // Recibir FormData del cliente y reenviarlo al backend
    if (!incomingType.includes("multipart/form-data")) {
      return NextResponse.json(
        { ok: false, message: "Se esperaba multipart/form-data" }, 
        { status: 400 }
      );
    }

    const inForm = await req.formData();
    const xml = inForm.get("xml_file");
    const project_name = (inForm.get("project_name") || "").toString();
    const template_name = (inForm.get("template_name") || "CTLS_Template").toString();

    if (!(xml instanceof Blob) || !project_name) {
      return NextResponse.json(
        { ok: false, message: "Parámetros incompletos (xml_file y project_name requeridos)." }, 
        { status: 400 }
      );
    }

    // Preparar FormData para enviar al backend
    const fileName = (xml as any).name || "archivo.xml";
    const form = new FormData();
    form.append("xml_file", xml, fileName);
    form.append("project_name", project_name);
    form.append("template_name", template_name);

    const res = await fetch(url, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[Proxy Error] Backend error", res.status, text || res.statusText);
      return NextResponse.json(
        { ok: false, message: `Backend error ${res.status}: ${text || res.statusText}` }, 
        { status: 502 }
      );
    }

    const blob = await res.blob();
    const disposition = res.headers.get("content-disposition") || "";
    
    // Extraer nombre del archivo del header si existe
    let filename = `Documento_${project_name.replace(/\s+/g, "_")}.docx`;
    const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
    if (match) {
      filename = decodeURIComponent(match[1] || match[2]);
    }

    const encodedFilename = encodeURIComponent(filename);

    // Devolver el archivo binario directamente al cliente
    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodedFilename}`,
      },
    });
  } catch (err: any) {
    console.error("[Proxy Error] fetch failed:", err);
    return NextResponse.json(
      { ok: false, message: err?.message || "Error contactando el backend" }, 
      { status: 500 }
    );
  }
}
