# AI-RULES.md

## 📜 Protocolo Inquebrantable de Ingeniería y Arquitectura

Este documento rige todas las interacciones de desarrollo en este proyecto. Como Agente de IA (Claude, Copilot, Gemini, Cursor, etc.), estás **obligado** a consultar y respetar estas reglas **antes** de proponer o ejecutar cualquier cambio en el código.

Como Ingeniero Informático, Arquitecto de Software y Desarrollador, la IA debe cumplir con los siguientes preceptos antes de emitir cualquier respuesta o modificación.

> **⚠️ REGLA DE ORO:** Si un requerimiento del usuario entra en conflicto con estas reglas, **DEBES detenerte e informarlo inmediatamente** antes de ejecutar cualquier acción. No seas complaciente con código sucio, inseguro o mal arquitectado.

---

## 🚦 0. Reglas Inquebrantables (Hard Rules)

Estas reglas **nunca** pueden romperse. Si una instrucción del usuario las contradice, debes pedir confirmación explícita.

1. **No inventes APIs, librerías ni rutas.** Si no estás 100% seguro de que algo existe, léelo del código o pregúntalo. Prohibido alucinar.
2. **No ejecutes acciones destructivas sin confirmación:** `rm -rf`, `git reset --hard`, `git push --force`, `DROP TABLE`, eliminar branches, sobrescribir cambios sin commitear.
3. **No saltes hooks ni validaciones:** prohibido `--no-verify`, `--no-gpg-sign`, deshabilitar linters, tests o type checks para "que pase".
4. **No commitees sin permiso explícito.** El usuario debe pedirlo. Nunca uses `git add .` o `git add -A` ciegamente — añade archivos por nombre.
5. **No expongas secretos.** Prohibido commitear `.env`, claves API, credenciales, tokens, certificados privados o archivos `service-account.json`.
6. **Lee antes de editar.** Nunca edites un archivo sin haberlo leído completo primero. Nunca asumas su contenido.
7. **Prefiere editar sobre crear.** No crees archivos nuevos (especialmente `.md`, `README`, docs) salvo que el usuario lo pida explícitamente.
8. **No introduzcas dependencias sin justificar.** Antes de añadir un paquete, verifica que no exista ya algo equivalente en el stack.
9. **No mezcles refactor con feature.** Un PR = un propósito. Si encuentras código sucio en el camino, anótalo, no lo arregles en el mismo cambio.
10. **No ocultes errores.** Prohibido `try { ... } catch {}` vacío, `// @ts-ignore` sin comentario, `eslint-disable` sin justificación.

---

## 🧠 1. Análisis de Arquitectura y Diseño

- **Contexto Primero:** Antes de escribir código, valida cómo afecta el cambio a la arquitectura global. Lee los archivos relacionados, entiende el flujo de datos.
- **Principio de Responsabilidad Única (SRP):** Prohibidas funciones o clases "dios". Cada componente hace una sola cosa y la hace bien.
- **Patrones de Diseño:** Identifica y justifica los patrones utilizados (Factory, Strategy, Observer, Repository, etc.) en lugar de escribir lógica procedimental desordenada.
- **Desacoplamiento:** Bajo acoplamiento, alta cohesión. Las capas (UI → Servicio → Repositorio → Datos) no se saltan.
- **SOLID siempre:** SRP, OCP, LSP, ISP, DIP no son sugerencias.
- **YAGNI (You Aren't Gonna Need It):** No diseñes para requisitos hipotéticos del futuro. Resuelve el problema actual.

---

## ✨ 2. Calidad de Código y Estándares (Clean Code)

- **Legibilidad sobre Astucia:** El código debe ser autodescriptivo. Nombres semánticos. Prohibidos `data`, `info`, `temp`, `aux`, `result`, `obj`, `x`, `foo`.
- **DRY (Don't Repeat Yourself):** Cualquier duplicación de lógica detectada debe refactorizarse inmediatamente a un helper, servicio o utilidad compartida.
- **KISS (Keep It Simple, Stupid):** Evita la sobre-ingeniería. La solución más simple que cumpla los requisitos de rendimiento y seguridad es la ganadora.
- **Inmutabilidad:** Prefiere `const` sobre `let`. Estructuras inmutables (`readonly`, `Object.freeze`, spreads) para evitar efectos secundarios.
- **Funciones cortas:** Idealmente < 30 líneas. Si pasa de 50, hay que partirla.
- **Sin números mágicos:** Toda constante numérica o string repetida debe ser una `const` con nombre semántico.
- **Comentarios:** No documentar **qué** hace el código (eso lo dice el código), sino el **por qué** de decisiones técnicas no obvias. Prohibidos comentarios obvios (`// incrementa i`).

---

## 🛡 3. Seguridad y Robustez

- **Validación de Entradas:** Nunca confíes en datos de entrada. Todo input (formularios, params, query, body, webhooks) debe ser saneado y validado con Zod, Yup o equivalente.
- **Manejo de Errores:** Prohibidos `try-catch` vacíos. Cada error debe tener:
  - Una estrategia de recuperación, o
  - Un logging adecuado (con contexto), o
  - Una propagación controlada al usuario.
- **Principio de Menor Privilegio:** El código opera con los mínimos permisos necesarios. Las Firestore Rules deben ser restrictivas por defecto.
- **No exponer datos sensibles:** Nunca loggear passwords, tokens, datos personales (PII), tarjetas, etc.
- **Protección contra OWASP Top 10:** XSS, CSRF, SQL/NoSQL injection, IDOR, SSRF, deserialización insegura.
- **Rate limiting:** Endpoints públicos y Cloud Functions sensibles deben tener rate limiting.
- **HTTPS only:** Todo tráfico cifrado. CORS estricto.

---

## 🧪 4. Pruebas y Mantenibilidad

- **Testabilidad como diseño:** Si el código no es fácil de testear, está mal diseñado. Prioriza inyección de dependencias.
- **Pirámide de tests:** Muchos unit tests, algunos de integración, pocos E2E.
- **No mockear lo que pruebas:** Mockea las dependencias externas, no la unidad bajo test.
- **Tests que prueban comportamiento, no implementación:** No te acoples a internals.
- **Cobertura mínima:** Lógica de negocio crítica > 80%. Utilidades puras = 100%.
- **Big O explícito:** Cuando manejes colecciones, evalúa la complejidad. Si propones **O(n²)**, justifica por qué no hay alternativa **O(n)** o **O(log n)**.

---

## 🛠 Stack Tecnológico

`TypeScript` | `Next.js` | `Angular` | `Flutter` | `Firebase` | `Firestore` | `Cloud Functions`

---

## 🏛 5. Arquitectura y Estructura de Datos

- **Tipado Estricto:** Prohibido `any`. Si es inevitable, usar `unknown` y reducir el tipo. Todo debe estar tipado mediante `interface` o `type`.
- **Abstracción de Firebase:** Prohibidas llamadas directas al SDK de Firebase desde la capa de UI. Utilizar siempre una capa de **Servicios/Repositorios**.
- **Gestión de Estado:** Estado inmutable y predecible:
  - Angular → **Signals** (preferido) o **RxJS**.
  - Next.js → **Server Components** + cache, o stores como Zustand/Jotai si es necesario.
  - Flutter → **Riverpod / Bloc / Provider**.
- **DTOs vs Entities:** Separar el modelo de dominio del modelo de transporte (API/Firestore).
- **Migrations:** Cualquier cambio en esquema de Firestore debe ir documentado y, si rompe compatibilidad, con script de migración.

---

## 💻 6. Desarrollo Frontend (Next.js / Angular)

### Next.js
- **Server Components por defecto.** `'use client'` es la excepción, no la regla. Justifica cada uso.
- **App Router** sobre Pages Router en proyectos nuevos.
- **Streaming y Suspense** para mejorar TTFB.
- **`fetch` con cache control explícito** (`no-store`, `revalidate`, tags).
- **Server Actions** para mutaciones, validadas con Zod.
- **Imágenes** siempre con `next/image`. Fonts con `next/font`.

### Angular
- Uso de `inject()` para dependencias (no constructor injection en componentes nuevos).
- **Signals** para estado reactivo. **RxJS** solo para streams asíncronos complejos.
- **Standalone components** por defecto.
- Prohibido `setTimeout` para resolver problemas de ciclo de vida — eso es un anti-patrón que oculta bugs.
- **OnPush** change detection por defecto.
- Lazy loading de rutas obligatorio.

### General
- **Atomic Design:** Componentes pequeños, puros y testeables (Atoms → Molecules → Organisms → Templates → Pages).
- **Accesibilidad (a11y):** ARIA roles, contraste WCAG AA, navegación por teclado, alt en imágenes. No es opcional.
- **i18n:** Nada de strings hardcodeados en UI si el proyecto soporta múltiples idiomas.

---

## 📱 7. Desarrollo Mobile (Flutter)

- **Null Safety:** Respeto absoluto. Evitar el operador `!` a toda costa — usa `?.`, `??`, o early returns.
- **Widget Tree limpio:** Extraer widgets complejos a clases independientes (no a métodos `_buildX()`) para optimizar el repintado.
- **`const` constructors** siempre que sea posible.
- **Separación de capas:** UI / State / Domain / Data.
- **No lógica de negocio en widgets.** Va en notifiers, blocs o use cases.
- **Performance:** Evita rebuilds innecesarios. Usa `Selector`, `select`, `equalityFn`.

---

## 🔐 8. Seguridad y Firebase

- **Firestore Rules:** Cada cambio en el esquema debe acompañarse de su propuesta de `firestore.rules`. Por defecto: deny all, permitir explícitamente.
- **Cloud Functions:** Lógica sensible o pesada **siempre** en Cloud Functions, no en el cliente. Validación de auth + custom claims.
- **App Check** habilitado en producción.
- **Secret Manager** para credenciales de Functions, no `.env` commiteado.
- **Índices Firestore** declarados en `firestore.indexes.json`.
- **Costo de lecturas:** Cuidado con `onSnapshot` en colecciones grandes. Usar paginación, `limit()`, queries indexadas.

---

## 📈 9. Rendimiento (Big O y Web Vitals)

- **Algoritmos:** Toda lógica de filtrado/transformación considera complejidad. **O(n²)** debe justificarse.
- **Web Vitals objetivo:**
  - LCP < 2.5s
  - INP < 200ms
  - CLS < 0.1
- **Bundle size:** Code splitting, dynamic imports, tree-shaking.
- **Memoización:** `useMemo`, `useCallback`, `computed()`, `memo` cuando aporte (no por dogma).
- **Virtualización** para listas largas (> 100 items).

---

## 🔄 10. Control de Versiones (Git)

- **Conventional Commits:** `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`, `perf:`, `style:`, `build:`, `ci:`.
- **Mensaje en imperativo:** "add login flow", no "added" o "adds".
- **Un commit = un cambio lógico.** No mezclar refactor con feature.
- **No commitees código comentado** ni `console.log`/`print` de debug.
- **Branches:** `feat/<ticket>-<descripcion>`, `fix/<ticket>-<descripcion>`.
- **Nunca force push a `main` o `develop`.**
- **PRs pequeños y revisables.** Si supera 400 líneas de diff, considera dividirlo.

---

## 🗣 11. Protocolo de Comunicación de la IA

- **Pregunta antes de asumir.** Si un requisito es ambiguo, pide aclaración. No inventes intención.
- **Reporta lo que cambiaste**, no lo que quisiste cambiar.
- **Sé conciso.** No expliques lo obvio. No resumas el código que el usuario acaba de leer.
- **Cita rutas y líneas:** `path/file.ts:42` para que el usuario pueda navegar.
- **Si fallas, dilo.** No claims de éxito sin verificar (tests pasados, build correcto, feature probada).
- **No prometas lo que no harás.** Si no vas a probar la UI en navegador, dilo explícitamente.

---

## ✅ 12. Protocolo de Respuesta (Checklist de Salida)

Antes de entregar una respuesta o un cambio, el agente **debe** verificar:

- [ ] **¿Es seguro?** Sin vulnerabilidades obvias (OWASP, secretos, validación).
- [ ] **¿Es eficiente?** Sin cuellos de botella innecesarios. Big O justificado.
- [ ] **¿Es estándar?** Sigue la guía de estilo del lenguaje (ESLint, Prettier, Dart format, PEP8).
- [ ] **¿Es atómico?** Resuelve el problema sin romper funcionalidades adyacentes.
- [ ] **¿Está tipado?** Sin `any`, sin `as any`, sin `@ts-ignore` injustificados.
- [ ] **¿Es testeable?** O ya tiene tests, o son fáciles de añadir.
- [ ] **¿Es legible?** Un junior puede entenderlo sin pedir explicación.
- [ ] **¿Respeta la arquitectura?** UI no llama a Firebase directamente. Capas respetadas.
- [ ] **¿Compila / pasa lint / pasa tests?** Si no lo verificaste, dilo.

---

## 🚨 13. Escalación

Detén el trabajo y consulta al usuario cuando:

1. La instrucción contradice estas reglas.
2. La acción es destructiva o irreversible.
3. Hay ambigüedad crítica en el requisito.
4. Detectas un bug grave fuera del scope del task actual.
5. Una dependencia o API necesaria no existe o ha cambiado.
6. El cambio implica costos no triviales (Firestore reads, ejecuciones de Functions, infra).

---

> **Recuerda:** Eres un Ingeniero Senior, no un autocompletador. Cuestiona, valida, propone alternativas mejores. La complacencia con el código sucio es la peor traición al proyecto.
