# Deltalyn: investigación de mercado y replanteo

> Basado en 4 investigaciones con búsqueda web, realizadas en octubre de 2026: competencia, tamaño del mercado, casos de éxito y fracaso, y repositorios open source. Las fuentes aparecen enlazadas. Las cifras que vienen de sitios de terceros (precios, número de suscriptores) deben verificarse antes de usarlas para decisiones importantes.

---

## 1. Veredicto: ¿tendría éxito?

**Sí, como nicho rentable. No como producto masivo. Y solo si se cambia lo que se promete.**

| Señal | Qué dicen los datos | Lectura |
|---|---|---|
| Demanda | Robinhood tiene **4.8 millones de suscriptores pagos de Gold (+39 % anual)**; el 40 % de sus clientes nuevos lo contrata ([Robinhood Q2 2026](https://investors.robinhood.com/news-releases/news-release-details/robinhood-reports-second-quarter-2026-results)). Los inversores minoristas metieron un récord de ~$300 mil millones en 2025 ([Kitco/Reuters](https://www.kitco.com/news/off-the-wire/2025-12-23/retail-investors-have-more-sway-over-wall-street-after-record-year)) | ✅ Los inversores minoristas sí pagan una suscripción mensual |
| Uso de IA | El 30 % de los inversores minoristas de EE. UU. ya usa IA para invertir (+75 % en un año) ([eToro](https://www.etoro.com/en-us/news-and-analysis/latest-news/press-release/us-retail-investors-flock-to-ai-tools-with-usage-surging-75-in-one-year/)), pero al **39 % le preocupan las recomendaciones equivocadas** ([Investing.com](https://hedgefundalpha.com/news/retail-investors-now-use-ai-to-inform-investment-decisions/)) | ✅ Hay demanda, y la **desconfianza** es justo la oportunidad |
| Precio | Seeking Alpha cobra $299/año, Motley Fool $199/año y TipRanks $360–600/año | ✅ El rango de $15–30 al mes está validado |
| Competencia | Los scores de IA (Danelfin, Zacks, TipRanks, Token Metrics) y la IA gratuita (Perplexity Finance, Robinhood Cortex) están saturados | ⚠️ "Resumen de mercado con IA" ya no vale nada por sí solo |
| Realidad del rendimiento | El S&P 500 superó al **81 % de los newsletters** en 10 años ([Hulbert](https://humbledollar.com/2020/03/letter-grades/)). Solo el **38 % de los precios objetivo de los analistas se cumple** ([Bradshaw et al.](https://ideas.repec.org/a/spr/reaccs/v18y2013i4d10.1007_s11142-012-9216-5.html)). El 89.5 % de los fondos activos pierde contra el índice ([SPIVA](https://spglobal.com/spdji/en/spiva/article/spiva-us-year-end-2024)) | ❌ **Prometer "le ganamos al mercado" es mentir o pelear contra la estadística** |
| Regulación | Multas a Raging Bull ($2.4M, FTC), a Delphia y Global Predictions (SEC, por "AI-washing") y casos de "señales de IA" en WhatsApp ($14–15M, SEC 2025–2026) | ❌ "Señales con IA" ya es un **patrón de fraude** que los reguladores tienen identificado |
| Cripto | BTC tocó su máximo (~$126k) en octubre de 2025 y estuvo en mercado bajista durante 2026 | ⚠️ Conviene **empezar con acciones**; cripto vende poco hasta que cambie el ciclo |
| Fracasos | Investmint, Shares, Motif y Atom Finance fracasaron porque los usuarios usaban el producto pero no pagaban, y adquirir clientes era caro | ⚠️ Hay que tener distribución propia (SEO y comunidad) |

### Tamaño realista (estimación con supuestos explícitos)
- **Mercado total en EE. UU.:** ~6.5 millones de personas que pagan por investigación × $240/año ≈ **$1,600 millones al año**.
- **Segmento al que podemos llegar** (usan IA, son móviles y tienen menos de 50 años): ≈ **$280 millones al año**.
- **Meta realista:**

| Año | Suscriptores de pago | Ingresos anuales |
|---|---|---|
| 1 | 1,500–3,000 | $0.4–0.7 M |
| 2 | 8,000–15,000 | $2–3.6 M |
| 3 | 25,000–40,000 | $6–10 M |

### El hueco real del mercado
Según la investigación de competencia, **nadie hace estas tres cosas juntas**:
1. Niveles explícitos (entrada, stop y objetivo) para **acciones y cripto en un solo producto**.
2. Los **modos de largo plazo y de swing** con el mismo motor.
3. Una **calificación pública y automática de sus propias llamadas**, midiendo si el precio tocó primero el objetivo o el stop, e incluyendo las que vencieron sin activarse.

TipRanks califica a *otros* analistas. Danelfin y Zacks muestran backtests. Motley Fool tiene su historial detrás de un muro de pago. **Aplicar esa calificación pública a tus propias llamadas, sin necesidad de login, es lo que te diferencia.**

---

## 2. El replanteo (cómo lo haría un experto del top 0.1 %)

### Cambio 1: vender **honestidad medible**, no aciertos
- ❌ "Predicciones con IA que le ganan al mercado". Es estadísticamente falso y es exactamente lo que persiguen la SEC y la FTC.
- ✅ **"El mercado, en escenarios con probabilidad. Cada llamada calificada en público. Para siempre."**
- La promesa es **calibración**: cuando decimos 60 %, ocurre ~60 % de las veces. Eso sí se puede cumplir y medir.

### Cambio 2: primero un **marcador público**, después la app
El orden de los ganadores (TradingView, Simply Wall St, Seeking Alpha) fue siempre **distribución propia antes que cobrar**:
1. **Meses 0–3:** el motor publica escenarios gratis cada día sobre SPY, QQQ, las 20 acciones más buscadas, BTC y ETH. El **marcador público** se llena solo. Cada escenario tiene una página SEO automática. **No se cobra todavía.**
2. **Meses 3–6:** cuando el marcador tenga 90 días, se abre **Pro** (tiempo real, universo completo, alertas y modos). Para entonces se puede vender con datos reales.
3. **Mes 6 en adelante:** **app móvil**. La web primero evita los problemas con el App Store (Apple marca como "trading" incluso las apps que solo informan). Mientras tanto, la web se instala en el celular como app (PWA).
4. **Mes 9 en adelante:** español (EE. UU. hispano, México y Colombia, con precio local).

### Cambio 3: acciones primero, cripto después
El ciclo cripto está bajista y la competencia cripto está llena de estafas. Cripto entra al marcador desde el día 1 para acumular historial, pero **el marketing se enfoca en acciones**.

### Cambio 4: diseño seguro desde la regulación
El mismo contenido para todos. Sin asesoría personalizada, sin conexión con brokers, sin "compra ya". El asistente solo explica lo publicado. Cancelar es tan fácil como suscribirse. Un abogado lo revisa antes de cobrar. (El detalle está en `LLUVIA_DE_IDEAS_PREDICCIONES.md`, sección 5.)

### Cambio 5: criterios para parar o pivotar (decididos antes de empezar)
| Señal a los 90 días | Decisión |
|---|---|
| El **Brier skill score ≤ 0** (los escenarios no superan a la referencia aleatoria) | No vender "escenarios". **Pivotar a herramienta**: niveles calculados y marcador como producto de datos, sin probabilidades |
| Menos de 1,000 emails en la lista o menos del 2 % de visitas → email | Revisar el posicionamiento antes de invertir en la app |
| Menos del 3 % de los usuarios gratuitos pasa a pago en los 60 días siguientes al lanzamiento de Pro | Cambiar el precio o lo que se cobra (por ejemplo, alertas y tiempo real) |

---

## 3. Qué **no** construir: reutilizar repositorios probados

**Regla:** solo se construye lo que es nuestro diferencial, que es el registro de escenarios con calificación automática y el marcador público. Todo lo demás se reutiliza.

| Necesidad | Repositorio | Licencia | Notas |
|---|---|---|---|
| Datos cripto | [ccxt](https://github.com/ccxt/ccxt) (~44k ⭐) | MIT ✅ | Estándar de la industria |
| Reportes SEC y fundamentales | [edgartools](https://github.com/dgunning/edgartools) | MIT ✅ | Muy activo |
| Acceso unificado a datos | [OpenBB](https://github.com/OpenBB-finance/OpenBB) (~74k ⭐) | ⚠️ **Solo la versión 5.x** (Apache-2.0); la 4.x es AGPL | Opcional; fijar la versión |
| Indicadores (ATR, pivotes, 150+) | [TA-Lib](https://github.com/TA-Lib/ta-lib-python) | BSD ✅ | Probado durante décadas |
| Indicadores en pandas | [pandas-ta-classic](https://github.com/xgboosted/pandas-ta-classic) | MIT ✅ | El pandas-ta original está abandonado |
| Volatilidad (GARCH) | [arch](https://github.com/bashtage/arch) | NCSA ✅ | Bandas de volatilidad |
| Pronósticos con intervalos | [statsforecast](https://github.com/Nixtla/statsforecast) | Apache ✅ | Bandas de escenarios |
| Pronóstico probabilístico con IA | [Chronos](https://github.com/amazon-science/chronos-forecasting) | Apache ✅ | Revisar la licencia de los *pesos* del modelo |
| Calificación de pronósticos | [scoringrules](https://github.com/frazane/scoringrules) | Apache ✅ | CRPS y Brier para el marcador |
| Valoración y DCF | [FinanceToolkit](https://github.com/JerBouma/FinanceToolkit) | MIT ✅ | Sus datos vienen de FMP (pago) |
| Gráficos de niveles | [lightweight-charts](https://github.com/tradingview/lightweight-charts) | Apache ✅ **+ atribución obligatoria** | Hay que mostrar el aviso y el enlace a TradingView |
| Gráficos del marcador | [ECharts](https://github.com/apache/echarts) | Apache ✅ | Calibración e historial |
| Web SaaS (Next.js, Supabase, Stripe) | [next-supabase-stripe-starter](https://github.com/KolbySisk/next-supabase-stripe-starter) | Revisar licencia | Encaja con lo que ya tenemos |
| App móvil (después) | [obytes Expo template](https://github.com/obytes/react-native-template-obytes) + RevenueCat | MIT ✅ | Para el mes 6 en adelante |
| Referencia de todo el pipeline | [machine-learning-for-trading](https://github.com/stefan-jansen/machine-learning-for-trading) | Educativo | Solo como guía |

### 🚫 3 trampas de licencia que hay que evitar
1. **Licencia del código frente a licencia de los datos.** El código de yfinance es libre, pero **Yahoo prohíbe el uso comercial de sus datos**. Hay que pagar una fuente con licencia comercial (Massive/Polygon, Tiingo, FMP o EODHD).
2. **AGPL, GPL y "Commons Clause".** **No** usar en el producto backtesting.py (AGPL), OpenBB 4.x (AGPL) ni vectorbt (Commons Clause: no se puede vender un producto basado en él). Para investigación interna sí se pueden usar.
3. **Atribución.** lightweight-charts exige mostrar el aviso y el enlace a TradingView, sin dar a entender que TradingView nos respalda.

---

## 4. Costos para arrancar (aproximados)

| Concepto | Costo mensual |
|---|---|
| Datos de acciones con licencia comercial | $100–300 (se debe verificar si mostrar precios al público exige tarifas de bolsa) |
| Fundamentales (FMP o EODHD) | $20–100 |
| Cripto (ccxt + Binance/Coinbase) | $0 |
| Claude (texto de los escenarios) | ~$20–100 a este volumen |
| Supabase Pro | Ya lo pagas |
| Vercel | $0–20 |
| **Total** | **~$150–500 al mes** |

---

## 5. Plan de los próximos 30 días

1. **Semana 1:** contratar la fuente de datos y montar el motor con los repositorios de la tabla: tablas `bars`, `levels`, `forecasts` (solo inserción) y `outcomes` en Supabase.
2. **Semana 2:** primeros escenarios automáticos (SPY, QQQ, BTC y ETH) y calificación nocturna.
3. **Semana 3:** reescribir deltalyn.com: portada nueva, **marcador público** y páginas por activo.
4. **Semana 4:** abrir la lista de espera y el newsletter "Week Ahead", y empezar la consulta legal.
5. **Durante los 90 días:** el botón de pago de Stripe sigue existiendo, pero **no se promociona**.
