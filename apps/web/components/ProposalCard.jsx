"use client";

import { useEffect, useRef, useState } from "react";

export default function ProposalCard() {
  const [state, setState] = useState("proposed"); // proposed | applied | dismissed
  const ref = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (state !== "proposed") return;
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SUMMARY" || tag === "BUTTON" || tag === "A") return;
      const r = ref.current?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > window.innerHeight) return;
      if (e.key === "Enter") { e.preventDefault(); setState("applied"); }
      if (e.key === "Escape") setState("dismissed");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state]);

  return (
    <aside ref={ref} className="glass proposal" aria-label="Example: Deltalyn proposes a chart change and waits for your approval">
      <div className="proposal-head">
        <span>Deltalyn proposes · NQ · 5m</span>
        <span className="live">Data 2s old</span>
      </div>
      {state === "proposed" && (
        <>
          <p className="proposal-title">
            Add a horizontal line at the prior-day high, <span className="num">24,550.25</span>
          </p>
          <div className="chips">
            <span className="chip">source: data_get_ohlcv · D</span>
            <span className="chip">Observed</span>
          </div>
          <div className="proposal-actions">
            <button type="button" className="btn btn-primary" onClick={() => setState("applied")}>
              Apply <kbd>Enter</kbd>
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setState("dismissed")}>
              Dismiss <kbd>Esc</kbd>
            </button>
          </div>
        </>
      )}
      {state !== "proposed" && (
        <div className="proposal-actions" role="status">
          <span className="proposal-status">
            {state === "applied" ? "Line added at 24,550.25. You approved it." : "Dismissed. Nothing changed on your chart."}
          </span>
          <button type="button" className="btn btn-ghost" onClick={() => setState("proposed")}>Undo</button>
        </div>
      )}
    </aside>
  );
}
