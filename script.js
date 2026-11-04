const GH = "https://github.com/harshakavya-10"; // swap each link for the exact repo URL

// Charge-up orb
const orb = document.getElementById("orb"), dlg = document.getElementById("reveal");
let p = 0, holding = false, raf = 0, last = 0, done = false;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
function spark(burst) {
  const r = orb.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const n = burst ? 40 : 2;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("i"); s.className = "spark";
    const a = Math.random() * 6.28, d = burst ? 80 + Math.random() * 160 : 70 + Math.random() * 30;
    s.style.left = cx + Math.cos(a) * (burst ? 10 : d) + "px"; s.style.top = cy + Math.sin(a) * (burst ? 10 : d) + "px";
    document.body.appendChild(s);
    s.animate([{ transform: "translate(0,0)", opacity: 1 }, { transform: burst ? `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px)` : `translate(${cx - parseFloat(s.style.left)}px,${cy - parseFloat(s.style.top)}px)`, opacity: 0 }], { duration: burst ? 900 : 600 }).onfinish = () => s.remove();
  }
}
function playStats() {
  document.querySelectorAll("#reveal .bar i").forEach((b, i) => setTimeout(() => { b.style.width = b.dataset.w + "%" }, 250 + i * 200));
}
document.getElementById("more").onclick = e => { document.getElementById("secret").hidden = false; e.target.hidden = true; if (!reduce) spark(true); };
function tick(t) {
  const dt = (t - last) / 1000; last = t;
  p = Math.max(0, Math.min(1, p + (holding ? dt / 2 : -dt / 1.2)));
  orb.style.setProperty("--p", p);
  if (holding && !reduce) spark(false);
  if (p >= 1 && !done) { done = true; holding = false; if (!reduce) spark(true); dlg.showModal(); playStats(); }
  if (p > 0 || holding) raf = requestAnimationFrame(tick); else raf = 0;
}
function start() { if (done) return; holding = true; orb.classList.remove("idle"); if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
function stop() { holding = false; if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
orb.addEventListener("pointerdown", e => { e.preventDefault(); start() });
["pointerup", "pointerleave", "pointercancel"].forEach(ev => orb.addEventListener(ev, stop));
orb.addEventListener("keydown", e => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); start() } });
orb.addEventListener("keyup", e => { if (e.key === " " || e.key === "Enter") stop() });
orb.addEventListener("contextmenu", e => e.preventDefault());
document.getElementById("close").onclick = () => dlg.close();
dlg.addEventListener("close", () => { document.querySelectorAll("#reveal .bar i").forEach(b => b.style.width = "0"); document.getElementById("secret").hidden = true; document.getElementById("more").hidden = false; done = false; p = 0; orb.style.setProperty("--p", 0); orb.classList.add("idle") });
// hide floating hint while the orb is visible
new IntersectionObserver(([e]) => { document.getElementById("fab").style.display = e.isIntersecting ? "none" : "block" }).observe(orb);
