// 中2数学。すべてクロラボのオリジナル問題です。
// 入試の中2範囲で毎年出る「式の計算・連立方程式・一次関数・図形の証明・確率・箱ひげ図」を、
// 計算 → 文章題・生活場面 → 説明（証明）の順にそろえています。
(function () {
const { mk, svg, line, lbl, graph, LET, SEL, tblH, figc, tcap, exp, talk, combo2, arrow, register } = window.KT;
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const frac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? (n < 0 ? `−${-n}` : String(n)) : `${n < 0 ? "−" : ""}${Math.abs(n)}/${d}`; };
const sg = n => n < 0 ? `−${-n}` : `${n}`;
const term = (c, v, first) => { if (c === 0) return ""; const a = Math.abs(c), s = c < 0 ? "−" : first ? "" : "＋"; return `${s}${a === 1 && v ? "" : a}${v}`; };
const poly = ts => { let out = "", first = true; for (const [c, v] of ts) { const t = term(c, v, first); if (t) { out += t; first = false; } } return out || "0"; };
const r2 = v => Math.round(v * 100) / 100;
// 負の数は全角の「−」で表示する（図の座標には使わない）
const neg = t => typeof t === "string" ? t.replace(/(^|[^\w#.:="-])-(\d)/g, "$1−$2").replace(/＋−/g, "−").replace(/−−/g, "＋") : t;
const fixQ = Q => { for (const k of ["lead", "title"]) Q[k] = neg(Q[k]); Q.items = Q.items.map(it => ({ ...it, q: neg(it.q), ans: neg(it.ans), ex: neg(it.ex), crit: neg(it.crit), qHtml: neg(it.qHtml), choices: it.choices && it.choices.map(neg) })); return Q; };
// 傾き n/d の直線の式 y＝(n/d)x＋b（b も分数可）
const linEq = (mn, md, bn, bd) => { const m = frac(mn, md), b = frac(bn, bd); const mt = m === "0" ? "" : m === "1" ? "x" : m === "−1" ? "−x" : m.includes("/") ? `${m.startsWith("−") ? "−" : ""}(${m.replace("−", "")})x` : `${m}x`; const bt = b === "0" ? "" : (b.startsWith("−") ? b : (mt ? "＋" : "") + b); return `y＝${mt}${bt}` || "y＝0"; };
const pa = n => n < 0 ? `(${sg(n)})` : `${n}`;
const nz = (K, a, b) => { let x; do { x = K.int(a, b); } while (x === 0); return x; };

/* ======================= 式の計算 ======================= */
const EXPR = [];
EXPR.push(["式の計算（基本）", 1, r => {
  const K = mk(r); const { int, pick, calc } = K;
  const a = nz(K, -6, 6), b = nz(K, -6, 6), c = nz(K, -6, 6), d = nz(K, -6, 6);
  const q1 = `(${poly([[a, "x"], [b, "y"]])}) − (${poly([[c, "x"], [d, "y"]])})`, a1 = poly([[a - c, "x"], [b - d, "y"]]);
  const m = pick([2, 3, 4]), n = pick([2, 3, 5]);
  const q2 = `${m}(${poly([[a, "a"], [b, "b"]])}) ＋ ${n}(${poly([[c, "a"], [d, "b"]])})`, a2 = poly([[m * a + n * c, "a"], [m * b + n * d, "b"]]);
  const p = pick([2, 3, 4, 6]), s = pick([3, 4, 5]);
  const q3 = `${p}x²y × ${s}xy ÷ ${p * 2}xy`, a3 = (f => f.includes("/") ? `(${f})x²y` : `${f}x²y`)(frac(p * s, p * 2));
  const x0 = nz(K, -3, 3), y0 = nz(K, -3, 3), e = nz(K, -4, 4), f = nz(K, -4, 4);
  const val = 2 * (e * x0 + f * y0) - (e * x0 - f * y0);
  const k = pick([2, 3, 4]), h = pick([2, 3, 5]);
  return {
    unit: "expr", title: "式の計算",
    lead: "次の問いに答えなさい。",
    items: [
      calc(`${q1} を計算しなさい。`, a1, "かっこの前が − のときは、かっこの中の各項の符号を変えます。"),
      calc(`${q2} を計算しなさい。`, a2, "分配法則でかっこをはずし、同類項をまとめます。"),
      calc(`${q3} を計算しなさい。`, a3, "係数どうし、文字どうしで計算します。"),
      calc(`x＝${sg(x0)}、y＝${sg(y0)} のとき、2(${poly([[e, "x"], [f, "y"]])}) − (${poly([[e, "x"], [-f, "y"]])}) の値を求めなさい。`, String(val), `式を簡単にすると ${poly([[e, "x"], [3 * f, "y"]])}。これに代入します。`),
      calc(`等式 ${k}x ＋ ${h}y ＝ 12 を y について解きなさい。`, linEq(-k, h, 12, h), `${h}y＝−${k}x＋12。両辺を ${h} でわります。`)
    ]
  };
}]);
EXPR.push(["文字式を使った説明", 2, r => {
  const K = mk(r); const { pick, desc, ch, word } = K;
  const T = pick([
    { name: "連続する3つの整数", claim: "連続する3つの整数の和は、3の倍数になる", set: "いちばん小さい整数を n とすると、連続する3つの整数は n、n＋1、n＋2 と表される。", calc: "n＋(n＋1)＋(n＋2)＝3n＋3＝3(n＋1)", tail: "n＋1 は整数だから、3(n＋1) は3の倍数である。", blank: "3(n＋1)" },
    { name: "2けたの自然数と入れかえた数", claim: "2けたの自然数と、その数の十の位の数と一の位の数を入れかえた数の和は、11の倍数になる", set: "もとの数の十の位の数を a、一の位の数を b とすると、もとの数は 10a＋b、入れかえた数は 10b＋a と表される。", calc: "(10a＋b)＋(10b＋a)＝11a＋11b＝11(a＋b)", tail: "a＋b は整数だから、11(a＋b) は11の倍数である。", blank: "11(a＋b)" },
    { name: "連続する2つの奇数", claim: "連続する2つの奇数の和は、4の倍数になる", set: "n を整数とすると、連続する2つの奇数は 2n＋1、2n＋3 と表される。", calc: "(2n＋1)＋(2n＋3)＝4n＋4＝4(n＋1)", tail: "n＋1 は整数だから、4(n＋1) は4の倍数である。", blank: "4(n＋1)" },
    { name: "3けたの自然数", claim: "百の位の数と一の位の数が等しい3けたの自然数から、その数の各位の数の和をひいた差は、9の倍数になる", set: "百の位と一の位の数を a、十の位の数を b とすると、その数は 100a＋10b＋a＝101a＋10b、各位の数の和は 2a＋b と表される。", calc: "(101a＋10b)−(2a＋b)＝99a＋9b＝9(11a＋b)", tail: "11a＋b は整数だから、9(11a＋b) は9の倍数である。", blank: "9(11a＋b)" }
  ]);
  const ex = T.name === "連続する3つの整数" ? (() => { const n = K.int(4, 30); return `${n}＋${n + 1}＋${n + 2}＝${3 * n + 3}＝3×${n + 1}`; })() : T.name === "2けたの自然数と入れかえた数" ? (() => { const a = K.int(1, 9), b = K.int(1, 9); return `${10 * a + b}＋${10 * b + a}＝${11 * (a + b)}＝11×${a + b}`; })() : T.name === "連続する2つの奇数" ? (() => { const n = K.int(2, 20); return `${2 * n + 1}＋${2 * n + 3}＝${4 * n + 4}＝4×${n + 1}`; })() : (() => { const a = K.int(1, 9), b = K.int(0, 9); const N = 101 * a + 10 * b; return `${N}−(${a}＋${b}＋${a})＝${N - 2 * a - b}＝9×${11 * a + b}`; })();
  return {
    unit: "expr", title: "文字式を使った説明",
    lead: `「${T.claim}」ことを、次のように説明した。<span class="exp"><b>【説明】</b><span class="st">${T.set}</span><span class="st">それらの和（差）は、${T.calc.replace(T.blank, "（　ア　）")}</span><span class="st">${T.tail.replace(T.blank, "（　ア　）")}</span><span class="st">したがって、${T.claim}。</span></span>`,
    items: [
      word("（ア）にあてはまる式を書きなさい。", T.blank, ""),
      ch("具体的な数で確かめた式として正しいものを、" + SEL, ex, [ex.replace(/＝([0-9]+)×/, (m, d) => `＝${+d + 1}×`), ex.replace(/[0-9]+$/, d => String(+d + 1)), ex.replace(/^([0-9]+)/, d => String(+d + 2))], "実際に計算して確かめます。"),
      desc(`この説明で、「${T.tail.split("だから")[0]}」と書く必要があるのはなぜか。`, `（ア）の式が、${T.blank.split("(")[0]}と整数の積であることを示し、${T.blank.split("(")[0]}の倍数であるといえるようにするため。`, "「整数の積の形」「倍数であるといえる」の内容で正解。", ""),
      desc(`${T.name === "連続する3つの整数" ? "連続する3つの整数の和は、まん中の数の何倍になっているか。説明の式をもとに答えなさい。" : T.name === "2けたの自然数と入れかえた数" ? "もとの数から入れかえた数をひいた差は、何の倍数になるか。文字式で説明しなさい。" : T.name === "連続する2つの奇数" ? "連続する2つの偶数の和は、何の倍数になるといえるか。文字式で説明しなさい。" : "この差を9でわった商は、何を表す式か。答えなさい。"}`, T.name === "連続する3つの整数" ? "3倍（3(n＋1) の n＋1 がまん中の数だから）" : T.name === "2けたの自然数と入れかえた数" ? "(10a＋b)−(10b＋a)＝9a−9b＝9(a−b)。a−b は整数なので9の倍数。" : T.name === "連続する2つの奇数" ? "2n＋(2n＋2)＝4n＋2＝2(2n＋1)。2n＋1 は整数なので2の倍数（偶数）。4の倍数とはいえない。" : "11a＋b", "式を正しく変形し、結論が書けていれば正解。", "")
    ]
  };
}]);

/* ======================= 連立方程式 ======================= */
const EQ = [];
EQ.push(["連立方程式を解く", 1, r => {
  const K = mk(r); const { calc, int } = K;
  const mkSys = () => { const x = nz(K, -5, 6), y = nz(K, -5, 6); const a = nz(K, -4, 5), b = nz(K, -4, 5), c = nz(K, -4, 5), d = nz(K, -4, 5); if (a * d - b * c === 0) return mkSys(); return { x, y, e1: `${poly([[a, "x"], [b, "y"]])}＝${a * x + b * y}`, e2: `${poly([[c, "x"], [d, "y"]])}＝${c * x + d * y}` }; };
  const S = [mkSys(), mkSys()];
  const x3 = nz(K, -4, 5), y3 = nz(K, -4, 5), k = K.pick([2, 3, 4]);
  const e3a = `y＝${poly([[k, "x"], [y3 - k * x3, ""]])}`, e3b = `${poly([[2, "x"], [1, "y"]])}＝${2 * x3 + y3}`;
  const x4 = K.pick([2, 4, 6, -2]), y4 = K.pick([3, 6, -3, 9]);
  const e4a = `x/2 ＋ y/3 ＝ ${x4 / 2 + y4 / 3}`, e4b = `${poly([[1, "x"], [-1, "y"]])}＝${x4 - y4}`;
  const ans = (x, y) => `x＝${sg(x)}、y＝${sg(y)}`;
  return {
    unit: "eq", title: "連立方程式を解く", lead: "次の連立方程式を解きなさい。",
    items: [
      calc(`${S[0].e1}　${S[0].e2}`, ans(S[0].x, S[0].y), "加減法で、どちらかの文字を消去します。"),
      calc(`${S[1].e1}　${S[1].e2}`, ans(S[1].x, S[1].y), ""),
      calc(`${e3a.replace("＝＋", "＝")}　${e3b}`, ans(x3, y3), "代入法：上の式を下の式に代入します。"),
      calc(`${e4a}　${e4b}`, ans(x4, y4), "上の式の両辺に6をかけて、分数のない式にします。")
    ].map(it => ({ ...it, qHtml: `<span style="display:inline-grid;gap:2px;border-left:2px solid #111;padding-left:8px">${it.q.split("　").map(t => `<span>${t}</span>`).join("")}</span>` }))
  };
}]);
EQ.push(["連立方程式の文章題", 2, r => {
  const K = mk(r); const { pick, int, calc, desc, word } = K;
  const T = pick(["price", "speed", "rate"]);
  if (T === "price") {
    const [p1, p2] = pick([[120, 80], [150, 90], [130, 70], [110, 60]]), x = int(3, 8), y = int(3, 9);
    const it = pick([["りんご", "みかん"], ["ノート", "ボールペン"], ["おにぎり", "パン"]]);
    return { unit: "eq", title: "連立方程式の利用（代金）", lead: `1個 ${p1}円の${it[0]}と、1個 ${p2}円の${it[1]}を、合わせて ${x + y}個買ったところ、代金の合計は ${p1 * x + p2 * y}円だった。${it[0]}を x 個、${it[1]}を y 個買ったとする。`, items: [
      word("個数の関係を、x、y を使った方程式で表しなさい。", `x＋y＝${x + y}`, ""),
      word("代金の関係を、x、y を使った方程式で表しなさい。", `${p1}x＋${p2}y＝${p1 * x + p2 * y}`, ""),
      calc(`${it[0]}と${it[1]}をそれぞれ何個買ったか。`, `${it[0]} ${x}個、${it[1]} ${y}個`, ""),
      desc(`${it[0]}を1個減らして${it[1]}を1個増やすと、代金はいくらになるか。求め方も書きなさい。`, `${p1 * x + p2 * y - p1 + p2}円（${p1 * x + p2 * y}−${p1}＋${p2}）`, "答えと求め方が正しければ正解。", "")
    ] };
  }
  if (T === "speed") {
    const v1 = pick([60, 70, 80]), v2 = pick([150, 160, 200, 240]), tw = int(8, 20), tr = int(4, 12);
    const x = v1 * tw, y = v2 * tr, D = x + y, tt = tw + tr;
    return { unit: "eq", title: "連立方程式の利用（速さ）", lead: `Aさんは家から ${D}m はなれた駅まで行くのに、はじめは分速 ${v1}m で歩き、途中から分速 ${v2}m で走ったところ、全体で ${tt}分かかった。歩いた道のりを x m、走った道のりを y m とする。`, items: [
      word("道のりの関係を方程式で表しなさい。", `x＋y＝${D}`, ""),
      word("時間の関係を方程式で表しなさい。", `x/${v1}＋y/${v2}＝${tt}`, "時間＝道のり÷速さ"),
      calc("歩いた道のりと走った道のりをそれぞれ求めなさい。", `歩いた道のり ${x}m、走った道のり ${y}m`, `下の式の両辺に ${v1 * v2 / gcd(v1, v2)} をかけて、分数のない式にしてから解きます。`),
      calc("走った時間は何分か。", `${tr}分`, `${y}÷${v2}＝${tr}`)
    ] };
  }
  // 割合（昨年比）
  const X = pick([200, 240, 300, 400]), Y = pick([150, 200, 250, 300]), p = pick([10, 20, 5]), q = pick([10, 20, 30]);
  const nx = r2(X * (1 + p / 100)), ny = r2(Y * (1 - q / 100));
  const tot0 = X + Y, tot1 = r2(nx + ny);
  return { unit: "eq", title: "連立方程式の利用（割合）", lead: `ある中学校の昨年の生徒数は、男子と女子を合わせて ${tot0}人だった。今年は昨年と比べて、男子が ${p}％増え、女子が ${q}％減ったので、全体で ${tot1}人になった。昨年の男子を x 人、女子を y 人とする。`, items: [
    word("昨年の人数の関係を方程式で表しなさい。", `x＋y＝${tot0}`, ""),
    word("今年の人数の関係を方程式で表しなさい。", `${1 + p / 100}x＋${r2(1 - q / 100)}y＝${tot1}`, `両辺を100倍した ${100 + p}x＋${100 - q}y＝${tot1 * 100}、増減だけに注目した ${p / 100}x−${q / 100}y＝${tot1 - tot0} も正解。`),
    calc("昨年の男子と女子の人数を求めなさい。", `男子 ${X}人、女子 ${Y}人`, ""),
    calc("今年の男子の人数を求めなさい。", `${nx}人`, `${X}×${1 + p / 100}`)
  ] };
}]);
EQ.push(["連立方程式の解と係数", 2, r => {
  const K = mk(r); const { int, calc, pick } = K;
  let x, y; do { x = nz(K, -4, 5); y = nz(K, -4, 5); } while (Math.abs(x) === Math.abs(y)); const a = nz(K, -4, 5), b = nz(K, -4, 5);
  const c1 = pick([2, 3]), c2 = pick([1, 2, 3]);
  return {
    unit: "eq", title: "連立方程式の解と係数", lead: `x、y についての連立方程式 { ax＋by＝${a * x + b * y}　bx＋ay＝${b * x + a * y} } の解が x＝${sg(x)}、y＝${sg(y)} である。`,
    items: [
      calc("a、b の値を求めなさい。", `a＝${sg(a)}、b＝${sg(b)}`, `x、y の値を代入して、a、b についての連立方程式 ${poly([[x, "a"], [y, "b"]])}＝${a * x + b * y}、${poly([[y, "a"], [x, "b"]])}＝${b * x + a * y} を解きます。`),
      calc(`a の値を使って、2つの直線 y＝${c1}x＋a と y＝−x＋${a + (c1 + 1) * c2} の交点の座標を求めなさい。`, `(${c2}, ${c1 * c2 + a})`, "2つの式を連立方程式として解きます。")
    ]
  };
}]);

/* ======================= 一次関数 ======================= */
const FUNC = [];
const plane = (xmin, xmax, ymin, ymax, U, body) => {
  const W = (xmax - xmin) * U + 40, H = (ymax - ymin) * U + 40, X = x => 20 + (x - xmin) * U, Y = y => 20 + (ymax - y) * U;
  let s = "";
  for (let x = xmin; x <= xmax; x++) s += line(X(x), Y(ymin), X(x), Y(ymax), 'stroke="#ddd" stroke-width="0.6"');
  for (let y = ymin; y <= ymax; y++) s += line(X(xmin), Y(y), X(xmax), Y(y), 'stroke="#ddd" stroke-width="0.6"');
  s += arrow(X(xmin), Y(0), X(xmax) + 8, Y(0), 'stroke-width="1.2"') + arrow(X(0), Y(ymin), X(0), Y(ymax) - 8, 'stroke-width="1.2"') + `<text x="${X(xmax) + 6}" y="${Y(0) + 14}" font-size="12">x</text><text x="${X(0) + 6}" y="${Y(ymax) - 4}" font-size="12">y</text><text x="${X(0) - 12}" y="${Y(0) + 14}" font-size="11">O</text>`;
  return svg(W + 10, H, s + body(X, Y));
};
const lineIn = (X, Y, m, b, xmin, xmax, ymin, ymax, extra = "") => { // y = m x + b を枠内で描く
  const pts = []; for (const x of [xmin, xmax]) { const y = m * x + b; if (y >= ymin && y <= ymax) pts.push([x, y]); }
  for (const y of [ymin, ymax]) { if (m === 0) continue; const x = (y - b) / m; if (x > xmin && x < xmax) pts.push([x, y]); }
  pts.sort((a, b2) => a[0] - b2[0]);
  return pts.length >= 2 ? `<line x1="${X(pts[0][0])}" y1="${Y(pts[0][1])}" x2="${X(pts[pts.length - 1][0])}" y2="${Y(pts[pts.length - 1][1])}" stroke="#222" stroke-width="2" ${extra}/>` : "";
};
FUNC.push(["一次関数の式", 1, r => {
  const K = mk(r); const { calc, pick, ch } = K;
  const m1 = nz(K, -3, 3), b1 = nz(K, -4, 4);
  const xa = nz(K, -3, 2), xb = xa + K.int(1, 3), m2 = nz(K, -3, 3), b2 = K.int(-4, 4);
  const ya = m2 * xa + b2, yb = m2 * xb + b2;
  const m3 = pick([1, 2, -1, -2, 0.5]), b3 = nz(K, -3, 3);
  const fig = plane(-5, 5, -5, 5, 18, (X, Y) => lineIn(X, Y, m3, b3, -5, 5, -5, 5) + `<text x="${X(3.6)}" y="${Y(Math.max(-4.6, Math.min(4.6, m3 * 3.6 + b3))) - 6}" font-weight="700">ℓ</text>`);
  const dx = K.pick([2, 3, 4]);
  return {
    unit: "func", title: "一次関数の式とグラフ", lead: "次の問いに答えなさい。", fig: figc(fig, "図（直線 ℓ）"),
    items: [
      calc(`一次関数 y＝${poly([[m1, "x"], [b1, ""]])} で、x の増加量が ${dx} のときの y の増加量を求めなさい。`, String(m1 * dx), `変化の割合 ${m1} × ${dx}`),
      calc(`グラフが点 (${xa}, ${ya}) と点 (${xb}, ${yb}) を通る直線の式を求めなさい。`, `y＝${poly([[m2, "x"], [b2, ""]])}`, `傾き＝(${yb}−${pa(ya)})÷(${xb}−${pa(xa)})＝${m2}`),
      calc("図の直線 ℓ の式を求めなさい。", `y＝${poly([[m3 === 0.5 ? 1 : m3, m3 === 0.5 ? "x/2" : "x"], [b3, ""]])}`.replace("1x/2", "x/2").replace("y＝x/2", "y＝(1/2)x"), "切片と、グラフが通る格子点から傾きを読みとります。"),
      ch(`一次関数 y＝${poly([[m1, "x"], [b1, ""]])} のグラフについて正しいものを、` + SEL, m1 > 0 ? "右上がりの直線である" : "右下がりの直線である", [m1 > 0 ? "右下がりの直線である" : "右上がりの直線である", "原点を通る", `点 (0, ${b1 + 1}) を通る`], "傾きの符号でグラフの向きが決まります。")
    ]
  };
}]);
FUNC.push(["2直線と三角形の面積", 2, r => {
  const K = mk(r); const { calc, pick, int } = K;
  let m1, b1, m2, b2, px, py;
  do { m1 = pick([1, 2, 3]); b1 = int(-2, 3); m2 = pick([-1, -2, -3]); px = int(1, 3); py = m1 * px + b1; b2 = py - m2 * px; } while (b2 > 9 || py < 1 || py > 9 || b1 === b2);
  const area = Math.abs(b2 - b1) * px / 2;
  const fig = plane(-2, 6, -3, 10, 16, (X, Y) => lineIn(X, Y, m1, b1, -2, 6, -3, 10) + lineIn(X, Y, m2, b2, -2, 6, -3, 10) + `<circle cx="${X(px)}" cy="${Y(py)}" r="3" fill="#222"/><text x="${X(px) + 6}" y="${Y(py) - 4}" font-weight="700">P</text><text x="${X(0) + 4}" y="${Y(b1) + 14}" font-weight="700">A</text><text x="${X(0) + 4}" y="${Y(b2) - 4}" font-weight="700">B</text>`);
  return {
    unit: "func", title: "2直線の交点と三角形の面積",
    lead: `図のように、直線 ℓ：y＝${poly([[m1, "x"], [b1, ""]])} と直線 m：y＝${poly([[m2, "x"], [b2, ""]])} が点 P で交わっている。ℓ と m が y 軸と交わる点をそれぞれ A、B とする。座標の1目盛りを 1cm とする。`,
    fig: figc(fig, "図"),
    items: [
      calc("点 P の座標を求めなさい。", `(${px}, ${py})`, "2つの式を連立方程式として解きます。"),
      calc("△PAB の面積を求めなさい。", `${area}cm²`, `底辺 AB＝${Math.abs(b2 - b1)}、高さは P の x 座標 ${px}。`),
      calc("点 P を通り、△PAB の面積を2等分する直線の式を求めなさい。", linEq(2 * py - b1 - b2, 2 * px, b1 + b2, 2), "AB の中点を通る直線が、面積を2等分します。"),
      calc(`直線 m と x 軸との交点の x 座標を求めなさい。`, frac(-b2, m2), "y＝0 を代入します。")
    ]
  };
}]);
FUNC.push(["料金プランの比較（一次関数の利用）", 2, r => {
  const K = mk(r); const { calc, pick, desc, ch } = K;
  let A0, a, b; do { A0 = pick([1000, 1200, 1500, 1800, 2000]); a = pick([20, 30]); b = a + pick([20, 30, 40, 50]); } while (A0 % (b - a) !== 0 || A0 / (b - a) > 80);
  const cross = A0 / (b - a);
  const x1 = pick([20, 30, 40, 60, 80].filter(x => x !== cross));
  const xmax = Math.ceil(cross * 1.6 / 10) * 10;
  const fig = graph({ xmax, ymax: Math.ceil((b * xmax) / 1000) * 1000, xstep: xmax / 10, ystep: 500, yticks: 1000, xticks: xmax / 5, xlabel: "使用時間 x［分］", ylabel: "料金 y［円］", series: [{ pts: [[0, A0], [xmax, A0 + a * xmax]], label: "A", at: [xmax * 0.9, A0 + a * xmax * 0.9] }, { pts: [[0, 0], [xmax, b * xmax]], label: "B", at: [xmax * 0.6, b * xmax * 0.6] }] });
  const better = x1 > cross ? "A" : "B";
  return {
    unit: "func", title: "料金プランの比較",
    lead: `ある会社の料金プランは、次の2つである。<span class="exp"><span class="st">プラン A：基本料金 ${A0}円に加えて、1分あたり ${a}円</span><span class="st">プラン B：基本料金なしで、1分あたり ${b}円</span></span>使用時間を x 分、料金を y 円として、グラフに表した。`,
    fig: figc(fig, "図"),
    items: [
      calc("プラン A について、y を x の式で表しなさい。", `y＝${a}x＋${A0}`, ""),
      calc("2つのプランの料金が等しくなるのは、使用時間が何分のときか。", `${frac(A0, b - a)}分`, `${a}x＋${A0}＝${b}x を解きます。`),
      ch(`1か月の使用時間が ${x1}分のとき、料金が安いのはどちらのプランか。`, `プラン ${better}`, [`プラン ${better === "A" ? "B" : "A"}`, "どちらも同じ", "決められない"], `${x1}分のとき、A は ${a * x1 + A0}円、B は ${b * x1}円。`),
      desc("プラン B を選ぶ方が得になるのは、使用時間がどのようなときか。理由もふくめて書きなさい。", `使用時間が ${frac(A0, b - a)}分より短いとき。グラフで B の直線が A の直線より下にあるから。`, "交点の時間と、グラフ（料金）の比較が書けていれば正解。", "")
    ]
  };
}]);
FUNC.push(["動点と面積", 2, r => {
  const K = mk(r); const { calc, pick, ch, pch } = K;
  const w = pick([6, 8, 10]), h = pick([4, 6]);
  const tot = w + h;
  const fig = svg(260, 170, `<rect x="30" y="30" width="${w * 18}" height="${h * 18}" fill="#f6f6f6" stroke="#222" stroke-width="1.6"/><text x="16" y="34" font-weight="700">A</text><text x="${36 + w * 18}" y="34" font-weight="700">D</text><text x="16" y="${44 + h * 18}" font-weight="700">B</text><text x="${36 + w * 18}" y="${44 + h * 18}" font-weight="700">C</text><circle cx="${30 + w * 18 * 0.5}" cy="${30 + h * 18}" r="4" fill="#c33"/><text x="${26 + w * 18 * 0.5}" y="${50 + h * 18}" font-weight="700">P</text><path d="M30 30 L${30 + w * 18 * 0.5} ${30 + h * 18}" stroke="#c33" stroke-dasharray="4 3"/><text x="${40 + w * 9}" y="${24}" font-size="11">${w}cm</text><text x="${36 + w * 18}" y="${30 + h * 9}" font-size="11">${h}cm</text>`);
  const mini = pts => svg(110, 80, `${line(10, 70, 104, 70)}${line(10, 70, 10, 6)}<polyline points="${pts.map(([x, y]) => `${10 + x * 90},${70 - y * 58}`).join(" ")}" fill="none" stroke="#222" stroke-width="2"/>`);
  const right = mini([[0, 0], [w / tot, 1], [1, 1]]);
  const s1 = pick([2, 3, 4].filter(x => x < w)), s2 = w + pick([1, 2].filter(x => x < h));
  return {
    unit: "func", title: "動点と面積",
    lead: `図のような長方形 ABCD（AD＝${w}cm、AB＝${h}cm）がある。点 P は B を出発して、辺 BC 上を C まで秒速 1cm で動き、C で止まらずに辺 CD 上を D まで動く。P が B を出発してから x 秒後の △ABP の面積を y cm² とする。`,
    fig: figc(fig, "図"),
    items: [
      calc(`x＝${s1} のときの y の値を求めなさい。`, String(h * s1 / 2), `△ABP の底辺 BP＝${s1}、高さ AB＝${h}。`),
      calc(`0≦x≦${w} のとき、y を x の式で表しなさい。`, `y＝${frac(h, 2)}x`, `y＝(1/2)×x×${h}`),
      calc(`x＝${s2} のときの y の値を求めなさい。`, String(w * h / 2), `P が辺 CD 上にあるとき、△ABP の底辺 AB＝${h}、高さは BC＝${w} で一定です。`),
      pch("x と y の関係を表すグラフとして最も適切なものを、" + SEL, right, [mini([[0, 0], [1, 1]]), mini([[0, 0], [w / tot, 1], [1, 0]]), mini([[0, 1], [w / tot, 1], [1, 0]])], "BC 上では増え、CD 上では一定です。"),
      calc(`△ABP の面積が ${h * w / 4}cm² になるのは、P が出発してから何秒後か。`, `${w / 2}秒後`, `${frac(h, 2)}x＝${h * w / 4}`)
    ]
  };
}]);

/* ======================= 図形 ======================= */
const GEO = [];
GEO.push(["平行線と角・多角形の角", 1, r => {
  const K = mk(r); const { calc, pick, int } = K;
  const a = int(35, 70), b = int(25, 60);
  const fig1 = svg(240, 140, `${line(20, 30, 220, 30)}${line(20, 110, 220, 110)}<path d="M60 30 L120 72 L60 110" fill="none" stroke="#222" stroke-width="1.6"/><text x="80" y="42" font-size="12">${a}°</text><text x="80" y="107" font-size="12">${b}°</text><text x="98" y="77" font-weight="700">x</text><text x="224" y="34" font-size="12">ℓ</text><text x="224" y="114" font-size="12">m</text>`);
  const n = pick([6, 8, 9, 10, 12]);
  const ext = pick([24, 30, 36, 40, 45]);
  return {
    unit: "geo", title: "平行線と角・多角形の角", lead: "次の問いに答えなさい。", fig: figc(fig1, "図（ℓ∥m）"),
    items: [
      calc("図で、ℓ∥m のとき、∠x の大きさを求めなさい。", `${a + b}°`, "折れ線の頂点を通り ℓ に平行な直線をひくと、錯角から ∠x＝" + `${a}°＋${b}°`),
      calc(`${n}角形の内角の和を求めなさい。`, `${180 * (n - 2)}°`, `180°×(${n}−2)`),
      calc(`正${n}角形の1つの外角の大きさを求めなさい。`, `${frac(360, n)}°`, "多角形の外角の和は 360°"),
      calc(`1つの外角が ${ext}° の正多角形は、正何角形か。`, `正${360 / ext}角形`, `360÷${ext}`)
    ]
  };
}]);
GEO.push(["三角形の合同の証明", 2, r => {
  const K = mk(r); const { pick, ch, word, desc } = K;
  const P = pick([
    { lead: "図のように、線分 AB と CD が点 O で交わっていて、AO＝BO、CO＝DO である。このとき、△AOC≡△BOD であることを証明しなさい。", fig: svg(220, 140, `<path d="M30 20 L190 120 M30 120 L190 20" stroke="#222" stroke-width="1.6"/><path d="M30 20 L30 120 M190 20 L190 120" stroke="#222"/>${lbl(16, 18, "A")}${lbl(194, 132, "B")}${lbl(16, 132, "C")}${lbl(194, 18, "D")}${lbl(104, 64, "O")}`), steps: ["△AOC と △BOD において", "仮定から　AO＝BO …①", "仮定から　CO＝DO …②", "（　ア　）は等しいから　∠AOC＝∠BOD …③", "①、②、③より、（　イ　）がそれぞれ等しいから", "△AOC≡△BOD"], a: "対頂角", b: "2組の辺とその間の角", hyp: "AO＝BO（または CO＝DO）", next: "AC∥DB であることを証明するには、どの角とどの角が等しいことを示せばよいか。", nextA: "∠OAC と ∠OBD（錯角）" },
    { lead: "図のように、AB＝AC の二等辺三角形 ABC の辺 BC 上に、BD＝CE となる点 D、E をとる。このとき、△ABD≡△ACE であることを証明しなさい。", fig: svg(240, 150, `<path d="M120 20 L30 130 L210 130 Z" fill="none" stroke="#222" stroke-width="1.6"/><path d="M120 20 L80 130 M120 20 L160 130" stroke="#222"/>${lbl(114, 14, "A")}${lbl(16, 140, "B")}${lbl(214, 140, "C")}${lbl(74, 146, "D")}${lbl(156, 146, "E")}`), steps: ["△ABD と △ACE において", "仮定から　AB＝AC …①", "仮定から　BD＝CE …②", "（　ア　）は等しいから　∠ABD＝∠ACE …③", "①、②、③より、（　イ　）がそれぞれ等しいから", "△ABD≡△ACE"], a: "二等辺三角形の底角", b: "2組の辺とその間の角", hyp: "AB＝AC（または BD＝CE）", next: "この証明から、AD＝AE がいえる。△ADE はどんな三角形か。", nextA: "二等辺三角形" },
    { lead: "図のように、平行四辺形 ABCD の対角線の交点を O とし、O を通る直線が辺 AD、BC と交わる点をそれぞれ E、F とする。このとき、△AOE≡△COF であることを証明しなさい。", fig: svg(260, 140, `<path d="M60 20 L240 20 L200 120 L20 120 Z" fill="none" stroke="#222" stroke-width="1.6"/><path d="M60 20 L200 120 M240 20 L20 120" stroke="#222"/><path d="M110 20 L150 120" stroke="#c33"/>${lbl(52, 14, "A")}${lbl(244, 14, "D")}${lbl(204, 134, "C")}${lbl(8, 134, "B")}${lbl(124, 74, "O")}${lbl(104, 14, "E")}${lbl(146, 134, "F")}`), steps: ["△AOE と △COF において", "平行四辺形の対角線はそれぞれの中点で交わるから　AO＝CO …①", "（　ア　）は等しいから　∠AOE＝∠COF …②", "AD∥BC より、平行線の錯角は等しいから　∠OAE＝∠OCF …③", "①、②、③より、（　イ　）がそれぞれ等しいから", "△AOE≡△COF"], a: "対頂角", b: "1組の辺とその両端の角", hyp: "四角形 ABCD は平行四辺形である（または 直線 EF は点 O を通る）", next: "この証明から、どの線分とどの線分が等しいといえるか。1組答えなさい。", nextA: "OE＝OF（または AE＝CF）" }
  ]);
  const conds = ["3組の辺", "2組の辺とその間の角", "1組の辺とその両端の角", "2組の角"];
  return {
    unit: "geo", title: "三角形の合同の証明",
    lead: P.lead + `<span class="exp"><b>【証明】</b>${P.steps.map(s => `<span class="st">${s}</span>`).join("")}</span>`,
    fig: figc(P.fig, "図"),
    items: [
      word("（ア）にあてはまる語句を書きなさい。", P.a, ""),
      ch("（イ）にあてはまる三角形の合同条件を、" + SEL, P.b, conds.filter(c => c !== P.b), ""),
      word(P.next, P.nextA, "合同な図形の対応する辺や角は等しくなります。"),
      desc("証明の中で「仮定」とは何か。この問題の仮定を1つ書きなさい。", P.hyp, "問題文で与えられた条件が書けていれば正解。", "")
    ]
  };
}]);
GEO.push(["二等辺三角形と平行四辺形", 2, r => {
  const K = mk(r); const { calc, pick, int, ch, desc } = K;
  const a = pick([40, 44, 50, 56, 66, 72]);
  const b = pick([58, 64, 70, 76]);
  const fig = svg(250, 140, `<path d="M70 20 L240 20 L190 120 L20 120 Z" fill="none" stroke="#222" stroke-width="1.6"/><path d="M70 20 L190 120" stroke="#222"/>${lbl(62, 14, "A")}${lbl(244, 14, "D")}${lbl(194, 134, "C")}${lbl(8, 134, "B")}<text x="40" y="112" font-size="12">${b}°</text><text x="156" y="116" font-size="12">${a}°</text><text x="212" y="34" font-weight="700">x</text>`);
  return {
    unit: "geo", title: "二等辺三角形と平行四辺形の性質",
    lead: `図の四角形 ABCD は平行四辺形で、∠ABC＝${b}°、∠ACB＝${a}° である。`,
    fig: figc(fig, "図"),
    items: [
      calc("∠x（∠ADC）の大きさを求めなさい。", `${b}°`, "平行四辺形の対角は等しい。"),
      calc("∠CAD の大きさを求めなさい。", `${a}°`, "AD∥BC より、錯角が等しい。"),
      calc("∠BAC の大きさを求めなさい。", `${180 - a - b}°`, `180°−${a}°−${b}°`),
      ch("四角形 ABCD が長方形になるための条件を、" + SEL, "AC＝BD", ["AB＝BC", "AC⊥BD", "AB∥DC"], "対角線の長さが等しい平行四辺形は長方形です。"),
      desc("二等辺三角形の底角が等しいことを証明するとき、頂角の二等分線をひいてできる2つの三角形が合同であることを使う。そのときの合同条件を書きなさい。", "2組の辺とその間の角がそれぞれ等しい。", "合同条件が正しければ正解。", "")
    ]
  };
}]);

/* ======================= 確率 ======================= */
const PROB = [];
PROB.push(["さいころ・硬貨の確率", 1, r => {
  const K = mk(r); const { calc, pick, int } = K;
  const s = int(5, 9), m = pick([3, 4, 5, 6]);
  const cnt = f => { let c = 0; for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) if (f(i, j)) c++; return c; };
  const k = pick([2, 3, 4]);
  return {
    unit: "prob", title: "さいころ・硬貨の確率", lead: "次の確率を求めなさい。ただし、さいころはどの目が出ることも同様に確からしく、硬貨の表と裏の出方も同様に確からしいものとする。",
    items: [
      calc(`大小2つのさいころを同時に投げるとき、出る目の数の和が ${s} になる確率`, frac(cnt((i, j) => i + j === s), 36), "36通りのうち、表をかいて数えます。"),
      calc(`大小2つのさいころを同時に投げるとき、出る目の数の積が ${m} の倍数になる確率`, frac(cnt((i, j) => (i * j) % m === 0), 36), ""),
      calc(`大小2つのさいころを同時に投げるとき、出る目の数の差が ${k} 以上になる確率`, frac(cnt((i, j) => Math.abs(i - j) >= k), 36), ""),
      calc("3枚の硬貨を同時に投げるとき、少なくとも1枚は表が出る確率", "7/8", "1−（3枚とも裏の確率 1/8）"),
      calc("大小2つのさいころを同時に投げるとき、同じ目が出ない確率", "5/6", "1−（同じ目が出る確率 6/36）")
    ]
  };
}]);
PROB.push(["くじ・カードの確率", 2, r => {
  const K = mk(r); const { calc, pick, int, desc, ch } = K;
  const nR = pick([2, 3]), nW = pick([2, 3]);
  const N = nR + nW, tot = N * (N - 1) / 2;
  const both = nR * (nR - 1) / 2, diff = nR * nW;
  const cards = pick([[1, 2, 3, 4, 5], [1, 2, 3, 4], [2, 3, 4, 5, 6]]);
  const two = []; for (const a of cards) for (const b of cards) if (a !== b) two.push(a * 10 + b);
  const mul = pick([3, 4, 6].filter(m => two.some(x => x % m === 0)));
  return {
    unit: "prob", title: "くじ・カードの確率",
    lead: `袋の中に、赤玉が ${nR}個、白玉が ${nW}個入っている。また、${cards.join("、")} の数字が1つずつ書かれた ${cards.length}枚のカードがある。`,
    items: [
      calc("袋から同時に2個の玉を取り出すとき、2個とも赤玉である確率を求めなさい。", frac(both, tot), `取り出し方は全部で ${tot}通り。赤玉に番号をつけて樹形図などで数えます。`),
      calc("袋から同時に2個の玉を取り出すとき、赤玉と白玉が1個ずつである確率を求めなさい。", frac(diff, tot), ""),
      calc(`カードをよくきって1枚ずつ続けて2枚取り出し、1枚目を十の位、2枚目を一の位として2けたの整数をつくるとき、その数が ${mul} の倍数になる確率を求めなさい。`, frac(two.filter(x => x % mul === 0).length, two.length), `できる2けたの数は ${two.length}通り。`),
      desc("「くじを先に引くか、後に引くかで、当たりやすさは変わらない」ことを、2本の当たりをふくむ5本のくじを A、B の2人が順に1本ずつ引く場合で説明しなさい。", "全部で 5×4＝20通り。A が当たるのは 2×4＝8通りで 8/20＝2/5、B が当たるのも 3×2＋2×1＝8通りで 2/5。どちらも同じ。", "A、B の確率がどちらも 2/5 であることが示せていれば正解。", "")
    ]
  };
}]);

/* ======================= データの活用 ======================= */
const DATA = [];
const quart = arr => {
  const a = arr.slice().sort((x, y) => x - y), n = a.length, med = v => v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2;
  const lower = a.slice(0, Math.floor(n / 2)), upper = a.slice(Math.ceil(n / 2));
  return { min: a[0], q1: med(lower), q2: med(a), q3: med(upper), max: a[n - 1], sorted: a };
};
const boxPlot = (rows, lo, hi, step) => {
  const W = 360, L = 60, R = 340, X = v => L + (R - L) * (v - lo) / (hi - lo);
  let s = "";
  for (let v = lo; v <= hi; v += step) s += line(X(v), 10, X(v), 30 + rows.length * 40, 'stroke="#ddd" stroke-width="0.6"') + `<text x="${X(v)}" y="${46 + rows.length * 40}" text-anchor="middle" font-size="10">${v}</text>`;
  rows.forEach(([name, q], i) => { const y = 30 + i * 40; s += `<text x="8" y="${y + 4}" font-size="12" font-weight="700">${name}</text>${line(X(q.min), y, X(q.q1), y)}${line(X(q.q3), y, X(q.max), y)}<rect x="${X(q.q1)}" y="${y - 10}" width="${X(q.q3) - X(q.q1)}" height="20" fill="#eef3f8" stroke="#222"/>${line(X(q.q2), y - 10, X(q.q2), y + 10, 'stroke-width="2"')}${line(X(q.min), y - 6, X(q.min), y + 6)}${line(X(q.max), y - 6, X(q.max), y + 6)}`; });
  return svg(W, 54 + rows.length * 40, s);
};
DATA.push(["四分位数と箱ひげ図", 2, r => {
  const K = mk(r); const { calc, pick, int, ch, desc } = K;
  const n = pick([9, 10, 11]);
  const data = Array.from({ length: n }, () => int(2, 20));
  const q = quart(data);
  // 3クラスの得点：ちらばりの大きさを変えて、四分位範囲がいちばん大きい組がはっきり決まるようにする
  let cls;
  do {
    const spread = K.shuffle([1, 2, 3]);
    cls = spread.map(sp => { const c = int(4, 6); const d = Array.from({ length: 30 }, () => Math.max(0, Math.min(10, c + int(-sp - 1, sp + 1) + int(-1, 1) * (sp > 1 ? 1 : 0)))); return quart(d); });
  } while (new Set(cls.map(c => c.q3 - c.q1)).size < 3 || new Set(cls.map(c => c.q2)).size < 2);
  const iqr = cls.map(c => c.q3 - c.q1), big = iqr.indexOf(Math.max(...iqr));
  const A = cls[0], B = cls[1];
  const t3 = [`2組で、${B.q2}点以上の生徒は15人以上いる`, true];
  const t4 = [`1組の平均点は${A.q2}点である`, null];
  return {
    unit: "data", title: "四分位数と箱ひげ図",
    lead: `次のデータは、ある班の ${n}人が1か月に読んだ本の冊数を、小さい順に並べたものである。<span class="exp"><span class="st">${q.sorted.join("、")}</span></span>また、図は、ある中学校の2年1組・2組・3組（各30人）の、10点満点の小テストの得点を箱ひげ図に表したものである。`,
    fig: figc(boxPlot(["1組", "2組", "3組"].map((nm, i) => [nm, cls[i]]), 0, 10, 1), "図（小テストの得点［点］）"),
    items: [
      calc("班のデータの中央値（第2四分位数）を求めなさい。", String(q.q2), ""),
      calc("班のデータの第1四分位数と第3四分位数を求めなさい。", `第1四分位数 ${q.q1}、第3四分位数 ${q.q3}`, "データを前半と後半に分け、それぞれの中央値を求めます。"),
      calc("班のデータの四分位範囲を求めなさい。", String(q.q3 - q.q1), "第3四分位数−第1四分位数"),
      ch("図で、四分位範囲がもっとも大きい組を、" + SEL, `${big + 1}組`, ["1組", "2組", "3組", "どの組も同じ"].filter(t => t !== `${big + 1}組`), "箱の横の長さが四分位範囲です。"),
      ch("図から読みとれることとして必ず正しいといえるものを、" + SEL, t3[0], [t4[0], `3組の最高点は${cls[2].max - 1}点である`, `1組の第1四分位数は${A.q1 + 1}点である`], "中央値以上の生徒は、30人の半分の15人以上います。平均値は箱ひげ図からはわかりません。"),
      desc("箱ひげ図で、箱の長さ（四分位範囲）を比べる利点を、範囲と比べて書きなさい。", "四分位範囲は、極端に大きい値や小さい値（外れ値）の影響を受けにくいから。", "「極端な値の影響を受けにくい」で正解。", "")
    ]
  };
}]);

/* ===================================================================== */
register("math2", { name: "中学2年 数学", grade: 2, minutes: 50, units: { expr: "式の計算", eq: "連立方程式", func: "一次関数", geo: "図形の性質と証明", prob: "確率", data: "データの活用（箱ひげ図）" }, defaults: { expr: 1, eq: 2, func: 2, geo: 0, prob: 0, data: 0 } }, ({ add, adv }) => {
  for (const [list, u] of [[EXPR, "expr"], [EQ, "eq"], [FUNC, "func"], [GEO, "geo"], [PROB, "prob"], [DATA, "data"]]) for (const [name, lv, f] of list) (lv === 2 ? adv : add)(u, name, r => fixQ(f(r)));
});
})();
