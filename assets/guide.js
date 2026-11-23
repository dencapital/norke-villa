/* ByROOM Guest App engine: live video hero, full-screen service "rooms" with hash routing,
   building blocks, reveal. Works with kit.js (basket, steppers, picks). Synced by _kit/sync.sh */
(function(){
"use strict";
const G = window.Guide = {};
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
G.esc = esc;

/* ---------------- icons (one line set) ---------------- */
const IC = {
  plane:'<path d="M2 16l20-6-3-2-6 2-6-5-2 1 4 5-5 2-2-1-1 1z"/>', car:'<path d="M5 17h14v-5l-2-5H7l-2 5z"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/>',
  scooter:'<circle cx="5.5" cy="17" r="3"/><circle cx="18.5" cy="17" r="3"/><path d="M8.5 17h7l-3-7h-3M15 6h3l1.5 5"/>',
  bag:'<rect x="4" y="7" width="16" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M9 12v4M15 12v4"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-4-6.3"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>', helmet:'<path d="M4 15a8 8 0 0 1 16 0v2H4z"/><path d="M12 7v4h8"/>',
  tool:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>', clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>', pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  snow:'<path d="M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1 19.1 4.9"/>', route:'<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M6 17V9a4 4 0 0 1 4-4h6M18 7v8a4 4 0 0 1-4 4H8"/>',
  home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>', heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>',
  leaf:'<path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14z"/><path d="M5 19 13 11"/>', lotus:'<path d="M12 20c-4 0-7-3-7-7 3 0 5 1 7 3 2-2 4-3 7-3 0 4-3 7-7 7z"/><path d="M12 16c-2-2-2-6 0-10 2 4 2 8 0 10z"/>',
  drop:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>', wave:'<path d="M2 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
  hand:'<path d="M7 12V6a1.5 1.5 0 0 1 3 0v5M10 11V4.5a1.5 1.5 0 0 1 3 0V11M13 11V5.5a1.5 1.5 0 0 1 3 0V12M16 12V8.5a1.5 1.5 0 0 1 3 0V14c0 4-3 7-7 7-3 0-5-1.5-6.5-4L4 14a1.5 1.5 0 0 1 2.6-1.5L8 14"/>',
  hands:'<path d="M4 14c2-1 4-1 5 1l2 3M20 14c-2-1-4-1-5 1l-2 3M7 10V6M10 10V4M14 10V4M17 10V6"/>', stone:'<ellipse cx="12" cy="17" rx="8" ry="3"/><ellipse cx="12" cy="11.5" rx="6" ry="2.5"/><ellipse cx="12" cy="7" rx="4" ry="2"/>',
  face:'<circle cx="12" cy="12" r="8.5"/><path d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 0 0 5 0"/>', bowl:'<path d="M4 11h16a8 8 0 0 1-16 0z"/><path d="M9 7c0-1 1-2 1-3M13 7c0-1 1-2 1-3"/>',
  foot:'<path d="M8 21c-2 0-3-2-3-5s1-6 1-8 1-4 3-4 3 2 3 4-1 4-1 6 1 3 1 4-2 3-4 3z"/><circle cx="15" cy="5" r="1"/><circle cx="17.5" cy="7.5" r="1"/><circle cx="18.5" cy="10.5" r="1"/>',
  nail:'<path d="M9 21v-9a3 3 0 0 1 6 0v9"/><path d="M10.5 11V6a1.5 1.5 0 0 1 3 0v5"/>', candle:'<rect x="8" y="10" width="8" height="11" rx="1"/><path d="M12 10V7M12 3c1.5 1.5 1.5 3 0 4-1.5-1-1.5-2.5 0-4z"/>',
  sound:'<path d="M3 12h2M7 8v8M11 5v14M15 8v8M19 10v4"/>', cards:'<rect x="3.5" y="5" width="10" height="15" rx="1.5" transform="rotate(-8 8.5 12.5)"/><rect x="10.5" y="4" width="10" height="15" rx="1.5" transform="rotate(8 15.5 11.5)"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  wifi:'<path d="M3 9a15 15 0 0 1 18 0M6 12.5a10 10 0 0 1 12 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19.5" r=".8"/>', key:'<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M15 8l2 2"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  cross:'<path d="M12 5v14M5 12h14"/>', pill:'<rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-45 12 12)"/><path d="m9.5 9.5 5 5"/>', cart:'<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 7H6"/>',
  sparkle:'<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>', gift:'<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M3 12h18M12 8v13M12 8c-2-4-6-4-6-1 0 1 1 1 6 1 5 0 6 0 6-1 0-3-4-3-6 1"/>',
  shirt:'<path d="M8 3 3 6l2 4 2-1v12h10V9l2 1 2-4-5-3a3 3 0 0 1-8 0z"/>', boat:'<path d="M3 17l2 4h14l2-4z"/><path d="M12 3v14M12 4l7 10h-7M12 6 6 14h6"/>',
  island:'<path d="M2 20c3-2 6-2 9 0s6 2 11 0"/><path d="M12 18V9M12 9c-2-3-6-3-8-1 3 0 5 1 8 1zM12 9c2-3 6-3 8-1-3 0-5 1-8 1z"/>', mountain:'<path d="M3 20l6-10 4 6 3-4 5 8z"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>', book:'<path d="M4 4h10a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M18 20V8"/>',
  chat:'<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/>', card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>', paw:'<circle cx="7" cy="9" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="17" cy="9" r="2"/><path d="M8 17c0-3 2-5 4-5s4 2 4 5c0 2-2 3-4 3s-4-1-4-3z"/>',
  star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>', check:'<path d="M20 6 9 17l-5-5"/>', chev:'<path d="M9 18l6-6-6-6"/>', arrow:'<path d="M7 17 17 7M8 7h9v9"/>',
  back:'<path d="M15 18l-6-6 6-6"/>', down:'<path d="M6 9l6 6 6-6"/>', glass:'<path d="M8 3h8l-1 9a3 3 0 0 1-6 0z"/><path d="M12 15v6M8 21h8"/>', utensils:'<path d="M7 3v8a2 2 0 0 0 4 0V3M9 11v10M17 3c-2 0-3 3-3 6s1 4 3 4v8"/>'
};
G.IC = IC;
G.ic = (k, cls) => `<svg ${cls ? `class="${cls}"` : ""} viewBox="0 0 24 24" aria-hidden="true">${IC[k] || IC.sparkle}</svg>`;
const ic = G.ic;

/* ---------------- building blocks ---------------- */
const h = G.h = {};
h.perks = list => `<div class="perks">${(list || []).map(([k, t]) => `<div class="perk">${ic(k)}<span>${esc(t)}</span></div>`).join("")}</div>`;
h.sec = (id, title, sub, inner) => `<section class="vsec" id="v-${id}" data-nav="${id}"><h3>${esc(title)}</h3>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}${inner}</section>`;
h.seg = (group, list, sel) => `<div class="k-seg" data-group="${group}">${list.map(([v, l]) => `<button type="button" data-v="${esc(v)}" class="${String(v) === String(sel) ? "on" : ""}">${esc(l)}</button>`).join("")}</div>`;
h.chips = list => `<div class="chips">${list.map(x => `<span>${esc(x)}</span>`).join("")}</div>`;
h.step = (name, val, min, max, units, label, sub) => `<div class="k-steprow"><div class="lbl"><b>${esc(label)}</b><span>${esc(sub || "")}</span></div>${Kit.stepHTML(name, val, min, max).replace('class="k-step"', `class="k-step" data-units="${esc(units || "")}"`)}</div>`;
h.total = (id, label) => `<div class="tot-line"><span data-sum="${id}">${esc(label || "")}</span><b data-price-of="${id}"></b></div>`;
h.add = (id, cls, label) => Kit.addBtn(id, cls, label);
h.note = t => `<p class="note">${esc(t)}</p>`;
h.warn = t => `<div class="warn"><span aria-hidden="true">⛑️</span><span>${esc(t)}</span></div>`;
h.cars = list => `<div class="cars">${list.map(([img, name, sub]) => `<figure><img src="${img}" alt="${esc(name)}" loading="lazy"><figcaption>${esc(name)}<small>${esc(sub || "")}</small></figcaption></figure>`).join("")}</div>`;
h.strip = list => `<div class="strip">${list.map(([img, t, d]) => `<figure><img src="${img}" alt="${esc(t)}" loading="lazy"><figcaption><b>${esc(t)}</b><span>${esc(d || "")}</span></figcaption></figure>`).join("")}</div>`;
// product cards: {id,img,cover,tag,name,meta(html-safe list|string),price,unit,totId}
h.prods = (items, one) => `<div class="prods ${one ? "one" : ""}">${items.map(p => `
  <article class="prod"><div class="prod-ph ${p.cover ? "cover" : ""}" style="background-image:url('${p.img}')" role="img" aria-label="${esc(p.name)}">${p.tag ? `<span class="prod-tag">${esc(p.tag)}</span>` : ""}</div>
    <div class="prod-b"><div class="prod-t">${esc(p.name)}</div>
      ${p.meta ? `<div class="prod-m">${Array.isArray(p.meta) ? `<ul>${p.meta.map(m => `<li>${esc(m)}</li>`).join("")}</ul>` : esc(p.meta)}</div>` : ""}
      ${p.extra || ""}
      ${p.price ? `<div class="prod-p">${esc(p.price)} ${p.unit ? `<small>${esc(p.unit)}</small>` : ""}${p.totId ? `<span class="tot" data-tot="${p.totId}"></span>` : ""}</div>` : ""}
      <div class="prod-f">${Kit.addBtn(p.id, "w sm", p.addLabel)}</div></div></article>`).join("")}</div>`;
// rows: {id,icon|img,name,meta,price,priceOf,opts:{group,list:[[v,label]],sel},noAdd,addLabel}
h.rows = (items, grp) => `<div class="rows">${grp ? `<div class="grp">${esc(grp)}</div>` : ""}${items.map(r => `
  <div class="rr">${r.img ? `<img class="rr-img" src="${r.img}" alt="" loading="lazy">` : `<div class="rr-ic">${ic(r.icon || "sparkle")}</div>`}
    <div class="rr-b"><div class="rr-t">${esc(r.name)}</div>${r.meta ? `<div class="rr-m">${esc(r.meta)}</div>` : ""}
      ${r.opts ? `<div class="durs" data-group="${r.opts.group}">${r.opts.list.map(([v, l]) => `<button type="button" data-v="${esc(v)}" class="${String(v) === String(r.opts.sel) ? "on" : ""}">${esc(l)}</button>`).join("")}</div>` : ""}
      ${r.priceOf ? `<div class="rr-p" data-price-of="${r.priceOf}"></div>` : r.price ? `<div class="rr-p">${esc(r.price)}</div>` : ""}</div>
    ${r.noAdd ? "" : Kit.addBtn(r.id, "sm", r.addLabel)}</div>`).join("")}</div>`;
h.acc = rows => `<div class="acc">${rows.map(r => `<div class="acc-i"><button type="button" class="acc-b" aria-expanded="false"><span class="e">${r.e || ""}</span><span class="tw">${esc(r.t)}</span>${ic("down", "ar")}</button><div class="acc-p"><div>${r.body}</div></div></div>`).join("")}</div>`;
h.wifi = (rows, L) => `<div class="card" style="padding:4px 16px">${rows.map(r => `<div class="wifi-r"><div><div class="l">${esc(r.l)}</div><div class="v ${r.mask ? "masked" : ""}" ${r.mask ? `data-code="${esc(r.v)}"` : ""}>${r.mask ? "••••••••" : esc(r.v)}</div></div><button type="button" class="copy" data-copy="${esc(r.v)}">${esc(L("copy"))}</button></div>`).join("")}</div>`;
h.places = (list, L) => list.map(p => `
  <article class="place">${p.img ? `<img src="${p.img}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()">` : ""}
    <div class="b"><div class="top"><div class="t">${esc(p.name)}${p.star ? `<span class="star">${esc(p.star)}</span>` : ""}</div>${p.dist ? `<span class="d">${esc(p.dist)}</span>` : ""}</div>
      ${p.note ? `<p>${esc(p.note)}</p>` : ""}${p.cost ? `<span class="cost">${esc(p.cost)}</span>` : ""}
      <div class="acts"><a class="lbtn" href="${p.maps}" target="_blank" rel="noopener">${ic("pin")}${esc(L("directions"))}</a>${p.addId ? Kit.addBtn(p.addId, "", p.addLabel) : ""}</div></div></article>`).join("");

/* ---------------- live video hero ---------------- */
G.hero = function(el, opt){
  const v = el.querySelector("video"), poster = el.querySelector(".poster");
  const mobile = matchMedia("(max-aspect-ratio: 4/5)").matches || (matchMedia("(max-width: 640px)").matches && opt.mobile);
  const pick = (mobile && opt.mobile) ? opt.mobile : opt.wide;
  if (poster) poster.style.backgroundImage = `url('${pick.poster}')`;
  v.poster = pick.poster;
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  v.muted = true; v.defaultMuted = true; v.setAttribute("muted", ""); v.playsInline = true;
  v.src = pick.src;
  v.addEventListener("playing", () => v.classList.add("on"), {once:true});
  const p = v.play(); if (p && p.catch) p.catch(() => {});
  // pause off-screen to save battery
  new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ const q = v.play(); q && q.catch && q.catch(() => {}); } else v.pause(); }), {threshold:.05}).observe(el);
};

/* ---------------- views (full-screen rooms) ---------------- */
G.views = {};
let viewEl, current = null, cfg = {};
G.setup = o => { cfg = o; };
function viewHTML(id){
  const v = G.views[id]; if (!v) return "";
  const nav = v.nav || [];
  return `<div class="vbar"><button type="button" class="back" aria-label="Back">${ic("back")}</button><div class="tt">${esc(v.title)}</div></div>
    <header class="vcover" style="background-image:url('${v.img}')"><div class="in"><div class="k">${esc(v.kicker || "")}</div><h2>${esc(v.title)}</h2>${v.sub ? `<p>${esc(v.sub)}</p>` : ""}</div></header>
    ${nav.length > 1 ? `<nav class="vnav">${nav.map(([nid, l], i) => `<a href="#" data-jump="${nid}" class="${i === 0 ? "on" : ""}">${esc(l)}</a>`).join("")}</nav>` : ""}
    <div class="vbody">${v.body()}</div>`;
}
let navIO;
function paint(id, keepScroll){
  const st = viewEl.scrollTop;
  viewEl.innerHTML = viewHTML(id);
  viewEl.setAttribute("aria-label", G.views[id].title);
  if (keepScroll) viewEl.scrollTop = st; else viewEl.scrollTop = 0;
  const v = G.views[id]; if (v.after) v.after();
  cfg.afterRender && cfg.afterRender();
  // nav highlight
  if (navIO) navIO.disconnect();
  const links = [...viewEl.querySelectorAll(".vnav a")];
  if (links.length){
    navIO = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle("on", a.dataset.jump === e.target.dataset.nav));
      const on = links.find(a => a.classList.contains("on")); on && on.parentElement.scrollTo({left: on.offsetLeft - 20, behavior:"smooth"});
    }), {root:viewEl, rootMargin:"-140px 0px -60% 0px"});
    viewEl.querySelectorAll(".vsec[data-nav]").forEach(s => navIO.observe(s));
  }
}
function route(){
  const m = location.hash.match(/^#\/([\w-]+)(?:\/([\w-]+))?/);
  const id = m && G.views[m[1]] ? m[1] : null;
  if (id){
    const fresh = id !== current;
    current = id; document.body.classList.add("has-view");
    if (fresh) paint(id, false);
    requestAnimationFrame(() => { viewEl.classList.add("open"); document.body.classList.add("view-open"); });
    if (m[2]) setTimeout(() => jump(m[2]), fresh ? 420 : 0);
  } else if (current){
    viewEl.classList.remove("open"); document.body.classList.remove("view-open");
    current = null;
    setTimeout(() => { if (!current) document.body.classList.remove("has-view"); }, 460);
  }
}
function jump(nid){
  const s = viewEl.querySelector(`#v-${nid}`); if (!s) return;
  viewEl.scrollTo({top: s.offsetTop - 120, behavior:"smooth"});
}
let pushed = false;
G.open = (id, sub) => { pushed = true; location.hash = "#/" + id + (sub ? "/" + sub : ""); };
G.close = () => { if (pushed && history.length > 1){ pushed = false; history.back(); } else { history.replaceState(null, "", location.pathname + location.search); route(); } };
G.repaint = () => { if (current) paint(current, true); };
G.current = () => current;

G.mount = function(){
  viewEl = document.createElement("div");
  viewEl.className = "view"; viewEl.setAttribute("role", "dialog");
  document.body.appendChild(viewEl);
  viewEl.addEventListener("scroll", () => { const b = viewEl.querySelector(".vbar"); if (b) b.classList.toggle("solid", viewEl.scrollTop > 190); }, {passive:true});
  addEventListener("hashchange", route);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && current && !document.querySelector(".ksheet.open")) G.close(); });
  document.addEventListener("click", e => {
    const t = e.target;
    const ov = t.closest("[data-view]"); if (ov){ e.preventDefault(); G.open(ov.dataset.view, ov.dataset.sub); return; }
    if (t.closest(".vbar .back")){ G.close(); return; }
    const j = t.closest("[data-jump]"); if (j){ e.preventDefault(); jump(j.dataset.jump); return; }
    const a = t.closest(".acc-b");
    if (a){ const open = a.getAttribute("aria-expanded") === "true", p = a.nextElementSibling; a.setAttribute("aria-expanded", String(!open)); p.style.maxHeight = open ? null : p.scrollHeight + "px"; return; }
    const m = t.closest(".v.masked"); if (m){ m.textContent = m.dataset.code; m.classList.remove("masked"); return; }
    const c = t.closest(".copy[data-copy]");
    if (c){ const r = c.parentElement.querySelector(".v.masked"); if (r){ r.textContent = r.dataset.code; r.classList.remove("masked"); }
      const txt = c.dataset.copy, ok = () => Kit.toast(cfg.L ? cfg.L("copied") : "Copied");
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok).catch(() => Kit.toast(txt)); else Kit.toast(txt); }
  });
  route();
};

/* ---------------- language menu ---------------- */
// list: [[code, label, short]]; onPick(code)
G.langMenu = function(el, list, cur, onPick){
  const c = list.find(l => l[0] === cur) || list[0];
  el.innerHTML = `<button type="button" class="lang-btn" aria-haspopup="listbox" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg><span>${esc(c[2] || c[0].toUpperCase())}</span><svg class="dn" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
    <div class="lang-list" role="listbox">${list.map(([code, label]) => `<button type="button" role="option" data-lang="${code}" aria-selected="${code === cur}" class="${code === cur ? "on" : ""}">${esc(label)}</button>`).join("")}</div>`;
  const btn = el.querySelector(".lang-btn");
  btn.onclick = e => { e.stopPropagation(); const o = el.classList.toggle("open"); btn.setAttribute("aria-expanded", String(o)); };
  el.querySelectorAll(".lang-list button").forEach(b => b.onclick = e => { e.stopPropagation(); el.classList.remove("open"); onPick(b.dataset.lang); });
  if (!G._langDoc){ G._langDoc = true; document.addEventListener("click", () => document.querySelectorAll(".langs.open").forEach(x => x.classList.remove("open"))); }
};

/* ---------------- translation overlay ----------------
   TX[lang][englishText] = translation. Used when a page has no native string for a language. */
G.tx = (lang, en) => (window.TX && TX[lang] && typeof en === "string" && TX[lang][en]) || en;
const FROM = {ru:"от $1", uk:"від $1", fr:"À partir de $1", id:"Mulai $1", zh:"$1 起", ko:"$1부터"};
const UNIT = {ru:{couple:"на двоих",person:"чел.",day:"день",kg:"кг"}, uk:{couple:"на двох",person:"ос.",day:"день",kg:"кг"}, fr:{couple:"pour deux",person:"pers.",day:"jour",kg:"kg"}, id:{couple:"pasangan",person:"orang",day:"hari",kg:"kg"}, zh:{couple:"两人",person:"人",day:"天",kg:"公斤"}, ko:{couple:"2인",person:"1인",day:"1일",kg:"kg"}};
G.price = (lang, s) => {
  if (typeof s !== "string" || lang === "en") return s;
  let out = s.replace(/\/\s*(couple|person|day|kg)\b/g, (m, u) => "/ " + ((UNIT[lang] || {})[u] || u));
  if (FROM[lang]) out = out.replace(/^from\s+(.+)$/i, FROM[lang]);
  return out;
};
G.txDeep = (lang, v) => typeof v === "string" ? G.tx(lang, v) : Array.isArray(v) ? v.map(x => G.txDeep(lang, x)) : v;

/* ---------------- reveal on scroll ---------------- */
G.reveal = function(root){
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const els = [...(root || document).querySelectorAll(".rv:not(.in)")];
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), {rootMargin:"0px 0px -6% 0px", threshold:.06});
  els.forEach(el => io.observe(el));
};
})();
