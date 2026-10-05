# RealDraft AI

**Prototipo Full Stack de análisis de contratos con IA.** Interfaz React y backend Express/TypeScript para explorar hallazgos, propuestas de cláusulas, historial de auditorías y exportación de resultados.

## Qué puede revisar un equipo técnico

- Interfaz por componentes con React y TypeScript.
- API HTTP para análisis de contratos y propuestas de redacción.
- Integración de Gemini en `server/auditEngine.ts` con respuesta JSON.
- Historial local y cifrado de registros en `server/vault.ts`.
- Flujos de Google Docs/Drive y un canal de eventos SSE.
- Exportación PDF desde la interfaz.

El código combina integraciones reales con datos y comportamientos de demostración. Este repositorio no acredita una implementación lista para producción.

## Arquitectura

| Capa | Ubicación | Función |
| --- | --- | --- |
| Interfaz | `src/` | Componentes React, navegación y presentación de resultados |
| API | `server.ts` | Rutas Express, OAuth y servicios de la aplicación |
| IA | `server/auditEngine.ts` | Solicitud al LLM, parseo JSON y respuestas de respaldo |
| Historial | `server/vault.ts` | Registros en `data/vault_db.json` |
| Patrones | `server/fraudRegistry.ts` | Comparación de patrones y eventos |
| Compilación | `vite.config.ts`, `package.json` | Frontend Vite y servidor compilado con esbuild |

## Ejecución local

Requisitos: Node.js 22 o posterior y npm. Hay un `bun.lock`, pero no un `package-lock.json`; `npm install` resolverá las versiones permitidas por `package.json`.

    git clone https://github.com/ennigmatico/realdraft-ai.git
    cd realdraft-ai
    npm install
    cp .env.example .env

En PowerShell, el último comando es `Copy-Item .env.example .env`.

Configura `.env` con valores propios. La aplicación lee `process.env`; estos comandos cargan el archivo explícitamente antes de importar los módulos:

    node --env-file=.env --import tsx server.ts

Abre `http://localhost:3000`. Sin una clave Gemini válida, el motor puede devolver respuestas de demostración. Los resultados de respaldo no demuestran una llamada exitosa al proveedor.

Para compilar y ejecutar la versión compilada:

    npm run lint
    npm run build
    node --env-file=.env dist/server.cjs

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `GEMINI_API_KEY` | Credencial del proveedor, exclusivamente en el servidor |
| `APP_URL` | URL base para enlaces y callback OAuth; localmente `http://localhost:3000` |
| `ENCRYPTION_SECRET` | Secreto propio para el cifrado del historial; no reutilizar ejemplos |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Credenciales propias para las integraciones reales de Google |
| `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` | Configuración opcional de los flujos de suscripción |

El callback que construye el servidor es `${APP_URL}/api/auth/google/callback`. Comprueba que el modelo configurado en `server/auditEngine.ts` esté disponible para tu cuenta antes de evaluar llamadas reales. No subas `.env`, tokens ni contratos de clientes.

## Demostración técnica con datos ficticios

1. Inicia la aplicación localmente.
2. Introduce un contrato breve inventado o utiliza los ejemplos de la interfaz.
3. Ejecuta el análisis y revisa los hallazgos y propuestas.
4. Comprueba la respuesta HTTP y los logs para distinguir una llamada real de un respaldo de demostración.
5. Revisa el historial y prueba la exportación PDF.

## Estado y trabajo pendiente

- **Validación:** el proyecto tiene comandos de comprobación TypeScript y compilación, pero no una suite automatizada ni un workflow de CI en el árbol revisado. Estos comandos deben ejecutarse en un entorno con dependencias instaladas antes de afirmar que pasan.
- **OAuth:** incluye valores de demostración, sesiones en memoria y cookie `Secure`; el flujo en HTTP local requiere revisar su configuración. Faltan controles como `state`, validación estricta de orígenes y tratamiento seguro del intercambio de tokens.
- **Acceso:** revisar autorización e aislamiento de usuarios en todos los endpoints antes de usar información real.
- **Persistencia:** usa archivos JSON locales; evaluar concurrencia, respaldos y una base de datos antes de uso multiusuario.
- **Cifrado:** el servidor tiene un secreto de respaldo para demostración. Configurar un secreto propio y retirar el respaldo antes de un despliegue con datos reales.
- **LLM:** validar el esquema de respuestas y diferenciar los resultados de demostración en la interfaz; `JSON.parse` por sí solo no valida los campos.
- **Datos:** revisar cualquier archivo de `data/` antes de compartir el proyecto o un despliegue.

## Contacto

[Andrés López Mendoza](https://github.com/ennigmatico) · [Portafolio](https://ennigmatico.github.io/ennigmatico/portfolio/)
