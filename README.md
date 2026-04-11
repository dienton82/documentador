
# Documentador — XML → DOCX

Aplicación fullstack que transforma archivos XML en documentos Word (.docx) estructurados.  
Frontend desplegado en **Vercel**, backend en **Render**.

---

## Demo rápido

¿No tienes un XML a mano? El formulario incluye links de descarga para dos archivos de ejemplo:

| Archivo | Descripción |
|---------|-------------|
| [`sample-documentador.xml`](/public/samples/sample-documentador.xml) | Estructura básica: proyecto, requerimientos, actividades |
| [`sample-documentador-profesional.xml`](/public/samples/sample-documentador-profesional.xml) | Estructura completa: encabezado, alcance, componentes, riesgos, firmas |

Ambos están disponibles como descarga directa desde el paso 1 del Documentador.

---

## Arquitectura

```
Frontend (Vercel)                Backend (Render)
React 18 + Vite 6 + TS          Python 3.11 + FastAPI 0.115
         │                                │
         │  POST /documentar              │
         │  multipart/form-data           │
         │  ──────────────────────────>   │  1. Valida extensión y tamaño
         │  file (.xml)                   │  2. Parsea con xmltodict
         │  project_name                  │  3. Extrae secciones jerárquicas
         │  template_code                 │  4. Genera DOCX con python-docx
         │  <──────────────────────────   │  5. Devuelve binario .docx
         │  Content-Disposition: filename │
         │                                │
         │  GET /health                   │  → {"status": "ok"}
```

---

## Stack

### Frontend
- **React 18** + TypeScript + **Vite 6.4**
- **Tailwind CSS 3.4** + CSS Modules
- Framer Motion 11 (animaciones)
- Headless UI 2 + Heroicons 2 (componentes accesibles)
- SweetAlert2 11 (alertas)
- React Router DOM 6 (SPA routing)
- Fuente: GFTGrotesk

### Backend
- **Python 3.11** + **FastAPI 0.115.6**
- uvicorn 0.34 (ASGI server)
- xmltodict 0.14.1 (parsing XML → dict)
- python-docx 1.1.2 (generación DOCX programática)
- python-multipart 0.0.20 (FormData)

---

## Ejecutar en local

### Frontend
```bash
npm install
npm run dev          # → http://localhost:5173
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

El frontend usa `VITE_API_BASE_URL` para apuntar al backend.  
Por defecto: `http://localhost:8000`.

### Variables de entorno

Crear `.env` en la raíz del proyecto:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

Para producción, configurar en Vercel:
```bash
VITE_API_BASE_URL=https://documentador-api.onrender.com
```

> El frontend sanitiza automáticamente trailing slashes del URL base.

---

## Contrato API

### `POST /documentar`

```
Content-Type: multipart/form-data

Campos:
  file           — archivo .xml (max 10MB)
  project_name   — nombre del proyecto (string)
  template_code  — código de plantilla (default: ETL_Template)

Respuesta 200:
  Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
  Content-Disposition: attachment; filename="Documentador_Proyecto_20260410.docx"
  Body: binario .docx

Errores:
  400 — no es .xml o excede 10MB
  422 — XML malformado
  500 — error interno de generación
```

### `GET /health`
```
Respuesta 200: {"status": "ok"}
```

---

## Flujo funcional

1. El usuario navega a **Panel** → abre **Documentador**
2. **Paso 1** — Carga un archivo `.xml` (o descarga un XML de ejemplo)
3. **Paso 2** — Selecciona una plantilla de documento
4. **Paso 3** — Ingresa el nombre del proyecto y envía
5. El frontend envía `POST /documentar` con FormData
6. El backend valida, parsea, genera DOCX y lo devuelve
7. Descarga automática del archivo `.docx`

---

## Estructura del proyecto

```
├── public/
│   ├── samples/
│   │   ├── sample-documentador.xml               # XML demo básico
│   │   └── sample-documentador-profesional.xml    # XML demo profesional
│   └── icons/                                     # Iconos UI
│
├── src/                                           # Frontend React
│   ├── App.tsx                                    # Router principal
│   ├── globals.css                                # Estilos globales + fuentes
│   ├── components/
│   │   ├── Documentador.tsx                       # Formulario 3 pasos + links XML demo
│   │   ├── Documentador.module.css
│   │   ├── Header.tsx                             # Navegación: Home / Panel
│   │   ├── Header.module.css
│   │   ├── Hero.tsx / HeroCopy.tsx                # Hero sections con fondo
│   │   ├── Sidebar.tsx                            # Panel lateral
│   │   └── TemplateSelect.tsx                     # Selector de plantilla (lazy)
│   ├── pages/
│   │   ├── Home.tsx                               # Landing page
│   │   └── Aceleradores.tsx                       # Panel con Documentador
│   └── lib/
│       ├── alerts.ts                              # SweetAlert2 wrappers
│       └── documentador/
│           ├── service.ts                         # POST al backend + descarga
│           ├── constants.ts                       # Plantillas disponibles
│           ├── download.ts                        # Blob → descarga navegador
│           ├── file-name.ts                       # Nomenclatura de archivos
│           ├── types.ts                           # Tipos TypeScript
│           └── mock.ts                            # Mock para desarrollo offline
│
├── backend/                                       # Backend FastAPI
│   ├── app/
│   │   ├── main.py                                # App + CORS + health
│   │   ├── routes/
│   │   │   └── documentar.py                      # POST /documentar
│   │   ├── parsers/
│   │   │   └── xml_parser.py                      # Validación + xmltodict
│   │   └── services/
│   │       ├── xml_transformer.py                 # XML dict → contexto estructurado
│   │       └── docx_generator.py                  # python-docx → Word real
│   ├── requirements.txt
│   ├── render.yaml                                # Deploy config Render
│   ├── Procfile
│   ├── build.sh
│   └── runtime.txt                                # Python 3.11.11
│
├── vercel.json                                    # Deploy config Vercel (SPA)
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json
```

---

## Rutas del frontend

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Home | Landing page con hero y cards |
| `/aceleradores` | Panel | Dashboard con Documentador integrado |

---

## Deploy

### Frontend → Vercel
1. Conectar repositorio en Vercel
2. Framework: auto-detectado (Vite)
3. Variable de entorno: `VITE_API_BASE_URL=https://documentador-api.onrender.com`
4. Deploy automático en cada push a `main`

### Backend → Render
1. Crear **Web Service** en Render
2. Root directory: `backend`
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Runtime: Python 3.11

> **Nota:** Free tier de Render duerme tras 15 min de inactividad. La primera petición puede tardar ~30s.

---

## Qué genera el DOCX

El backend construye un documento Word real con python-docx (no es mock ni placeholder):

- **Portada** — título "Documentador", nombre del proyecto, tag raíz del XML, fecha
- **Secciones jerárquicas** — cada nodo XML con hijos se convierte en un heading + tabla Campo/Valor
- **Tablas de datos** — listas de nodos repetidos se renderizan como tablas con columnas dinámicas
- **Resumen plano** — tabla con todos los campos hoja del XML como pares clave/valor
- **Pie de página** — marca "Generado por Documentador"
- **Estilo corporativo** — colores `#5D5E60`, fuente Calibri, celdas header con fondo gris

---

## Paleta de colores

| Uso | Color | Hex |
|-----|-------|-----|
| Principal / body text | Gris medio | `#5d5e60` |
| Títulos / dark | Gris oscuro | `#3a3b3d` |
| Texto inactivo / light | Gris claro | `#8a8b8d` |

---

## Archivos XML de ejemplo

Incluidos en `public/samples/` y accesibles como URL pública tras deploy:

- `/samples/sample-documentador.xml` — Estructura básica (~50 líneas)
- `/samples/sample-documentador-profesional.xml` — Estructura profesional completa (~150 líneas)

Descargables desde el paso 1 del formulario Documentador.
