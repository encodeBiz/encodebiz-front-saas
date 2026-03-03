# Ayuda de Indicadores (CheckBiz V3)

## Rendimiento y Eficiencia (Heuristic Indicators)
Cada indicador incluye: **Qué indica**, **Cómo se obtiene**, **Qué compara/representa**, **Por qué es confiable**.

1. **Relación Eficiencia–Coste / Efficiency–Cost Relationship**  
   - Qué indica: uso eficiente del tiempo respecto al coste laboral.  
   - Cómo se obtiene: horas netas validadas + coste asociado + evolución histórica del coste medio + consistencia de patrón (sin días aislados).  
   - Qué compara: coste efectivo actual vs. histórico consolidado.  
   - Por qué es confiable: sólo jornadas validadas, volumen mínimo y penaliza patrones inestables.

2. **Evolución de la Eficiencia Económica / Economic Efficiency Evolution**  
   - Qué indica: si el rendimiento mejora, se mantiene o se deteriora.  
   - Cómo se obtiene: cambios sostenidos en coste/jornada, duración efectiva, estabilidad horaria y tendencia acumulada.  
   - Qué compara: actual vs. histórico consolidado.  
   - Por qué es confiable: basado en patrones acumulados, no en fluctuaciones puntuales.

3. **Potencial de Recuperación de Eficiencia / Efficiency Recovery Potential**  
   - Qué indica: margen de mejora al reducir variabilidad.  
   - Cómo se obtiene: dispersión horaria, variabilidad de coste por jornada y distancia a un patrón estabilizado.  
   - Qué evalúa: impacto económico de la variabilidad.  
   - Por qué es confiable: se basa en comportamiento real registrado.

4. **Índice de Eficiencia Operativa / Operational Efficiency Index**  
   - Qué indica: equilibrio entre coste real y esperado según historial.  
   - Cómo se obtiene: coste efectivo medio, coste histórico consolidado, consistencia de patrón y volumen estadístico.  
   - Qué representa: si el sistema opera en rango saludable.  
   - Por qué es confiable: requiere consistencia y datos suficientes.

5. **Índice de Ineficiencia Operativa / Operational Inefficiency Index**  
   - Qué indica: impacto económico de inestabilidad/variabilidad.  
   - Cómo se obtiene: incrementos repetidos de coste, dispersión vs. promedio, variabilidad de duración, ponderado por fiabilidad.  
   - Qué representa: penalización por inestabilidad.  
   - Por qué es confiable: sólo se activa con fluctuaciones sostenidas.

6. **Índice de Riesgo de Coste / Cost Risk Index**  
   - Qué indica: exposición económica por inestabilidad.  
   - Cómo se obtiene: volatilidad y dispersión de coste, estabilidad horaria, consistencia temporal.  
   - Qué representa: riesgo implícito; mayor variabilidad sostenida → mayor riesgo.  
   - Por qué es confiable: basado en variabilidad real sostenida.

7. **Índice Global de Salud Operativa / Global Operational Health Index**  
   - Qué indica: estado general del equilibrio operativo.  
   - Cómo se obtiene: integra estabilidad horaria, eficiencia económica, fiabilidad estadística y variabilidad de coste.  
   - Qué representa: salud global del sistema.  
   - Por qué es confiable: pondera estabilidad y volumen de datos (no es media simple).

8. **Índice de Confianza del Patrón / Pattern Confidence Index**  
   - Qué indica: solidez del análisis.  
   - Cómo se obtiene: jornadas válidas, consistencia temporal, ausencia de anomalías, estabilidad estructural.  
   - Qué representa: nivel de confianza; baja con poco volumen o inestabilidad.  
   - Por qué es confiable: se ajusta a calidad y cantidad del dato real.

9. **Desviación de Turno Operativo / Operational Shift Deviation**  
   - Qué indica: dispersión horaria vs. promedio consolidado.  
   - Cómo se obtiene: horas promedio de inicio/fin, variaciones repetidas, cambios progresivos.  
   - Qué representa: desalineación sostenida sin penalizar flexibilidad puntual.  
   - Por qué es confiable: usa patrones consolidados.

10. **Retorno por Hora Trabajada / Return per Worked Hour**  
    - Qué indica: eficiencia por hora efectiva.  
    - Cómo se obtiene: horas netas, coste asociado, estabilidad operativa, evolución histórica del patrón.  
    - Qué representa: utilización estructural del tiempo (no productividad individual).  
    - Por qué es confiable: emplea horas validadas y patrones estables.

## Datos Operativos (Operational Data)

11. **Horario Operativo Medio / Average Operational Schedule**  
    - Qué indica: horario real habitual de inicio y fin.  
    - Cómo se obtiene: sólo jornadas completas validadas; analiza inicio, fin, consistencia y variabilidad diaria.  
    - Qué consolida: patrón estable de horario efectivo.  
    - Por qué es confiable: exige volumen mínimo y descarta registros incompletos.

12. **Carga Horaria Semanal / Weekly Hour Load**  
    - Qué indica: horas reales por semana según tendencia consolidada.  
    - Cómo se obtiene: suma horas netas validadas, distribuye por semana y mide variación/estabilidad.  
    - Qué permite: ver si la carga es constante, creciente, decreciente o inestable.  
    - Por qué es confiable: se basa en horas registradas, no previsiones.

13. **Coste por Hora Trabajada / Cost per Worked Hour**  
    - Qué indica: coste medio por hora efectiva.  
    - Cómo se obtiene: relaciona horas netas y coste asociado, ajustado por estabilidad del patrón.  
    - Qué compara: coste medio actual vs. histórico consolidado.  
    - Por qué es confiable: usa jornadas válidas y estabilidad mínima.

14. **Coste por Jornada / Cost per Workday**  
    - Qué indica: coste de un día completo real.  
    - Cómo se obtiene: duración efectiva, coste asociado, variabilidad diaria, consistencia histórica.  
    - Qué aporta: comparación homogénea entre periodos/sucursales.  
    - Por qué es confiable: deriva de comportamiento real, no de costes teóricos.

15. **Coste por Rendimiento / Cost Performance**  
    - Qué indica: medida estructural que integra coste y estabilidad.  
    - Cómo se obtiene: coste por jornada + estabilidad horaria + variabilidad acumulada + fiabilidad estadística.  
    - Qué representa: calidad estructural del funcionamiento.  
    - Por qué es confiable: pondera estabilidad y volumen de datos.

16. **Rendimiento del Coste Invertido / Return on Invested Cost**  
    - Qué indica: aprovechamiento operativo del coste asumido.  
    - Cómo se obtiene: coste efectivo acumulado, estabilidad del patrón, regularidad horaria, tendencia histórica.  
    - Qué representa: si el coste se aprovecha coherentemente con el patrón.  
    - Por qué es confiable: se basa sólo en relación tiempo–coste interna.

17. **Nivel de Confiabilidad / Reliability Level**  
    - Qué indica: solidez estadística del patrón operativo.  
    - Cómo se obtiene: jornadas válidas acumuladas, consistencia temporal, ausencia de anomalías, estabilidad.  
    - Qué representa: robustez del insight.  
    - Por qué es confiable: baja automáticamente con poco volumen o alta variabilidad.

18. **Volumen de Datos / Data Volume**  
    - Qué indica: cantidad de jornadas válidas usadas para el patrón.  
    - Cómo se obtiene: sólo jornadas completas que pasan controles de coherencia.  
    - Por qué es relevante: más volumen consolidado = más estabilidad y menor distorsión.

