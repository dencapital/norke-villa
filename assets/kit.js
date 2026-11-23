/* ByROOM guest-guide kit: motion hero, service hub tabs, request basket -> WhatsApp.
   Shared by jungle-vista and byroom-south-bali. Keep both copies in sync (_kit/sync.sh). */
(function(){
"use strict";
const K = window.Kit = {};
const SK = k => k + ":" + location.pathname; // both guides share one origin (github.io) — keep their state apart
const EN = {
  kAdd:"Add", kAdded:"Added", kMyReq:"My request", kChat:"Chat with us",
  kSheetT:"Your request", kSheetSub:"Check the list, add details and send it to our team in one WhatsApp message.",
  kName:"Your name", kRoom:"Room / villa", kNote:"Anything else?", kNoteP:"Dates, times, number of guests…",
  kTotal:"Estimated total", kTotalNote:"Final price is confirmed by our team", kSend:"Send via WhatsApp",
  kEmpty:"Your list is empty — tap “Add” on any service.", kSent:"Opening WhatsApp…", kRemoved:"Removed", kAddedT:"Added to your request",
  kMsgHi:"Hi! I'm a guest at {v}.", kMsgReq:"I'd like to request:", kMsgTot:"Estimated total", kMsgEnd:"Please confirm availability. Thank you!",
  kOnReq:"price on request", kNameL:"Name", kRoomL:"Room", kNoteL:"Note", kScroll:"Scroll"
};
K.cfg = { L:k=>EN[k]||k, phone:"", villa:()=>"", chatHref:()=>"#", roomField:true };
K.init = o => Object.assign(K.cfg, o);
const L = k => { const v = K.cfg.L(k); if (v && v !== k) return v; const e = EN[k] || k; const lg = K.cfg.lang ? K.cfg.lang() : "en"; return (window.TX && TX[lg] && TX[lg][e]) || e; };
K.fmt = n => "IDR " + Math.round(n).toLocaleString("en-US");
K.esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const wa = (phone, msg) => `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
K.wa = wa;

const ICON = {
  plus:'<svg class="plus-i" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  check:'<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>',
  bag:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1 14H5L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
  wa:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.7-.85-2-.95-.26-.1-.46-.15-.65.15s-.75.94-.92 1.14c-.17.19-.34.22-.63.07a8.2 8.2 0 0 1-2.4-1.48 9 9 0 0 1-1.67-2.07c-.17-.3 0-.46.13-.6.13-.14.3-.34.44-.5.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.65-1.57-.9-2.15-.23-.56-.47-.48-.65-.49h-.55c-.2 0-.5.07-.77.37-.26.3-1 1-1 2.42s1.03 2.8 1.17 3c.15.2 2.02 3.08 4.9 4.32.68.3 1.22.47 1.63.6.69.22 1.32.19 1.81.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34z"/><path d="M12 2a10 10 0 0 0-8.6 15.06L2 22l5.06-1.33A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3 .79.8-2.92-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>'
};
K.icon = ICON;

/* ================= Motion hero (scroll-scrubbed frame sequence) ================= */
K.hero = function(root, opt){
  const count = opt.count, src = opt.src, focus = opt.focus == null ? .55 : opt.focus;
  const cv = root.querySelector(".mh-cv"), ctx = cv.getContext("2d");
  const c1 = root.querySelector(".mh-c1"), c2 = root.querySelector(".mh-c2");
  const fade = root.querySelector(".mh-fade"), bar = root.querySelector(".mh-bar"), cue = root.querySelector(".mh-cue");
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const imgs = new Array(count);
  let want = 0, drawn = null, raf = 0;

  function size(){
    const d = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(cv.clientWidth * d); cv.height = Math.round(cv.clientHeight * d);
    drawn = null; draw();
  }
  function nearest(i){
    for (let d = 0; d < count; d++){
      if (imgs[i - d]) return imgs[i - d];
      if (imgs[i + d]) return imgs[i + d];
    }
    return null;
  }
  function draw(){
    const im = nearest(want); if (!im || im === drawn || !cv.width) return;
    drawn = im;
    const W = cv.width, H = cv.height, iw = im.naturalWidth, ih = im.naturalHeight;
    const s = Math.max(W / iw, H / ih) * 1.02, dw = iw * s, dh = ih * s;
    ctx.drawImage(im, (W - dw) * focus, (H - dh) / 2, dw, dh);
    root.classList.add("ready");
  }
  // progressive load: coarse frames first, then fill the gaps
  const order = [], seen = new Set();
  (reduce ? [count] : [16, 8, 4, 2, 1]).forEach(st => { for (let i = 0; i < count; i += st) if (!seen.has(i)){ seen.add(i); order.push(i); } });
  let li = 0;
  function next(){
    if (li >= order.length) return;
    const i = order[li++], im = new Image();
    im.decoding = "async";
    im.onload = () => { imgs[i] = im; if (drawn === null || Math.abs(i - want) < Math.abs(imgs.indexOf(drawn) - want)) { drawn = null; draw(); } next(); };
    im.onerror = next;
    im.src = src(i);
  }
  for (let k = 0; k < 4; k++) next();

  function progress(){
    const r = root.getBoundingClientRect(), tot = r.height - window.innerHeight;
    return tot > 0 ? Math.min(1, Math.max(0, -r.top / tot)) : 0;
  }
  function tick(){
    raf = 0;
    const p = reduce ? 0 : progress();
    want = Math.round(p * (count - 1)); draw();
    if (c1){ const a = 1 - Math.min(1, p / .2); c1.style.opacity = a.toFixed(3); c1.style.transform = `translateY(${(-p * 140).toFixed(1)}px)`; }
    if (c2){
      const b = p < .28 ? 0 : p < .42 ? (p - .28) / .14 : p < .76 ? 1 : Math.max(0, 1 - (p - .76) / .12);
      c2.style.opacity = b.toFixed(3); c2.style.transform = `translateY(calc(-50% + ${((1 - b) * 26).toFixed(1)}px))`;
    }
    if (fade) fade.style.opacity = Math.max(0, (p - .84) / .16).toFixed(3);
    if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
    if (cue) cue.style.opacity = (1 - Math.min(1, p / .06)).toFixed(3);
    K._heroP = root.getBoundingClientRect().bottom > window.innerHeight * .5 ? p : 1;
    K._dockState && K._dockState();
  }
  K._heroTick = tick;
  addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(tick); }, {passive:true});
  addEventListener("resize", () => { size(); tick(); });
  size(); tick();
};

/* ================= Hub tabs ================= */
K.tabs = function(root){
  if (root._kTabs){ root._kTabs(); return; } // re-render (e.g. language switch): keep listeners, re-apply selection
  const bar = root.querySelector(".hub-tabs");
  let tabs = [...root.querySelectorAll(".hub-tab")];
  const panels = [...root.querySelectorAll(".hub-panel")];
  let current = null;
  root._kTabs = () => { tabs = [...root.querySelectorAll(".hub-tab")]; if (current) sel(current, false); };
  function sel(id, jump){
    current = id;
    if (!tabs.some(t => t.dataset.tab === id)) return;
    tabs.forEach(t => t.setAttribute("aria-selected", String(t.dataset.tab === id)));
    panels.forEach(p => p.classList.toggle("on", p.dataset.panel === id));
    const t = tabs.find(t => t.dataset.tab === id);
    if (t) bar.scrollTo({left: Math.max(0, t.offsetLeft - 18), behavior: "smooth"});
    if (jump){
      const top = root.getBoundingClientRect().top + window.scrollY - 4;
      if (root.getBoundingClientRect().top < 0 || jump === "force") window.scrollTo({top, behavior: "smooth"});
    }
    try { sessionStorage.setItem(SK("kTab"), id); } catch(e){}
  }
  bar.addEventListener("click", e => { const t = e.target.closest(".hub-tab"); if (t) sel(t.dataset.tab, true); });
  K.openTab = id => sel(id, "force");
  let first = tabs[0] && tabs[0].dataset.tab;
  try { const s = sessionStorage.getItem(SK("kTab")); if (s && tabs.some(t => t.dataset.tab === s)) first = s; } catch(e){}
  sel(first, false);
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-open-tab]"); if (!a) return;
    e.preventDefault(); K.openTab(a.dataset.openTab);
  });
};

/* ================= Pick controls & steppers ================= */
document.addEventListener("click", e => {
  const b = e.target.closest(".k-seg button, .durs button, .tchips button");
  if (b){
    const g = b.parentElement;
    g.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b));
    document.dispatchEvent(new CustomEvent("kpick", {detail:{group:g.dataset.group, value:b.dataset.v, el:b}}));
    return;
  }
  const s = e.target.closest(".k-step button");
  if (s){
    const w = s.parentElement, min = +w.dataset.min || 0, max = +w.dataset.max || 99;
    let v = +w.dataset.val || min;
    v = Math.min(max, Math.max(min, v + (s.dataset.d === "+" ? 1 : -1)));
    K.setStep(w, v);
    document.dispatchEvent(new CustomEvent("kstep", {detail:{name:w.dataset.step, value:v, el:w}}));
  }
});
K.stepHTML = (name, val, min, max) =>
  `<div class="k-step" data-step="${name}" data-val="${val}" data-min="${min}" data-max="${max}"><button type="button" data-d="-" aria-label="less">−</button><output></output><button type="button" data-d="+" aria-label="more">+</button></div>`;
K.setStep = (w, v) => {
  w.dataset.val = v;
  const out = w.querySelector("output"), u = (w.dataset.units || "").split("|");
  out.textContent = u.length > 1 ? `${v} ${v === 1 ? u[0] : u[1]}` : v;
  w.querySelector('[data-d="-"]').disabled = v <= +w.dataset.min;
  w.querySelector('[data-d="+"]').disabled = v >= +w.dataset.max;
};
K.stepVal = name => { const w = document.querySelector(`.k-step[data-step="${name}"]`); return w ? +w.dataset.val : 1; };
K.pick = group => { const b = document.querySelector(`[data-group="${group}"] button.on`); return b ? b.dataset.v : null; };

/* ================= Basket ================= */
const reg = {};
let cart = [];
try { cart = JSON.parse(sessionStorage.getItem(SK("kCart")) || "[]"); } catch(e){ cart = []; }
const save = () => { try { sessionStorage.setItem(SK("kCart"), JSON.stringify(cart)); } catch(e){} };
K.item = (id, fn) => { reg[id] = fn; };
K.has = id => cart.some(c => c.id === id);
K.addBtn = (id, cls, label) => `<button type="button" class="add ${cls || ""}" data-add="${K.esc(id)}"><span class="plus">${ICON.plus} ${K.esc(label || L("kAdd"))}</span><span class="ok">${ICON.check} ${K.esc(L("kAdded"))}</span></button>`;
K.refresh = id => { // re-read an item after its options changed
  const i = cart.findIndex(c => c.id === id);
  if (i > -1 && reg[id]){ cart[i] = Object.assign({id}, reg[id]()); save(); sync(false); }
};
K.refreshAll = () => { cart.forEach(c => { if (reg[c.id]) Object.assign(c, reg[c.id](), {id:c.id}); }); save(); sync(false); };
function toggle(id){
  const i = cart.findIndex(c => c.id === id);
  if (i > -1){ cart.splice(i, 1); toast(L("kRemoved")); }
  else if (reg[id]){ cart.push(Object.assign({id}, reg[id]())); toast(L("kAddedT")); }
  save(); sync(true);
}
document.addEventListener("click", e => { const b = e.target.closest("[data-add]"); if (b){ e.preventDefault(); toggle(b.dataset.add); } });
K.get = id => reg[id] ? Object.assign({id}, reg[id]()) : null;
K.priceText = id => { const it = K.get(id); return !it ? "" : typeof it.amt === "number" ? K.fmt(it.amt) : (it.lbl || L("kOnReq")); };
K.updatePrices = () => { document.querySelectorAll("[data-price-of]").forEach(el => { el.textContent = K.priceText(el.dataset.priceOf); }); K.refreshAll(); };

let dock, sheet, toastEl;
function sync(bump){
  document.querySelectorAll("[data-add]").forEach(b => {
    const on = K.has(b.dataset.add); b.classList.toggle("is-added", on);
    const card = b.closest(".prod"); if (card) card.classList.toggle("is-added", on);
  });
  if (!dock) return;
  dock.classList.toggle("has", cart.length > 0);
  dock.querySelector(".cnt").textContent = cart.length;
  if (bump){ const bk = dock.querySelector(".bk"); bk.classList.remove("bump"); void bk.offsetWidth; bk.classList.add("bump"); }
  K._dockState();
  if (sheet && sheet.classList.contains("open")) fillSheet();
}
K.sync = () => sync(false);

function toast(m){
  if (!toastEl){ toastEl = document.createElement("div"); toastEl.className = "ktoast"; document.body.appendChild(toastEl); }
  toastEl.textContent = m; toastEl.classList.add("show");
  clearTimeout(toastEl._t); toastEl._t = setTimeout(() => toastEl.classList.remove("show"), 1700);
}
K.toast = toast;

K.mountDock = function(){
  dock = document.createElement("div");
  dock.className = "kdock hide";
  dock.innerHTML = `<button type="button" class="bk">${ICON.bag}<span class="bk-l"></span><span class="cnt">0</span></button><a class="wa" target="_blank" rel="noopener">${ICON.wa}<span class="wa-l"></span></a>`;
  document.body.appendChild(dock);
  dock.querySelector(".bk").addEventListener("click", openSheet);
  sheet = document.createElement("div");
  sheet.className = "ksheet"; sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-modal", "true");
  sheet.innerHTML = `<div class="ksheet-bg"></div><div class="ksheet-p"><div class="ksheet-grab"></div><button type="button" class="ksheet-close" aria-label="Close">✕</button><div class="ksheet-c"></div></div>`;
  document.body.appendChild(sheet);
  sheet.querySelector(".ksheet-bg").addEventListener("click", closeSheet);
  sheet.querySelector(".ksheet-close").addEventListener("click", closeSheet);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });
  K._dockState = () => {
    const p = K._heroP == null ? 1 : K._heroP;
    dock.classList.toggle("hide", p < .12 && cart.length === 0);
  };
  K.relabel(); sync(false);
};
K.relabel = () => {
  if (!dock) return;
  dock.querySelector(".bk-l").textContent = L("kMyReq");
  dock.querySelector(".wa-l").textContent = L("kChat");
  dock.querySelector(".wa").href = K.cfg.chatHref();
  if (sheet.classList.contains("open")) fillSheet();
};

const memo = {name:"", room:"", note:""};
function fillSheet(){
  const c = sheet.querySelector(".ksheet-c");
  const known = cart.filter(i => typeof i.amt === "number");
  const total = known.reduce((s, i) => s + i.amt, 0);
  const list = cart.length ? cart.map(i => `
    <div class="ksheet-li"><div class="b"><div class="t">${K.esc(i.t)}</div>${i.m ? `<div class="m">${K.esc(i.m)}</div>` : ""}</div>
      <div class="p">${typeof i.amt === "number" ? K.fmt(i.amt) : K.esc(i.lbl || L("kOnReq"))}</div>
      <button type="button" class="x" data-rm="${K.esc(i.id)}" aria-label="remove">✕</button></div>`).join("")
    : `<p class="sub" style="margin:18px 0">${K.esc(L("kEmpty"))}</p>`;
  c.innerHTML = `<h3>${K.esc(L("kSheetT"))}</h3><p class="sub">${K.esc(L("kSheetSub"))}</p>${list}
    ${known.length ? `<div class="ksheet-tot"><span>${K.esc(L("kTotal"))}<small>${K.esc(L("kTotalNote"))}</small></span><b>${K.fmt(total)}</b></div>` : ""}
    <div class="k-fields">
      <label class="${K.cfg.roomField ? "" : "full"}">${K.esc(L("kName"))}<input class="k-in" id="kName" autocomplete="name" value="${K.esc(memo.name)}"></label>
      ${K.cfg.roomField ? `<label>${K.esc(L("kRoom"))}<input class="k-in" id="kRoom" value="${K.esc(memo.room)}"></label>` : ""}
      <label class="full">${K.esc(L("kNote"))}<textarea class="k-in" id="kNote" rows="2" placeholder="${K.esc(L("kNoteP"))}">${K.esc(memo.note)}</textarea></label>
    </div>
    <button type="button" class="ksheet-send" ${cart.length ? "" : "disabled style=\"opacity:.45\""}>${ICON.wa}<span>${K.esc(L("kSend"))}</span></button>`;
  c.querySelectorAll("[data-rm]").forEach(b => b.addEventListener("click", () => toggle(b.dataset.rm)));
  ["kName","kRoom","kNote"].forEach(id => { const el = c.querySelector("#" + id); if (el) el.addEventListener("input", () => { memo[id.slice(1).toLowerCase()] = el.value; }); });
  c.querySelector(".ksheet-send").addEventListener("click", send);
}
function openSheet(){
  fillSheet(); sheet.classList.add("open");
  requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add("show")));
  document.documentElement.style.overflow = "hidden";
}
function closeSheet(){
  if (!sheet || !sheet.classList.contains("open")) return;
  sheet.classList.remove("show"); document.documentElement.style.overflow = "";
  setTimeout(() => sheet.classList.remove("open"), 380);
}
K.openSheet = openSheet;
function send(){
  if (!cart.length) return;
  const v = K.cfg.villa();
  const lines = [L("kMsgHi").replace(/\{v\}/g, v), "", L("kMsgReq")];
  cart.forEach((i, n) => lines.push(`${n + 1}. ${i.t}${i.m ? " — " + i.m : ""} · ${typeof i.amt === "number" ? K.fmt(i.amt) : (i.lbl || L("kOnReq"))}`));
  const known = cart.filter(i => typeof i.amt === "number");
  if (known.length) lines.push("", `${L("kMsgTot")}: ${K.fmt(known.reduce((s, i) => s + i.amt, 0))}`);
  const extra = [];
  if (memo.name.trim()) extra.push(`${L("kNameL")}: ${memo.name.trim()}`);
  if (memo.room.trim()) extra.push(`${L("kRoomL")}: ${memo.room.trim()}`);
  if (memo.note.trim()) extra.push(`${L("kNoteL")}: ${memo.note.trim()}`);
  if (extra.length) lines.push("", ...extra);
  lines.push("", L("kMsgEnd"));
  window.open(wa(K.cfg.phone, lines.join("\n")), "_blank");
  toast(L("kSent"));
}
})();
