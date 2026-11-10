# mi_trader_bot v2 — propuesta de mejora del motor Donchian (borrador)

Copia de trabajo de la estrategia. **No modifica `mi_trader_bot/`, no está instalada en ningún cron
y no coloca órdenes.** Solo contiene el prompt propuesto y el backtest que lo compara con la versión actual.

## Cambios respecto a la v1

| | v1 (actual) | v2 (propuesta) |
|---|---|---|
| Velas | diarias | diarias (explícito: nada intradía) |
| Filtro de tendencia | — | cierre > SMA200 |
| Confirmación | cierre > Donchian(20) | igual, explícito: vela diaria completada, sin toques intradía |
| Stop inicial | 1,5 × ATR(14) | 2,5 × ATR(14) |
| Riesgo por operación | 4 % | 1 % |
| Apalancados (TQQQ+SOXL) | sin tope | máx. 30 % del capital |
| Trailing, parcial 2R, breakers, 2 posiciones, 45 %/20 % | sin cambios | sin cambios |

La regla (c) no cambia el backtest: la v1 ya decidía con el cierre diario. En vivo sí importa, porque el escaneo
corre a las 9:45 ET y podría leer la cotización intradía.

## Resultado (1-jul-2024 → 9-nov-2026, $100 iniciales)

Costes: comisión $0 (Robinhood), deslizamiento 0,10 % por lado, tasa SEC en ventas. Precios diarios de Robinhood.

| Estrategia | Rent. anual | Caída máx. | Ganadoras | Factor de beneficio | Operaciones | Stops en 1–3 días |
|---|---|---|---|---|---|---|
| v1 actual | +4,5 % | 34,7 % | 39,4 % | 1,07 | 71 | 21 |
| v2 propuesta | −1,6 % | 8,2 % | 39,6 % | 0,87 | 48 | 5 |
| Comprar y aguantar QQQ | +14,1 % | 22,9 % | — | — | 1 | — |
| Comprar y aguantar universo (pesos iguales) | +24,7 % | 35,0 % | — | — | 8 | — |

Con deslizamiento de 0,25 %: v1 +1,8 %/año, v2 −1,7 %/año.

**Lectura:** la v2 cumple su objetivo de riesgo (caída máxima de 34,7 % a 8,2 %; stops rápidos de 21 a 5),
pero deja de ganar. Probando cada cambio por separado sobre la v1: el stop de 2,5 ATR es neutro (+4,3 %/año), el
riesgo del 1 % reduce la caída pero no da ventaja, y el filtro SMA200 **empeora** el resultado en este periodo
(−10,6 %/año). Ninguna versión supera a comprar y aguantar. Muestra corta (≈2,3 años) y universo elegido a
posteriori: no tomar estas cifras como expectativa.

## Reproducir

```bash
python3 backtest_v1_vs_v2.py <dir_con_csv> 2024-07-01 0.001
```
