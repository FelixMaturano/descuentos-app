# Ejercicio 4 — Ayuda contextual y referencia rápida

## A. Calculadora de descuentos: referencia rápida

### Para calcular un precio

1. Abre la aplicación y confirma que la API esté conectada en el pie de página. Si aparece “API sin conexión”, el cálculo no podrá completarse.
2. En **Precio original (Bs)**, escribe el precio antes del descuento. Se admiten decimales.
3. En **Descuento (%)**, escribe un valor entre 0 y 100, inclusive.
4. Selecciona **Calcular** y espera el resultado.
5. Revisa el precio final en bolivianos, con dos decimales y coma decimal. Ejemplo: 200 Bs con 25% de descuento produce 150,00 Bs.

### Reglas y mensajes

- El precio debe ser mayor que cero según la regla de negocio de la API.
- El porcentaje permitido va de 0% a 100%.
- Un precio inválido muestra “El precio original debe ser mayor que cero”.
- Un porcentaje fuera del rango muestra “El porcentaje de descuento debe estar entre 0 y 100”.
- Si el servicio no responde, comprueba la conexión e inténtalo de nuevo; no asumas que el cálculo se completó.

**Nota de calidad:** hoy la validación del frontend rechaza precios menores que cero, pero permite cero; la API rechaza cero. Hasta alinear esa regla, el mensaje de precio cero puede aparecer después de enviar la solicitud al servidor. La regla oficial y la API exigen un valor estrictamente mayor que cero.

## B. Textos propuestos de ayuda contextual

Estos textos son propuestas documentales; no se afirma que la interfaz actual ya renderice tooltips.

| Campo                     | Texto de ayuda                                                       |
| ------------------------- | -------------------------------------------------------------------- |
| Precio original (Bs)      | “Escribe el precio antes del descuento. Debe ser mayor que 0 Bs.”    |
| Descuento (%)             | “Indica cuánto quieres descontar: usa un valor entre 0% y 100%.”     |
| Precio original (formato) | “Puedes usar decimales; el resultado se mostrará con dos decimales.” |

## C. Mensajes de error en lenguaje claro

| Situación                                | Mensaje recomendado                                                             |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| Precio vacío, cero, negativo o no válido | “Revisa el precio: debe ser un número mayor que 0 Bs.”                          |
| Porcentaje negativo o mayor que 100      | “Usa un descuento entre 0% y 100%.”                                             |
| API no disponible                        | “No pudimos calcular el descuento. Comprueba tu conexión e inténtalo de nuevo.” |

## D. Auditoría de contenido

| Sección            | Contenido IA                                                                 | Verdad Terreno                                                                            | Clasificación   | Corrección                                                                     | Evidencia                                                                                       |
| ------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Cálculo de ejemplo | 200 Bs con 25% termina en 150,00 Bs                                          | La API calcula el precio final con BigDecimal y dos decimales; el E2E verifica este caso. | Correcto        | Ninguna.                                                                       | `CalculadoraDescuentos.java`; `descuento.cy.ts`.                                                |
| Precio cero        | La guía inicial podría indicar que el formulario lo rechaza antes del envío. | `validar` del frontend solo rechaza `< 0`; la API rechaza `<= 0`.                         | Discrepancia    | Alinear la validación frontend con la regla de API y probar el caso cero.      | `web/src/descuentos.ts`; `api/src/main/java/bo/edu/usfx/descuentos/CalculadoraDescuentos.java`. |
| Porcentaje         | Se admite de 0% a 100%.                                                      | La validación frontend y la API aceptan los extremos y rechazan valores exteriores.       | Correcto        | Mantener pruebas de límites 0 y 100, además de -1 y 101.                       | `web/src/descuentos.ts`; `CalculadoraDescuentos.java`.                                          |
| Formato            | El resultado se presenta en Bs con coma y dos decimales.                     | El frontend usa `toFixed(2)` y sustituye el punto por coma.                               | Correcto        | Ninguna.                                                                       | `web/src/descuentos.ts`; `web/src/App.tsx`.                                                     |
| Tooltips           | Los textos sugeridos se muestran junto a cada campo.                         | No se encontraron tooltips implementados en el formulario actual.                         | No implementado | Tratar los textos como propuesta hasta añadir y probar controles accesibles.   | `web/src/App.tsx`.                                                                              |
| Estado de API      | La página informa conexión o desconexión.                                    | El pie muestra la versión/commit si `/api/info` responde o “API sin conexión” si falla.   | Correcto        | Mantener visible el estado; no confundir disponibilidad con éxito del cálculo. | `web/src/App.tsx`; `web/src/api.ts`.                                                            |

## E. Revisión humana y mantenimiento

La corrección humana más importante fue contrastar la regla del precio contra ambos lados del sistema: el copy promete “mayor que cero”, el frontend acepta cero y la API lo rechaza. También se separaron los textos propuestos de los tooltips realmente implementados, para no presentar una sugerencia como una capacidad existente.

Para mantener el manual sincronizado, cada cambio de regla debe actualizar conjuntamente la función de validación, las pruebas unitarias, el contrato de API y esta referencia. En la revisión del PR, comprobar los mensajes visibles y ejecutar E2E para límites y errores. El equipo debe asignar un responsable del manual y tratar los ejemplos/reglas de este documento como parte de la misma revisión de cambios de producto.
