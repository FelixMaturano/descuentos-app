# Ejercicio 6 — Guion de presentación

**Duración total:** 25 minutos: 10 min de presentación, 10 min de demostración en vivo y 5 min de preguntas.  
**Nota de alcance:** no se encontró en el repositorio una guía adicional con títulos obligatorios para las 12 diapositivas. Este guion propone el contenido textual a partir de los siete ejercicios y de la implementación real de descuentos-app.

## Bloque 1 — Presentación (10 minutos, 12 diapositivas)

### Diapositiva 1 — Calidad de software con pruebas y asistencia de IA (0:30)

**Texto visible:**

> Práctica 9 · Parte C  
> Calidad de software con pruebas, mutación y asistencia de IA  
> Descuentos-app · COM450

**Guion:** “Presentaremos cómo convertir una calculadora pequeña en un caso práctico de calidad: requisitos verificables, pruebas unitarias y E2E, mutación como gate y uso responsable de IA.”

### Diapositiva 2 — El problema que queremos controlar (0:45)

**Texto visible:**

> Una prueba puede ejecutarse y aun así no detectar el defecto.  
> La calidad se mide por los comportamientos que protegemos, no solo por líneas ejecutadas.

**Guion:** “La cobertura indica qué código se ejecutó, pero no prueba que las aserciones distingan el comportamiento correcto del incorrecto. Por eso añadimos mutación y escenarios de usuario.”

### Diapositiva 3 — El sistema bajo prueba (0:45)

**Texto visible:**

> React + TypeScript → API Spring Boot  
> Vitest para lógica local · Cypress para flujos de navegador  
> GitHub Actions para gates de CI/CD

**Guion:** “El formulario valida localmente y solicita el cálculo a la API. Vitest cubre las funciones; Cypress recorre la UI; Actions coordina los controles antes del despliegue.”

### Diapositiva 4 — Pruebas unitarias de cupones (0:50)

**Texto visible:**

> Código: cuatro letras y dos dígitos  
> Límites: fecha de vencimiento inclusiva, tope y redondeo  
> Errores: precio inválido, cupón ausente y código inválido

**Guion:** “Cada regla tiene casos válidos, inválidos y de límite. Por ejemplo, el código `XUSFX10` debe rechazarse: comprueba que el patrón esté anclado al comienzo y no acepte un código válido dentro de texto adicional.”

### Diapositiva 5 — Mutación: ¿las pruebas detectan el cambio? (0:55)

**Texto visible:**

> Stryker altera el código deliberadamente.  
> 57 mutantes · 57 eliminados · 100% observado  
> Umbral configurado para el ejercicio: 70%

**Guion:** “El mutante sobreviviente que quitaba `^` motivó una prueba de prefijo extra. Después de agregarla, la mutación sobre `cupones.ts` eliminó los 57 mutantes en la medición local.”

### Diapositiva 6 — Mutación en el pipeline (0:50)

**Texto visible:**

> Job independiente · Pull requests · Fuente: `src/cupones.ts`  
> Umbral evita aceptar scores bajos  
> Incrementalidad y cambios detectados reducen costo

**Guion:** “El job se limita a PRs porque ahí el resultado informa una decisión de merge. En este entorno Stryker tardó 3 minutos y 15 segundos; para repositorios grandes se deben medir caché incremental, alcance y concurrencia.”

### Diapositiva 7 — E2E: los flujos de usuario (0:55)

**Texto visible:**

> 200 Bs − 25% → 150,00 Bs  
> Precio negativo → mensaje claro  
> Porcentaje 101% → validación

**Guion:** “Cypress opera la pantalla, envía el formulario y verifica resultado o error visible. No hay esperas fijas; las aserciones se reintentan hasta observar el estado.”

### Diapositiva 8 — Selectores estables y frágiles (0:45)

**Texto visible:**

> Estable: `[data-cy=calcular]`  
> Frágil: `contains('button', 'Calcular')`  
> La identidad del control no es su etiqueta visual

**Guion:** “Si el texto cambia a ‘Aplicar’, el selector dedicado sigue encontrando el botón; el selector por texto deja de hacerlo. La etiqueta puede comprobarse aparte si es un requisito.”

### Diapositiva 9 — Documentación basada en evidencia (0:50)

**Texto visible:**

> Manual y tooltips: lenguaje del usuario  
> Auditoría: contenido propuesto vs. verdad del código  
> Discrepancia encontrada: precio cero en UI y API

**Guion:** “La auditoría detectó que el frontend permite cero mientras la API lo rechaza. Documentar sin contrastar el comportamiento habría perpetuado una instrucción engañosa.”

### Diapositiva 10 — Política de uso de IA (0:55)

**Texto visible:**

> No incluir secretos, tokens, PII ni datos de clientes  
> Revisión humana obligatoria  
> Bitácora, licencias y gates verificables

**Guion:** “La IA acelera una propuesta, no asume responsabilidad. Cada PR asistido debe dejar trazabilidad, revisar licencias y cumplir los controles de calidad y seguridad.”

### Diapositiva 11 — Evidencia de estabilidad (0:55)

**Texto visible:**

> Cypress: 5 corridas consecutivas · 9/9 en cada una  
> Duración observada: 6–7 s  
> Stryker: 57/57 mutantes eliminados · 3:15

**Guion:** “Los datos son de ejecuciones locales declaradas con su entorno. No son una promesa de duración para CI ni reemplazan repetir las mediciones después de cambios relevantes.”

### Diapositiva 12 — Conclusiones y decisión (1:05)

**Texto visible:**

> Aserciones que detectan defectos  
> Pipeline que informa a tiempo  
> Documentación revisada por personas  
> Próximo paso: alinear validación de precio cero y los umbrales de la política

**Guion:** “La evidencia más valiosa no es el porcentaje aislado: es que cada regla crítica tenga una prueba capaz de fallar, que el pipeline la ejecute en el momento adecuado y que una persona contraste el resultado con el producto.”

## Bloque 2 — Demostración en vivo (10 minutos)

| Tiempo     | Acción                                                        | Resultado que se muestra                               |
| ---------- | ------------------------------------------------------------- | ------------------------------------------------------ |
| 0:00–0:30  | Presentar aplicación y condiciones locales.                   | Frontend en 4173 y API en 8080.                        |
| 0:30–2:00  | Ejecutar pruebas unitarias del módulo.                        | Reglas de código, vencimiento y cálculo.               |
| 2:00–3:30  | En Cypress, enviar 200 y 25.                                  | Resultado 150,00 Bs.                                   |
| 3:30–4:30  | Enviar precio negativo y porcentaje 101.                      | Errores visibles; sin espera fija.                     |
| 4:30–5:30  | Mostrar `[data-cy=calcular]` frente a `contains('Calcular')`. | Qué selector soportaría renombrar el botón.            |
| 5:30–9:30  | Ejecutar `npx stryker run` o abrir el informe HTML reciente.  | Score, mutantes eliminados y costo aproximado de 3:15. |
| 9:30–10:00 | Mostrar el job PR-only y recordar los límites documentados.   | Gate y alcance del ejercicio.                          |

**Plan de contingencia:** si la API o el navegador no arranca, usar el informe Cypress/Stryker ya generado y explicar la causa observada; no reportar una demostración grabada como ejecución en vivo.

## Bloque 3 — Preguntas (5 minutos)

**Apertura exacta:** “Tenemos cinco minutos para preguntas sobre cobertura, mutación, confiabilidad de E2E, selectores o política de IA.”

**Cierre exacto:** “Registraremos cualquier brecha detectada como una acción con responsable y fecha; un porcentaje verde no reemplaza la revisión del comportamiento real.”
