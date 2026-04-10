"""POST /documentar — receive XML, return generated DOCX."""

from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from fastapi.responses import Response

from app.parsers.xml_parser import parse_xml
from app.services.xml_transformer import build_template_context
from app.services.docx_generator import render_docx

router = APIRouter()

DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


@router.post("/documentar")
async def documentar(
    file: UploadFile = File(...),
    project_name: str = Form(...),
    template_code: str = Form("ETL_Template"),
):
    # 1. Validate file extension
    if not file.filename or not file.filename.lower().endswith(".xml"):
        raise HTTPException(status_code=400, detail="El archivo debe ser .xml")

    # 2. Read & limit size (10 MB)
    raw = await file.read()
    if len(raw) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="El archivo excede el límite de 10 MB")

    # 3. Parse XML
    try:
        parsed = parse_xml(raw)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    # 4. Transform to template context
    context = build_template_context(parsed, project_name)

    # 5. Render DOCX
    try:
        docx_bytes = render_docx(context, template_code)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error al generar documento: {exc}")

    # 6. Build filename
    safe_name = project_name.strip().replace("/", "-").replace("\\", "-")
    filename = f"Documentador_{safe_name}_{template_code}.docx"

    return Response(
        content=docx_bytes,
        media_type=DOCX_MIME,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
