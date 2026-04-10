
# Documentador — XML → DOCX con IA

Aplicación fullstack que transforma archivos XML en documentos Word estructurados. Frontend en React + Vite, backend en Python + FastAPI.

## Arquitectura

```
Frontend (Vercel)              Backend (Render)
React + Vite + TS              Python + FastAPI
       │                              │
       │  POST /documentar            │
       │  multipart/form-data         │
       │  ─────────────────────────>  │  1. Valida XML
       │  file (.xml)                 │  2. Parsea con xmltodict
       │  project_name                │  3. Mapea secciones
       │  template_code               │  4. Genera DOCX con python-docx
       │  <─────────────────────────  │  5. Devuelve binario .docx
       │  binary .docx                │
```

## Stack

**Frontend:**
- React 18 + TypeScript + Vite
- Tailwind CSS + CSS Modules
- Framer Motion, Headless UI, SweetAlert2
- React Router DOM

**Backend:**
- Python 3.11 + FastAPI
- xmltodict (parsing XML)
- python-docx (generación DOCX)
- uvicorn (server ASGI)

## Ejecutar en local

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

El frontend apunta a `http://localhost:8000` por defecto (configurable via `.env`).

## Variables de entorno

### Frontend (`.env`)
```bash
VITE_API_BASE_URL=http://localhost:8000
```

### Producción (`.env.production`)
```bash
VITE_API_BASE_URL=https://tu-backend.onrender.com
```

## Contrato API

```
POST /documentar
Content-Type: multipart/form-data

Campos:
  file           — archivo .xml (max 10MB)
  project_name   — nombre del proyecto
  template_code  — código de plantilla (default: ETL_Template)

Respuesta 200:
  Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
  Body: binario .docx

Errores:
  400 — archivo no es .xml o excede 10MB
  422 — XML malformado
  500 — error interno
```

## Flujo funcional

1. El usuario navega a **Panel** y abre el **Documentador**
2. Carga un archivo `.xml` (se valida extensión)
3. Selecciona una plantilla de documento
4. Ingresa el nombre del proyecto
5. Al enviar:
   - El XML se envía al backend via `POST /documentar`
   - El backend parsea el XML, extrae secciones y campos
   - Genera un DOCX real con portada, tablas y estructura
   - El frontend descarga el archivo automáticamente

## Estructura del proyecto

```
src/                          # Frontend React
  components/
    Documentador.tsx          # Formulario 3 pasos
    Header.tsx                # Cabecera con navegación
    Hero.tsx / HeroCopy.tsx   # Hero sections
    Sidebar.tsx               # Panel lateral
    TemplateSelect.tsx        # Selector de plantilla
  pages/
    Home.tsx / Aceleradores.tsx
  lib/
    alerts.ts                 # SweetAlert2
    documentador/
      service.ts              # POST al backend real
      constants.ts            # Plantillas disponibles
      download.ts             # Descarga de blob
      file-name.ts            # Nomenclatura de archivos
      types.ts                # Tipos TypeScript

backend/                      # Backend FastAPI
  app/
    main.py                   # App + CORS
    routes/
      documentar.py           # POST /documentar
    parsers/
      xml_parser.py           # Validación + xmltodict
    services/
      xml_transformer.py      # XML dict → contexto para DOCX
      docx_generator.py       # python-docx → genera Word
  requirements.txt
  render.yaml                 # Config para Render
```

## Deploy

### Frontend → Vercel
1. Conectar repo en Vercel
2. Framework: Vite (auto-detectado)
3. Variable de entorno: `VITE_API_BASE_URL=https://tu-backend.onrender.com`
4. Deploy automático en cada push

### Backend → Render
1. Crear "Web Service" en Render
2. Root directory: `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Python version: 3.11

## Qué hace realmente

- Parsea XML de cualquier estructura con xmltodict
- Extrae secciones jerárquicas y campos hoja
- Genera un documento Word con:
  - Portada con nombre del proyecto y origen XML
  - Secciones con headings y tablas Campo/Valor
  - Resumen plano de todos los campos
  - Pie de página con marca Documentador
- No es mock, no es placeholder, no renombra archivos
