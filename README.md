
# Documentador — React + Vite + TypeScript + Tailwind

Aplicación frontend de demostración para portafolio. Permite cargar un archivo XML, validarlo, seleccionar una plantilla, ingresar el nombre del proyecto y descargar un documento DOCX con nombre corporativo.

## Stack

- **React 18** + **TypeScript**
- **Vite** como bundler
- **Tailwind CSS** + CSS Modules
- **Framer Motion** para animaciones
- **Headless UI** + **Heroicons** para componentes de selección
- **SweetAlert2** para alertas
- **React Router DOM** para navegación

## Ejecutar

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview
```

## Flujo funcional

1. El usuario navega a **Aceleradores** y abre el **Documentador**
2. Carga un archivo `.xml` (se valida tipo/extensión)
3. Selecciona una plantilla de documento
4. Ingresa el nombre del proyecto
5. Al enviar, se descarga un archivo DOCX con nombre corporativo:
   `TI – CQ-JiraXXX – Diseño detallado y desarrollo – {NombreProyecto}.docx`

## Mock documental

Esta versión usa un **mock frontend** para la generación del documento:

- El archivo descargado es una plantilla base (`public/placeholder.docx`)
- No se realiza conversión real de XML a DOCX
- El nombre del archivo sí se personaliza con el nombre del proyecto ingresado
- El flujo completo (carga → validación → descarga) es funcional y demostrable

## Estructura

```
src/
  main.tsx              # Entry point
  App.tsx               # Router y layout principal
  globals.css           # Estilos globales + Tailwind
  components/           # Componentes de UI
    Header.tsx          # Cabecera con navegación
    Hero.tsx            # Hero de la página principal
    HeroCopy.tsx        # Hero con Documentador integrado
    Documentador.tsx    # Formulario principal (steps 1-2-3)
    Sidebar.tsx         # Panel lateral de aceleradores
    TemplateSelect.tsx  # Selector de plantilla (Headless UI)
  pages/                # Páginas/vistas
    Home.tsx
    Aceleradores.tsx
  lib/                  # Lógica de negocio
    alerts.ts           # Alertas con SweetAlert2
    documentador/
      constants.ts      # Templates y configuración
      download.ts       # Utilidad de descarga de blob
      file-name.ts      # Generación de nombre corporativo
      service.ts        # Mock: genera descarga desde placeholder
      types.ts          # Tipos TypeScript
public/
  placeholder.docx      # Plantilla base para descarga mock
  icons/                # Iconos de la UI
  *.svg                 # SVGs de la interfaz
```

## Preparado para integración real

El servicio en `src/lib/documentador/service.ts` puede reemplazarse fácilmente por una llamada a un backend real. Solo habría que cambiar `generateDocument()` para hacer un `fetch` a un endpoint que procese el XML y devuelva el DOCX.
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
