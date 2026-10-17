# Ejercicio 3 — Selectores frágiles vs. estables

## Comparación ante el cambio de etiqueta

El spec `web/cypress/e2e/descuentos.cy.ts` encuentra el botón mediante `[data-cy=calcular]`. Si el texto visible cambia de **“Calcular”** a **“Aplicar”**, la prueba puede seguir localizando y pulsando el mismo control, siempre que se conserve el atributo de prueba. El test de resultado seguirá comprobando el resultado funcional, no el copy del botón.

La variante `web/cypress/e2e/descuentos_fragil.cy.ts` usa `cy.contains('button', 'Calcular')`. Con el cambio a “Aplicar”, Cypress ya no encontrará el elemento y fallará antes de enviar el formulario, aunque la función de cálculo continúe correcta. Un selector genérico como `button` podría evitar esa falla, pero sería ambiguo si aparece un segundo botón. La variante también localiza inputs por posición (`eq(0)` y `eq(1)`): insertar un campo numérico antes de ellos cambiaría silenciosamente qué dato edita la prueba. Un selector de clase como `.btn-primary` tampoco es ideal si la clase se usa solo para presentación y el rediseño la elimina.

Los selectores estables no significan “ignorar la interfaz”. Cuando el texto forma parte de un requisito visible, ese texto se debe comprobar en una aserción independiente. La separación es intencional: `data-cy` localiza el control por identidad de prueba; una aserción verifica que el botón diga “Aplicar” cuando ese copy sea un requisito. Así el test señala si falla la interacción o si el texto de producto no coincide.

## Herramientas self-healing

Las herramientas de auto-reparación intentan mantener una prueba funcionando cuando cambia un localizador. Pueden analizar el DOM, atributos, texto y proximidad de otros elementos para proponer o elegir un reemplazo. Esto reduce mantenimiento cuando un cambio cosmético rompe una ruta que todavía apunta al mismo control.

El riesgo aparece cuando la herramienta optimiza únicamente “encontrar algo parecido”. Puede seleccionar otro botón con texto similar, aceptar una pantalla diferente o actualizar automáticamente una aserción que debía detectar una regresión. El test queda verde, pero ya no comprueba el requisito original. También puede introducir resultados no deterministas si varios candidatos puntúan de forma parecida, ocultar problemas de accesibilidad o tolerar un cambio de UI/UX que el equipo debía revisar.

La auto-reparación debe producir una sugerencia auditable, no una aprobación silenciosa. La revisión humana debe confirmar la semántica del nuevo elemento, observar el diff del test y conservar una aserción explícita sobre el comportamiento esperado. Los atributos `data-cy` reducen la fragilidad por cambios visuales; no sustituyen la revisión de accesibilidad, textos, estados y navegación.
