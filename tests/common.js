// クロラボ 定期テスト自動作成：各教科のデータファイルで使う共通の道具
// すべてクロラボのオリジナル問題です（教科書の文章・入試の過去問は使っていません）。
(function () {
const KANA = ["ア", "イ", "ウ", "エ", "オ", "カ"];
function mk(r) {
  const int = (a, b) => a + Math.floor(r() * (b - a + 1));
  const pick = a => a[Math.floor(r() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const ch = (q, right, wrongs, ex, extra = {}) => {
    const opts = shuffle([right, ...wrongs.slice(0, 3)]);
    return { q, type: "choice", choices: opts.map((o, i) => KANA[i] + "　" + o), ans: KANA[opts.indexOf(right)], ex, ...extra };
  };
  // 絵や図の選択肢（choicesHtml にそのまま入れる）
  const pch = (q, rightHtml, wrongHtmls, ex, extra = {}) => {
    const opts = shuffle([[rightHtml, 1], ...wrongHtmls.slice(0, 3).map(w => [w, 0])]);
    return { q, type: "choice", pics: opts.map(([h], i) => `<span class="pic"><b>${KANA[i]}</b>${h}</span>`), ans: KANA[opts.findIndex(o => o[1])], ex, ...extra };
  };
  const word = (q, ans, ex, extra = {}) => ({ q, type: "word", ans, ex, ...extra });
  const calc = (q, ans, ex, extra = {}) => ({ q, type: "calc", ans, ex, ...extra });
  const desc = (q, ans, crit, ex, extra = {}) => ({ q, type: "desc", ans, crit, ex, ...extra });
  const order = (q, steps, ex) => { const o = shuffle(steps.map((s, i) => [s, i])); return { q, type: "order", choices: o.map((x, i) => KANA[i] + "　" + x[0]), ans: steps.map((_, i) => KANA[o.findIndex(x => x[1] === i)]).join("→"), ex }; };
  const fmt = v => String(Math.round(v * 100) / 100);
  return { int, pick, shuffle, sample, ch, pch, word, calc, desc, order, fmt };
}
const svg = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="'Zen Maru Gothic','Hiragino Sans',sans-serif" font-size="13">${body}</svg>`;
const lbl = (x, y, t, extra = "") => `<text x="${x}" y="${y}" font-weight="700" ${extra}>${t}</text>`;
const line = (x1, y1, x2, y2, extra = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${/stroke=/.test(extra) ? "" : 'stroke="#222"'} ${/stroke-width=/.test(extra) ? "" : 'stroke-width="1.2"'} ${extra}/>`;
function graph({ w = 330, h = 230, xmax, ymax, xmin = 0, ymin = 0, xstep, ystep, xlabel, ylabel, series, xticks, yticks, extra = "" }) {
  const L = 46, B = h - 36, R = w - 12, T = 12;
  const X = v => L + (R - L) * (v - xmin) / (xmax - xmin), Y = v => B - (B - T) * (v - ymin) / (ymax - ymin);
  let s = "";
  for (let v = xmin; v <= xmax + 1e-9; v += xstep) s += line(X(v), T, X(v), B, 'stroke="#bbb" stroke-width="0.6"');
  for (let v = ymin; v <= ymax + 1e-9; v += ystep) s += line(L, Y(v), R, Y(v), 'stroke="#bbb" stroke-width="0.6"');
  s += line(L, B, R, B) + line(L, B, L, T);
  for (let v = xmin; v <= xmax + 1e-9; v += xticks || xstep) s += `<text x="${X(v)}" y="${B + 14}" text-anchor="middle" font-size="11">${Math.round(v * 100) / 100}</text>`;
  for (let v = ymin; v <= ymax + 1e-9; v += yticks || ystep) s += `<text x="${L - 5}" y="${Y(v) + 4}" text-anchor="end" font-size="11">${Math.round(v * 100) / 100}</text>`;
  s += `<text x="${(L + R) / 2}" y="${h - 4}" text-anchor="middle" font-size="12">${xlabel}</text>`;
  s += `<text x="10" y="${(T + B) / 2}" text-anchor="middle" font-size="12" transform="rotate(-90 10 ${(T + B) / 2})">${ylabel}</text>`;
  for (const sr of series) {
    if (sr.dots) { s += sr.pts.map(([a, b]) => `<circle cx="${X(a)}" cy="${Y(b)}" r="3" fill="#222"/>`).join(""); continue; }
    s += `<polyline fill="none" stroke="${sr.color || "#222"}" stroke-width="${sr.wd || 1.8}" ${sr.dash ? 'stroke-dasharray="5 3"' : ""} points="${sr.pts.map(([a, b]) => X(a) + "," + Y(b)).join(" ")}"/>`;
    if (sr.label) { const [a, b] = sr.at || sr.pts[sr.pts.length - 1]; s += `<text x="${X(a) + 4}" y="${Y(b) - 4}" font-weight="700">${sr.label}</text>`; }
  }
  return svg(w, h, s + (typeof extra === "function" ? extra(X, Y) : extra));
}
const LET = ["A", "B", "C", "D", "E", "F"];
const SEL = "ア〜エから一つ選び、記号で答えなさい。";
let UID = 0;
const uid = p => (p || "u") + (++UID);
function comboCh(r, letters, right, maxLen = 3) {
  const key = a => a.slice().sort().join("・");
  const all = [];
  for (let m = 1; m < (1 << letters.length); m++) { const s = letters.filter((_, i) => m >> i & 1); if (s.length <= maxLen) all.push(key(s)); }
  const rk = key(right);
  const near = all.filter(k => k !== rk).map(k => [k, Math.abs(k.length - rk.length) + r()]).sort((a, b) => a[1] - b[1]).map(x => x[0]);
  return { right: rk, wrongs: near.slice(0, 3) };
}
const tblH = (head, rows, cls = "") => `<table class="tbl ${cls}">${head ? `<tr>${head.map(h => `<th>${h}</th>`).join("")}</tr>` : ""}${rows.map(row => `<tr>${row.map((c, i) => i === 0 ? `<th>${c}</th>` : `<td>${c}</td>`).join("")}</tr>`).join("")}</table>`;
const figc = (body, cap) => `<figure class="fc">${body}<figcaption>${cap}</figcaption></figure>`;
const tcap = t => `<div class="tcap">${t}</div>`;
const exp = (label, steps) => `<span class="exp"><b>【${label}】</b>${steps.map((s, i) => `<span class="st">${"①②③④⑤⑥⑦⑧"[i]} ${s}</span>`).join("")}</span>`;
const talk = lines => `<span class="talk">${lines.map(([who, t]) => `<span><b>${who}</b>「${t}」</span>`).join("")}</span>`;
const combo2 = (ch, q, o1, o2, ex) => {
  const all = [[0, 0], [0, 1], [1, 0], [1, 1]].map(([i, j]) => `①${o1[i]}　②${o2[j]}`);
  return ch(q + SEL, all[0], all.slice(1), ex);
};
const arrowHead = (x, y, ang, s = 7) => { const a = ang * Math.PI / 180; return `<path d="M${x} ${y} L${x - s * Math.cos(a - 0.4)} ${y - s * Math.sin(a - 0.4)} L${x - s * Math.cos(a + 0.4)} ${y - s * Math.sin(a + 0.4)} Z" fill="#222"/>`; };
const arrow = (x1, y1, x2, y2, extra = "") => line(x1, y1, x2, y2, extra) + arrowHead(x2, y2, Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI);
// 本文（国語・英語の長文）：段落ごとに番号をつけられる
const passage = (paras, opt = {}) => `<div class="passage${opt.vertical ? " tate" : ""}${opt.en ? " en" : ""}">${paras.map((p, i) => `<p>${opt.num ? `<span class="pn">${"①②③④⑤⑥⑦⑧⑨⑩"[i]}</span>` : ""}${p}</p>`).join("")}</div>`;
// 教科データを登録する
function register(key, meta, def) {
  const T = [];
  const api = { add: (unit, name, f, extra = {}) => T.push({ unit, name, f, lv: 1, ...extra }), adv: (unit, name, f, extra = {}) => T.push({ unit, name, f, lv: 2, ...extra }) };
  def(api);
  window.KUROTEST = window.KUROTEST || {};
  window.KUROTEST[key] = { ...meta, templates: T };
  return window.KUROTEST[key];
}
window.KT = { KANA, mk, svg, lbl, line, graph, LET, SEL, uid, comboCh, tblH, figc, tcap, exp, talk, combo2, arrowHead, arrow, passage, register };
})();
