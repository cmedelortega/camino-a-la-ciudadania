# BUSINESS_LOGIC.md - Ciudadanía USA (Plataforma de Naturalización)

> Generado por SaaS Factory | Fecha: 2026-05-29

## 1. Problema de Negocio

**Dolor:** Los residentes permanentes (titulares de Green Card) que quieren naturalizarse
enfrentan un proceso confuso: no saben **cuándo califican** (regla de 5 o 3 años), si están
**exentos del examen de inglés** (reglas 50/20, 55/15, 65/20), **qué versión del examen de
civismo** les toca (2008 de 100 preguntas vs. 2025 de 128), ni **cómo estudiar** las preguntas.
La información oficial está dispersa, casi toda en inglés, y los nombres de funcionarios
(Presidente, Gobernador, etc.) cambian, lo que invalida material de estudio viejo.

**Costo actual:** Ansiedad, dinero gastado en abogados para dudas básicas, aplicaciones
presentadas antes de tiempo (rechazo + pérdida de la tarifa del N-400), y solicitantes que
reprueban el examen por estudiar material desactualizado o en el idioma equivocado.

## 2. Solución

**Propuesta de valor:** Una plataforma bilingüe (ES/EN) que guía al residente de principio a
fin: determina su elegibilidad y exenciones, le arma un plan de estudio personalizado, lo
entrena con simulacros realistas del examen de civismo (versión correcta según su caso), lo
acompaña en el proceso N-400 paso a paso, y resuelve dudas con un asistente de IA.

**Flujo principal (Happy Path):**
1. El usuario crea cuenta y completa un wizard corto (edad, fecha de Green Card, estado civil, fecha objetivo de aplicación).
2. El sistema calcula su elegibilidad: regla 5/3 años, exención de inglés aplicable (50/20, 55/15, 65/20) y versión del examen de civismo (2008 o 2025) según la fecha de presentación del N-400.
3. Genera un plan de estudio personalizado por semanas hasta su fecha objetivo, en su idioma.
4. El usuario estudia con flashcards bilingües y hace simulacros que imitan al oficial de USCIS (se detienen al alcanzar el mínimo de aciertos).
5. Consulta la guía del proceso N-400 (pasos, documentos, tiempos) y pregunta dudas al asistente de IA.
6. Llega preparado a la entrevista y aprueba.

## 3. Usuario Objetivo

**Rol:** Residente permanente legal (Green Card) que aspira a la ciudadanía por naturalización.
Bilingüe ES/EN con selector de idioma — sirve tanto al hispanohablante mayor con exención 55/15
(caso del documento de investigación) como al solicitante general que da el examen en inglés.

**Contexto:** Adultos de cualquier edad; sensibilidad especial a usuarios mayores (UI clara,
texto legible, modo español de primera clase). No son técnicos.

## 4. Arquitectura de Datos

**Input:**
- Perfil de elegibilidad: edad / fecha de nacimiento, fecha de obtención de Green Card, casado con ciudadano (sí/no), fecha objetivo del N-400, idioma preferido, estado de residencia (para preguntas locales: senadores, gobernador, capital).
- Respuestas a flashcards y simulacros.
- Preguntas en lenguaje natural al asistente de IA.

**Output:**
- Diagnóstico de elegibilidad y exenciones (qué regla aplica y por qué).
- Plan de estudio semanal personalizado.
- Resultados de simulacros (aciertos, aprobado/reprobado, preguntas falladas).
- Progreso de dominio por pregunta y por categoría.
- Respuestas del asistente de IA (con verificación de nombres de funcionarios vía web search).

**Storage (Supabase tables sugeridas):**
- `profiles`: datos básicos del usuario + idioma preferido.
- `eligibility_profiles`: edad, fecha GC, casado_con_ciudadano, fecha_objetivo_n400, estado; campos calculados (regla, exención, versión_examen).
- `civics_questions`: banco de preguntas bilingüe (question_en, question_es, answers_en[], answers_es[], categoría, es_dinámica, es_65_20, versión 2008/2025).
- `user_progress`: dominio por pregunta (veces correcta/incorrecta, estado, última vez vista).
- `exam_attempts`: intentos de simulacro (modo, puntaje, aprobado, preguntas usadas, fecha).
- `study_plans`: plan generado (fecha objetivo, semanas, temas por semana, progreso).
- `chat_messages`: historial del asistente de IA (opcional, si se persiste).

## 5. KPI de Éxito

**Métrica principal:** % de usuarios que alcanzan ≥90% de aciertos en simulacros completos antes
de su fecha de entrevista. Secundario: usuarios que completan el wizard y obtienen un diagnóstico
de elegibilidad correcto en <2 minutos.

## 6. Especificación Técnica (Para el Agente)

### Features a Implementar (Feature-First)
```
src/features/
├── auth/             # Autenticacion Email/Password (Supabase) — ya scaffolded
├── eligibility/      # Wizard + motor de reglas (5/3 años, 50-20, 55-15, 65-20, version examen)
├── civics/           # Banco de 128 preguntas bilingue, flashcards, simulacros de examen
├── study-plan/       # Generador de plan de estudio personalizado por semanas
├── process-guide/    # Guia del proceso N-400 paso a paso + checklist de documentos
└── ai-assistant/     # Chat IA (Vercel AI SDK + OpenRouter) con web search para datos actuales
```

### Reglas de negocio clave (motor de elegibilidad)
- **Tiempo requerido:** 5 años con GC en general; 3 años si casado con ciudadano (con convivencia).
- **Exención de inglés** (medida al presentar el N-400):
  - 50/20: ≥50 años + ≥20 años LPR → sin inglés, civismo en idioma nativo con intérprete.
  - 55/15: ≥55 años + ≥15 años LPR → igual que 50/20.
  - 65/20: ≥65 años + ≥20 años LPR → sin inglés + civismo **simplificado** (subconjunto 65/20).
- **Versión del examen de civismo** (según fecha del N-400):
  - 2008: N-400 antes del 2025-10-20 → 100 preguntas, 10 preguntas, 6 para aprobar.
  - 2025: N-400 desde el 2025-10-20 → 128 preguntas, 20 preguntas, 12 para aprobar.
  - 65/20: subconjunto designado, 10 preguntas, 6 para aprobar.

### ⚠️ Riesgo de contenido a resolver antes de producción
Las 128 preguntas del documento de investigación están **parafraseadas por IA** y tienen
duplicados. Antes de usarlas hay que **validarlas contra el PDF oficial de USCIS** (versión 2025
de 128 y versión 2008 de 100) para garantizar exactitud legal. El motor de simulacros debe marcar
las preguntas "dinámicas" (Presidente, Gobernador, etc.) para resolver el nombre actual en vivo.

### Stack Confirmado
- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind 3.4 + shadcn/ui
- **Backend:** Supabase (Auth + Database + RLS + Storage)
- **Validacion:** Zod
- **State:** Zustand (donde sea necesario)
- **AI:** Vercel AI SDK v5 + OpenRouter (chat + web search para datos actuales)
- **i18n:** Bilingue ES/EN con selector de idioma
- **MCPs:** Next.js DevTools + Playwright + Supabase

### Proximos Pasos
1. [ ] Setup proyecto base (npm install, .env, design system)
2. [ ] Configurar Supabase (tablas + RLS + seed del banco de preguntas validado)
3. [ ] Feature: auth (login/signup)
4. [ ] Feature: eligibility (wizard + motor de reglas)
5. [ ] Feature: civics (flashcards + simulacros)
6. [ ] Feature: study-plan (generador personalizado)
7. [ ] Feature: process-guide (guia N-400)
8. [ ] Feature: ai-assistant (chat con web search)
9. [ ] i18n ES/EN en toda la app
10. [ ] Testing E2E (Playwright) + Deploy Vercel
```
