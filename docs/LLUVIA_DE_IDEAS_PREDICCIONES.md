# Deltalyn — Lluvia de ideas: app y web de predicciones de mercado

> **Cambio de rumbo (pivot):** Deltalyn **deja de depender de TradingView**. El producto es una app y una web que publican **escenarios de mercado para acciones de EE. UU. y cripto**, con **niveles claros** (zona de entrada, invalidación y objetivos) y un **plan claro**. Separa dos modos: **Inversión a largo plazo** y **Trading diario/swing**.
>
> Esta lluvia de ideas une el trabajo de 4 expertos (producto, datos/modelos, regulación y crecimiento) y resuelve los puntos en los que no coincidían. No es asesoría legal: antes de cobrar, un abogado de valores en EE. UU. debe revisar la sección 5.

---

## 1. La idea en una frase

**"Cada llamada, con fecha y hora. Calificada automáticamente. Para siempre."**

El mercado está lleno de grupos de Telegram que borran sus pérdidas y de "scores" de caja negra sin historial verificable. La ventaja de Deltalyn es la **honestidad medible**: cada escenario se publica con fecha, hora, nivel de invalidación y probabilidad, y se califica solo, con datos de mercado. Las pérdidas quedan a la vista igual que las ganancias.

**Cambio de lenguaje recomendado:** decir **"escenarios con probabilidad"** en lugar de "predicciones". Es más honesto (nadie adivina el precio exacto), genera más confianza y reduce el riesgo legal.

---

## 2. Dos modos, dos productos

| | **Inversión (largo plazo)** | **Trading (diario / swing)** |
|---|---|---|
| Horizonte | Meses a años | Intradía a semanas |
| Qué se publica | Banda de valor justo (bajista / base / alcista), escalera de acumulación en 3 tramos, tesis con "criterios de salida" | Zona de entrada, stop (invalidación), objetivos T1 y T2, relación riesgo/beneficio, fecha de vencimiento |
| Cómo se calcula | Valoración: DCF inverso, múltiplos frente a competidores (P/E, EV/Ventas) y, en cripto, ciclo y zonas on-chain | Volatilidad (ATR, movimiento esperado según opciones), máximos y mínimos previos, perfil de volumen, VWAP; en cripto también funding, open interest y liquidaciones |
| Ritmo | Revisión semanal y después de cada reporte de resultados | Plan pre-mercado diario (8:30 ET) y estado en vivo |
| Métrica de éxito | Retorno frente al índice y la banda de valor | % de aciertos, R promedio, drawdown máximo |

**Regla de oro:** una operación de trading **nunca** se convierte en silencio en "inversión". Cada modo tiene sus propias estadísticas, reglas y lenguaje.

---

## 3. Lluvia de ideas: 18 funciones

### Inversión
1. **Banda de valor justo**: responde en 5 segundos "¿está barata?".
2. **Escalera de acumulación**: 3 tramos de compra con precio y % de la posición en cada uno.
3. **Tarjeta de tesis con criterios de salida**: qué hechos del negocio invalidarían la idea. Evita quedarse "atrapado para siempre".
4. **Chequeo de tesis después de cada reporte de resultados**: ¿la tesis sigue en pie? Sí o no, en 2 minutos de lectura.
5. **Mapa del ciclo cripto**: dónde está BTC/ETH en su ciclo y cuáles son las zonas de acumulación.
6. **Recordatorios de rebalanceo** *(cuidado legal; ver sección 5)*.

### Trading
7. **Plan pre-mercado** a las 8:30 ET: 5 a 10 activos, sesgo y escenarios "si pasa X, entonces Y".
8. **Tarjetas de setup**: entrada, stop, T1/T2, riesgo/beneficio y vencimiento. Es la unidad básica del producto.
9. **Estado en vivo de cada setup**: Pendiente, Activado, Stop, Objetivo alcanzado o Vencido.
10. **Planes cripto por sesión**: Asia, Londres y Nueva York.
11. **"Hoy no hay operación"**, dicho explícitamente cuando no hay setups buenos. Esa honestidad también es producto.
12. **Calculadora de tamaño de posición** *(cuidado legal; ver sección 5)*.
13. **Diario de trading**: registra si el usuario siguió el plan o se desvió.

### Compartidas
14. **Historial público y permanente**: el motor de confianza.
15. **Alertas de nivel** que el usuario activa sobre los niveles publicados.
16. **Panorama semanal**: risk-on o risk-off, y niveles clave del S&P 500, Nasdaq y BTC.
17. **"Por qué" y nivel de confianza** en lenguaje simple, para que el usuario aprenda en vez de copiar.
18. **Páginas públicas por activo** (SEO) con niveles publicados con 24 h de retraso.

### MVP: las 5 funciones a lanzar primero
1. **Tarjetas de setup con estado en vivo** (#8 + #9).
2. **Plan pre-mercado diario** (#7), que crea el hábito.
3. **Banda de valor justo y escalera de acumulación** (#1 + #2) sobre unas 50 acciones de EE. UU. y las 10 principales cripto.
4. **Alertas de nivel** (#15).
5. **Historial público** (#14), activo **desde el día 1**: un historial no se puede reconstruir hacia atrás de forma honesta.

**Para después:** diario, rebalanceo, chequeo post-resultados, calculadora y español.

---

## 4. Cómo se generan los escenarios (el motor)

1. **Los niveles los calcula el código, nunca la IA.** Volatilidad (ATR, σ·√t), movimiento implícito de opciones, estructura (máximos y mínimos del día, semana y mes; gaps; pivotes), perfil de volumen (POC, VAH, VAL) y VWAP anclado. En cripto se suman funding, open interest, liquidaciones y métricas on-chain. Para largo plazo: DCF inverso y rangos de múltiplos.
2. **Puntaje de confluencia:** cuando varios métodos coinciden en un mismo nivel (a menos de 0.25 ATR entre sí), ese nivel pesa más.
3. **La probabilidad es real y está calibrada.** Por ejemplo: "62 % de que BTC toque 68.4k antes que 61.9k en 10 días". Sale de frecuencias históricas en condiciones de mercado similares. Se muestra en rangos ("~60 %"), sin decimales falsos.
4. **Ser honestos sobre lo que se puede predecir:**
   - Corto plazo: la volatilidad y el rango sí; la dirección casi no. Acertar la dirección un 52–55 % de las veces ya es bueno.
   - Swing: hay ventaja débil por momentum, deriva después de resultados y reversión tras extremos.
   - Largo plazo: la valoración y las ganancias de la empresa.
   - Imposible de predecir: techos y pisos exactos, noticias inesperadas y cascadas de liquidación. Hay que decirlo en la página.
5. **Papel de la IA (Claude):** recibe los números ya calculados y escribe la explicación y el plan. Después, un control automático revisa cada número del texto; **si aparece uno que no estaba en los datos, se rechaza**.
   - Haiku: resúmenes por activo.
   - Sonnet: panorama diario.
   - Opus: análisis semanal y revisión de calidad.
6. **Historial auto-calificado:**
   - Cada escenario se guarda con fecha, hora y una huella digital (hash) **antes** de conocer el resultado, y no se puede editar.
   - "Acierto" = toca T1 antes que la invalidación y dentro del plazo. Si ambos ocurren en la misma vela, cuenta como fallo.
   - Se publican el % de aciertos, el R promedio, el Brier score frente a una referencia aleatoria y el drawdown máximo, siempre por modo y por tipo de activo.
   - Universo fijo (S&P 100 y las 20 principales cripto) que se revisa cada trimestre. Se califica **todo**, sin elegir solo lo que salió bien.
7. **Validación antes de presumir resultados:**
   - Backtest "walk-forward" con datos tal como se conocían en cada fecha, sin sesgo de supervivencia.
   - Los últimos 12 meses se guardan sin tocar para la prueba final.
   - **3 meses publicando en vivo sin vender ninguna cifra de acierto.**

### Datos (costo aproximado; verificar precios y licencias actuales)

| Fuente | Para qué | Costo aproximado | Ojo |
|---|---|---|---|
| Massive (ex-Polygon) | Acciones y opciones | $29–199/mes | Mostrar precios al público requiere licencia comercial y tarifas de bolsa |
| FMP o EODHD | Fundamentales y valoración | $20–100/mes | El uso comercial requiere un plan superior |
| Binance / Coinbase | Cripto | Gratis | Términos de uso; no se pueden redistribuir los ticks en bruto |
| CoinGecko | Cripto | Gratis / ~$129/mes | Pide atribución |
| SEC EDGAR | Reportes oficiales | Gratis | Máximo 10 solicitudes por segundo |

**Táctica clave de licencias:** publicar **niveles y probabilidades calculados**, no cotizaciones en bruto. Si hace falta mostrar un precio, usar uno con retraso o un widget de gráfico con licencia.

**Arquitectura del MVP:** Supabase (Postgres) con tareas programadas.
- Cada hora (cripto) y al cierre (acciones): descargar datos, calcular niveles, generar escenarios, escribir el texto con IA, verificar los números y publicar.
- Cada noche: calificar los escenarios abiertos y actualizar el historial.
- Python alcanza; no hace falta Spark.

---

## 5. Regulación: diseñarlo seguro desde el inicio

En EE. UU. se puede publicar análisis sin registrarse como asesor de inversiones si se cumplen las 3 condiciones de **Lowe v. SEC** (la "exclusión de publicador"):

- **Impersonal**: todos los suscriptores ven lo mismo.
- **Genuino**: análisis real; el equipo no opera a favor ni en contra de sus propias llamadas.
- **Circulación general y regular**: horario fijo, no publicaciones disparadas por eventos.

### 3 líneas rojas (nunca)
1. **Nada de asesoría personalizada.** Nada basado en el portafolio, el tamaño de cuenta o la situación del usuario, ni en el chat, ni por email, ni por mensaje directo.
2. **Nada de "scalping" ni promoción pagada oculta.** No operar antes ni en contra de nuestras llamadas, ni cobrar en secreto a proyectos cripto o empresas.
3. **Nada de rendimiento engañoso.** Ni resultados elegidos a dedo, ni resultados hipotéticos presentados como reales, ni "ganancias garantizadas", ni testimonios falsos.

### Lista de diseño seguro
1. El mismo contenido para todos los suscriptores de un plan. El usuario no ingresa lo que posee.
2. Publicación con horario fijo. Las actualizaciones intradía son versiones nuevas del plan publicado, y las reciben todos.
3. El asistente de IA solo **explica** lo publicado. Ante "¿qué hago yo?", se niega.
4. Las alertas las activa el usuario sobre niveles ya publicados. Deltalyn **no** envía avisos de "compra ya".
5. Sin ejecución de órdenes, sin conexión con brokers y sin copy-trading.
6. Política escrita de inversiones propias del equipo, con ventanas sin operar alrededor de cada llamada.
7. Historial inmutable y completo.
8. Aviso legal que el usuario acepta al registrarse (queda guardado con fecha y hora) y pie de aviso en cada pieza.
9. Marketing revisado según las reglas de la FTC: solo testimonios con resultados típicos.
10. Cancelar debe ser tan fácil como suscribirse. Términos claros de renovación (ley ARL de California). Bloqueo de países no revisados.

### Decisiones donde los expertos no coincidían
- **Calculadora de tamaño de posición:** para Producto es una herramienta; para Regulación, usar el tamaño de la cuenta del usuario puede romper la exclusión. **Decisión: fuera del MVP.** Si se agrega, será una calculadora genérica que no guarda datos, y solo con el visto bueno del abogado.
- **"Mi watchlist, mis niveles":** está permitido solo si **filtra** los escenarios ya publicados para todos. Nunca debe generar un plan nuevo para un usuario.
- **Recordatorios de rebalanceo sobre las posiciones del usuario:** fuera, porque es personalizado.
- **Futuros y cripto con apalancamiento:** pueden activar las reglas de la CFTC (asesor de commodities). La exención 4.14(a)(9) aplica si el contenido no va dirigido a cuentas concretas. Empezar con acciones y cripto spot.
- **Brasil:** exige analistas acreditados incluso para reportes impersonales, así que queda fuera.
- **España/UE:** las reglas MAR exigen identificar al autor y declarar conflictos en cada recomendación.
- **México:** asesorar de forma personalizada exige registro, así que solo contenido impersonal.

### App Store
- **Apple:** las suscripciones vendidas dentro de la app deben usar la compra integrada de Apple. En EE. UU. ahora también se permite enlazar a un pago externo; hay que verificar las reglas vigentes.
- La app de finanzas debe publicarla **Berrezueta Inc.** como empresa, con número D-U-N-S, no a título personal.

---

## 6. Crecimiento y precios

### Gratis frente a pago
- **Gratis (genera confianza):** el historial completo; el panorama diario de SPY, QQQ, BTC y ETH; el newsletter semanal; y las páginas por activo con 24 h de retraso.
- **Pago (más velocidad y amplitud):** escenarios en tiempo real para todo el universo, los modos Inversión y Trading, alertas, watchlist y el archivo completo.
- **Regla:** se cobra la velocidad y la amplitud; **los datos de honestidad nunca se cobran**.

### Precios (decisión)
- **Lanzamiento:** Gratis + **Pro a $19.99/mes** (ya existe en Stripe) o **$179/año** (2 meses gratis). Prueba de 7 días con tarjeta.
- **Más adelante, con datos de uso:** Inversión $12.99 · Trading $24.99 · Ambos $29.99. Los primeros suscriptores conservan sus $19.99.
- **Latinoamérica (Fase 3):** ~$12.99 con precios locales de Stripe.

### Las 10 mejores ideas de adquisición (de más barata a más cara)
1. **Página de historial público**: es el activo de marketing principal.
2. **Páginas SEO automáticas por activo**, por ejemplo `/outlook/nvda-today` o `/btc-levels-this-week`.
3. **3 gráficos de niveles al día en X**, y por la tarde "cómo se comportaron los niveles de ayer", incluyendo los fallos.
4. **Shorts, TikTok y Reels de 30 s**: "niveles publicados a las 9:00, esto es lo que pasó".
5. **Reddit** (r/stocks, r/swingtrading, r/CryptoMarkets): solo valor, sin links, con revisiones semanales que muestren también los fallos.
6. **Newsletter "Week Ahead"** cada domingo.
7. **Referidos:** un mes gratis para ambas partes, solo cuando el referido paga.
8. **Intercambios con otros newsletters** de finanzas.
9. **Afiliados de brokers** (con aviso de la FTC), solo en una página de recursos, **nunca junto a un plan**.
10. **Anuncios pagados**, solo después de conocer el LTV y el CAC.

### Onboarding de 60 segundos (sin personalizar)
1. ¿Para qué vienes? Inversión, Trading o ambos.
2. ¿Qué mercados? Acciones y/o cripto.
3. ¿Cómo prefieres ver los planes? Conservador o Activo.

Estas respuestas solo **filtran y ordenan** el contenido que ven todos. El texto dice "Mostrando planes de swing", **nunca** "recomendado para ti".

### Retención
- **Morning Brief** a las 8:30 ET.
- **Revisión del domingo**, incluyendo los fallos.
- **Avisos de nivel** activados por el propio usuario.
- **Nada de rachas ni gamificación:** empujar a operar más destruye la confianza.

### 3 experimentos para los primeros 30 días
1. **Botón de la portada:** "Start free trial" frente a "Mira cada llamada que hemos hecho, aciertos y fallos". Éxito: +20 % de pruebas iniciadas.
2. **Plan anual preseleccionado:** éxito si al menos el 30 % elige el plan anual sin bajar la conversión total.
3. **Email a cambio del "Week Ahead"** en las páginas SEO. Éxito: al menos 4 % de captura de emails.

### Métricas
- **North Star:** **acciones sobre el plan por usuario de pago a la semana** (alertas creadas, setups guardados).
- **Freno de seguridad:** si la North Star sube pero la expectativa del historial baja, estamos vendiendo humo. Primero se arreglan los escenarios.

---

## 7. Pantallas de la app

1. **Hoy:** selector Inversión / Trading, plan del día, setups activos y panorama.
2. **Detalle de activo:** pestaña Inversión (banda de valor, escalera, tesis) y pestaña Trading (niveles, setups).
3. **Detalle de setup:** gráfico con zonas, línea de tiempo de estados y el "por qué".
4. **Historial:** todas las llamadas, con filtros por modo y por activo.
5. **Watchlist.**
6. **Alertas.**
7. **Ajustes.**

---

## 8. Qué cambia en lo que ya está construido

| Pieza | Qué pasa |
|---|---|
| Servidor MCP de TradingView (este repositorio) | Deja de ser el producto. Se puede usar internamente para investigar, pero los clientes no lo necesitan |
| Web deltalyn.com (`apps/web`) | Hay que **reescribir los textos y las secciones** para el nuevo producto: escenarios, dos modos e historial público. La base técnica sirve (Next.js, 3D, Stripe, Supabase) |
| Supabase `deltalyn` | Se mantiene. Se agregan las tablas `bars`, `levels`, `forecasts` (solo inserción), `outcomes` y `scorecard` |
| Stripe Deltalyn Pro $19.99 | Se mantiene. Falta agregar el precio anual de $179 |
| Plan anterior (`docs/PLAN_APP_WEB.md`) | Queda superado por este documento en producto y regulación |

---

## 9. Próximos pasos recomendados

1. **Validar el diseño con un abogado de valores en EE. UU.** (sección 5) antes de cobrar.
2. **Encender el motor en modo silencioso:** publicar escenarios automáticos de SPY, QQQ, BTC y ETH cada día durante 3 meses, con historial público y sin vender cifras.
3. **Reescribir deltalyn.com** para el nuevo producto, con la página de historial como protagonista.
4. **Contratar los datos:** FMP o EODHD para fundamentales y Massive para precios, con licencia de uso comercial.
5. **Recién después**, la app móvil y la versión en español.
