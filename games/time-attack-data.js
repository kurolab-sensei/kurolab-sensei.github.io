// 一問一答タイムアタックの問題データ。教科書の文章は使わず、計算の自動生成と一般的な知識だけで作っています。
// UNITS: { id, subj, grade, name, gen: [() => {unit, q, ans, opts, ex}] }
(function () {
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
// 袋から1つずつ取り出す：全部出るまで同じものは出ない
function bag(list) { let b = []; return () => { if (!b.length) b = shuffle(list); return b.pop(); }; }
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sgn = n => n < 0 ? "−" + (-n) : String(n);
const par = n => n < 0 ? "(" + sgn(n) + ")" : String(n);
const nz = (lo, hi) => { let v = 0; while (v === 0) v = lo + rnd(hi - lo + 1); return v; };
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const frac = (n, d) => { const g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : n + "/" + d; };
// 多項式の表示: [[係数, "x²"], [係数, "x"], [係数, ""]]
function poly(terms) {
  let s = "";
  for (const [c, v] of terms) {
    if (c === 0) continue;
    const abs = Math.abs(c), body = (abs === 1 && v ? "" : abs) + v;
    s += s ? (c < 0 ? " − " : " ＋ ") + body : (c < 0 ? "−" : "") + body;
  }
  return s || "0";
}
const clean = v => Number.isFinite(v) && Math.abs(v * 100 - Math.round(v * 100)) < 1e-9;

function numQ(unit, q, ans, near, ex, suffix = "") {
  const set = new Set([ans]);
  for (const v of shuffle(near)) { if (set.size >= 4) break; if (clean(v) && v !== ans) set.add(v); }
  let k = 1;
  while (set.size < 4) { const v = ans + (k % 2 ? k : -k) * (Math.abs(ans) >= 50 ? 10 : 1); if (!set.has(v)) set.add(v); k++; }
  const f = v => sgn(Math.round(v * 100) / 100) + suffix;
  return { unit, q, ans: f(ans), opts: shuffle([...set]).map(f), ex };
}
function strQ(unit, q, ans, wrongs, ex) {
  const set = new Set([ans]);
  for (const v of shuffle(wrongs)) { if (set.size >= 4) break; if (v && v !== ans) set.add(v); }
  return { unit, q, ans, opts: shuffle([...set]), ex };
}
// 知識問題: items = [問題, 答え, 解説?, まちがいの選択肢?]
function pool(unit, items, defEx = "") {
  const answers = [...new Set(items.map(x => x[1]))];
  const hasNum = v => /\d/.test(v);
  const next = bag(items);
  return () => {
    const [q, a, ex, w] = next();
    const same = answers.filter(v => hasNum(v) === hasNum(a));
    return strQ(unit, q, a, w && w.length >= 3 ? w : same.length >= 4 ? same : answers, ex || defEx);
  };
}
// 対になった用語: 両方向の問題を作る
function pairs(unit, list, qa, qb, defEx = "") {
  const n1 = bag(list), n2 = bag(list);
  return [
    () => { const [x, y, ex] = n1(); return strQ(unit, qa(x), y, list.filter(p => p[0] !== x).map(p => p[1]), ex || defEx); },
    () => { const [x, y, ex] = n2(); return strQ(unit, qb(y), x, list.filter(p => p[1] !== y).map(p => p[0]), ex || defEx); }
  ];
}

const U = [];
const add = (id, subj, grade, name, gen) => U.push({ id, subj, grade, name, gen: Array.isArray(gen) ? gen : [gen] });

/* ===================== 数学 ===================== */
add("m1-int", "math", 1, "正負の数", [
  () => { const a = nz(-12, 12), b = nz(-12, 12); return numQ("正負の数", par(a) + " ＋ " + par(b) + " ＝ ？", a + b, [a - b, b - a, -(a + b)],
    a * b > 0 ? "同じ符号どうしは、絶対値をたして、その符号をつけます。" : "ちがう符号どうしは、絶対値の大きい方から小さい方をひいて、絶対値が大きい方の符号をつけます。"); },
  () => { const a = nz(-12, 12), b = nz(-12, 12); return numQ("正負の数", par(a) + " − " + par(b) + " ＝ ？", a - b, [a + b, b - a, -a - b],
    "ひく数の符号を変えて、たし算にします。" + par(a) + " ＋ " + par(-b) + " ＝ " + sgn(a - b)); },
  () => { const a = nz(-9, 9), b = nz(-9, 9); return numQ("正負の数", par(a) + " × " + par(b) + " ＝ ？", a * b, [-a * b, a + b, a * b + 1],
    "同じ符号なら＋、ちがう符号なら−。" + Math.abs(a) + "×" + Math.abs(b) + "＝" + Math.abs(a * b)); },
  () => { const b = nz(-9, 9), q = nz(-9, 9), a = b * q; return numQ("正負の数", par(a) + " ÷ " + par(b) + " ＝ ？", q, [-q, a * b, q + 1],
    "わり算も、同じ符号なら＋、ちがう符号なら−。" + Math.abs(a) + "÷" + Math.abs(b) + "＝" + Math.abs(q)); },
  () => { const a = 2 + rnd(6), s = pick([-1, 1]); return numQ("累乗", (s < 0 ? "−" : "") + a + "² ＝ ？", s * a * a, [-s * a * a, s * 2 * a, s * (a * a + a)],
    s < 0 ? "−" + a + "² は −(" + a + "×" + a + ")。−は計算のあとにつけます。" : a + "² ＝ " + a + "×" + a + "（" + a + "×2 ではありません）"); },
  () => { const a = 2 + rnd(4); return numQ("累乗", "(−" + a + ")² ＝ ？", a * a, [-a * a, -2 * a, 2 * a], "(−" + a + ")² ＝ (−" + a + ")×(−" + a + ") ＝ " + a * a + "。かっこごと2回かけます。"); },
  () => { const a = nz(-9, 9), b = nz(-6, 6), c = nz(-6, 6); return numQ("四則の混じった計算", par(a) + " ＋ " + par(b) + " × " + par(c) + " ＝ ？", a + b * c, [(a + b) * c, a - b * c, a + b + c],
    "かけ算を先に計算します。" + par(b) + "×" + par(c) + "＝" + sgn(b * c) + "、" + par(a) + "＋" + par(b * c) + "＝" + sgn(a + b * c)); },
]);
add("m1-expr", "math", 1, "文字と式", [
  () => { const a = 1 + rnd(9), b = 1 + rnd(9); return strQ("文字式", a + "x ＋ " + b + "x ＝ ？", (a + b) + "x", [(a * b) + "x", (a + b) + "x²", String(a + b), Math.abs(a - b) + "x"],
    "x の係数どうしをたします。" + a + "＋" + b + "＝" + (a + b) + "。x² にはなりません。"); },
  () => { const a = 2 + rnd(7), b = nz(-9, 9); return strQ("文字式", a + "(x ＋ " + par(b) + ") を計算すると？", poly([[a, "x"], [a * b, ""]]),
    [poly([[a, "x"], [b, ""]]), poly([[1, "x"], [a * b, ""]]), poly([[a, "x"], [-a * b, ""]]), poly([[a, "x"], [a + b, ""]])], "分配法則：" + a + "×x と " + a + "×" + par(b) + " の両方にかけます。"); },
  () => { const a = nz(-6, 6), b = nz(-9, 9), x = nz(-5, 5); return numQ("式の値", "x ＝ " + sgn(x) + " のとき、" + poly([[a, "x"], [b, ""]]) + " の値は？", a * x + b, [-a * x + b, a + x + b, a * x - b],
    "x に " + par(x) + " を入れます。" + a + "×" + par(x) + (b < 0 ? " − " + (-b) : " ＋ " + b) + " ＝ " + sgn(a * x + b)); },
  () => { const a = 2 + rnd(5), b = 2 + rnd(5), p = 50 + 10 * rnd(10); return strQ("文字式", "1個 " + p + "円のりんごを x 個と、" + a * 100 + "円のメロンを1個買った代金は？", (p + "x ＋ " + a * 100) + "円",
    [(p + a * 100) + "x円", (p * a) + "x円", (p + "x × " + a * 100) + "円"], "りんごの代金 " + p + "×x と、メロンの代金をたします。"); },
]);
add("m1-eq", "math", 1, "一次方程式", [
  () => { const a = 2 + rnd(8), b = nz(-9, 9), x = nz(-6, 6), c = a * x + b; return numQ("一次方程式", poly([[a, "x"], [b, ""]]) + " ＝ " + sgn(c) + "　x ＝ ？", x, [-x, x + 1, (c + b) / a],
    (b > 0 ? "＋" : "−") + Math.abs(b) + " を移項すると " + a + "x ＝ " + sgn(c - b) + "。両辺を " + a + " でわって x ＝ " + sgn(x)); },
  () => { let a, c; do { a = nz(-6, 9); c = nz(-6, 9); } while (a === c); const x = nz(-6, 6), b = nz(-9, 9), d = (a - c) * x + b;
    return numQ("一次方程式", poly([[a, "x"], [b, ""]]) + " ＝ " + poly([[c, "x"], [d, ""]]) + "　x ＝ ？", x, [-x, x + 1, x - 1, (d + b) / (a - c)],
    "x の項を左、数を右に移項：" + poly([[a - c, "x"]]) + " ＝ " + sgn(d - b) + "。x ＝ " + sgn(x)); },
  () => { const a = 2 + rnd(5), x = nz(-6, 6); return numQ("一次方程式", "x/" + a + " ＝ " + sgn(x) + "　x ＝ ？", a * x, [x, x / a, a + x], "両辺に " + a + " をかけて x ＝ " + sgn(a * x)); },
  () => { const a = 2 + rnd(4), k = 2 + rnd(4), x = 3 + rnd(8); return numQ("比例式", "x : " + a * k + " ＝ " + x + " : " + a + "　x ＝ ？", x * k, [x * a, a * k * a / x, x + k],
    "外側の積＝内側の積。x×" + a + " ＝ " + a * k + "×" + x + " なので x ＝ " + x * k); },
]);
add("m1-func", "math", 1, "比例と反比例", [
  () => { const x = nz(-5, 5), k = nz(-6, 6); return numQ("比例", "y は x に比例し、x ＝ " + sgn(x) + " のとき y ＝ " + sgn(k * x) + "。比例定数は？", k, [k * x, x, -k],
    "y ＝ ax の a が比例定数。a ＝ y÷x ＝ " + sgn(k * x) + "÷" + par(x) + " ＝ " + sgn(k)); },
  () => { const k = pick([6, 12, 18, 24, 36]), x = pick([2, 3, 6].filter(v => k % v === 0)), x2 = pick([1, 2, 3, 4, 6].filter(v => k % v === 0 && v !== x));
    return numQ("反比例", "y は x に反比例し、x ＝ " + x + " のとき y ＝ " + k / x + "。x ＝ " + x2 + " のとき y は？", k / x2, [k / x * x2, k, x2 * x],
    "反比例は xy ＝ 一定。" + x + "×" + k / x + " ＝ " + k + " なので y ＝ " + k + "÷" + x2 + " ＝ " + k / x2); },
  () => { const k = nz(-5, 5), x = nz(-6, 6); return numQ("比例", "y ＝ " + poly([[k, "x"]]) + " で、x ＝ " + sgn(x) + " のとき y は？", k * x, [-k * x, k + x, k * x + 1], k + "×" + par(x) + " ＝ " + sgn(k * x)); },
  pool("座標", [["点(3, −2) はどの象限にある？", "第4象限", "x が＋、y が−なので右下の第4象限です。", ["第1象限", "第2象限", "第3象限"]],
    ["点(−4, 5) はどの象限にある？", "第2象限", "x が−、y が＋なので左上の第2象限です。", ["第1象限", "第3象限", "第4象限"]],
    ["点(−1, −6) はどの象限にある？", "第3象限", "x も y も−なので左下の第3象限です。", ["第1象限", "第2象限", "第4象限"]],
    ["反比例のグラフの形は？", "双曲線", "反比例のグラフは、2つの曲線が組になった双曲線です。", ["原点を通る直線", "放物線", "円"]],
    ["比例のグラフは、必ずどこを通る？", "原点", "y ＝ ax は x ＝ 0 のとき y ＝ 0 なので、原点を通ります。", ["(1, 1)", "y軸上の点(0, 1)", "どこも通らない"]]]),
]);
add("m1-geo", "math", 1, "平面図形・空間図形", [
  () => { const [r, t] = pick([[6, 60], [3, 120], [9, 40], [6, 90], [4, 90], [12, 30], [10, 36], [6, 120], [9, 120], [8, 45]]); const c = r * t / 180;
    return strQ("おうぎ形", "半径 " + r + "cm、中心角 " + t + "° のおうぎ形の弧の長さは？", c + "π cm", [2 * c + "π cm", r * c + "π cm", c / 2 + "π cm", (c + 1) + "π cm"],
    "弧の長さ ＝ 2π×半径×(中心角/360)。2π×" + r + "×" + t + "/360 ＝ " + c + "π"); },
  () => { const [r, t] = pick([[6, 60], [3, 120], [6, 120], [4, 90], [12, 30], [6, 90], [10, 36], [8, 45]]); const s = r * r * t / 360;
    return strQ("おうぎ形", "半径 " + r + "cm、中心角 " + t + "° のおうぎ形の面積は？", s + "π cm²", [2 * s + "π cm²", r * t / 180 + "π cm²", r * r + "π cm²", (s + 2) + "π cm²"],
    "面積 ＝ π×半径²×(中心角/360)。π×" + r * r + "×" + t + "/360 ＝ " + s + "π"); },
  () => { const r = 1 + rnd(5), h = 2 + rnd(8); return strQ("立体の体積", "底面の半径 " + r + "cm、高さ " + h + "cm の円柱の体積は？", r * r * h + "π cm³", [2 * r * h + "π cm³", r * h + "π cm³", r * r * h * 2 + "π cm³", (r * r * h + h) + "π cm³", (r * r + h) + "π cm³"].concat(r * r * h % 3 === 0 ? [r * r * h / 3 + "π cm³"] : []),
    "円柱の体積 ＝ 底面積×高さ ＝ π×" + r + "²×" + h + " ＝ " + r * r * h + "π"); },
  () => { const r = pick([3, 6]), h = pick([2, 4, 5, 7]); return strQ("立体の体積", "底面の半径 " + r + "cm、高さ " + h + "cm の円錐の体積は？", r * r * h / 3 + "π cm³", [r * r * h + "π cm³", r * h + "π cm³", 2 * r * r * h / 3 + "π cm³"],
    "錐の体積は 1/3×底面積×高さ。1/3×π×" + r * r + "×" + h + " ＝ " + r * r * h / 3 + "π"); },
  () => { const a = 2 + rnd(6), h = pick([3, 6, 9]); return numQ("立体の体積", "底面が1辺 " + a + "cm の正方形、高さ " + h + "cm の正四角錐の体積は？", a * a * h / 3, [a * a * h, a * h, a * a * h / 2], "1/3×" + a + "×" + a + "×" + h + " ＝ " + a * a * h / 3, " cm³"); },
  pool("図形の用語", [["円周上の2点を結ぶ線分を何という？", "弦"], ["円と1点だけで交わる直線を何という？", "接線"], ["円の接線と、接点を通る半径がつくる角は何度？", "90°", "接線は、接点を通る半径に垂直です。", ["45°", "60°", "180°"]],
    ["球の表面積を求める式は？（半径 r）", "4πr²", "球の表面積は 4πr²、体積は 4/3πr³ です。", ["πr²", "2πr²", "4/3πr³"]], ["球の体積を求める式は？（半径 r）", "4/3πr³", "「身の上に心配あるので参上（3分の4πr³）」と覚える方法もあります。", ["4πr²", "πr³", "1/3πr³"]],
    ["平面の上で、図形を一定の方向に一定の距離だけずらす移動は？", "平行移動"], ["図形をある点を中心に回す移動は？", "回転移動"], ["図形をある直線を折り目として折り返す移動は？", "対称移動"],
    ["面が三角形4つでできた立体は？", "正四面体", "正四面体は、正三角形4つでできています。", ["三角柱", "四角錐", "正六面体"]], ["正多面体は全部で何種類？", "5種類", "正四面体・正六面体・正八面体・正十二面体・正二十面体の5種類です。", ["3種類", "4種類", "6種類"]]]),
]);
add("m2-poly", "math", 2, "式の計算", [
  () => { const a = 2 + rnd(5), b = 2 + rnd(5); return strQ("単項式の乗法", a + "x × " + b + "y ＝ ？", a * b + "xy", [(a + b) + "xy", a * b + "x", a * b + "x²y", (a + b) + "x＋y"], "係数どうし、文字どうしをかけます。" + a + "×" + b + "＝" + a * b); },
  () => { const a = 2 + rnd(4), b = 2 + rnd(4); return strQ("単項式の除法", a * b + "xy ÷ " + a + "x ＝ ？", b + "y", [b + "xy", a * b - a + "y", b + "x", a * b * a + "x²y"], "係数どうし、文字どうしをわります。" + a * b + "÷" + a + "＝" + b + "、xy÷x＝y"); },
  () => { const a = nz(1, 6), b = nz(-6, 6), c = nz(-5, 5), d = nz(-6, 6);
    return strQ("多項式の計算", "(" + poly([[a, "x"], [b, "y"]]) + ") − (" + poly([[c, "x"], [d, "y"]]) + ") ＝ ？", poly([[a - c, "x"], [b - d, "y"]]),
    [poly([[a + c, "x"], [b + d, "y"]]), poly([[a - c, "x"], [b + d, "y"]]), poly([[a + c, "x"], [b - d, "y"]]), poly([[a - c, "x"], [d - b, "y"]])],
    "ひく式のかっこを外すと、符号がすべて変わります。"); },
  () => { const a = 2 + rnd(4); return strQ("等式の変形", a + "x ＋ y ＝ 12 を y について解くと？", "y ＝ 12 − " + a + "x", ["y ＝ 12 ＋ " + a + "x", "y ＝ " + a + "x − 12", "y ＝ (12 − y)/" + a], a + "x を右辺に移項します。"); },
  () => { const x = nz(-4, 4), y = nz(-4, 4), a = nz(-4, 4), b = nz(-4, 4); return numQ("式の値", "x ＝ " + sgn(x) + "、y ＝ " + sgn(y) + " のとき、" + poly([[a, "x"], [b, "y"]]) + " の値は？", a * x + b * y, [a * x - b * y, a * y + b * x, -(a * x + b * y)],
    a + "×" + par(x) + " ＋ " + b + "×" + par(y) + " ＝ " + sgn(a * x + b * y)); },
]);
add("m2-sys", "math", 2, "連立方程式", [
  () => { const x = nz(-6, 8), y = nz(-6, 8); return strQ("連立方程式", "x ＋ y ＝ " + sgn(x + y) + "、x − y ＝ " + sgn(x - y) + "　の解は？", "x＝" + sgn(x) + ", y＝" + sgn(y),
    ["x＝" + sgn(y) + ", y＝" + sgn(x), "x＝" + sgn(x + 1) + ", y＝" + sgn(y - 1), "x＝" + sgn(-x) + ", y＝" + sgn(-y), "x＝" + sgn(x) + ", y＝" + sgn(-y)],
    "2つの式をたすと 2x ＝ " + sgn(2 * x) + " で x ＝ " + sgn(x) + "。代入して y ＝ " + sgn(y)); },
  () => { const x = nz(-5, 6), y = nz(-5, 6), a = 2 + rnd(3), b = nz(-4, 4); return strQ("連立方程式", "y ＝ " + poly([[a, "x"], [y - a * x, ""]]) + "、" + poly([[1, "x"], [b, "y"]]) + " ＝ " + sgn(x + b * y) + "　の解は？", "x＝" + sgn(x) + ", y＝" + sgn(y),
    ["x＝" + sgn(y) + ", y＝" + sgn(x), "x＝" + sgn(x - 1) + ", y＝" + sgn(y + a), "x＝" + sgn(-x) + ", y＝" + sgn(y), "x＝" + sgn(x + 1) + ", y＝" + sgn(y + a)],
    "上の式を下の式に代入（代入法）すると x ＝ " + sgn(x) + "、y ＝ " + sgn(y)); },
  () => { const p = pick([80, 100, 120, 150]), q = pick([50, 60, 70]), x = 2 + rnd(5), y = 2 + rnd(5);
    return numQ("連立方程式の利用", "1個 " + p + "円のパンと " + q + "円のおにぎりを合わせて " + (x + y) + "個買い、" + (p * x + q * y) + "円でした。パンは何個？", x, [y, x + 1, x - 1],
    "パン x 個、おにぎり y 個として、x＋y＝" + (x + y) + "、" + p + "x＋" + q + "y＝" + (p * x + q * y) + " を解きます。", "個"); },
]);
add("m2-lin", "math", 2, "一次関数", [
  () => { const a = nz(-5, 5), b = nz(-8, 8), x1 = nz(-4, 2), x2 = x1 + 1 + rnd(4); return numQ("一次関数", "2点 (" + sgn(x1) + ", " + sgn(a * x1 + b) + ")、(" + sgn(x2) + ", " + sgn(a * x2 + b) + ") を通る直線の傾きは？", a, [-a, b, (x2 - x1) / (a || 1)],
    "傾き ＝ y の増加量 ÷ x の増加量 ＝ " + sgn(a * (x2 - x1)) + "÷" + (x2 - x1) + " ＝ " + sgn(a)); },
  () => { const a = nz(-5, 5), b = nz(-8, 8); return numQ("一次関数", "y ＝ " + poly([[a, "x"], [b, ""]]) + " の切片は？", b, [a, -b, a + b], "y ＝ ax ＋ b の b が切片。グラフが y 軸と交わる点の y 座標です。"); },
  () => { const a = nz(-5, 5), b = nz(-8, 8), d = 2 + rnd(5); return numQ("一次関数", "y ＝ " + poly([[a, "x"], [b, ""]]) + " で、x が " + d + " 増えると y はいくつ増える？", a * d, [a, a + d, b * d],
    "一次関数の変化の割合は一定で、傾きと同じ。y の増加量 ＝ " + a + "×" + d + " ＝ " + sgn(a * d)); },
  () => { const a = nz(-4, 4), b = nz(-6, 6), x = nz(-3, 3); return strQ("一次関数", "傾き " + sgn(a) + "、点 (" + sgn(x) + ", " + sgn(a * x + b) + ") を通る直線の式は？", "y ＝ " + poly([[a, "x"], [b, ""]]),
    ["y ＝ " + poly([[a, "x"], [-b, ""]]), "y ＝ " + poly([[a, "x"], [a * x + b, ""]]), "y ＝ " + poly([[b, "x"], [a, ""]]), "y ＝ " + poly([[-a, "x"], [b, ""]])], "y ＝ " + a + "x ＋ b に点の座標を代入して b ＝ " + sgn(b)); },
]);
add("m2-angle", "math", 2, "図形と角・合同", [
  () => { const n = pick([5, 6, 7, 8, 9, 10, 12]); return numQ("多角形の角", n + "角形の内角の和は何度？", 180 * (n - 2), [180 * n, 180 * (n - 1), 360], "n角形の内角の和は 180°×(n−2)。180×" + (n - 2) + "＝" + 180 * (n - 2) + "°", "°"); },
  () => { const n = pick([3, 4, 5, 6, 8, 9, 10, 12, 15, 18]); return numQ("多角形の角", "正" + n + "角形の1つの外角は何度？", 360 / n, [180 - 360 / n, 180 * (n - 2), 360 / n * 2], "多角形の外角の和はいつも 360°。360÷" + n + "＝" + 360 / n + "°", "°"); },
  () => { const n = pick([5, 6, 8, 9, 10, 12]); return numQ("多角形の角", "正" + n + "角形の1つの内角は何度？", 180 - 360 / n, [360 / n, 180 * (n - 2), 180 - 360 / n + 10], "1つの外角は 360÷" + n + "＝" + 360 / n + "°、内角は 180−" + 360 / n + "＝" + (180 - 360 / n) + "°", "°"); },
  () => { const a = 30 + 5 * rnd(12), b = 20 + 5 * rnd(10); return numQ("三角形の角", "三角形の2つの内角が " + a + "° と " + b + "° のとき、残りの角の外角は何度？", a + b, [180 - a - b, 180 - a, 360 - a - b], "三角形の外角は、となりにない2つの内角の和。" + a + "＋" + b + "＝" + (a + b) + "°", "°"); },
  pool("合同・証明", [["三角形の合同条件で「3組の辺がそれぞれ等しい」ほかに何がある？（1つ選ぶ）", "2組の辺とその間の角", "合同条件は、3辺／2辺とその間の角／1辺とその両端の角の3つです。", ["2組の角", "1組の辺と1つの角", "3組の角"]],
    ["平行線の錯角はどうなる？", "等しい", "平行線では、同位角も錯角も等しくなります。", ["和が180°", "和が90°", "2倍になる"]], ["対頂角はどうなる？", "等しい", "交わる2直線の向かい合う角（対頂角）は等しいです。", ["和が180°", "和が90°", "決まらない"]],
    ["二等辺三角形の底角はどうなる？", "等しい", "二等辺三角形の2つの底角は等しいです。", ["和が90°", "頂角と等しい", "決まらない"]], ["平行四辺形の対角線はどうなる？", "それぞれの中点で交わる", "平行四辺形の対角線は、それぞれの中点で交わります。", ["長さが等しい", "垂直に交わる", "交わらない"]],
    ["長方形の対角線の特徴は？", "長さが等しい", "長方形は平行四辺形の性質に加えて、対角線の長さが等しくなります。", ["垂直に交わる", "長さがちがう", "交わらない"]], ["ひし形の対角線の特徴は？", "垂直に交わる", "ひし形の対角線は、垂直に交わります。", ["長さが等しい", "平行になる", "交わらない"]],
    ["「仮定」と「結論」で、証明でみちびくのは？", "結論", "仮定から出発して、結論をみちびきます。", ["仮定", "定義", "逆"]], ["直角三角形の合同条件「斜辺と1つの鋭角」のほかは？", "斜辺と他の1辺", "直角三角形では、斜辺と1鋭角／斜辺と他の1辺 がそれぞれ等しければ合同です。", ["2つの鋭角", "直角と1辺", "3つの角"]]]),
]);
add("m2-prob", "math", 2, "確率", [
  () => { const s = 2 + rnd(11); let c = 0; for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) if (i + j === s) c++;
    return strQ("確率", "さいころを2回投げて、出た目の和が " + s + " になる確率は？", frac(c, 36), [frac(c + 1, 36), frac(1, 6), frac(1, 36), frac(c, 12), frac(Math.max(1, c - 1), 36), frac(1, 12)].filter(v => v !== frac(c, 36)),
    "目の出方は全部で 6×6＝36 通り。和が " + s + " になるのは " + c + " 通りなので " + c + "/36" + (frac(c, 36) !== c + "/36" ? "＝" + frac(c, 36) : "")); },
  () => { const n = 1 + rnd(6); return strQ("確率", "さいころを1回投げて、" + n + " 以下の目が出る確率は？", frac(n, 6), [frac(Math.min(6, n + 1), 6), frac(1, 6), frac(Math.max(1, n - 1), 6), frac(n, 12), "1/2", "1"].filter(v => v !== frac(n, 6)),
    n + " 以下の目は " + n + " 通り、全部で6通りなので " + n + "/6"); },
  () => { const k = pick([[2, "2枚とも表"], [2, "1枚が表で1枚が裏"], [3, "3枚とも表"], [3, "少なくとも1枚は表"]]); const [c, t] = k;
    const ans = c === 2 ? (t === "2枚とも表" ? "1/4" : "1/2") : (t === "3枚とも表" ? "1/8" : "7/8");
    return strQ("確率", "硬貨を " + c + " 枚投げて、" + t + "になる確率は？", ans, ["1/2", "1/3", "1/4", "1/8", "3/4", "7/8", "3/8"].filter(v => v !== ans),
    "表裏の出方は全部で " + (c === 2 ? "4" : "8") + " 通り。" + (t === "少なくとも1枚は表" ? "「3枚とも裏」以外なので 1−1/8＝7/8" : "樹形図で数えます。")); },
  () => { const r = 2 + rnd(4), w = 1 + rnd(4); return strQ("確率", "赤玉 " + r + " 個、白玉 " + w + " 個の袋から1個取り出すとき、赤玉が出る確率は？", frac(r, r + w), [frac(w, r + w), frac(r, w), frac(1, r + w), frac(r + 1, r + w + 1)].filter(v => v !== frac(r, r + w)),
    "全部で " + (r + w) + " 個のうち赤は " + r + " 個なので " + r + "/" + (r + w)); },
  pool("データの活用", [["データを小さい順に並べたとき、真ん中の値を何という？", "中央値", "中央値（メジアン）は、並べたときの真ん中の値です。", ["最頻値", "平均値", "範囲"]], ["データの中で、いちばん多く出てくる値を何という？", "最頻値", "最頻値（モード）は、いちばん多く出てくる値です。", ["中央値", "平均値", "範囲"]],
    ["最大値 − 最小値 を何という？", "範囲", "範囲（レンジ）＝最大値−最小値。", ["四分位範囲", "階級", "度数"]], ["第3四分位数 − 第1四分位数 を何という？", "四分位範囲", "四分位範囲は、データの真ん中約半分の散らばりを表します。", ["範囲", "中央値", "平均値"]],
    ["データの分布を、最小値・四分位数・最大値で表した図は？", "箱ひげ図", "箱ひげ図は、5つの値で分布のようすを表します。", ["ヒストグラム", "度数折れ線", "円グラフ"]]]),
]);
add("m3-exp", "math", 3, "展開と因数分解", [
  () => { const a = nz(-7, 7), b = nz(-7, 7); return strQ("展開", "(x " + (a < 0 ? "− " + -a : "＋ " + a) + ")(x " + (b < 0 ? "− " + -b : "＋ " + b) + ") を展開すると？", poly([[1, "x²"], [a + b, "x"], [a * b, ""]]),
    [poly([[1, "x²"], [a * b, "x"], [a + b, ""]]), poly([[1, "x²"], [a + b, "x"], [-a * b, ""]]), poly([[1, "x²"], [-(a + b), "x"], [a * b, ""]]), poly([[1, "x²"], [a * b, ""]])],
    "(x＋a)(x＋b) ＝ x² ＋ (a＋b)x ＋ ab。a＋b＝" + sgn(a + b) + "、ab＝" + sgn(a * b)); },
  () => { const a = nz(-8, 8); return strQ("展開", "(x " + (a < 0 ? "− " + -a : "＋ " + a) + ")² を展開すると？", poly([[1, "x²"], [2 * a, "x"], [a * a, ""]]),
    [poly([[1, "x²"], [a * a, ""]]), poly([[1, "x²"], [a, "x"], [a * a, ""]]), poly([[1, "x²"], [2 * a, "x"], [2 * a, ""]]), poly([[1, "x²"], [-2 * a, "x"], [a * a, ""]])],
    "(x＋a)² ＝ x² ＋ 2ax ＋ a²。真ん中の項 2ax を忘れないように。"); },
  () => { const a = 1 + rnd(9); return strQ("展開", "(x ＋ " + a + ")(x − " + a + ") を展開すると？", poly([[1, "x²"], [-a * a, ""]]), [poly([[1, "x²"], [a * a, ""]]), poly([[1, "x²"], [-2 * a, "x"], [-a * a, ""]]), poly([[1, "x²"], [-2 * a, ""]])], "(x＋a)(x−a) ＝ x² − a²（和と差の積）"); },
  () => { let a, b; do { a = nz(-7, 7); b = nz(-7, 7); } while (a === b);
    const f = (p, q) => "(x " + (p < 0 ? "− " + -p : "＋ " + p) + ")(x " + (q < 0 ? "− " + -q : "＋ " + q) + ")";
    return strQ("因数分解", poly([[1, "x²"], [a + b, "x"], [a * b, ""]]) + " を因数分解すると？", f(Math.min(a, b), Math.max(a, b)), [f(-Math.max(a, b), -Math.min(a, b)), f(Math.min(a, b), -Math.max(a, b)), f(-Math.min(a, b), Math.max(a, b)), f(a + b, 1)].filter(v => v !== f(Math.min(a, b), Math.max(a, b))),
    "たして " + sgn(a + b) + "、かけて " + sgn(a * b) + " になる2数は " + sgn(a) + " と " + sgn(b)); },
  () => { const a = 2 + rnd(8); return strQ("因数分解", "x² − " + a * a + " を因数分解すると？", "(x ＋ " + a + ")(x − " + a + ")", ["(x − " + a + ")²", "(x ＋ " + a + ")²", "(x − " + a * a + ")(x ＋ 1)"], "a² − b² ＝ (a＋b)(a−b)。" + a * a + " ＝ " + a + "²"); },
]);
add("m3-root", "math", 3, "平方根", [
  () => { const n = 2 + rnd(14); return numQ("平方根", "√" + n * n + " ＝ ？", n, [n * 2, n + 1, n - 1, n * n / 2], n + "×" + n + "＝" + n * n + " なので √" + n * n + "＝" + n); },
  () => { const k = 2 + rnd(4), m = pick([2, 3, 5, 6, 7]); return strQ("平方根", "√" + k * k * m + " を a√b の形にすると？", k + "√" + m, [m + "√" + k, k * k + "√" + m, k + "√" + k * m, (k + 1) + "√" + m], k * k * m + " ＝ " + k + "²×" + m + " なので " + k + "√" + m); },
  () => { const m = pick([2, 3, 5, 6, 7]), a = 1 + rnd(5), b = 1 + rnd(5); return strQ("平方根", a + "√" + m + " ＋ " + b + "√" + m + " ＝ ？", (a + b) + "√" + m, [(a + b) + "√" + 2 * m, (a * b) + "√" + m, "√" + (a + b) * m, (a + b) * m + ""], "√" + m + " を文字のように考えて、係数どうしをたします。"); },
  () => { const a = pick([2, 3, 5, 6, 7]), b = pick([2, 3, 5, 7].filter(v => v !== a)); return strQ("平方根", "√" + a + " × √" + b + " ＝ ？", "√" + a * b, ["√" + (a + b), a * b + "", a + "√" + b], "√a×√b ＝ √(ab)"); },
  () => { const n = pick([2, 3, 5, 6, 7, 10, 11, 13, 15, 17, 20]); const lo = Math.floor(Math.sqrt(n)); return strQ("平方根", "√" + n + " は、どの整数の間にある？", lo + " と " + (lo + 1), [(lo - 1) + " と " + lo, (lo + 1) + " と " + (lo + 2), (lo + 2) + " と " + (lo + 3)].filter(v => !v.startsWith("0 と") || lo !== 1),
    lo + "²＝" + lo * lo + "、" + (lo + 1) + "²＝" + (lo + 1) * (lo + 1) + " なので、√" + n + " は " + lo + " と " + (lo + 1) + " の間"); },
  pool("平方根の用語", [["9 の平方根は？", "±3", "平方根は正と負の2つ。2乗して9になる数は 3 と −3 です。", ["3", "−3", "81"]], ["16 の平方根は？", "±4", "2乗して16になる数は 4 と −4。", ["4", "8", "256"]],
    ["√(−3)² ＝ ？", "3", "(−3)²＝9、√9＝3。√の中身が2乗のときは正の数になります。", ["−3", "±3", "9"]], ["分母に√をふくまない形にすることを何という？", "分母の有理化", "1/√2 ＝ √2/2 のように直すことを有理化といいます。", ["約分", "通分", "因数分解"]],
    ["1/√2 を有理化すると？", "√2/2", "分母と分子に √2 をかけます。", ["2/√2", "√2", "1/2"]]]),
]);
add("m3-quad", "math", 3, "二次方程式", [
  () => { let a, b; do { a = nz(-7, 7); b = nz(-7, 7); } while (a === b || a === -b); const r1 = Math.min(-a, -b), r2 = Math.max(-a, -b);
    return strQ("二次方程式", poly([[1, "x²"], [a + b, "x"], [a * b, ""]]) + " ＝ 0 の解は？", "x＝" + sgn(r1) + ", " + sgn(r2), ["x＝" + sgn(-r2) + ", " + sgn(-r1), "x＝" + sgn(r1) + ", " + sgn(-r2), "x＝" + sgn(a) + ", " + sgn(b * -1 === r2 ? b : -b)].filter(v => v !== "x＝" + sgn(r1) + ", " + sgn(r2)),
    "因数分解すると (x " + (a < 0 ? "− " + -a : "＋ " + a) + ")(x " + (b < 0 ? "− " + -b : "＋ " + b) + ") ＝ 0。かっこの中が0になる x を求めます。"); },
  () => { const a = 2 + rnd(8); return strQ("二次方程式", "x² ＝ " + a * a + " の解は？", "x＝±" + a, ["x＝" + a, "x＝" + a * a, "x＝±" + a * a, "x＝" + a / 2], "2乗して " + a * a + " になる数は ±" + a + "。マイナスを忘れずに。"); },
  () => { const r = 1 + rnd(9); return strQ("二次方程式", "x² − " + r + "x ＝ 0 の解は？", "x＝0, " + r, ["x＝" + r, "x＝0, " + -r, "x＝±" + r, "x＝1, " + r], "x(x − " + r + ") ＝ 0 なので x ＝ 0 または " + r + "。x でわると x＝0 が消えてしまいます。"); },
  pool("解の公式", [["ax² ＋ bx ＋ c ＝ 0 の解の公式は？", "x ＝ (−b ± √(b²−4ac)) / 2a", "そのまま覚えましょう。√ の中は b² − 4ac です。", ["x ＝ (b ± √(b²−4ac)) / 2a", "x ＝ (−b ± √(b²＋4ac)) / 2a", "x ＝ (−b ± √(b²−4ac)) / a"]]]),
]);
add("m3-func", "math", 3, "関数 y＝ax²", [
  () => { const a = nz(-3, 3), x = nz(-5, 5); return numQ("関数 y＝ax²", "y ＝ " + poly([[a, "x²"]]) + " で、x ＝ " + sgn(x) + " のときの y は？", a * x * x, [-a * x * x, a * x * 2, a * x], a + "×" + par(x) + "² ＝ " + a + "×" + x * x + " ＝ " + sgn(a * x * x)); },
  () => { const a = nz(-3, 3), p = nz(-4, 3), q = p + 1 + rnd(4); return numQ("関数 y＝ax²", "y ＝ " + poly([[a, "x²"]]) + " で、x が " + sgn(p) + " から " + sgn(q) + " まで増えるときの変化の割合は？", a * (p + q), [a * (q - p), a * p * q, a * q * q - a * p * p],
    "y＝ax² の変化の割合 ＝ a×(はじめの x ＋ おわりの x) ＝ " + a + "×(" + sgn(p) + "＋" + sgn(q) + ") ＝ " + sgn(a * (p + q))); },
  () => { const a = nz(-3, 3), x = nz(-4, 4); return numQ("関数 y＝ax²", "y ＝ ax² のグラフが点 (" + sgn(x) + ", " + sgn(a * x * x) + ") を通る。a は？", a, [-a, a * x, a * x * x], "y ＝ ax² に代入して " + sgn(a * x * x) + " ＝ a×" + x * x + "。a ＝ " + sgn(a)); },
  pool("y＝ax²のグラフ", [["y＝ax² のグラフの形を何という？", "放物線", "y＝ax² のグラフは、原点を頂点とする放物線です。", ["双曲線", "直線", "円"]], ["y＝ax² で a ＜ 0 のとき、グラフはどうなる？", "下に開く", "a が負のとき、グラフは下に開いた形になります。", ["上に開く", "右上がりの直線", "x 軸と重なる"]],
    ["y＝2x² と y＝−2x² のグラフの関係は？", "x 軸について対称", "a の符号だけがちがうグラフは、x 軸について対称です。", ["y 軸について対称", "原点について対称", "重なる"]], ["ボールが落ちる距離は、落ち始めてからの時間の何に比例する？", "2乗", "落下距離は時間の2乗に比例します（y＝ax²）。", ["1乗", "3乗", "平方根"]]]),
]);
add("m3-geo", "math", 3, "相似・円・三平方の定理", [
  () => { const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25], [9, 12, 15], [12, 16, 20], [20, 21, 29]]);
    return numQ("三平方の定理", "直角をはさむ2辺が " + a + "cm と " + b + "cm の直角三角形。斜辺は何cm？", c, [a + b, c + 1, c - 1, b + 1], a + "² ＋ " + b + "² ＝ " + (a * a + b * b) + " ＝ " + c + "²", "cm"); },
  () => { const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15]]);
    return numQ("三平方の定理", "斜辺が " + c + "cm、1辺が " + a + "cm の直角三角形。残りの辺は何cm？", b, [c - a, c + a, b + 1, b - 1], c + "² − " + a + "² ＝ " + (c * c - a * a) + " ＝ " + b + "²", "cm"); },
  () => { const a = 1 + rnd(9); return strQ("三平方の定理", "1辺 " + a + "cm の正方形の対角線の長さは？", (a === 1 ? "" : a) + "√2 cm", [(a === 1 ? "" : a) + "√3 cm", 2 * a + " cm", a * 2 + "√2 cm", a + " cm"], "直角二等辺三角形の辺の比は 1 : 1 : √2"); },
  () => { const k = 2 + rnd(3), m = k + 1 + rnd(2); return strQ("相似", "相似比が " + k + " : " + m + " の2つの図形の面積比は？", k * k + " : " + m * m, [k + " : " + m, k ** 3 + " : " + m ** 3, 2 * k + " : " + 2 * m], "面積比は相似比の2乗。" + k + "² : " + m + "² ＝ " + k * k + " : " + m * m); },
  () => { const k = 1 + rnd(3), m = k + 1 + rnd(2); return strQ("相似", "相似比が " + k + " : " + m + " の2つの立体の体積比は？", k ** 3 + " : " + m ** 3, [k + " : " + m, k * k + " : " + m * m, 3 * k + " : " + 3 * m], "体積比は相似比の3乗。"); },
  () => { const c = 30 + 5 * rnd(20); return numQ("円周角", "中心角が " + 2 * c + "° のとき、同じ弧に対する円周角は何度？", c, [2 * c, 4 * c, 180 - c], "円周角は、同じ弧に対する中心角の半分。", "°"); },
  pool("円・相似の用語", [["半円の弧に対する円周角は何度？", "90°", "直径に対する円周角は 90° です。", ["180°", "45°", "60°"]], ["同じ弧に対する円周角どうしはどうなる？", "等しい", "1つの弧に対する円周角は、すべて等しくなります。", ["2倍になる", "和が180°", "決まらない"]],
    ["三角形の2辺の中点を結ぶ線分は、残りの辺とどうなる？", "平行で長さが半分", "中点連結定理です。", ["垂直で長さが半分", "平行で長さが等しい", "長さが2倍"]], ["三角形の相似条件で「3組の辺の比がすべて等しい」ほかに（1つ選ぶ）", "2組の角がそれぞれ等しい", "相似条件は、3辺の比／2辺の比とその間の角／2組の角 の3つです。", ["1組の辺が等しい", "面積が等しい", "1組の角が等しい"]],
    ["三角定規の 30°・60°・90° の三角形の辺の比は？", "1 : 2 : √3", "短い辺 : 斜辺 : 残りの辺 ＝ 1 : 2 : √3", ["1 : 1 : √2", "3 : 4 : 5", "1 : √2 : 2"]]]),
]);

/* ===================== 英語 ===================== */
const BE = [["I ( ) a student.", "am"], ["He ( ) my brother.", "is"], ["They ( ) busy now.", "are"], ["You ( ) very kind.", "are"], ["My mother ( ) a nurse.", "is"], ["We ( ) good friends.", "are"],
  ["Ken and I ( ) classmates.", "are"], ["This book ( ) interesting.", "is"], ["It ( ) sunny today.", "is"], ["I ( ) not tired.", "am"], ["I ( ) at home yesterday.", "was"], ["They ( ) in Kyoto last week.", "were"],
  ["She ( ) sick last Sunday.", "was"], ["We ( ) very hungry then.", "were"], ["( ) you from Canada?", "Are"], ["( ) this your bag?", "Is"], ["Mr. Sato and Ms. Ito ( ) teachers.", "are"], ["My dog ( ) very cute.", "is"], ["I ( ) twelve years old.", "am"], ["Where ( ) your shoes?", "are"],
  ["It ( ) cold last night.", "was"], ["You ( ) late yesterday.", "were"], ["My sister ( ) in Tokyo now.", "is"], ["These pens ( ) mine.", "are"], ["( ) they your friends?", "Are"], ["( ) she a doctor?", "Is"],
  ["( ) I right?", "Am"], ["Tom ( ) not at school yesterday.", "was"], ["There ( ) a cat under the table.", "is"], ["There ( ) many books on the desk.", "are"]];
const S3 = [["play", "plays"], ["study", "studies"], ["go", "goes"], ["watch", "watches"], ["have", "has"], ["wash", "washes"], ["teach", "teaches"], ["try", "tries"], ["like", "likes"], ["do", "does"],
  ["fly", "flies"], ["enjoy", "enjoys"], ["read", "reads"], ["swim", "swims"], ["carry", "carries"], ["mix", "mixes"], ["stay", "stays"], ["cry", "cries"], ["catch", "catches"], ["use", "uses"], ["finish", "finishes"], ["say", "says"], ["buy", "buys"], ["push", "pushes"], ["miss", "misses"], ["worry", "worries"], ["pass", "passes"], ["fix", "fixes"], ["play", "plays"], ["make", "makes"]];
const PL = [["child", "children"], ["man", "men"], ["woman", "women"], ["foot", "feet"], ["tooth", "teeth"], ["mouse", "mice"], ["box", "boxes"], ["city", "cities"], ["knife", "knives"], ["leaf", "leaves"],
  ["potato", "potatoes"], ["dish", "dishes"], ["family", "families"], ["boy", "boys"], ["sheep", "sheep"], ["fish", "fish"], ["bus", "buses"], ["day", "days"], ["country", "countries"], ["life", "lives"], ["photo", "photos"], ["piano", "pianos"], ["glass", "glasses"], ["watch", "watches"], ["baby", "babies"], ["toy", "toys"], ["story", "stories"], ["wolf", "wolves"], ["person", "people"], ["Japanese", "Japanese"]];
const WH = [["どこ", "where"], ["いつ", "when"], ["だれ", "who"], ["なに", "what"], ["なぜ", "why"], ["どのように", "how"], ["どちら・どれ", "which"], ["だれの", "whose"], ["いくつ（数）", "how many"], ["いくら（値段）", "how much"], ["何歳", "how old"], ["何時", "what time"], ["どのくらい長く", "how long"], ["どんな天気", "how is the weather"], ["何曜日", "what day"], ["何色", "what color"], ["どのくらいの頻度で", "how often"], ["どのくらい遠く", "how far"], ["どの〜", "which ＋ 名詞"], ["何の教科", "what subject"]];
const DAYS = [["月曜日", "Monday"], ["火曜日", "Tuesday"], ["水曜日", "Wednesday"], ["木曜日", "Thursday"], ["金曜日", "Friday"], ["土曜日", "Saturday"], ["日曜日", "Sunday"],
  ["1月", "January"], ["2月", "February"], ["3月", "March"], ["4月", "April"], ["5月", "May"], ["6月", "June"], ["7月", "July"], ["8月", "August"], ["9月", "September"], ["10月", "October"], ["11月", "November"], ["12月", "December"],
  ["春", "spring"], ["夏", "summer"], ["秋", "fall"], ["冬", "winter"]];
const W1 = [["library", "図書館"], ["hospital", "病院"], ["station", "駅"], ["museum", "博物館"], ["weather", "天気"], ["season", "季節"], ["country", "国"], ["language", "言語"], ["breakfast", "朝食"], ["dinner", "夕食"],
  ["kitchen", "台所"], ["classmate", "同級生"], ["homework", "宿題"], ["subject", "教科"], ["favorite", "お気に入りの"], ["hungry", "空腹の"], ["tired", "疲れた"], ["sometimes", "ときどき"], ["usually", "ふつうは"], ["always", "いつも"],
  ["often", "よく、しばしば"], ["never", "一度も〜ない"], ["tomorrow", "明日"], ["yesterday", "昨日"], ["listen", "聞く"], ["speak", "話す"], ["practice", "練習する"], ["clean", "そうじする"], ["help", "手伝う"], ["cook", "料理する"]];
const W2 = [["future", "未来"], ["history", "歴史"], ["question", "質問"], ["answer", "答え"], ["important", "大切な"], ["difficult", "難しい"], ["famous", "有名な"], ["interesting", "おもしろい"], ["popular", "人気のある"], ["beautiful", "美しい"],
  ["useful", "役に立つ"], ["borrow", "借りる"], ["remember", "覚えている"], ["forget", "忘れる"], ["decide", "決める"], ["arrive", "着く"], ["believe", "信じる"], ["change", "変える"], ["agree", "賛成する"], ["explain", "説明する"],
  ["experience", "経験"], ["environment", "環境"], ["culture", "文化"], ["volunteer", "ボランティア"], ["invent", "発明する"], ["protect", "守る"], ["receive", "受け取る"], ["several", "いくつかの"], ["dangerous", "危険な"], ["necessary", "必要な"]];
const VERBS = [["go", "went", "gone"], ["come", "came", "come"], ["see", "saw", "seen"], ["eat", "ate", "eaten"], ["take", "took", "taken"], ["make", "made", "made"], ["get", "got", "gotten"], ["give", "gave", "given"],
  ["know", "knew", "known"], ["think", "thought", "thought"], ["buy", "bought", "bought"], ["bring", "brought", "brought"], ["teach", "taught", "taught"], ["catch", "caught", "caught"], ["write", "wrote", "written"],
  ["read", "read", "read"], ["run", "ran", "run"], ["swim", "swam", "swum"], ["sing", "sang", "sung"], ["speak", "spoke", "spoken"], ["tell", "told", "told"], ["say", "said", "said"], ["find", "found", "found"],
  ["leave", "left", "left"], ["feel", "felt", "felt"], ["meet", "met", "met"], ["sit", "sat", "sat"], ["stand", "stood", "stood"], ["begin", "began", "begun"], ["drink", "drank", "drunk"], ["have", "had", "had"],
  ["do", "did", "done"], ["send", "sent", "sent"], ["lose", "lost", "lost"], ["sleep", "slept", "slept"], ["build", "built", "built"], ["break", "broke", "broken"], ["choose", "chose", "chosen"], ["fly", "flew", "flown"],
  ["draw", "drew", "drawn"], ["grow", "grew", "grown"], ["throw", "threw", "thrown"], ["wear", "wore", "worn"], ["forget", "forgot", "forgotten"], ["hear", "heard", "heard"], ["keep", "kept", "kept"], ["put", "put", "put"], ["cut", "cut", "cut"]];
const COMP = [["big", "bigger", "biggest", "g を重ねて -er／-est"], ["tall", "taller", "tallest"], ["long", "longer", "longest"], ["old", "older", "oldest"], ["hot", "hotter", "hottest", "t を重ねて -er／-est"],
  ["easy", "easier", "easiest", "y を i にかえて -er／-est"], ["busy", "busier", "busiest", "y を i にかえて -er／-est"], ["large", "larger", "largest", "e で終わる語は -r／-st だけ"], ["good", "better", "best", "形が変わる語：good − better − best"],
  ["many", "more", "most", "形が変わる語：many − more − most"], ["bad", "worse", "worst", "形が変わる語：bad − worse − worst"], ["fast", "faster", "fastest"], ["happy", "happier", "happiest", "y を i にかえて -er／-est"],
  ["popular", "more popular", "most popular", "長い語は more／most をつけます"], ["important", "more important", "most important", "長い語は more／most をつけます"], ["difficult", "more difficult", "most difficult", "長い語は more／most をつけます"],
  ["well", "better", "best", "well も better − best と変わります"], ["early", "earlier", "earliest", "y を i にかえて -er／-est"]];
const regular = v => v.endsWith("e") ? v + "d" : v + "ed";

add("e1-be", "eng", 1, "be動詞", [() => { const [q, a] = pick(BE); const cap = /^\(/.test(q); const all = cap ? ["Am", "Is", "Are", "Do", "Does"] : ["am", "is", "are", "was", "were", "be"];
  return strQ("be動詞", q.replace("( )", "(　　)") + "　（　）に入るのは？", a, all, { I: "I には am（過去は was）", He: "3人称単数には is（過去は was）", They: "複数には are（過去は were）" }[q.split(" ")[0]] || "主語が I なら am、3人称単数なら is、you と複数なら are。過去は was／were。"); }]);
add("e1-3s", "eng", 1, "3人称単数現在", [() => { const [v, s] = pick(S3); return strQ("三単現", "He ___ …。" + v + " の3人称単数現在形は？", s, [v + "s", v + "es", v.replace(/y$/, "ies"), v.replace(/y$/, "is"), v].filter(x => x !== s),
  s === "has" ? "have は has に変わります。" : s.endsWith("ies") ? "子音字＋y で終わる語は y を i にかえて -es" : s.endsWith("es") ? "s, x, sh, ch, o で終わる語は -es" : "ふつうは -s をつけます。"); },
  pool("三単現", [["Ken ( ) soccer every day.", "plays", "主語 Ken は3人称単数なので plays。", ["play", "playing", "played"]], ["( ) she like music?", "Does", "3人称単数の疑問文は Does ではじめます。", ["Do", "Is", "Are"]],
    ["My father ( ) not drink coffee.", "does", "3人称単数の否定文は does not ＋ 動詞の原形。", ["do", "is", "doesn't"]], ["She ( ) English every night.", "studies", "study は y を i にかえて studies。", ["study", "studys", "studying"]],
    ["Tom ( ) two dogs.", "has", "have は has に変わります。", ["have", "haves", "is"]]])]);
add("e1-pl", "eng", 1, "名詞の複数形", [() => { const [n, p] = pick(PL); return strQ("複数形", n + " の複数形は？", p, [n + "s", n + "es", n.replace(/y$/, "ies"), n.replace(/fe?$/, "ves"), n].filter(x => x !== p),
  p === n ? n + " は単数と複数が同じ形です。" : /^(children|men|women|feet|teeth|mice)$/.test(p) ? "形が変わる特別な複数形です。" : p.endsWith("ves") ? "f／fe で終わる語は ves にします。" : p.endsWith("ies") ? "子音字＋y は y を i にかえて -es" : p.endsWith("es") ? "s, x, sh, ch, o で終わる語は -es" : "ふつうは -s をつけます。"); }]);
add("e1-wh", "eng", 1, "疑問詞", pairs("疑問詞", WH, j => "「" + j + "」を英語で？", e => e + " の意味は？"));
add("e1-days", "eng", 1, "曜日・月・季節", pairs("曜日・月・季節", DAYS, j => "「" + j + "」を英語で？", e => e + " の意味は？"));
add("e1-word", "eng", 1, "英単語（中1）", pairs("英単語", W1, e => e + " の意味は？", j => "「" + j + "」を英語で？"));
add("e2-past", "eng", 2, "不規則動詞の過去形", [() => { const [v, p] = pick(VERBS); return strQ("過去形", v + " の過去形は？", p, [regular(v), ...VERBS.map(x => x[1])], v + " は不規則動詞で、過去形は " + p + "。-ed はつけません。"); },
  () => { const [v, p] = pick(VERBS); return strQ("過去形", p + " は何の過去形？", v, VERBS.map(x => x[0]), v + " − " + p); }]);
add("e2-comp", "eng", 2, "比較", [() => { const [a, c, , ex] = pick(COMP); return strQ("比較級", a + " の比較級は？", c, [a + "er", "more " + a, a + a.slice(-1) + "er", a + "est", a.replace(/y$/, "ier")].filter(x => x !== c), ex || a + " に -er をつけます。"); },
  () => { const [a, , s, ex] = pick(COMP); return strQ("最上級", a + " の最上級は？", s, [a + "est", "most " + a, a + "er", a.replace(/y$/, "iest")].filter(x => x !== s), ex || a + " に -est をつけます。"); },
  pool("比較の文", [["Tom is as tall ( ) Ken.", "as", "as ＋ 原級 ＋ as で「〜と同じくらい…」。", ["than", "so", "of"]], ["This is the highest mountain ( ) Japan.", "in", "場所・範囲には in、仲間・数には of。", ["of", "than", "at"]],
    ["He is the tallest ( ) the five.", "of", "数や仲間を表すときは of。", ["in", "than", "at"]], ["My bag is bigger ( ) yours.", "than", "比較級 ＋ than で「〜よりも…」。", ["as", "of", "in"]], ["I like summer ( ) than winter.", "better", "like A better than B で「BよりAが好き」。", ["more", "best", "good"]],
    ["Which do you like ( ), tea or coffee?", "better", "2つを比べて「どちらが好き？」は better。", ["best", "more", "most"]]])]);
add("e2-inf", "eng", 2, "不定詞・動名詞", pool("不定詞・動名詞", [["I enjoy ( ) tennis.", "playing", "enjoy のあとは動名詞（-ing）。", ["to play", "play", "played"]], ["I want ( ) a doctor.", "to be", "want のあとは to ＋ 動詞の原形。", ["being", "be", "am"]],
  ["Did you finish ( ) your homework?", "doing", "finish のあとは動名詞。", ["to do", "do", "did"]], ["I hope ( ) you again.", "to see", "hope のあとは不定詞。", ["seeing", "see", "saw"]], ["Stop ( ), please.", "talking", "stop ＋ -ing で「〜するのをやめる」。", ["to talk", "talk", "talked"]],
  ["She decided ( ) abroad.", "to study", "decide のあとは不定詞。", ["studying", "study", "studied"]], ["Thank you for ( ) me.", "helping", "前置詞のあとは動名詞。", ["to help", "help", "helped"]], ["He is good at ( ).", "singing", "前置詞 at のあとは動名詞。", ["to sing", "sing", "sang"]],
  ["I went to the library ( ) books.", "to borrow", "「〜するために」は不定詞（副詞的用法）。", ["borrowing", "borrow", "borrowed"]], ["I have a lot of homework ( ) today.", "to do", "「〜するべき」は不定詞（形容詞的用法）。", ["doing", "do", "done"]],
  ["It is important ( ) English every day.", "to study", "It is … to 〜 で「〜することは…だ」。", ["studying", "study", "studied"]], ["Do you know how ( ) this machine?", "to use", "how to 〜 で「〜のしかた」。", ["using", "use", "used"]], ["My dream is ( ) a teacher.", "to become", "「〜すること」は不定詞（名詞的用法）。", ["becoming", "become", "became"]],
  ["( ) English is fun.", "Studying", "主語になる「〜すること」は動名詞。", ["Study", "Studied", "Studies"]], ["I'm happy ( ) you.", "to see", "感情の原因「〜して」は不定詞。", ["seeing", "see", "saw"]], ["Would you like something ( )?", "to drink", "「何か飲むもの」は something to drink。", ["drinking", "drink", "drank"]],
  ["He likes ( ) pictures.", "drawing", "like のあとは -ing も to ＋ 原形も使えます。", ["drew", "draws", "drawn"]], ["I don't know what ( ).", "to do", "what to 〜 で「何を〜すべきか」。", ["doing", "do", "did"]], ["She practiced ( ) the piano.", "playing", "practice のあとは動名詞。", ["to play", "play", "played"]],
  ["We need ( ) water.", "to save", "need のあとは不定詞。", ["saving", "save", "saved"]], ["How about ( ) shopping?", "going", "How about のあとは動名詞。", ["to go", "go", "went"]], ["I tried ( ) the box.", "to open", "try to 〜 で「〜しようとする」。", ["opened", "open", "opens"]]]));
add("e2-aux", "eng", 2, "助動詞・未来", [...pairs("助動詞", [["must", "〜しなければならない"], ["can", "〜できる"], ["may", "〜してもよい"], ["should", "〜すべきだ"], ["will", "〜するだろう"], ["must not", "〜してはいけない"], ["don't have to", "〜する必要はない"], ["Shall I 〜?", "〜しましょうか"], ["Will you 〜?", "〜してくれませんか"]],
  e => e + " の意味は？", j => "「" + j + "」を表すのは？", "must not（〜してはいけない）と don't have to（〜する必要はない）は、意味がまったくちがうので要注意です。"),
  pool("未来の文", [["I ( ) visit Kyoto next week.", "will", "未来のことは will ＋ 動詞の原形。", ["was", "did", "am"]], ["She is going ( ) buy a new bike.", "to", "be going to ＋ 動詞の原形。", ["for", "will", "at"]], ["It will ( ) rainy tomorrow.", "be", "will のあとは原形なので be。", ["is", "was", "are"]],
    ["( ) you going to join the party?", "Are", "be going to の疑問文は be 動詞を前に。", ["Do", "Will", "Is"]]])]);
add("e2-word", "eng", 2, "英単語（中2）", pairs("英単語", W2, e => e + " の意味は？", j => "「" + j + "」を英語で？"));
add("e3-pp", "eng", 3, "過去分詞", [() => { const [v, , pp] = pick(VERBS); return strQ("過去分詞", v + " の過去分詞は？", pp, [regular(v), v + "en", ...VERBS.map(x => x[2])], v + " − " + VERBS.find(x => x[0] === v)[1] + " − " + pp); }]);
add("e3-perf", "eng", 3, "現在完了", pool("現在完了", [["I have ( ) to Kyoto twice.", "been", "have been to 〜 で「〜に行ったことがある」。", ["gone", "went", "go"]], ["She has ( ) here since 2020.", "lived", "have ＋ 過去分詞。", ["live", "lives", "living"]],
  ["I have just ( ) lunch.", "eaten", "eat の過去分詞は eaten。", ["ate", "eat", "eating"]], ["Have you ever ( ) sushi?", "eaten", "経験を聞く文。have ＋ 過去分詞。", ["ate", "eat", "eats"]], ["( ) long have you lived here?", "How", "How long 〜? で期間をたずねます。", ["What", "When", "Where"]],
  ["I have lived here ( ) three years.", "for", "期間の長さは for。", ["since", "from", "in"]], ["I have known him ( ) last year.", "since", "始まった時点は since。", ["for", "from", "in"]], ["I have ( ) finished my homework.", "already", "肯定文の「もう」は already。", ["yet", "ever", "never"]],
  ["Have you finished it ( )?", "yet", "疑問文の「もう」は yet（文末）。", ["already", "ever", "just"]], ["I have ( ) seen a panda.", "never", "「一度も〜ない」は never。", ["ever", "yet", "already"]],
  ["He has ( ) to Canada.（もう行ってしまって、ここにいない）", "gone", "have gone to は「行ってしまった（今ここにいない）」。", ["been", "went", "go"]], ["It has ( ) raining since this morning.", "been", "現在完了進行形は have been ＋ -ing。", ["be", "was", "being"]], ["How many times ( ) you visited Nara?", "have", "回数をたずねる現在完了の疑問文。", ["did", "do", "are"]],
  ["I have ( ) him for ten years.", "known", "know の過去分詞は known。", ["knew", "know", "knowing"]], ["She has ( ) her homework yet.", "not finished", "否定文は have not ＋ 過去分詞。", ["didn't finish", "not finish", "no finished"]], ["We have been friends ( ) we were children.", "since", "since のあとに文が続くこともあります。", ["for", "from", "when"]],
  ["Have you ever ( ) to Okinawa?", "been", "「〜に行ったことがある」は have been to。", ["gone", "went", "go"]], ["I have ( ) seen such a big fish.", "never", "「一度も〜ない」は never。", ["ever", "yet", "already"]], ["The train has just ( ).", "left", "leave の過去分詞は left。", ["leave", "leaved", "leaving"]], ["( ) have you been?", "Where", "「どこにいたの？」", ["What", "Who", "How"]]]));
add("e3-pass", "eng", 3, "受け身", pool("受け身", [["This room is ( ) every day.", "cleaned", "受け身は be 動詞 ＋ 過去分詞。", ["clean", "cleaning", "cleans"]], ["English is ( ) in many countries.", "spoken", "speak の過去分詞は spoken。", ["speak", "spoke", "speaking"]],
  ["This book was ( ) by Soseki.", "written", "write の過去分詞は written。", ["wrote", "write", "writing"]], ["The bridge was ( ) in 1990.", "built", "build の過去分詞は built。", ["build", "builded", "building"]], ["The window was broken ( ) Tom.", "by", "「〜によって」は by。", ["of", "with", "from"]],
  ["Mt. Fuji can ( ) from here.", "be seen", "助動詞の受け身は can be ＋ 過去分詞。", ["see", "seen", "be saw"]], ["( ) this letter written in English?", "Was", "受け身の疑問文は be 動詞を前に。", ["Did", "Does", "Has"]], ["She is known ( ) everyone.", "to", "be known to 〜 で「〜に知られている」。", ["by", "for", "of"]],
  ["I was surprised ( ) the news.", "at", "be surprised at 〜 で「〜に驚く」。", ["by", "with", "of"]], ["The desk is made ( ) wood.", "of", "材料が見てわかるときは be made of。", ["from", "by", "in"]], ["Butter is made ( ) milk.", "from", "原料が見てわからないときは be made from。", ["of", "by", "in"]],
  ["The top of the mountain is covered ( ) snow.", "with", "be covered with 〜 で「〜でおおわれている」。", ["by", "of", "in"]], ["I am interested ( ) science.", "in", "be interested in 〜 で「〜に興味がある」。", ["at", "of", "by"]], ["This song is loved ( ) young people.", "by", "「〜によって」は by。", ["to", "with", "of"]],
  ["The letter was ( ) yesterday.", "sent", "send の過去分詞は sent。", ["send", "sended", "sending"]], ["When was this temple ( )?", "built", "受け身の疑問文。build − built − built。", ["build", "building", "builds"]], ["The museum is ( ) on Mondays.", "closed", "「閉められている」は closed。", ["close", "closing", "closes"]], ["Many stars can ( ) tonight.", "be seen", "can be ＋ 過去分詞。", ["see", "seeing", "saw"]]]));
add("e3-rel", "eng", 3, "関係代名詞・分詞", pool("関係代名詞", [["I have a friend ( ) lives in Osaka.", "who", "先行詞が人で、主語のはたらきなら who。", ["which", "whose", "where"]], ["This is the book ( ) I bought yesterday.", "which", "先行詞がもので、目的語のはたらきなら which（that も可）。", ["who", "whose", "what"]],
  ["Look at the dog ( ) has long ears.", "which", "先行詞が動物・ものなら which。", ["who", "whose", "where"]], ["I know a girl ( ) hair is very long.", "whose", "「その人の〜」は whose。", ["who", "which", "what"]], ["The boy ( ) is running over there is Ken.", "who", "先行詞が人なので who。", ["which", "whose", "what"]],
  ["The boy ( ) under the tree is Ken.", "sitting", "「〜している」名詞は -ing（現在分詞）で後ろから説明します。", ["sat", "sits", "to sit"]], ["This is a car ( ) in Japan.", "made", "「〜された」名詞は過去分詞で後ろから説明します。", ["making", "makes", "to make"]],
  ["Look at the ( ) baby.", "sleeping", "1語なら名詞の前に置きます。", ["slept", "sleeps", "to sleep"]], ["I wish I ( ) a bird.", "were", "仮定法では be 動詞は were をよく使います。", ["am", "was been", "be"]], ["If I ( ) time, I would help you.", "had", "仮定法過去は if ＋ 過去形。", ["have", "has", "will have"]], ["The man ( ) I met yesterday was kind.", "that", "目的格の関係代名詞は that（または who／省略）も使えます。", ["which", "whose", "what"]],
  ["Do you know the girl ( ) is playing the piano?", "who", "先行詞が人で主語のはたらき。", ["which", "whose", "where"]], ["This is the house ( ) roof is red.", "whose", "「その家の屋根」なので whose。", ["which", "who", "that"]], ["The language ( ) in Brazil is Portuguese.", "spoken", "「話されている言語」は過去分詞で後ろから説明。", ["speaking", "speaks", "spoke"]],
  ["The girl ( ) with Ken is Mika.", "talking", "「話している少女」は -ing で後ろから説明。", ["talked", "talks", "to talk"]], ["I have a friend ( ) father is a pilot.", "whose", "「その友だちの父親」なので whose。", ["who", "which", "that"]], ["I wish I ( ) speak French.", "could", "I wish のあとは過去形（仮定法）。", ["can", "will", "am"]], ["Everything ( ) he said was true.", "that", "先行詞に everything があるときは that をよく使います。", ["who", "whose", "what"]]]));

/* ===================== 理科 ===================== */
add("s1-plant", "sci", 1, "植物のつくりとなかま", pool("植物", [["花粉をつくるところは？", "やく"], ["受粉したあと種子になるところは？", "胚珠"], ["受粉したあと果実になるところは？", "子房"], ["めしべの先を何という？", "柱頭"],
  ["花粉が柱頭につくことを何という？", "受粉"], ["胚珠が子房に包まれている植物は？", "被子植物"], ["胚珠がむき出しになっている植物は？", "裸子植物"], ["マツは何植物？", "裸子植物", "マツやイチョウは、胚珠がむき出しの裸子植物です。", ["被子植物", "シダ植物", "コケ植物"]],
  ["単子葉類の葉脈は？", "平行脈", "単子葉類は平行脈、双子葉類は網状脈です。", ["網状脈", "主根", "ひげ根"]], ["双子葉類の根のつくりは？", "主根と側根", "単子葉類はひげ根です。", ["ひげ根", "仮根", "平行脈"]], ["光合成でつくられる気体は？", "酸素", "光合成では、二酸化炭素と水からデンプンと酸素ができます。", ["二酸化炭素", "水素", "窒素"]],
  ["光合成が行われる、細胞の中の緑色の粒は？", "葉緑体"], ["水蒸気が出ていく、葉の表面のすきまは？", "気孔"], ["根から吸った水が通る管は？", "道管"], ["葉でつくられた養分が通る管は？", "師管"], ["シダ植物やコケ植物は何でふえる？", "胞子"],
  ["コケ植物の、根のように見えるつくりは？", "仮根"], ["植物の体から水が水蒸気として出ていくことを何という？", "蒸散"], ["道管と師管が集まって束のようになったものは？", "維管束"], ["アブラナの花で、いちばん外側にあるのは？", "がく", "外側から、がく・花弁・おしべ・めしべの順です。", ["花弁", "おしべ", "めしべ"]],
  ["マツの雌花で、胚珠がついているところは？", "りん片"], ["種子をつくらず胞子でふえる、維管束がある植物は？", "シダ植物"], ["イネやトウモロコシのように子葉が1枚の植物は？", "単子葉類"], ["アサガオやアブラナのように子葉が2枚の植物は？", "双子葉類"],
  ["花弁が1つにくっついている花を何という？", "合弁花"], ["花弁が1枚1枚離れている花を何という？", "離弁花"], ["ルーペで観察するとき、動かすのは？（観察物が動かせるとき）", "観察物", "ルーペは目に近づけて持ち、観察物を前後に動かしてピントを合わせます。", ["ルーペ", "顔", "両方"]],
  ["顕微鏡で、最初に使う対物レンズの倍率は？", "低倍率", "最初は低倍率で広く見て、観察したいものを中央にしてから高倍率にします。", ["高倍率", "どちらでもよい", "最大倍率"]], ["葉の表皮で、気孔をつくっている2つの細胞は？", "孔辺細胞"], ["デンプンがあるかどうか調べる薬品は？", "ヨウ素液", "デンプンがあると青紫色に変わります。", ["BTB溶液", "石灰水", "ベネジクト液"]]]));
add("s1-animal", "sci", 1, "動物のなかま", pool("動物", [["背骨のある動物をまとめて何という？", "セキツイ動物"], ["背骨のない動物をまとめて何という？", "無セキツイ動物"], ["カエルは何類？", "両生類", "子はえら、親は肺と皮膚で呼吸します。", ["は虫類", "魚類", "哺乳類"]],
  ["クジラは何類？", "哺乳類", "クジラは肺で呼吸し、子を母乳で育てます。", ["魚類", "両生類", "鳥類"]], ["ペンギンは何類？", "鳥類", "飛べなくても、羽毛があり卵を産むので鳥類です。", ["哺乳類", "魚類", "両生類"]], ["イモリは何類？", "両生類", "イモリは両生類、ヤモリはは虫類です。", ["は虫類", "魚類", "哺乳類"]],
  ["ヤモリは何類？", "は虫類", "ヤモリはは虫類、イモリは両生類です。", ["両生類", "哺乳類", "鳥類"]], ["子が母親の体内である程度育ってから生まれる生まれ方は？", "胎生"], ["卵で生まれる生まれ方は？", "卵生"], ["昆虫の体は、頭部・胸部と何に分かれる？", "腹部", "昆虫の体は頭部・胸部・腹部の3つ。あしは胸部に6本です。", ["背部", "尾部", "脚部"]],
  ["エビやカニのなかまは？", "甲殻類"], ["昆虫やエビの体をおおうかたい殻は？", "外骨格"], ["イカやアサリのなかまは？", "軟体動物"], ["ほかの動物を食べる動物は？", "肉食動物"], ["肉食動物の目のつき方の特徴は？", "前向きにつく", "前向きの目は立体的に見えて、えものとの距離をはかりやすい。", ["横向きにつく", "上向きにつく", "目がない"]],
  ["草食動物の目のつき方の特徴は？", "横向きにつく", "横向きの目は広い範囲を見わたせて、敵を見つけやすい。", ["前向きにつく", "上向きにつく", "目がない"]], ["肉食動物の歯で、えものをとらえる大きくするどい歯は？", "犬歯"], ["草食動物で、草をすりつぶすのに適した発達した歯は？", "臼歯"],
  ["魚類の呼吸のしかたは？", "えら呼吸"], ["は虫類の体表は何でおおわれている？", "うろこ"], ["鳥類の体表は何でおおわれている？", "羽毛"], ["殻のない卵を水中に産むなかまは？", "魚類と両生類", "", ["鳥類とは虫類", "哺乳類と鳥類", "は虫類と魚類"]],
  ["外とう膜で内臓が包まれている動物のなかまは？", "軟体動物"], ["コウモリは何類？", "哺乳類", "空を飛びますが、子を母乳で育てる哺乳類です。", ["鳥類", "は虫類", "両生類"]], ["昆虫のあしは何本？", "6本", "昆虫のあしは胸部から6本出ています。", ["4本", "8本", "10本"]]]));
add("s1-matter", "sci", 1, "身のまわりの物質", [pool("気体・物質", [["ものを燃やすはたらきがある気体は？", "酸素"], ["石灰水を白くにごらせる気体は？", "二酸化炭素"], ["火をつけると音を立てて燃える、最も軽い気体は？", "水素"], ["水によくとけ、水溶液がアルカリ性で、上方置換で集める気体は？", "アンモニア"],
  ["二酸化マンガンにオキシドール（過酸化水素水）を加えると出る気体は？", "酸素"], ["石灰石にうすい塩酸を加えると出る気体は？", "二酸化炭素"], ["亜鉛にうすい塩酸を加えると出る気体は？", "水素"], ["空気中に約78％ふくまれる気体は？", "窒素"],
  ["水にとけにくい気体を集める方法は？", "水上置換法"], ["水にとけやすく空気より重い気体を集める方法は？", "下方置換法"], ["炭素をふくみ、燃えると二酸化炭素ができる物質は？", "有機物"], ["固体が液体に変わる温度は？", "融点"], ["液体が沸騰する温度は？", "沸点"],
  ["液体を加熱して気体にし、冷やして再び液体として取り出す方法は？", "蒸留"], ["水溶液を冷やしたりして、固体を取り出すことを何という？", "再結晶"], ["物質を溶かしている液体（水など）は？", "溶媒"], ["水溶液にとけている物質は？", "溶質"], ["金属に共通する性質でないものは？", "磁石につく", "磁石につくのは鉄などの一部の金属だけです。", ["電気をよく通す", "みがくと光る", "たたくと広がる"]]]),
  () => { const s = pick([10, 20, 25, 30, 40, 50]), w = pick([40, 75, 80, 90, 150, 200].filter(v => (s * 100) % (s + v) === 0)); if (!w) return numQ("濃度", "水 90g に食塩 10g をとかした食塩水の質量パーセント濃度は？", 10, [11, 9, 100], "10÷(10＋90)×100 ＝ 10%", "%");
    return numQ("濃度", "水 " + w + "g に食塩 " + s + "g をとかした食塩水の質量パーセント濃度は？", s * 100 / (s + w), [s * 100 / w, s, (s + w) / 10], "濃度 ＝ 溶質 ÷ 溶液（水＋食塩）×100 ＝ " + s + "÷" + (s + w) + "×100", "%"); },
  () => { const [m, v] = pick([[27, 10], [79, 10], [54, 20], [89, 10], [21, 3], [40, 5], [19.3, 1], [270, 100], [7.9, 1]]); return numQ("密度", "質量 " + m + "g、体積 " + v + "cm³ の物質の密度は？", m / v, [m * v, v / m, m / v * 10], "密度 ＝ 質量 ÷ 体積 ＝ " + m + "÷" + v, " g/cm³"); }]);
add("s1-phys", "sci", 1, "光・音・力", [pool("光・音・力", [["光が鏡で反射するとき、入射角と反射角の関係は？", "等しい"], ["光が水中から空気中に進むとき、屈折角は入射角より？", "大きい", "水→空気では屈折角が大きくなります。大きくなりすぎると全反射が起こります。", ["小さい", "等しい", "0°"]],
  ["光が空気中から水中に進むとき、屈折角は入射角より？", "小さい", "空気→水では屈折角が小さくなります。", ["大きい", "等しい", "90°"]], ["光がすべて反射して、境界面を通りぬけない現象は？", "全反射"], ["凸レンズで、光軸に平行な光が集まる点は？", "焦点"],
  ["物体を焦点の内側に置いて凸レンズをのぞくと見える像は？", "虚像"], ["空気中を伝わる音の速さはおよそ？", "秒速340m"], ["音を大きくすると、何が大きくなる？", "振幅", "音の大小は振幅、高低は振動数で決まります。", ["振動数", "速さ", "波長だけ"]],
  ["音を高くすると、何が多くなる？", "振動数"], ["振動数の単位は？", "Hz"], ["力の大きさの単位は？", "N"], ["100g の物体にはたらく重力はおよそ？", "1N"], ["ばねののびが、ばねを引く力に比例する法則は？", "フックの法則"], ["面に垂直にはたらく、ふれあう面からの力は？", "垂直抗力"],
  ["音が伝わらないのはどこ？", "真空中", "音は物体の振動が伝わる現象なので、何もない真空中は伝わりません。", ["水中", "鉄の中", "空気中"]], ["月面で重さ（重力の大きさ）はどうなる？", "約6分の1になる", "月の重力は地球の約6分の1。質量は変わりません。", ["変わらない", "約2倍になる", "0になる"]]]),
  () => { const k = pick([2, 3, 4, 5]), f = 1 + rnd(5); return numQ("フックの法則", "1N で " + k + "cm のびるばねに、" + f + "N の力を加えると何cm のびる？", k * f, [k + f, f, k * f + k], "のびは力に比例：" + k + "×" + f + "＝" + k * f, "cm"); },
  () => { const t = 2 + rnd(5); return numQ("音の速さ", "いなずまが光ってから " + t + " 秒後に音が聞こえた。音の速さを 340m/秒 とすると、何m はなれている？", 340 * t, [340 / t, 340 + t, 340 * (t + 1)], "距離 ＝ 速さ×時間 ＝ 340×" + t, "m"); }]);
add("s1-earth", "sci", 1, "大地の変化", pool("大地", [["マグマが冷えて固まった岩石は？", "火成岩"], ["マグマが地表付近で急に冷えて固まった岩石は？", "火山岩"], ["マグマが地下深くでゆっくり冷えて固まった岩石は？", "深成岩"], ["火山岩に見られる、石基と斑晶のつくりは？", "斑状組織"],
  ["深成岩に見られる、同じくらいの大きさの結晶が集まったつくりは？", "等粒状組織"], ["花こう岩は何岩？", "深成岩", "花こう岩は白っぽい深成岩です。", ["火山岩", "堆積岩", "変成岩"]], ["玄武岩は何岩？", "火山岩", "玄武岩は黒っぽい火山岩です。", ["深成岩", "堆積岩", "変成岩"]],
  ["サンヨウチュウが栄えた時代は？", "古生代", "サンヨウチュウは古生代の示準化石です。", ["中生代", "新生代", "現代"]], ["アンモナイトが栄えた時代は？", "中生代", "アンモナイトや恐竜は中生代の示準化石です。", ["古生代", "新生代", "先カンブリア時代"]], ["ビカリアやナウマンゾウが生きていた時代は？", "新生代", "新生代の示準化石です。", ["古生代", "中生代", "先カンブリア時代"]],
  ["サンゴの化石が見つかった地層は、当時どんな環境だった？", "あたたかく浅い海", "サンゴは示相化石。あたたかく浅い海だったとわかります。", ["冷たく深い海", "湖", "陸地の森林"]], ["地震が発生した場所の真上の地点は？", "震央"], ["最初に来る小さなゆれは？", "初期微動"], ["初期微動を伝える波は？", "P波"], ["主要動を伝える波は？", "S波"],
  ["ある地点でのゆれの大きさを表すのは？", "震度"], ["地震そのものの規模を表すのは？", "マグニチュード"], ["うすい塩酸をかけると二酸化炭素が出る堆積岩は？", "石灰岩"], ["火山灰が固まってできた堆積岩は？", "凝灰岩"], ["日本の震度は何段階？", "10段階", "0〜7で、5と6は強・弱に分かれるので10段階です。", ["7段階", "8段階", "12段階"]],
  ["火山岩で、大きな結晶のまわりの細かい粒の部分は？", "石基"], ["火山岩で、石基の中に見える大きな結晶は？", "斑晶"], ["ねばりけの強いマグマでできる火山の形は？", "ドーム状（おわんをふせた形）", "ねばりけが強いと盛り上がった形になり、激しい噴火になりやすいです。", ["傾斜のゆるやかな形", "円すい形", "平らな台地"]],
  ["ねばりけの強いマグマからできる火山灰や岩石の色は？", "白っぽい"], ["流れる水のはたらきで、粒の大きさがいちばん小さいものは？", "泥", "粒の大きさは れき＞砂＞泥。小さい泥ほど遠く・深いところに積もります。", ["れき", "砂", "火山灰"]], ["大地が大きな力を受けて、地層が波打つように曲がったものは？", "しゅう曲"],
  ["大地に力がはたらいてできる、地層のずれは？", "断層"], ["今後も活動して地震を起こす可能性がある断層は？", "活断層"], ["地震で海底の地形が変化して起こる大きな波は？", "津波"], ["地下の浅いところにあるマグマがたまった場所は？", "マグマだまり"]]));
add("s2-chem", "sci", 2, "化学変化と原子・分子", [pool("化学変化", [["水を電気分解したとき、陰極に出る気体は？", "水素", "陰極に水素、陽極に酸素が 2：1 の体積で出ます。", ["酸素", "二酸化炭素", "塩素"]], ["炭酸水素ナトリウムを加熱すると、炭酸ナトリウム・水と何ができる？", "二酸化炭素"],
  ["鉄と硫黄を加熱するとできる物質は？", "硫化鉄"], ["酸化銀を加熱すると、銀と何に分かれる？", "酸素"], ["物質が酸素と結びつく化学変化は？", "酸化"], ["酸化物から酸素がうばわれる化学変化は？", "還元"], ["熱や光を出しながら激しく酸化することは？", "燃焼"],
  ["化学変化の前後で、全体の質量が変わらない法則は？", "質量保存の法則"], ["まわりから熱をうばう化学変化は？", "吸熱反応"], ["酸化銅と炭素を加熱すると、銅と何ができる？", "二酸化炭素"], ["塩化コバルト紙は水にふれると何色になる？", "赤色（桃色）", "青色の塩化コバルト紙は、水にふれると赤（桃）色になります。", ["青色", "黄色", "白色"]],
  ["水の電気分解の化学反応式は？", "2H₂O → 2H₂ ＋ O₂", "", ["H₂O → H₂ ＋ O", "2H₂O → H₂ ＋ 2O₂", "H₂O → 2H ＋ O"]], ["水素が燃える化学反応式は？", "2H₂ ＋ O₂ → 2H₂O", "", ["H₂ ＋ O → H₂O", "H₂ ＋ O₂ → H₂O₂", "2H ＋ O → H₂O"]],
  ["炭素が燃える化学反応式は？", "C ＋ O₂ → CO₂", "", ["C ＋ O → CO", "2C ＋ O₂ → CO₂", "C ＋ 2O → CO₂"]], ["マグネシウムが燃える化学反応式は？", "2Mg ＋ O₂ → 2MgO", "", ["Mg ＋ O → MgO", "Mg ＋ O₂ → MgO₂", "2Mg ＋ O → Mg₂O"]],
  ["銅が酸化する化学反応式は？", "2Cu ＋ O₂ → 2CuO", "", ["Cu ＋ O → CuO", "Cu ＋ O₂ → CuO₂", "2Cu ＋ O → Cu₂O"]], ["鉄と硫黄の化学反応式は？", "Fe ＋ S → FeS", "", ["2Fe ＋ S → Fe₂S", "Fe ＋ 2S → FeS₂", "Fe ＋ S₂ → FeS"]]]),
  ...pairs("元素記号", [["水素", "H"], ["炭素", "C"], ["窒素", "N"], ["酸素", "O"], ["ナトリウム", "Na"], ["マグネシウム", "Mg"], ["アルミニウム", "Al"], ["硫黄", "S"], ["塩素", "Cl"], ["カリウム", "K"], ["カルシウム", "Ca"], ["鉄", "Fe"], ["銅", "Cu"], ["亜鉛", "Zn"], ["銀", "Ag"], ["金", "Au"], ["ヘリウム", "He"], ["ケイ素", "Si"], ["リン", "P"], ["バリウム", "Ba"]],
    n => n + " の元素記号は？", s => s + " は何の元素？", "元素記号は、1文字目が大文字、2文字目は小文字です（Na、Cl など）。"),
  ...pairs("化学式", [["水", "H₂O"], ["二酸化炭素", "CO₂"], ["酸素", "O₂"], ["水素", "H₂"], ["窒素", "N₂"], ["塩化ナトリウム", "NaCl"], ["アンモニア", "NH₃"], ["酸化銅", "CuO"], ["硫化鉄", "FeS"], ["酸化マグネシウム", "MgO"], ["塩化水素", "HCl"], ["水酸化ナトリウム", "NaOH"], ["酸化銀", "Ag₂O"], ["炭酸水素ナトリウム", "NaHCO₃"]],
    n => n + " の化学式は？", f => f + " は何の化学式？", "化学式の右下の小さい数字は、原子の数を表します（H₂O は水素原子2個と酸素原子1個）。"),
  () => { const c = 4 * (1 + rnd(5)); return numQ("質量の比", "銅と酸素は 4 : 1 の質量の比で結びつく。銅 " + c + "g を完全に酸化させると、酸化銅は何g？", c * 5 / 4, [c / 4, c * 4 / 5, c + 1], "結びつく酸素は " + c + "÷4＝" + c / 4 + "g。酸化銅は " + c + "＋" + c / 4 + "＝" + c * 5 / 4 + "g", "g"); },
  () => { const m = 3 * (1 + rnd(5)); return numQ("質量の比", "マグネシウムと酸素は 3 : 2 の質量の比で結びつく。マグネシウム " + m + "g を完全に燃やすと、酸化マグネシウムは何g？", m * 5 / 3, [m * 2 / 3, m * 3 / 2, m + 2], "酸素は " + m + "×2/3＝" + m * 2 / 3 + "g。合わせて " + m * 5 / 3 + "g", "g"); }]);
add("s2-bio", "sci", 2, "生物のからだのつくり", pool("生物のからだ", [["デンプンを分解する、だ液にふくまれる消化酵素は？", "アミラーゼ"], ["胃液にふくまれ、タンパク質を分解する消化酵素は？", "ペプシン"], ["すい液にふくまれ、脂肪を分解する消化酵素は？", "リパーゼ"],
  ["胆汁をつくる器官は？", "肝臓", "胆汁は肝臓でつくられ、胆のうにたくわえられます。", ["胆のう", "すい臓", "胃"]], ["小腸の内側にある、表面積を大きくする突起は？", "柔毛"], ["肺の中にある、小さな袋のようなつくりは？", "肺胞"], ["赤血球にふくまれ、酸素を運ぶ物質は？", "ヘモグロビン"],
  ["心臓から送り出される血液が流れる血管は？", "動脈"], ["心臓にもどる血液が流れ、弁がある血管は？", "静脈"], ["アンモニアを尿素に変える器官は？", "肝臓"], ["血液中から尿素などをこし出して尿をつくる器官は？", "じん臓"], ["植物の細胞だけにあり、体を支えるつくりは？", "細胞壁"],
  ["動物と植物の細胞に共通する、染色液によく染まるつくりは？", "核"], ["熱いものにさわって思わず手を引っこめるような反応は？", "反射"], ["目で、光の刺激を受け取る細胞がある膜は？", "網膜"], ["デンプンが分解されて最終的にできる物質は？", "ブドウ糖"],
  ["タンパク質が分解されて最終的にできる物質は？", "アミノ酸"], ["血液の液体成分で、養分や不要物を運ぶのは？", "血しょう"], ["出血したとき血液を固めるのは？", "血小板"], ["細菌などをとらえるのは？", "白血球"], ["ブドウ糖やアミノ酸を吸収する、小腸のひだの表面の突起は？", "柔毛"], ["柔毛で吸収された脂肪が入る管は？", "リンパ管"], ["酸素の多い血液を何という？", "動脈血"],
  ["二酸化炭素の多い血液を何という？", "静脈血"], ["肺から心臓へもどる血液が流れる血管は？", "肺静脈", "肺静脈には、酸素を多くふくむ動脈血が流れています。", ["肺動脈", "大動脈", "大静脈"]], ["刺激を受け取る目や耳などの器官は？", "感覚器官"],
  ["脳や脊髄をまとめて何という？", "中枢神経"], ["骨についている筋肉の両端の、じょうぶなつくりは？", "けん"], ["からだが1つの細胞でできている生物は？", "単細胞生物"], ["細胞が、生きるためのエネルギーを取り出すはたらきは？", "細胞呼吸（細胞による呼吸）"]]));
add("s2-elec", "sci", 2, "電流とそのはたらき", [
  () => { const r = pick([2, 4, 5, 10, 20, 30]), i = pick([0.5, 1, 2, 3, 0.2]); return numQ("オームの法則", "抵抗 " + r + "Ω に " + i + "A の電流が流れた。電圧は何V？", r * i, [r / i, r + i, r * i * 2], "電圧 ＝ 抵抗 × 電流 ＝ " + r + "×" + i, "V"); },
  () => { const r = pick([2, 4, 5, 10, 20]), v = r * pick([1, 2, 3, 0.5]); return numQ("オームの法則", "抵抗 " + r + "Ω に " + v + "V の電圧を加えた。電流は何A？", v / r, [v * r, r / v, v / r * 10], "電流 ＝ 電圧 ÷ 抵抗 ＝ " + v + "÷" + r, "A"); },
  () => { const i = pick([0.2, 0.5, 1, 2]), r = pick([5, 10, 20, 30]); return numQ("オームの法則", "電圧 " + r * i + "V で " + i + "A の電流が流れた。抵抗は何Ω？", r, [r * i * i, i / r, r * 2], "抵抗 ＝ 電圧 ÷ 電流 ＝ " + r * i + "÷" + i, "Ω"); },
  () => { const v = pick([100, 6, 12, 3]), i = pick([2, 0.5, 3, 1.5]); return numQ("電力", v + "V で " + i + "A の電流が流れたときの電力は何W？", v * i, [v / i, v + i, v * i * 2], "電力 ＝ 電圧 × 電流 ＝ " + v + "×" + i, "W"); },
  () => { const a = pick([2, 5, 10, 15]), b = pick([3, 5, 10, 20]); return numQ("合成抵抗", a + "Ω と " + b + "Ω の抵抗を直列につないだ全体の抵抗は？", a + b, [a * b / (a + b), a * b, Math.abs(a - b)], "直列の全体の抵抗は、それぞれの和。" + a + "＋" + b, "Ω"); },
  () => { const [a, b] = pick([[6, 3], [4, 4], [12, 6], [10, 10], [20, 30], [6, 12], [3, 6], [20, 20]]); return numQ("合成抵抗", a + "Ω と " + b + "Ω の抵抗を並列につないだ全体の抵抗は？", a * b / (a + b), [a + b, Math.abs(a - b), (a + b) / 2], "並列では全体の抵抗は小さくなります。1/R ＝ 1/" + a + "＋1/" + b, "Ω"); },
  () => { const w = pick([100, 600, 1000, 1200]), t = pick([10, 30, 60, 120]); return numQ("電力量・熱量", w + "W の電気器具を " + t + " 秒使ったときの電力量は何J？", w * t, [w / t, w + t, w * t / 60], "電力量（J）＝ 電力（W）× 時間（秒）", "J"); },
  pool("電流と磁界", [["電流計は回路にどうつなぐ？", "直列", "電流計は直列、電圧計は並列につなぎます。", ["並列", "どちらでもよい", "つながない"]], ["電圧計は回路にどうつなぐ？", "並列", "", ["直列", "どちらでもよい", "つながない"]],
    ["電流の単位は？", "A"], ["電圧の単位は？", "V"], ["抵抗の単位は？", "Ω"], ["電力の単位は？", "W"], ["コイルの中の磁界が変化すると電流が流れる現象は？", "電磁誘導"], ["電磁誘導で流れる電流は？", "誘導電流"],
    ["電流の向きが周期的に変わる電流は？", "交流"], ["乾電池から流れる、向きが変わらない電流は？", "直流"], ["真空放電管で見られる、−極から出る粒子の流れは？", "電子", "陰極線は、−の電気をもつ電子の流れです。", ["陽子", "中性子", "イオン"]], ["こすり合わせたときに生じる電気は？", "静電気"]], "計器のつなぎ方や単位は、実験の問題で毎回のように出ます。")]);
add("s2-weather", "sci", 2, "天気とその変化", [pool("天気", [["気圧の単位は？", "hPa"], ["1気圧はおよそ何hPa？", "1013hPa"], ["等圧線の間隔がせまいところでは、風はどうなる？", "強い"], ["高気圧の中心付近では、どんな気流が起こる？", "下降気流", "高気圧は下降気流で雲ができにくく、晴れやすいです。", ["上昇気流", "前線", "台風"]],
  ["寒冷前線付近でできやすい雲は？", "積乱雲"], ["温暖前線付近でできやすい、広い範囲に雨を降らせる雲は？", "乱層雲"], ["寒冷前線が通過したあと、気温はどうなる？", "下がる"], ["日本の冬の典型的な気圧配置は？", "西高東低"], ["日本の冬にふく季節風の向きは？", "北西"],
  ["梅雨の時期に日本付近にとどまる前線は？", "停滞前線"], ["夏に日本の南東にはり出す高気圧は？", "太平洋高気圧"], ["冬にシベリア大陸でできる高気圧は？", "シベリア高気圧"], ["空気中の水蒸気が水滴に変わり始める温度は？", "露点"], ["熱帯低気圧が発達して最大風速が約17m/s以上になったものは？", "台風"],
  ["日本の上空をふく西よりの強い風は？", "偏西風"], ["寒冷前線が温暖前線に追いついてできる前線は？", "閉そく前線"], ["天気図記号で ◎ が表す天気は？", "くもり", "○ は快晴、◎ はくもり、● は雨です。", ["快晴", "晴れ", "雨"]]]),
  () => { const [s, p] = pick([[17.3, 50], [23.1, 60], [30.4, 50], [12.8, 75], [9.4, 50], [17.3, 100]]); const w = Math.round(s * p) / 100; return numQ("湿度", "飽和水蒸気量 " + s + "g/m³ の気温で、空気 1m³ に水蒸気が " + w + "g ふくまれている。湿度は？", p, [Math.round(s / w), 100 - p, p / 2], "湿度 ＝ 水蒸気量 ÷ 飽和水蒸気量 × 100 ＝ " + w + "÷" + s + "×100", "%"); },
  () => { const m = pick([60, 100, 120, 200]), a = pick([0.2, 0.5, 2, 4]); return numQ("圧力", m + "N の力が " + a + "m² の面に垂直にはたらく。圧力は何Pa？", m / a, [m * a, m / a / 10, m - a], "圧力 ＝ 力 ÷ 面積 ＝ " + m + "÷" + a, "Pa"); }]);
add("s3-ion", "sci", 3, "化学変化とイオン", [...pairs("イオン式", [["ナトリウムイオン", "Na⁺"], ["塩化物イオン", "Cl⁻"], ["水素イオン", "H⁺"], ["水酸化物イオン", "OH⁻"], ["銅イオン", "Cu²⁺"], ["マグネシウムイオン", "Mg²⁺"], ["亜鉛イオン", "Zn²⁺"], ["カルシウムイオン", "Ca²⁺"], ["硫酸イオン", "SO₄²⁻"], ["アンモニウムイオン", "NH₄⁺"]],
  n => n + " のイオン式は？", f => f + " は何イオン？", "右上の＋や−は電気の種類、数字はやりとりした電子の数です（Cu²⁺ は電子を2個失った陽イオン）。"),
  pool("酸・アルカリ・電池", [["酸性の水溶液に共通してふくまれるイオンは？", "H⁺"], ["アルカリ性の水溶液に共通してふくまれるイオンは？", "OH⁻"], ["酸とアルカリが反応して水ができる反応は？", "中和"], ["中和でできる、水以外の物質をまとめて何という？", "塩"],
    ["BTB溶液は酸性で何色？", "黄色", "BTB溶液は 酸性＝黄、中性＝緑、アルカリ性＝青。", ["緑色", "青色", "赤色"]], ["BTB溶液はアルカリ性で何色？", "青色", "", ["黄色", "緑色", "無色"]], ["フェノールフタレイン溶液はアルカリ性で何色？", "赤色", "フェノールフタレインはアルカリ性で赤色、酸性・中性では無色です。", ["青色", "黄色", "緑色"]],
    ["pH7 の水溶液は何性？", "中性"], ["pH が7より小さい水溶液は何性？", "酸性"], ["亜鉛板と銅板を使ったダニエル電池で、−極になるのは？", "亜鉛板", "イオンになりやすい亜鉛が電子を出して −極になります。", ["銅板", "どちらも", "どちらでもない"]],
    ["塩化銅水溶液を電気分解したとき、陰極に付着する物質は？", "銅"], ["塩化銅水溶液を電気分解したとき、陽極で発生する気体は？", "塩素"], ["水溶液にすると電流が流れる物質は？", "電解質"], ["砂糖のように、水溶液にしても電流が流れない物質は？", "非電解質"],
    ["原子の中心にある、陽子と中性子からなる部分は？", "原子核"], ["水素と酸素の化学変化から電気をとり出す装置は？", "燃料電池"]])]);
add("s3-motion", "sci", 3, "運動とエネルギー", [
  () => { const d = pick([60, 120, 150, 300, 600]), t = pick([2, 3, 5, 10, 20, 30].filter(v => d % v === 0)); return numQ("速さ", d + "m を " + t + " 秒で進んだ。平均の速さは何m/s？", d / t, [d * t, t / d * 100, d / t * 2], "速さ ＝ 距離 ÷ 時間 ＝ " + d + "÷" + t, " m/s"); },
  () => { const f = pick([10, 20, 30, 50]), d = pick([1, 2, 3, 0.5]); return numQ("仕事", f + "N の物体を " + d + "m 持ち上げた。仕事は何J？", f * d, [f / d, f + d, f * d * 10], "仕事 ＝ 力 × 力の向きに動いた距離 ＝ " + f + "×" + d, "J"); },
  () => { const j = pick([100, 200, 300, 600]), t = pick([2, 4, 5, 10]); return numQ("仕事率", j + "J の仕事を " + t + " 秒でした。仕事率は何W？", j / t, [j * t, t / j * 100, j / t * 2], "仕事率 ＝ 仕事 ÷ 時間 ＝ " + j + "÷" + t, "W"); },
  pool("運動とエネルギー", [["物体が外から力を受けないとき、静止または等速直線運動を続ける性質は？", "慣性"], ["Aが Bをおすと、Bも Aを同じ大きさで反対向きにおし返す。この法則は？", "作用・反作用の法則"], ["速さが一定で一直線上を進む運動は？", "等速直線運動"],
    ["斜面の角度を大きくすると、台車の速さの増え方はどうなる？", "大きくなる"], ["高いところにある物体がもつエネルギーは？", "位置エネルギー"], ["運動している物体がもつエネルギーは？", "運動エネルギー"], ["位置エネルギーと運動エネルギーの和を何という？", "力学的エネルギー"],
    ["摩擦や空気の抵抗がないとき、力学的エネルギーはどうなる？", "一定に保たれる", "力学的エネルギーの保存といいます。", ["増え続ける", "減り続ける", "0になる"]], ["道具を使っても、仕事の大きさは変わらないこと", "仕事の原理"], ["2つの力と同じはたらきをする1つの力は？", "合力"],
    ["1つの力を2つに分けることは？", "力の分解"], ["熱が、温度の高いところから低いところへ移動して伝わる現象は？", "伝導"], ["熱が光のように空間を伝わる現象は？", "放射"], ["温められた液体や気体が動いて熱が伝わる現象は？", "対流"]], "エネルギーは姿を変えても、全体の量は保存されます。言葉の意味を図と一緒に覚えましょう。")]);
add("s3-space", "sci", 3, "地球と宇宙", [pool("地球と宇宙", [["地球が自転するので、星は1時間に約何度動いて見える？", "15°", "360°÷24時間＝15°。", ["30°", "1°", "45°"]], ["地球が公転するので、同じ時刻に見える星は1か月に約何度動く？", "30°", "360°÷12か月＝30°。", ["15°", "1°", "45°"]],
  ["北の空の星は、何を中心に回って見える？", "北極星"], ["北の空の星は、どちら回りに動いて見える？", "反時計回り"], ["太陽・月・地球の順に一直線に並ぶと起こる現象は？", "日食"], ["太陽・地球・月の順に一直線に並ぶと起こる現象は？", "月食"],
  ["明け方の東の空に見える金星を何という？", "明けの明星"], ["夕方の西の空に見える金星を何という？", "よいの明星"], ["太陽系で最も大きい惑星は？", "木星"], ["太陽系で最も太陽に近い惑星は？", "水星"], ["地球の地軸は、公転面に垂直な方向から約何度かたむいている？", "23.4°"],
  ["太陽の南中高度が最も高くなる日は？", "夏至"], ["太陽の南中高度が最も低くなる日は？", "冬至"], ["太陽のように、自ら光を出す天体は？", "恒星"], ["地球のまわりを回る月のような天体は？", "衛星"], ["太陽の表面に見える、まわりより温度が低く黒く見える部分は？", "黒点"],
  ["天球上の太陽の通り道は？", "黄道"], ["地球型惑星にあてはまるのは？", "火星", "水星・金星・地球・火星が地球型惑星。", ["木星", "土星", "天王星"]], ["満月から次の満月までは約何日？", "約29.5日"], ["夕方、南の空に見える半月は？", "上弦の月"]]),
  () => { const lat = pick([30, 33, 35, 36, 40, 43]); const k = pick(["春分", "夏至", "冬至"]); const h = k === "春分" ? 90 - lat : k === "夏至" ? 90 - lat + 23.4 : 90 - lat - 23.4;
    return numQ("南中高度", "北緯 " + lat + "° の地点の、" + k + "の日の太陽の南中高度は？", Math.round(h * 10) / 10, [lat, 90 - lat + (k === "春分" ? 23.4 : 0), 180 - lat - 23.4, lat + 23.4].map(v => Math.round(v * 10) / 10), "春分・秋分は 90−緯度。夏至は ＋23.4°、冬至は −23.4°。", "°"); }]);
add("s3-life", "sci", 3, "生命の連続性・自然と人間", pool("遺伝・生態系", [["親の形質が子に伝わることは？", "遺伝"], ["遺伝子の本体の物質は？", "DNA"], ["生殖細胞がつくられるときの、染色体の数が半分になる細胞分裂は？", "減数分裂"], ["体をつくる細胞がふえる細胞分裂は？", "体細胞分裂"],
  ["AA と aa をかけ合わせた子の遺伝子の組み合わせは？", "すべて Aa"], ["Aa と Aa をかけ合わせた孫で、A の形質と a の形質の数の比は？", "3 : 1", "AA : Aa : aa ＝ 1 : 2 : 1 なので、A の形質（AA と Aa）: a の形質（aa）＝ 3 : 1。", ["1 : 1", "1 : 2 : 1", "2 : 1"]],
  ["Aa と aa をかけ合わせた子で、A の形質と a の形質の比は？", "1 : 1"], ["対になった遺伝子が、別々の生殖細胞に入ること", "分離の法則"], ["親の体の一部から新しい個体ができる、受精をしない生殖は？", "無性生殖"], ["無性生殖でできた子の形質は？", "親と同じ", "無性生殖では、子は親と同じ遺伝子を受けつぎます。", ["親と必ずちがう", "半分だけ同じ", "決まらない"]],
  ["生物どうしの「食べる・食べられる」のつながりは？", "食物連鎖"], ["光合成で有機物をつくる植物は、生態系で何とよばれる？", "生産者"], ["落ち葉や死がいを分解する菌類・細菌類は？", "分解者"], ["生物のからだが、長い時間をかけて世代を重ねて変化することは？", "進化"],
  ["形やはたらきはちがうが、もとは同じ器官だったと考えられるものは？", "相同器官"], ["始祖鳥は、何類と鳥類の両方の特徴をもつ？", "は虫類"], ["地球温暖化の原因と考えられている、二酸化炭素などの気体は？", "温室効果ガス"], ["石油や石炭など、大昔の生物の死がいからできた燃料は？", "化石燃料"], ["体細胞分裂で、染色体が見えるようになるのはどこ？", "核の中の染色体", "分裂が始まると、核の中で染色体が太く短くなって見えるようになります。", ["細胞膜", "細胞壁", "葉緑体"]],
  ["タマネギの根で、細胞分裂がさかんなのは？", "根の先端付近", "根の先端近くの成長点で、細胞分裂がさかんに行われます。", ["根もと", "葉の先", "どこも同じ"]], ["受精卵が細胞分裂をくり返して、親と同じ形になっていく過程は？", "発生"],
  ["オスとメスの生殖細胞が合体することを何という？", "受精"], ["動物の雌の生殖細胞は？", "卵"], ["被子植物で、花粉から胚珠に向かってのびる管は？", "花粉管"], ["遺伝子を人工的に変える技術は？", "遺伝子組換え"],
  ["食物連鎖で、上位の生物ほど数はどうなる？", "少なくなる", "生物の数はピラミッドの形になり、上位ほど少なくなります。", ["多くなる", "変わらない", "決まらない"]], ["本来の生息地から人間によって持ちこまれ、定着した生物は？", "外来種"], ["プラスチックが細かくなって海などにただようものは？", "マイクロプラスチック"]]));

/* ===================== 社会 ===================== */
const PREF = [["北海道","札幌市"],["青森県","青森市"],["岩手県","盛岡市"],["宮城県","仙台市"],["秋田県","秋田市"],["山形県","山形市"],["福島県","福島市"],["茨城県","水戸市"],["栃木県","宇都宮市"],["群馬県","前橋市"],["埼玉県","さいたま市"],["千葉県","千葉市"],["東京都","東京（新宿区）"],["神奈川県","横浜市"],
  ["新潟県","新潟市"],["富山県","富山市"],["石川県","金沢市"],["福井県","福井市"],["山梨県","甲府市"],["長野県","長野市"],["岐阜県","岐阜市"],["静岡県","静岡市"],["愛知県","名古屋市"],["三重県","津市"],["滋賀県","大津市"],["京都府","京都市"],["大阪府","大阪市"],["兵庫県","神戸市"],["奈良県","奈良市"],["和歌山県","和歌山市"],
  ["鳥取県","鳥取市"],["島根県","松江市"],["岡山県","岡山市"],["広島県","広島市"],["山口県","山口市"],["徳島県","徳島市"],["香川県","高松市"],["愛媛県","松山市"],["高知県","高知市"],["福岡県","福岡市"],["佐賀県","佐賀市"],["長崎県","長崎市"],["熊本県","熊本市"],["大分県","大分市"],["宮崎県","宮崎市"],["鹿児島県","鹿児島市"],["沖縄県","那覇市"]];
const DIFF = PREF.filter(([p, c]) => !c.startsWith(p.replace(/[都道府県]$/, "")));
add("g-pref", "soc", 1, "都道府県と県庁所在地", [() => { const [p, c] = pick(Math.random() < .7 ? DIFF : PREF); return strQ("県庁所在地", p + " の県庁所在地は？", c, DIFF.map(x => x[1]).concat(PREF.map(x => x[1])), p + " → " + c); },
  () => { const [p, c] = pick(DIFF); return strQ("県庁所在地", c + " が県庁所在地なのは？", p, DIFF.map(x => x[0]), c + " は " + p + " の県庁所在地"); },
  pool("日本の地域", [["日本最北端の島は？", "択捉島"], ["日本最南端の島は？", "沖ノ鳥島"], ["日本最東端の島は？", "南鳥島"], ["日本最西端の島は？", "与那国島"], ["日本でいちばん長い川は？", "信濃川"], ["日本でいちばん流域面積が広い川は？", "利根川"],
    ["日本でいちばん面積が大きい湖は？", "琵琶湖"], ["日本でいちばん高い山は？", "富士山"], ["「日本の屋根」とよばれる3つの山脈をまとめて何という？", "日本アルプス"], ["東北地方の中央を南北に走る山脈は？", "奥羽山脈"], ["日本でいちばん広い平野は？", "関東平野"],
    ["水深約200mまでの、なだらかな海底は？", "大陸だな"], ["三陸海岸南部や志摩半島に見られる、入り組んだ海岸は？", "リアス海岸"], ["季節風が山地をこえて乾いた風になり、気温が上がる現象は？", "フェーン現象"], ["夏に東北地方の太平洋側にふく、冷たく湿った北東の風は？", "やませ"],
    ["日本の標準時子午線は東経何度？", "135度"], ["日本の標準時子午線が通る兵庫県の市は？", "明石市"], ["沿岸から200海里までの、水産資源などを利用できる水域は？", "排他的経済水域"]], "日本の地形は、地図で位置を確かめながら北から順に覚えると整理しやすいです。")]);
const CAP = [["アメリカ","ワシントンD.C."],["イギリス","ロンドン"],["フランス","パリ"],["ドイツ","ベルリン"],["イタリア","ローマ"],["スペイン","マドリード"],["ロシア","モスクワ"],["中国","ペキン"],["韓国","ソウル"],["インド","ニューデリー"],
  ["オーストラリア","キャンベラ"],["カナダ","オタワ"],["ブラジル","ブラジリア"],["エジプト","カイロ"],["タイ","バンコク"],["トルコ","アンカラ"],["サウジアラビア","リヤド"],["アルゼンチン","ブエノスアイレス"],["南アフリカ共和国","プレトリア"],["ケニア","ナイロビ"],["ベトナム","ハノイ"],["フィリピン","マニラ"],["インドネシア","ジャカルタ"],["ニュージーランド","ウェリントン"],["メキシコ","メキシコシティ"]];
const TZ = [["ロンドン", 0], ["パリ", 15], ["カイロ", 30], ["モスクワ", 45], ["ペキン", 120], ["シドニー", 150], ["ニューヨーク", -75], ["ロサンゼルス", -120], ["リオデジャネイロ", -45]];
add("g-world", "soc", 1, "世界の地理", [...pairs("世界の首都", CAP, c => c + " の首都は？", s => s + " が首都の国は？", "首都は、その国でいちばん大きい都市とは限りません（オーストラリアはシドニーではなくキャンベラ）。"),
  () => { const [c, lon] = pick(TZ); const diff = (135 - lon) / 15; let h = 12 - diff, day = "同じ日"; if (h < 0) { h += 24; day = "前日"; }
    const fmt = (hh, d) => (d === "前日" ? "前日の" : "") + hh + "時";
    return strQ("時差", "東京が1月1日の正午（12時）のとき、" + c + "（標準時の経度 " + (lon === 0 ? "0度" : (lon > 0 ? "東経" : "西経") + Math.abs(lon) + "度") + "）は何時？", fmt(h, day),
      [fmt((h + 12) % 24, day), fmt(h, day === "前日" ? "同じ日" : "前日"), fmt((h + 2) % 24, day), fmt(Math.abs(12 - diff * 2) % 24, day)],
      "経度15度で1時間の時差。東京との経度差は " + Math.abs(135 - lon) + "度なので " + diff + " 時間。東京より西なので時刻は遅れます。"); },
  pool("世界の地理", [["世界で最も面積が大きい大陸は？", "ユーラシア大陸"], ["三大洋のうち、最も広いのは？", "太平洋"], ["本初子午線が通るイギリスの都市は？", "ロンドン"], ["緯度0度の線を何という？", "赤道"], ["世界で最も面積が大きい国は？", "ロシア"],
    ["世界で最も人口が多い国（2023年以降）は？", "インド"], ["地中海性気候の夏の特徴は？", "乾燥する", "地中海性気候は夏に乾燥し、冬に雨が多くなります。オリーブやぶどうの栽培がさかんです。", ["雨が多い", "雪が多い", "一年中寒い"]], ["一年中暑く雨が多い気候帯は？", "熱帯"],
    ["シベリアなどに広がる、冬の寒さがきびしく針葉樹林が広がる気候帯は？", "冷帯（亜寒帯）"], ["ツンドラが広がる気候帯は？", "寒帯"], ["豚肉を食べないなどの決まりがある宗教は？", "イスラム教"], ["牛を神聖な動物とする宗教は？", "ヒンドゥー教"], ["東南アジアの10か国が加盟する組織は？", "ASEAN"],
    ["ヨーロッパの多くの国が加盟し、共通通貨ユーロを使う組織は？", "EU"], ["南アメリカ大陸を流れる、流域面積が世界最大の川は？", "アマゾン川"], ["アフリカ大陸北部に広がる世界最大の砂漠は？", "サハラ砂漠"], ["中国で、外国企業を受け入れるために設けられた地域は？", "経済特区"],
    ["アメリカで、北緯37度より南の工業がさかんな地域は？", "サンベルト"], ["オーストラリアの先住民は？", "アボリジニ"], ["特定の農産物や鉱産資源の輸出に頼る経済は？", "モノカルチャー経済"]], "地図帳で場所を確かめながら覚えると、気候や産業の問題にもつながります。")]);
const ERA = [["大化の改新","飛鳥時代"],["十七条の憲法の制定","飛鳥時代"],["平城京への遷都","奈良時代"],["大仏の建立（東大寺）","奈良時代"],["平安京への遷都","平安時代"],["『源氏物語』の成立","平安時代"],["御成敗式目の制定","鎌倉時代"],["元寇（蒙古襲来）","鎌倉時代"],
  ["応仁の乱","室町時代"],["勘合貿易（日明貿易）","室町時代"],["太閤検地","安土桃山時代"],["参勤交代の制度化","江戸時代"],["ペリーの来航","江戸時代"],["大日本帝国憲法の発布","明治時代"],["日清戦争","明治時代"],["米騒動","大正時代"],["普通選挙法の制定","大正時代"],["日本国憲法の公布","昭和時代"],["東京オリンピック（1964年）","昭和時代"],["吉野ヶ里遺跡のような環濠集落","弥生時代"],["三内丸山遺跡のくらし","縄文時代"]];
const YEAR = [["大化の改新", 645], ["平城京遷都", 710], ["平安京遷都", 794], ["承久の乱", 1221], ["文永の役（元寇）", 1274], ["応仁の乱の始まり", 1467], ["鉄砲の伝来", 1543], ["キリスト教の伝来", 1549], ["関ヶ原の戦い", 1600], ["江戸幕府が開かれる", 1603],
  ["ペリーの来航", 1853], ["大政奉還", 1867], ["大日本帝国憲法の発布", 1889], ["日清戦争の開始", 1894], ["日露戦争の開始", 1904], ["第一次世界大戦の開始", 1914], ["第二次世界大戦の終結", 1945], ["日本国憲法の公布", 1946], ["サンフランシスコ平和条約", 1951], ["沖縄の日本復帰", 1972]];
add("h-era", "soc", 2, "歴史の時代と年代", [() => { const [e, era] = pick(ERA); return strQ("時代", e + " は何時代？", era, [...new Set(ERA.map(x => x[1]))], e + " → " + era); },
  () => { const [e, y] = pick(YEAR); return strQ("年代", e + " は何年？", y + "年", shuffle(YEAR.filter(x => x[1] !== y)).sort((a, b) => Math.abs(a[1] - y) - Math.abs(b[1] - y)).slice(0, 3).map(x => x[1] + "年"), e + " は " + y + "年"); },
  () => { const [a, b] = shuffle(YEAR).slice(0, 2); return strQ("年代", "「" + a[0] + "」と「" + b[0] + "」、先に起こったのは？", a[1] < b[1] ? a[0] : b[0], [a[1] < b[1] ? b[0] : a[0], "同じ年", "わからない"], a[0] + "（" + a[1] + "年）、" + b[0] + "（" + b[1] + "年）"); }]);
const WHO = [["邪馬台国の女王","卑弥呼"],["十七条の憲法を定めた","聖徳太子"],["大化の改新の中心となった","中大兄皇子"],["唐から来日し唐招提寺を開いた","鑑真"],["東大寺の大仏づくりに協力した僧","行基"],["遣唐使の停止を提案した","菅原道真"],["『源氏物語』を書いた","紫式部"],["『枕草子』を書いた","清少納言"],
  ["武士として初めて太政大臣になった","平清盛"],["鎌倉幕府を開いた","源頼朝"],["御成敗式目を定めた","北条泰時"],["元寇のときの執権","北条時宗"],["建武の新政を行った","後醍醐天皇"],["室町幕府を開いた","足利尊氏"],["金閣を建てた","足利義満"],["銀閣を建てた","足利義政"],["水墨画を大成した","雪舟"],
  ["日本にキリスト教を伝えた","フランシスコ・ザビエル"],["楽市・楽座を行った","織田信長"],["刀狩や太閤検地を行った","豊臣秀吉"],["江戸幕府を開いた","徳川家康"],["参勤交代を制度化した","徳川家光"],["享保の改革を行った","徳川吉宗"],["寛政の改革を行った","松平定信"],["天保の改革を行った","水野忠邦"],
  ["『解体新書』を出版した","杉田玄白"],["正確な日本地図をつくった","伊能忠敬"],["薩長同盟の仲立ちをした","坂本龍馬"],["大政奉還を行った将軍","徳川慶喜"],["『学問のすゝめ』を書いた","福沢諭吉"],["自由民権運動の中心となった","板垣退助"],["初代内閣総理大臣","伊藤博文"],["領事裁判権の撤廃に成功した外務大臣","陸奥宗光"],
  ["関税自主権の回復に成功した外務大臣","小村寿太郎"],["黄熱病の研究をした","野口英世"],["「君死にたまふことなかれ」をよんだ","与謝野晶子"]];
add("h-people", "soc", 2, "歴史の人物", pairs("歴史の人物", WHO, d => d + "人物は？", n => n + " がしたことは？"));
add("c-civics", "soc", 3, "公民", [...pairs("三権・国のしくみ", [["立法権", "国会"], ["行政権", "内閣"], ["司法権", "裁判所"], ["内閣総理大臣の指名", "国会"], ["最高裁判所長官の指名", "内閣"], ["違憲審査（法律が憲法に違反していないか）", "裁判所"], ["弾劾裁判所の設置", "国会"], ["条約の締結", "内閣"], ["予算の議決", "国会"], ["法律の制定", "国会"]],
  w => w + " をもつ（行う）のは？", n => n + " がもつ（行う）ものは？"),
  pool("公民", [["日本国憲法の三大原則にあてはまるのは？", "国民主権", "三大原則は 国民主権・基本的人権の尊重・平和主義。", ["三権分立", "地方自治", "議院内閣制"]], ["日本国憲法で天皇は何と定められている？", "日本国と日本国民統合の象徴", "", ["国の元首", "主権者", "内閣の長"]],
    ["国民の三大義務にあてはまるのは？", "納税の義務", "三大義務は 子どもに普通教育を受けさせる義務・勤労の義務・納税の義務。", ["選挙の義務", "兵役の義務", "裁判を受ける義務"]], ["選挙権は何歳以上？", "18歳"], ["衆議院議員の任期は？", "4年"], ["参議院議員の任期は？", "6年", "参議院は3年ごとに半数を改選します。", ["4年", "3年", "5年"]],
    ["衆議院議員の被選挙権は何歳以上？", "25歳"], ["参議院議員の被選挙権は何歳以上？", "30歳"], ["都道府県知事の被選挙権は何歳以上？", "30歳"], ["内閣が国会に対して連帯して責任を負うしくみは？", "議院内閣制"], ["国民が裁判に参加する制度は？", "裁判員制度"],
    ["日本の裁判で、1つの事件について3回まで裁判を受けられるしくみは？", "三審制"], ["需要量が供給量より多いとき、価格はどうなる？", "上がる"], ["日本銀行が紙幣を発行する役割を何という？", "発券銀行"], ["円高になると有利になるのは？", "輸入", "円高では外国のものを安く買えるので輸入に有利です。", ["輸出", "海外旅行の費用が上がる", "どちらも同じ"]],
    ["国際連合の本部がある都市は？", "ニューヨーク"], ["安全保障理事会の常任理事国がもつ、1か国でも反対すれば決まらない権利は？", "拒否権"], ["世界遺産の登録などを行う国連の機関は？", "ユネスコ"], ["地方公共団体の首長と議員を住民が直接選ぶしくみは？", "二元代表制"],
    ["消費税のように、税を納める人と負担する人がちがう税は？", "間接税"], ["所得が多い人ほど税率が高くなるしくみは？", "累進課税"], ["働く人が団結して労働組合をつくる権利は？", "団結権"], ["「健康で文化的な最低限度の生活」を営む権利は？", "生存権"],
    ["自分の生き方などを自分で決める権利は？", "自己決定権"], ["国や地方の情報を受け取る権利は？", "知る権利"]])]);

const TIPS = {"m1-int": "符号のミスがいちばん多い単元です。答えを出したら、まず符号だけもう一度見直しましょう。", "m1-expr": "同じ文字の項どうしだけがまとめられます。かっこの前の数は、中のすべての項にかけます。", "m1-eq": "移項すると符号が変わります。最後に x の値を元の式に代入して確かめると安心です。", "m1-func": "比例は y＝ax（y÷x が一定）、反比例は y＝a/x（x×y が一定）。どちらが一定かを先に考えます。", "m1-geo": "おうぎ形は「円の何分のいくつか」を考えます。錐の体積は柱の 1/3 です。", "m2-poly": "係数どうし・文字どうしで計算します。ひき算のかっこを外すときは符号に注意。", "m2-sys": "x か y のどちらかを消して、1つの文字の方程式にします。求めた解は両方の式に代入して確かめます。", "m2-lin": "y＝ax＋b の a は傾き（変化の割合）、b は切片。2点がわかれば傾きが出せます。", "m2-angle": "多角形の外角の和はいつも360°。平行線の同位角・錯角は等しい、をよく使います。", "m2-prob": "まず「全部で何通りか」を数えます。表や樹形図を書くと数えもれが防げます。", "m3-exp": "乗法公式4つ（(x＋a)(x＋b)、(x＋a)²、(x−a)²、(x＋a)(x−a)）を使い分けます。", "m3-root": "√ の中をできるだけ小さい整数にします。√a×√b＝√ab、たし算は √ の中が同じものどうしだけ。", "m3-quad": "まず因数分解できないか考え、できなければ解の公式。解は2つあることが多いです。", "m3-func": "y＝ax² の変化の割合は一定ではありません。a×(はじめの x＋おわりの x)で求められます。", "m3-geo": "三平方の定理は直角三角形だけ。相似比が m:n なら、面積比は m²:n²、体積比は m³:n³。", "e1-be": "主語が I なら am、3人称単数なら is、you と複数なら are。過去は was／were。", "e1-3s": "主語が3人称単数で現在の文なら、動詞に -s／-es をつけます。", "e1-pl": "ふつうは -s。s, x, sh, ch で終わる語は -es。形が変わる特別な語は、まとめて覚えましょう。", "e1-wh": "疑問詞は文の最初に置きます。how は組み合わせ（how many／how much／how old など）で意味が変わります。", "e1-days": "曜日と月は、いつも大文字で書きはじめます。つづりのまちがいが多いので、書いて覚えましょう。", "e1-word": "英単語は「見て言える」→「聞いてわかる」→「書ける」の順で覚えると定着しやすいです。", "e2-past": "不規則動詞はリズムで覚えるのが近道です。go − went − gone のように3つセットで声に出しましょう。", "e2-comp": "短い語は -er／-est、長い語は more／most。good／well／many／bad は形が変わります。", "e2-inf": "enjoy／finish／stop のあとは -ing、want／hope／decide のあとは to ＋ 原形。前置詞のあとは -ing。", "e2-aux": "助動詞のあとは、いつも動詞の原形です。must not と don't have to の意味のちがいに注意。", "e2-word": "中2で出てくる単語は、長文読解でもよく出ます。品詞（名詞・動詞・形容詞）も一緒に覚えましょう。", "e3-pp": "過去分詞は、現在完了（have＋過去分詞）と受け身（be動詞＋過去分詞）で使います。", "e3-perf": "for は期間の長さ、since は始まった時点。経験は ever／never、完了は already／yet。", "e3-pass": "受け身は be動詞＋過去分詞。「〜によって」は by。時制は be動詞で表します。", "e3-rel": "先行詞が人なら who、ものなら which、「その人の〜」なら whose。that は人にもものにも使えます。", "s1-plant": "花のつくりは外側から、がく→花弁→おしべ→めしべ。被子植物は子房→果実、胚珠→種子。", "s1-animal": "セキツイ動物の5つのなかまは、呼吸のしかた・生まれ方・体表のようすで見分けます。", "s1-matter": "気体は「発生方法」と「性質」と「集め方」の3つをセットで覚えると強いです。", "s1-phys": "光は反射・屈折、音は振幅（大きさ）と振動数（高さ）。ばねののびは力に比例します。", "s1-earth": "火山岩は斑状組織、深成岩は等粒状組織。化石は示準化石（時代）と示相化石（環境）に分けます。", "s2-chem": "化学反応式は、矢印の左右で原子の数が同じになるように係数をつけます。", "s2-bio": "消化酵素は「どの消化液に入っていて、何を分解するか」をセットで覚えましょう。", "s2-elec": "V＝R×I。直列は抵抗の和、並列は全体の抵抗が小さくなります。電力 W＝V×A。", "s2-weather": "寒冷前線は積乱雲で短時間の強い雨、通過後は気温が下がる。温暖前線は乱層雲で長い雨。", "s3-ion": "酸は H⁺、アルカリは OH⁻。H⁺＋OH⁻→H₂O が中和です。電池はイオンになりやすい金属が−極。", "s3-motion": "速さ＝距離÷時間、仕事＝力×距離、仕事率＝仕事÷時間。単位も一緒に覚えましょう。", "s3-space": "星は1時間に15°（自転）、1か月に30°（公転）動いて見えます。図をかいて考えるのがコツです。", "s3-life": "親の遺伝子の組み合わせを表にかくと、子や孫の比が確実に出せます。", "g-pref": "県名と県庁所在地名がちがう18都道県は、テストによく出ます。地図と一緒に覚えましょう。", "g-world": "時差は経度15度で1時間。東にある都市ほど時刻が進んでいます。", "h-era": "年号は語呂合わせで覚えるのが近道です（例：なくよ（794）うぐいす平安京）。", "h-people": "人物は「何をした人か」とセットで覚えます。同じ時代の人どうしをまとめると整理しやすいです。", "c-civics": "三権分立は、国会・内閣・裁判所がおたがいに抑え合うしくみ。矢印の図をかいて覚えましょう。"};
for (const u of U) { const tip = TIPS[u.id]; u.gen = u.gen.map(g => () => { const q = g(); if (!q.ex) q.ex = tip; return q; }); }
window.TA = { UNITS: U, pick, shuffle };
})();
