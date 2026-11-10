#!/usr/bin/env python3
"""Backtest v1 (estrategia actual) vs v2 (propuesta) del motor Donchian, solo velas diarias, con costes.

Uso:  python3 backtest_v1_vs_v2.py <dir_csv> [desde=2024-07-01] [deslizamiento=0.001]
Cada CSV se llama <SIMBOLO>_daily.csv (o <SIMBOLO>_10y_daily.csv) con columnas
date,open,high,low,close,volume.  Solo lee datos; no se conecta a ningún bróker.

Limitaciones: precios de ejecución simplificados (stop al precio del stop salvo hueco de apertura → open),
universo elegido conociendo el pasado, sin dividendos.
"""
import json, datetime as dt, math, os, sys
def load(data_dir):
    out={}
    for f in os.listdir(data_dir):
        if not f.endswith('.csv'): continue
        sym=f.split('_')[0]; rows=[]
        for line in open(os.path.join(data_dir,f)).read().strip().split('\n')[1:]:
            d,o,h,l,c,*_=line.split(',')
            if float(o)>0 and float(h)>0: rows.append(dict(t=d[:10],o=float(o),h=float(h),l=float(l),c=float(c)))
        out[sym]=sorted(rows,key=lambda r:r['t'])
    return out
LEV={'TQQQ','SOXL'}
V1=dict(name='v1 actual',stop_atr=1.5,trail_atr=1.5,risk=0.04,sma200=False,lev_cap=None)
V2=dict(name='v2 nueva',stop_atr=2.5,trail_atr=1.5,risk=0.01,sma200=True,lev_cap=0.30)
def atr(rows,n=14):
    a=[math.nan]*len(rows); s=0
    for i,r in enumerate(rows):
        tr=r['h']-r['l'] if i==0 else max(r['h']-r['l'],abs(r['h']-rows[i-1]['c']),abs(r['l']-rows[i-1]['c']))
        if i<n:
            s+=tr
            if i==n-1:a[i]=s/n
        else:a[i]=(a[i-1]*(n-1)+tr)/n
    return a
def sma(v,n):
    o=[math.nan]*len(v); s=0
    for i,x in enumerate(v):
        s+=x
        if i>=n: s-=v[i-n]
        if i>=n-1: o[i]=s/n
    return o
def don(rows,i,n=20):
    if i<n: return None
    w=rows[i-n:i]; return max(r['h'] for r in w),min(r['l'] for r in w)
def chpos(rows,i):
    d=don(rows,i)
    if not d or d[0]==d[1]: return None
    return (rows[i]['c']-d[1])/(d[0]-d[1])

def sim(data,U,P,start,slip=0.001,sell_fee=0.0000278):
    prep={}
    for s in U:
        if s not in data: continue
        rows=data[s]; prep[s]=dict(rows=rows,atr=atr(rows),sma=sma([r['c'] for r in rows],200),idx={r['t']:i for i,r in enumerate(rows)})
    days=sorted({r['t'] for p in prep.values() for r in p['rows'] if r['t']>=start})
    cash=100.0; peak=100; mdd=0; pos={}; trades=[]; consec=0; pause=None; halted=False; week=None; wk=100; costs=0
    def px(s,t):
        P_=prep[s]; i=P_['idx'].get(t)
        if i is None: i=max(j for tt,j in P_['idx'].items() if tt<=t)
        return P_['rows'][i]['c']
    def eq(t): return cash+sum(p['q']*px(s,t) for s,p in pos.items())
    def sell(q,f):
        nonlocal cash,costs
        fill=f*(1-slip); fee=q*fill*sell_fee; cash+=q*fill-fee; costs+=q*f*slip+fee; return fill
    for t in days:
        d=dt.date.fromisoformat(t); w=d-dt.timedelta(days=d.weekday())
        if w!=week: week=w; wk=eq(t)
        for s,p in list(pos.items()):
            Q=prep[s]; i=Q['idx'].get(t)
            if i is None: continue
            b=Q['rows'][i]
            if b['l']<=p['stop']:
                raw=b['o'] if b['o']<p['stop'] else p['stop']; fill=sell(p['q'],raw)
                pnl=p['part']+p['q']*fill-p['cost_rem']; R=pnl/p['rd']
                trades.append(dict(sym=s,entry_t=p['t'],exit_t=t,entry=p['e'],exit=fill,R=R,pnl=pnl,why=p['why'],days=i-p['i']+1,gap=b['o']<p['stop']))
                consec=consec+1 if pnl<=0 else 0
                if consec>=3: pause=d+dt.timedelta(days=3); consec=0
                del pos[s]; continue
            two=p['e']+2*p['rps']
            if not p['tp'] and b['h']>=two:
                h=p['q']/2; fill=sell(h,max(b['o'],two)); p['part']+=h*fill-p['cost_rem']/2; p['cost_rem']/=2; p['q']=h; p['tp']=True
            if b['c']>=p['e']+p['rps']:
                ns=b['c']-P['trail_atr']*Q['atr'][i]
                if ns>p['stop']: p['stop']=ns; p['why']='trailing'
        e_now=eq(t)
        if e_now<78: halted=True
        wdd=(wk-e_now)/wk if wk>0 else 0
        can=not halted and not (pause and d<=pause) and wdd<=0.08
        bought=0
        for s in U:
            if not can or len(pos)>=2 or bought>=1: break
            if s in pos or s not in prep: continue
            Q=prep[s]; i=Q['idx'].get(t)
            if i is None or i<21: continue
            pr=Q['rows'][i-1]; dn=don(Q['rows'],i-1); a0=Q['atr'][i-1]
            if not dn or math.isnan(a0) or not pr['c']>dn[0]: continue   # (c) ruptura confirmada al CIERRE del día anterior
            if P['sma200'] and (math.isnan(Q['sma'][i-1]) or not pr['c']>Q['sma'][i-1]): continue  # (b)
            if 'TQQQ' in prep and 'SOXL' in prep:
                a=prep['TQQQ']['idx'].get(pr['t']); c=prep['SOXL']['idx'].get(pr['t'])
                if a is not None and c is not None:
                    x=chpos(prep['TQQQ']['rows'],a); y=chpos(prep['SOXL']['rows'],c)
                    if x is not None and y is not None and x<=.25 and y<=.25: continue
            e=Q['rows'][i]['o']*(1+slip); stop=e-P['stop_atr']*a0
            if stop<=0: continue
            rps=e-stop
            q=min(e_now*P['risk']/rps, e_now*0.45/e, max(0,cash-e_now*0.2)/e)
            if P['lev_cap'] and s in LEV:   # (e) máx 30% en apalancados
                lev_now=sum(p['q']*px(k,t) for k,p in pos.items() if k in LEV)
                q=min(q,max(0,P['lev_cap']*e_now-lev_now)/e)
            if q*e<e_now*0.001: continue
            cash-=q*e; costs+=q*Q['rows'][i]['o']*slip
            pos[s]=dict(q=q,e=e,stop=stop,rps=rps,rd=q*rps,part=0,cost_rem=q*e,tp=False,t=t,i=i,why='stop inicial'); bought+=1
        e2=eq(t); peak=max(peak,e2); mdd=max(mdd,(peak-e2)/peak)
    last=days[-1]
    for s,p in list(pos.items()):
        fill=sell(p['q'],px(s,last)); pnl=p['part']+p['q']*fill-p['cost_rem']
        trades.append(dict(sym=s,entry_t=p['t'],exit_t=last+' (cierre fin de test)',entry=p['e'],exit=fill,R=pnl/p['rd'],pnl=pnl,why='fin de test',days=None,gap=False))
    fin=cash; yrs=(dt.date.fromisoformat(last)-dt.date.fromisoformat(days[0])).days/365.25
    wins=[x for x in trades if x['pnl']>0]; loss=[x for x in trades if x['pnl']<=0]
    quick=sum(1 for x in trades if x['why'] in('stop inicial','trailing') and x['days'] is not None and x['days']<=3)
    return dict(estrategia=P['name'],desde=days[0],hasta=last,final=round(fin,2),total_pct=round(fin-100,1),cagr_pct=round(((fin/100)**(1/yrs)-1)*100,1),
        maxdd_pct=round(mdd*100,1),ganadoras_pct=round(100*len(wins)/len(trades),1) if trades else None,
        pf=round(sum(x['pnl'] for x in wins)/-sum(x['pnl'] for x in loss),2) if loss and sum(x['pnl'] for x in loss) else None,
        operaciones=len(trades),stop_1a3dias=quick,costes_usd=round(costs,2)),trades

def buyhold(data,syms,start,slip=0.001,sell_fee=0.0000278,name=''):
    """Pesos iguales sin rebalanceo; cada símbolo se compra en su primera apertura >= start (CRCL/SPCX al cotizar)."""
    alloc=100/len(syms); hold={}; cash=0; costs=0
    days=sorted({r['t'] for s in syms for r in data[s] if r['t']>=start})
    idx={s:{r['t']:r for r in data[s]} for s in syms}
    pending=set(syms); cash=100; peak=100; mdd=0
    lastpx={}
    for t in days:
        for s in list(pending):
            r=idx[s].get(t)
            if r:
                p0=r['c'] if r is data[s][0] else r['o']  # día de salida a bolsa (CRCL/SPCX): el 'open' es el precio de OPV, no negociable; uso el cierre
                q=alloc/(p0*(1+slip)); hold[s]=q; cash-=alloc; costs+=alloc*slip/(1+slip); pending.discard(s)
        for s in syms:
            r=idx[s].get(t)
            if r: lastpx[s]=r['c']
        e=cash+sum(q*lastpx[s] for s,q in hold.items()); peak=max(peak,e); mdd=max(mdd,(peak-e)/peak)
    fin=cash+sum(q*lastpx[s]*(1-slip)*(1-sell_fee) for s,q in hold.items())
    yrs=(dt.date.fromisoformat(days[-1])-dt.date.fromisoformat(days[0])).days/365.25
    return dict(estrategia=name,desde=days[0],hasta=days[-1],final=round(fin,2),total_pct=round(fin-100,1),cagr_pct=round(((fin/100)**(1/yrs)-1)*100,1),maxdd_pct=round(mdd*100,1),
        ganadoras_pct=None,pf=None,operaciones=len(syms),stop_1a3dias=None,costes_usd=round(costs,2))

UNIVERSE=['CRCL','COIN','MSTR','PLTR','NVDA','TQQQ','SOXL','SPCX']
if __name__=='__main__':
    D=load(sys.argv[1]); start=sys.argv[2] if len(sys.argv)>2 else '2024-07-01'; slip=float(sys.argv[3]) if len(sys.argv)>3 else 0.001
    rows=[sim(D,UNIVERSE,V1,start,slip=slip)[0], sim(D,UNIVERSE,V2,start,slip=slip)[0]]
    if 'QQQ' in D: rows.append(buyhold(D,['QQQ'],start,slip=slip,name='Comprar y aguantar QQQ'))
    rows.append(buyhold(D,[s for s in UNIVERSE if s in D],start,slip=slip,name='Comprar y aguantar universo (pesos iguales)'))
    cols=['estrategia','cagr_pct','maxdd_pct','ganadoras_pct','pf','operaciones','stop_1a3dias','total_pct']
    print(' | '.join(cols))
    for r in rows: print(' | '.join(str(r[c]) for c in cols))
