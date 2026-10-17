# Política de uso de inteligencia artificial en ingeniería de software

**Código:** POL-SW-IA-01  
**Versión:** 1.0  
**Vigencia propuesta:** 16 de octubre de 2026  
**Propietario:** Líder de Calidad de Software  
**Aprobación:** pendiente de aprobación por el responsable del proyecto

## 1. Propósito y alcance

Esta política regula el uso de asistentes de IA para requisitos, diseño, código, pruebas, documentación, análisis y operaciones del proyecto. Aplica a integrantes, docentes, contratistas y herramientas automatizadas que procesen información del repositorio. La IA es una herramienta de apoyo: la persona que propone el cambio conserva la responsabilidad técnica, legal y de seguridad.

## 2. Información permitida y prohibida en prompts

Se puede incluir contexto técnico público o autorizado, fragmentos mínimos de código sin secretos, mensajes de error sanitizados, requisitos no confidenciales y datos sintéticos. Antes de compartir un fragmento, se debe comprobar que no incluya información sensible en comentarios, fixtures, capturas ni historial.

Está estrictamente prohibido introducir en prompts, adjuntos o conversaciones:

- Contraseñas, claves privadas, tokens, cookies, credenciales, secretos de CI/CD o URLs con credenciales.
- Datos personales identificables (PII), información de salud, financiera o identificadores de usuarios.
- Datos de clientes, órdenes, transacciones, tickets o bases de datos reales, aunque se omitan nombres.
- Código, arquitectura, incidentes o documentación confidencial cuya divulgación no esté autorizada por el propietario.
- Información protegida por contrato, regulación, NDA o política institucional sin autorización expresa y controles aprobados.

Si se expone información prohibida, se debe reportar inmediatamente al responsable de seguridad, revocar o rotar credenciales afectadas y seguir el procedimiento de incidentes. Borrar el prompt no sustituye la revocación.

## 3. Protocolo de revisión humana previo al merge

Todo cambio asistido por IA debe tener una persona autora responsable y una revisión humana independiente acorde al riesgo. Antes del merge, el PR debe completar esta lista:

- [ ] La bitácora de uso de IA está completa y no reproduce prompts sensibles.
- [ ] Requisitos, invariantes, límites y mensajes se contrastaron con el código y la especificación vigente.
- [ ] El diff es mínimo, comprendido y revisado línea por línea; no se aceptó código opaco solo porque compila.
- [ ] Pruebas unitarias, E2E pertinentes, build y análisis estático pasaron; las pruebas comprueban comportamiento y no solo ejecución.
- [ ] Se evaluaron errores, entradas límite, seguridad, privacidad, accesibilidad y compatibilidad de API.
- [ ] Dependencias nuevas, licencias y procedencia de código están revisadas y aprobadas.
- [ ] Documentación, ejemplos y mensajes de usuario coinciden con el comportamiento real.
- [ ] Cobertura y mutación superan los gates de esta política, o existe una excepción aprobada con alcance, responsable y fecha de expiración.
- [ ] No se incluyeron secretos, datos de clientes ni resultados de pruebas ficticios.

La persona revisora debe poder explicar el cambio y reproducir sus verificaciones. Para cambios de autenticación, pagos, datos personales o límites de confianza se requiere revisión adicional de seguridad.

## 4. Bitácora obligatoria de uso de IA en commits/PRs

Todo PR con asistencia material de IA incluirá una sección con este formato. Se puede añadir un resumen en el cuerpo del commit; la bitácora completa reside en el PR para mantener trazabilidad. No se debe copiar el prompt íntegro si contiene contexto interno.

```text
### Bitácora de uso de IA
- Asistencia: sí/no
- Herramienta y modelo (si se conoce):
- Fecha:
- Propósito:
- Archivos o áreas afectadas:
- Resumen de la solicitud (sin datos sensibles):
- Cambios aceptados y descartados:
- Verificaciones ejecutadas y resultado:
- Riesgos o limitaciones conocidos:
- Revisor humano responsable:
```

Se declara asistencia material cuando la IA propone código, pruebas, configuración, documentación técnica o decisiones que se incorporan al producto. El uso de autocompletado trivial puede registrarse como “asistencia menor” según la convención del equipo.

## 5. Aspectos legales, licencias y autoría

Antes de incorporar una salida generada se debe revisar que no reproduzca material de terceros incompatible con las licencias del repositorio ni atribuya falsamente autoría, marcas o citas. Las dependencias y fragmentos derivados deben conservar avisos y obligaciones de licencia aplicables. No se debe pedir a la herramienta que copie código propietario ni asumir que una salida está libre de derechos por haber sido generada automáticamente.

La autoría, titularidad y responsabilidad se rigen por los contratos, licencias y normas aplicables al proyecto y la jurisdicción; esta política no sustituye asesoría legal. La persona que integra el cambio responde por su revisión y por la evidencia de procedencia disponible. Si existe duda de licencia o titularidad, el cambio queda en espera de revisión legal o del propietario del código.

## 6. Gateways automáticos obligatorios

Todo PR debe pasar los siguientes controles automáticos antes del merge:

- **Cobertura de pruebas >80%**, medida sobre el código ejecutable acordado (líneas y/o statements), con exclusiones explícitas y revisables.
- **Puntaje de mutación >80%**, o análisis documentado de mutantes sobrevivientes considerados equivalentes/no accionables.
- Build, lint, pruebas unitarias y pruebas E2E aplicables.
- Escaneo de secretos y dependencias vulnerables conforme a los controles del repositorio.

Un umbral no se puede evadir reduciendo el conjunto medido o agregando exclusiones sin justificación revisada. Las excepciones requieren aprobación del Líder de Calidad y del dueño técnico, motivación, mitigación, fecha de expiración y tarea para cerrar la brecha.

**Brecha de implementación identificada:** a la fecha, `web/vite.config.ts` fija cobertura en 80 (no estrictamente mayor que 80) y `web/stryker.config.json` conserva `thresholds.break: 70` por el requisito del Ejercicio 1. Por tanto, la política define el gate futuro/organizacional, pero esos valores actuales no demuestran todavía que ambos gates >80 estén aplicados. El responsable del pipeline debe elevarlos en un cambio aprobado compatible con la consigna del ejercicio, verificar el score y actualizar esta nota antes de declarar cumplimiento automático.

## 7. Ubicación en el Plan de Calidad y métrica

Esta política forma parte del **Plan de Calidad del Software, Sección 4 — Estándares**, como estándar transversal de desarrollo, verificación, seguridad y documentación asistidos por IA. Debe revisarse al menos una vez por semestre y ante cambios relevantes de proveedor, licencia, legislación o clasificación de datos.

**Métrica propuesta — Cumplimiento de uso responsable de IA:**

`PRs asistidos por IA que incluyen bitácora, revisión humana y gates aprobados / total de PRs asistidos por IA × 100`

Meta: **100% por release** y al menos **95% mensual**, sin incidentes de exposición de información prohibida. Cualquier PR sin bitácora o con gate omitido cuenta como incumplimiento hasta que se documente y apruebe una excepción válida. El equipo debe medir además el porcentaje de excepciones vencidas, cuya meta es 0%.
