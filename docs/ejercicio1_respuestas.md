# Ejercicio 1 — La mutación como control del pipeline

## Configuración aplicada

`web/stryker.config.json` limita la mutación a `src/cupones.ts` y mantiene `thresholds.break` en 70. El job `mutacion-frontend` usa Node 20, ejecuta desde `web/` y está condicionado a `github.event_name == 'pull_request'`. Así el score funciona como gate de revisión antes del merge, sin añadir varios minutos a cada despliegue de `main`.

## Cuándo ejecutar el job

La mutación es más costosa que una prueba unitaria normal: Stryker crea versiones alteradas del código y ejecuta pruebas para averiguar si cada cambio artificial es detectado. Ejecutarlo en cada push, en cada rama o durante un despliegue puede alargar el feedback sin aportar una decisión de calidad nueva. El PR es un buen punto de control: el cambio está listo para revisión y el score puede bloquear un merge que deje mutantes relevantes vivos.

El filtro por archivos modificados es una optimización adicional. Si un PR solo cambia documentación, imágenes o configuración ajena a `cupones.ts`, iniciar los 57 mutantes del módulo no ofrece información útil. En este repositorio el workflow reutilizable también se invoca desde CD; por eso el job quedó restringido a PR. Para afinarlo aún más, un paso de detección de cambios puede emitir un output y permitir el job únicamente cuando cambien `web/src/cupones.ts`, sus pruebas o la configuración de Stryker. La decisión debe evitar falsos negativos: un cambio en una dependencia de negocio o en el test runner también puede justificar ejecutar la mutación.

## Costo observado

En el entorno local disponible (Windows, Node v22.23.2, Cypress/Vitest instalados y concurrencia 2), la ejecución completa de Stryker tomó **3 min 15 s**. Mutó un archivo, generó 57 mutantes, eliminó los 57 y obtuvo un score de 100%; la corrida inicial de pruebas duró aproximadamente 9 segundos. Este tiempo es una medición puntual, no una garantía para GitHub Actions: la máquina, el sistema operativo, la carga y las versiones pueden cambiarlo. Frente a las pruebas unitarias, el costo dominante es volver a ejecutar pruebas para los mutantes, no compilar el frontend.

## Estrategias concretas para reducir el costo

1. **Detectar cambios con `git diff` y saltar cuando no correspondan.** En una etapa de CI se pueden comparar los SHA base y head del PR (`git diff --name-only BASE...HEAD`) y marcar si cambió `web/src/cupones.ts`, `web/src/cupones.test.ts` o `web/stryker.config.json`. El output gobierna `if:` del job. Los archivos de pruebas también deben considerarse, porque cambiar cobertura puede alterar el resultado aunque el fuente no cambie.

2. **Seleccionar fuente y pruebas de forma explícita.** La CLI instalada no tiene una opción `--mutants`; usarla produciría un error. La opción soportada es `--mutate`, por ejemplo `npx stryker run --mutate 'src/cupones.ts'`. `--testFiles` puede limitar la suite si se quiere verificar de forma aislada las pruebas dedicadas al módulo. La configuración ya establece ese alcance por defecto. Para un diagnóstico muy localizado, Stryker admite rangos de líneas en el patrón de mutación.

3. **Activar modo incremental.** `npx stryker run --incremental` conserva resultados y evita repetir trabajo de mutantes que no han cambiado. En CI hay que persistir su archivo incremental mediante caché y usar una clave ligada a lockfile, fuente y configuración; una caché obsoleta o compartida entre ramas sin una clave adecuada puede dar una medición incompleta. Conviene hacer una corrida completa periódica o antes de liberar.

4. **Ajustar concurrencia con mediciones.** La configuración actual usa `concurrency: 2`. Aumentarla puede reducir duración en un runner con CPU y memoria disponibles; también puede saturarlo, competir por disco y volver más lentas las pruebas. Conviene probar valores controlados (por ejemplo 2 y 4) en el mismo runner y comparar duración y memoria, en vez de igualar automáticamente el número de núcleos.

## Resultado

La suite actual eliminó **57 de 57 mutantes** (100%), por encima del umbral de 70. El umbral es un mínimo de pipeline, no una afirmación de que todo el riesgo esté cubierto: mutantes equivalentes, requisitos omitidos y errores de integración pueden sobrevivir a un score alto.
