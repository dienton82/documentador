
# Documentador — Next.js + TypeScript + Tailwind + CSS Modules

## Ejecutar
```bash
npm install
npm run dev
```

## Produccion
Aplicacion desplegada en Vercel:

`https://documentador-topaz.vercel.app/`

## Deploy en Vercel
- Esta aplicación es compatible con Vercel tal como está hoy.
- No requiere `static export`.
- El route handler [`app/api/documentar/route.ts`](./app/api/documentar/route.ts) funcionará en Vercel como función serverless del App Router.

Pasos mínimos:
1. Importa el repositorio `dienton82/documentador` en Vercel.
2. Mantén los valores por defecto de framework para Next.js.
3. Configura las variables de entorno según el modo de uso.
4. Despliega.

Variables para demo/mock:

```bash
DOCUMENTADOR_MODE=mock
```

Variables para backend real:

```bash
DOCUMENTADOR_MODE=real
BACKEND_URL=https://your-backend.example.com
DOCUMENTADOR_BACKEND_TARGET=python
```

O para Express:

```bash
DOCUMENTADOR_MODE=real
BACKEND_URL=https://your-backend.example.com
DOCUMENTADOR_BACKEND_TARGET=express
```

Notas:
- No uses `BACKEND_URL=http://127.0.0.1:8000` en Vercel.
- `NEXT_PUBLIC_DOCUMENTADOR_MODE` es opcional; el flujo actual funciona solo con variables server-side.
- No hace falta `vercel.json` para este caso.

## Flujo del documentador
- El usuario selecciona un archivo XML, elige una plantilla y define el nombre del proyecto.
- El frontend envía el archivo al endpoint local [`app/api/documentar/route.ts`](./app/api/documentar/route.ts).
- El route transforma el request en un payload estructurado y decide si responde con mock local o si reenvía al backend real.
- La respuesta vuelve siempre como DOCX descargable con nombre corporativo consistente.

## Modos de integración
Variables relevantes:

```bash
NEXT_PUBLIC_DOCUMENTADOR_MODE=mock
DOCUMENTADOR_MODE=mock
DOCUMENTADOR_BACKEND_TARGET=python
BACKEND_URL=http://127.0.0.1:8000
```

- `mock`: usa [`lib/documentador/mock.ts`](./lib/documentador/mock.ts) y devuelve el `placeholder.docx` para validar la UX completa sin backend real.
- `real`: usa [`lib/documentador/server-service.ts`](./lib/documentador/server-service.ts) y reenvía el XML al backend configurado en `BACKEND_URL`.
- `DOCUMENTADOR_BACKEND_TARGET`: documenta el destino esperado (`python` o `express`) para mantener claro el adapter activo, sin acoplar el componente de UI.

## Estructura del módulo
- [`components/Documentador.tsx`](./components/Documentador.tsx): UI y estado del flujo de 3 pasos.
- [`components/TemplateSelect.tsx`](./components/TemplateSelect.tsx): selector visual de plantilla.
- [`lib/documentador/types.ts`](./lib/documentador/types.ts): contrato del payload, respuesta, plantillas y modos.
- [`lib/documentador/constants.ts`](./lib/documentador/constants.ts): catálogo inicial de plantillas y constantes del módulo.
- [`lib/documentador/service.ts`](./lib/documentador/service.ts): cliente frontend para generar y descargar el documento.
- [`lib/documentador/server-service.ts`](./lib/documentador/server-service.ts): capa del route para mock o integración real.
- [`lib/documentador/mock.ts`](./lib/documentador/mock.ts): respuesta mock reutilizable para desarrollo y demos.
- [`lib/documentador/file-name.ts`](./lib/documentador/file-name.ts): nomenclatura corporativa del archivo DOCX.
- [`lib/documentador/download.ts`](./lib/documentador/download.ts): descarga robusta y parseo del nombre desde headers.

## Contrato esperado por el frontend
Payload estructurado interno:

```ts
{
  fileName: string;
  fileBase64: string;
  fileMimeType: string;
  projectName: string;
  templateCode: string;
  requestedFormat: "docx";
  corporateNaming: "legacy-bdo";
}
```

- Hoy el componente sigue enviando `multipart/form-data` al route local para no romper la UI.
- El route adapta ese request a un payload estable, que ya puede alimentar un backend Python o Express sin volver a mezclar la lógica en React.

## Descarga y nomenclatura DOCX
- La descarga se centraliza en [`lib/documentador/download.ts`](./lib/documentador/download.ts).
- El nombre final se centraliza en [`lib/documentador/file-name.ts`](./lib/documentador/file-name.ts).
- La convención actual preserva el formato corporativo que ya usaba la UI:

```text
TI – CQ-JiraXXX – Diseño detallado y desarrollo – {projectName}.docx
```

- La utilidad ya recibe `templateCode`, así que si en el futuro necesitas una convención como `BDO_{template}_{project}_{date}.docx`, podrás cambiarla en un solo punto.

## Integración futura con Python o Express
- Python: el route local ya puede seguir actuando como adapter y reenviar al servicio Python actual o a uno nuevo.
- Express: basta con apuntar `BACKEND_URL` a un servicio Express que acepte el mismo XML y responda el binario DOCX o un `Content-Disposition` con filename.
- El frontend no necesita conocer si el backend real es Python o Express; solo consume el route local y el contrato de descarga.
