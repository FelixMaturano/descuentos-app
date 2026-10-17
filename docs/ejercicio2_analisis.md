# Ejercicio 2 — E2E de Cypress generado por IA

## Alcance y entorno

Se ejecutó la suite completa de Cypress desde `web/` con el comando exacto `npm run e2e`. El entorno tenía el preview de Vite disponible en `http://localhost:4173`, la API Spring Boot disponible en `http://localhost:8080`, Node v22.23.2, Cypress 16.1.1 y Electron headless. Cada corrida descubrió tres specs y nueve pruebas en total: cinco del spec preexistente de integración, tres del nuevo spec con selectores estables y una variante con selectores frágiles.

## Resultados de cinco ejecuciones consecutivas

| Ejecución | Resultado | Aprobadas | Fallidas | Duración total de Cypress |
| --------- | --------: | --------: | -------: | ------------------------: |
| 1         |  Aprobada |       9/9 |        0 |                       7 s |
| 2         |  Aprobada |       9/9 |        0 |                       8 s |
| 3         |  Aprobada |       9/9 |        0 |                       7 s |
| 4         |  Aprobada |       9/9 |        0 |                       9 s |
| 5         |  Aprobada |       9/9 |        0 |                       6 s |

Las cinco ejecuciones fueron consecutivas y estables. Los tiempos corresponden a los reportes de Cypress y no incluyen el tiempo de preparación de la API o el build del frontend. En una exploración previa, antes de iniciar correctamente la API empaquetada, fallaron las verificaciones que dependían del servicio; esa ejecución no forma parte de la tabla. Esta diferencia muestra por qué un informe debe declarar el estado de sus dependencias y no presentar una corrida aislada como resultado estable.

## Selectores usados

| Propósito       | Selector                                                         | Evaluación                                                                     |
| --------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Precio          | `[data-cy=precio]`                                               | Atributo dedicado al test, no depende de clases visuales ni de texto.          |
| Porcentaje      | `[data-cy=porcentaje]`                                           | Identifica semánticamente el campo aunque cambie su posición.                  |
| Enviar          | `[data-cy=calcular]`                                             | No depende de la etiqueta visible del botón.                                   |
| Resultado       | `[data-cy=resultado]`                                            | Se comprueba visibilidad y texto final.                                        |
| Error           | `[data-cy=error]`                                                | Se comprueba visibilidad y mensaje esperado.                                   |
| Variante frágil | `input[type="number"]`.eq(0/1), `contains('button', 'Calcular')` | Depende de orden y texto visible; se conserva solo como comparación didáctica. |

No se usan esperas fijas. Cypress reintenta las aserciones `should('be.visible')` y `should('contain', ...)` hasta que se cumple la condición o vence el timeout configurado. En los dos specs nuevos, la respuesta HTTP del flujo feliz se intercepta para que el test de UI no dependa del estado del backend; el spec preexistente conserva las pruebas contra la API real.

## Correcciones aplicadas

- Se añadieron tres flujos al spec con selectores `data-cy`: cálculo correcto (200 Bs con 25%, total 150 Bs), precio negativo y porcentaje superior a 100.
- Se agregó la variante frágil sin `data-cy` para comparar estabilidad de localizadores.
- Se interceptó la respuesta del POST solo en los escenarios nuevos de cálculo feliz. Esto elimina la dependencia externa de esos tests sin sustituir la integración existente.
- Se confirmó que las validaciones de precio negativo y porcentaje fuera de rango se muestran antes de llamar a la API.
- Se dejó explícita una limitación del producto para revisión: el frontend permite precio cero, mientras la API lo rechaza. No se cambió esa regla como parte del ejercicio E2E.
