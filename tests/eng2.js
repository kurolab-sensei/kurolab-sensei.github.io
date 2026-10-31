// 中2英語（リスニングつき）。すべてクロラボのオリジナル問題です。
// 入試の形式：リスニング（絵を選ぶ・応答を選ぶ・メモ完成・英問英答）、文法（適語選択・語形変化・並べかえ）、
// 読解（グラフや表を使う対話文・長文）、英作文（条件英作文）。
(function () {
const { mk, svg, line, lbl, tblH, figc, tcap, talk, passage, SEL, register } = window.KT;

/* ---------- 共通の部品 ---------- */
const BOYS = ["Ken", "Takuya", "Sota", "Ryo", "Haruto"], GIRLS = ["Yuki", "Aya", "Mika", "Saki", "Emi"];
const FRIENDS = [["Tom", "m"], ["Mike", "m"], ["Emily", "f"], ["Lisa", "f"], ["Kate", "f"], ["Bob", "m"]];
const SEL_EN = "ア〜エから一つ選び、記号で答えなさい。";
const people = (r, pick) => { const g = r() < 0.5; return { jp: pick(g ? BOYS : GIRLS), jpg: g ? "m" : "f", fr: pick(FRIENDS) }; };
const he = g => g === "m" ? "he" : "she", He = g => g === "m" ? "He" : "She", his = g => g === "m" ? "his" : "her";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const NUMW = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const timeW = (h, m) => m === 0 ? `${NUMW[h]} o'clock` : m === 30 ? `${NUMW[h]} thirty` : m === 15 ? `${NUMW[h]} fifteen` : `${NUMW[h]} forty-five`;
const timeD = (h, m) => `${h}:${String(m).padStart(2, "0")}`;
const P = (w, h, body) => svg(w, h, body);
const BL = s => s.replace(/\( \)/g, "(　　　　)").replace(/\(  ①  \)/g, "(　①　)");

/* ---------- 絵（リスニングの選択肢） ---------- */
const ICON = {
  sun: (x, y) => `<circle cx="${x}" cy="${y}" r="11" fill="#fff" stroke="#222" stroke-width="1.6"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return line(x + 15 * c, y + 15 * s, x + 21 * c, y + 21 * s, 'stroke-width="1.6"'); }).join("")}`,
  cloud: (x, y) => `<path d="M${x - 20} ${y + 8} Q${x - 24} ${y - 4} ${x - 12} ${y - 6} Q${x - 8} ${y - 18} ${x + 4} ${y - 14} Q${x + 16} ${y - 18} ${x + 18} ${y - 4} Q${x + 26} ${y} ${x + 20} ${y + 8} Z" fill="#eee" stroke="#222" stroke-width="1.6"/>`,
  rain: (x, y) => ICON.cloud(x, y - 6) + [-12, 0, 12].map(d => line(x + d, y + 8, x + d - 4, y + 18, 'stroke-width="1.6"')).join(""),
  snow: (x, y) => ICON.cloud(x, y - 6) + [-12, 0, 12].map(d => `<text x="${x + d - 4}" y="${y + 20}" font-size="12">＊</text>`).join("")
};
const wPic = k => P(84, 64, ICON[k](42, 32));
const clock = (h, m) => {
  const ha = ((h % 12) + m / 60) * 30 - 90, ma = m * 6 - 90, rad = a => a * Math.PI / 180;
  let s = `<circle cx="42" cy="34" r="27" fill="#fff" stroke="#222" stroke-width="1.6"/>`;
  for (let i = 0; i < 12; i++) { const a = rad(i * 30 - 90); s += line(42 + 23 * Math.cos(a), 34 + 23 * Math.sin(a), 42 + 27 * Math.cos(a), 34 + 27 * Math.sin(a), i % 3 ? 'stroke-width="1"' : 'stroke-width="2"'); }
  s += line(42, 34, 42 + 13 * Math.cos(rad(ha)), 34 + 13 * Math.sin(rad(ha)), 'stroke-width="3"') + line(42, 34, 42 + 21 * Math.cos(rad(ma)), 34 + 21 * Math.sin(rad(ma)), 'stroke-width="1.8"') + `<circle cx="42" cy="34" r="2" fill="#222"/>`;
  return P(84, 68, s);
};
const desk = (pos) => {
  // 机といすと、かぎの位置
  const key = (x, y) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#fff" stroke="#c33" stroke-width="1.6"/>${line(x + 3, y, x + 11, y, 'stroke="#c33" stroke-width="1.6"')}${line(x + 9, y, x + 9, y + 3, 'stroke="#c33" stroke-width="1.6"')}`;
  let s = `<rect x="10" y="30" width="44" height="5" fill="#d9c7a6" stroke="#222"/>${line(14, 35, 14, 58)}${line(50, 35, 50, 58)}
    <rect x="60" y="38" width="16" height="4" fill="#d9c7a6" stroke="#222"/>${line(76, 22, 76, 58)}${line(62, 42, 62, 58)}${line(74, 42, 74, 58)}${line(4, 58, 82, 58, 'stroke="#999"')}`;
  if (pos === "on") s += key(24, 26);
  if (pos === "under") s += key(24, 54);
  if (pos === "chair") s += key(62, 34);
  if (pos === "bag") s += `<path d="M30 30 L30 18 Q40 10 50 18 L50 30 Z" fill="#eee" stroke="#222"/>${key(34, 24)}`;
  return P(84, 64, s);
};
const TR = {
  bike: `<circle cx="22" cy="44" r="12" fill="none" stroke="#222" stroke-width="1.8"/><circle cx="62" cy="44" r="12" fill="none" stroke="#222" stroke-width="1.8"/><path d="M22 44 L36 26 L56 26 L62 44 M36 26 L44 44 L56 26 M32 20 L42 20 M56 26 L54 18 L62 18" fill="none" stroke="#222" stroke-width="1.8"/>`,
  car: `<path d="M8 44 L10 32 L24 30 L32 20 L54 20 L64 30 L76 32 L78 44 Z" fill="#eee" stroke="#222" stroke-width="1.6"/><path d="M34 24 L52 24 L58 30 L30 30 Z" fill="#fff" stroke="#222"/><circle cx="24" cy="46" r="7" fill="#fff" stroke="#222" stroke-width="1.6"/><circle cx="62" cy="46" r="7" fill="#fff" stroke="#222" stroke-width="1.6"/>`,
  bus: `<rect x="8" y="14" width="70" height="34" rx="5" fill="#eee" stroke="#222" stroke-width="1.6"/>${[14, 30, 46, 62].map(x => `<rect x="${x}" y="20" width="12" height="10" fill="#fff" stroke="#222"/>`).join("")}<circle cx="22" cy="50" r="6" fill="#fff" stroke="#222" stroke-width="1.6"/><circle cx="64" cy="50" r="6" fill="#fff" stroke="#222" stroke-width="1.6"/>`,
  walk: `<circle cx="42" cy="12" r="6" fill="#fff" stroke="#222" stroke-width="1.6"/><path d="M42 18 L40 36 M40 36 L32 54 M40 36 L50 54 M41 24 L30 32 M41 24 L52 30" fill="none" stroke="#222" stroke-width="2"/>`
};
const trPic = k => P(84, 60, TR[k]);
const THING = {
  tv: `<rect x="16" y="12" width="52" height="34" rx="3" fill="#fff" stroke="#222" stroke-width="1.8"/><rect x="21" y="17" width="42" height="24" fill="#e8eef6" stroke="#222"/>${line(34, 46, 30, 54)}${line(50, 46, 54, 54)}`,
  study: `<path d="M14 20 L42 26 L70 20 L70 50 L42 56 L14 50 Z" fill="#fff" stroke="#222" stroke-width="1.6"/>${line(42, 26, 42, 56)}${[30, 36, 42].map(y => line(20, y, 36, y + 3, 'stroke="#999"')).join("")}<path d="M56 8 L64 44 L60 46 L52 10 Z" fill="#f3d27a" stroke="#222"/>`,
  cook: `<ellipse cx="38" cy="36" rx="22" ry="9" fill="#ddd" stroke="#222" stroke-width="1.6"/>${line(60, 34, 80, 28, 'stroke-width="3"')}<path d="M28 22 Q30 14 28 8 M38 22 Q40 14 38 8 M48 22 Q50 14 48 8" fill="none" stroke="#999"/>`,
  guitar: `<ellipse cx="30" cy="42" rx="14" ry="11" fill="#e8d2b0" stroke="#222" stroke-width="1.6"/><ellipse cx="44" cy="34" rx="10" ry="8" fill="#e8d2b0" stroke="#222" stroke-width="1.6"/><circle cx="34" cy="40" r="3" fill="#222"/><path d="M50 30 L74 12" stroke="#222" stroke-width="4"/>`,
  soccer: `<circle cx="42" cy="32" r="20" fill="#fff" stroke="#222" stroke-width="1.6"/><path d="M42 24 L50 30 L47 39 L37 39 L34 30 Z" fill="#222"/>`,
  tennis: `<ellipse cx="34" cy="26" rx="14" ry="18" fill="none" stroke="#222" stroke-width="2"/>${line(34, 44, 34, 60, 'stroke-width="4"')}<circle cx="62" cy="40" r="8" fill="#e9f0a8" stroke="#222"/>`,
  basket: `<circle cx="42" cy="32" r="20" fill="#f1c48a" stroke="#222" stroke-width="1.6"/><path d="M22 32 L62 32 M42 12 L42 52 M28 18 Q38 32 28 46 M56 18 Q46 32 56 46" fill="none" stroke="#222"/>`,
  swim: `<path d="M6 40 Q16 34 26 40 T46 40 T66 40 T86 40" fill="none" stroke="#222" stroke-width="1.6"/><path d="M6 50 Q16 44 26 50 T46 50 T66 50 T86 50" fill="none" stroke="#222" stroke-width="1.6"/><circle cx="34" cy="30" r="6" fill="#fff" stroke="#222"/><path d="M40 30 L62 26" stroke="#222" stroke-width="2"/>`
};
const thPic = k => P(84, 62, THING[k]);
// Tシャツ：星やハートの数
const shirt = (mark, n) => {
  const m = (x, y) => mark === "star" ? `<path d="M${x} ${y - 6} L${x + 2} ${y - 2} L${x + 6} ${y - 2} L${x + 3} ${y + 1} L${x + 4} ${y + 6} L${x} ${y + 3} L${x - 4} ${y + 6} L${x - 3} ${y + 1} L${x - 6} ${y - 2} L${x - 2} ${y - 2} Z" fill="#222"/>` : `<path d="M${x} ${y + 5} L${x - 6} ${y - 1} Q${x - 6} ${y - 6} ${x - 2} ${y - 5} Q${x} ${y - 4} ${x} ${y - 2} Q${x} ${y - 4} ${x + 2} ${y - 5} Q${x + 6} ${y - 6} ${x + 6} ${y - 1} Z" fill="#222"/>`;
  const xs = n === 1 ? [42] : [34, 50];
  return P(84, 64, `<path d="M22 10 L34 6 Q42 12 50 6 L62 10 L74 22 L64 28 L60 24 L60 58 L24 58 L24 24 L20 28 L10 22 Z" fill="#fff" stroke="#222" stroke-width="1.6"/>${xs.map(x => m(x, 34)).join("")}`);
};

/* ---------- リスニング 大問1：絵を選ぶ ---------- */
// 各ジェネレーターは { item, block } を返す（block は放送台本の1問分）
const L1GEN = {
  weather: (r, K) => {
    const { pick, shuffle, pch } = K; const p = people(r, pick);
    const ks = ["sun", "cloud", "rain", "snow"].filter(k => k !== "snow" || r() < 0.5);
    const [am, pm] = shuffle(["sun", "cloud", "rain"]);
    const W = { sun: "sunny", cloud: "cloudy", rain: "rainy", snow: "snowy" };
    const place = pick(["Kyoto", "Sapporo", "Nagano", "Osaka"]);
    const ask = pick(["morning", "afternoon"]);
    const right = ask === "morning" ? am : pm;
    const lines = [
      { who: p.fr[0], en: `Are you going to go to ${place} tomorrow?` },
      { who: p.jp, en: `Yes. I'm a little worried about the weather.` },
      { who: p.fr[0], en: `I checked the news. It will be ${W[am]} in the morning, but it will be ${W[pm]} in the afternoon.` },
      { who: p.jp, en: `Really? I'll be there in the ${ask}. Thank you.` }
    ];
    const q = `Question: How will the weather be in ${place} tomorrow ${ask}?`;
    const opts = shuffle(["sun", "cloud", "rain", "snow"]).filter(k => k !== right).slice(0, 3);
    return { item: pch("対話と質問を聞いて、質問の答えとして最も適切な絵を、" + SEL_EN, wPic(right), opts.map(wPic), `${ask === "morning" ? "午前" : "午後"}の天気を聞いています。${W[right]} が正解です。`), lines: [...lines, { en: q }] };
  },
  time: (r, K) => {
    const { pick, shuffle, pch } = K; const p = people(r, pick);
    const h = pick([9, 10, 1, 2, 3]), m1 = pick([0, 30]);
    const h2 = (h % 12) + 1, m2 = m1;
    const lines = [
      { who: p.fr[0], en: `${p.jp}, let's go to the library together this ${pick(["Saturday", "Sunday"])}.` },
      { who: p.jp, en: `Sure. What time shall we meet?` },
      { who: p.fr[0], en: `How about ${timeW(h, m1)}?` },
      { who: p.jp, en: `Sorry, I have to help my ${pick(["mother", "father", "grandmother"])} until then. Can we meet one hour later?` },
      { who: p.fr[0], en: `OK. See you then.` }
    ];
    const right = [h2, m2], wr = [[h, m1], [h2, m1 === 0 ? 30 : 0], [h, m1 === 0 ? 30 : 0]];
    return { item: pch("対話と質問を聞いて、質問の答えとして最も適切な絵を、" + SEL_EN, clock(...right), wr.map(t => clock(...t)), `最初は ${timeD(h, m1)} でしたが、「1時間おそく」と言っているので ${timeD(h2, m2)} です。`), lines: [...lines, { en: "Question: What time will they meet?" }] };
  },
  key: (r, K) => {
    const { pick, shuffle, pch } = K; const p = people(r, pick);
    const pos = shuffle(["on", "under", "chair", "bag"]);
    const say = { on: "on the desk", under: "under the desk", chair: "on the chair", bag: "in my bag" };
    const [first, right] = pos;
    const lines = [
      { who: p.jp, en: `Mom, I can't find my key. I put it ${say[first]}, but it's not there now.` },
      { who: "Mother", en: `Did you look ${say[right] === "in my bag" ? "in your bag" : say[right]}? I saw something there this morning.` },
      { who: p.jp, en: `Oh, here it is! Thank you.` }
    ];
    return { item: pch("対話と質問を聞いて、質問の答えとして最も適切な絵を、" + SEL_EN, desk(right), pos.slice(0, 1).concat(pos.slice(2)).map(desk), `最初に置いた場所（${say[first]}）にはなく、母親が見た場所で見つかりました。`), lines: [...lines, { en: `Question: Where did ${p.jp} find ${his(p.jpg)} key?` }] };
  },
  transport: (r, K) => {
    const { pick, pch } = K; const p = people(r, pick);
    const say = { bike: "by bike", bus: "by bus", walk: "on foot", car: "by car" };
    // [いつも, 今日, 理由]（理由と手段が自然につながる組み合わせだけ）
    const [usual, today, reason] = pick([
      ["bike", "bus", "my bike was broken"], ["bike", "walk", "my bike was broken"], ["bike", "car", "it was raining hard"],
      ["bus", "bike", "I got up late and missed the bus"], ["bus", "car", "I got up late"],
      ["walk", "bus", "it was raining hard"], ["walk", "car", "my bag was very heavy"], ["walk", "bike", "I got up late"]
    ]);
    const lines = [
      { who: p.fr[0], en: `${p.jp}, how did you come to school today?` },
      { who: p.jp, en: `I usually come ${say[usual]}, but ${reason}, so I came ${say[today]}${today === "car" ? ". My father took me" : ""}.` },
      { who: p.fr[0], en: `I see. Will you go home ${say[usual]}?` },
      { who: p.jp, en: today === "car" ? `No. My father will come to pick me up.` : `No. I'll go home ${say[today]}, too.` }
    ];
    const opts = ["bike", "bus", "walk", "car"].filter(k => k !== today);
    return { item: pch("対話と質問を聞いて、質問の答えとして最も適切な絵を、" + SEL_EN, trPic(today), opts.map(trPic), `いつもは ${say[usual]} ですが、${reason} という理由で、今日は ${say[today]} で来ました。usually（いつもは）の手段を選ばないように注意します。`), lines: [...lines, { en: `Question: How did ${p.jp} come to school today?` }] };
  },
  doing: (r, K) => {
    const { pick, shuffle, pch } = K; const p = people(r, pick);
    const acts = shuffle(["tv", "study", "cook", "guitar"]);
    const say = { tv: "watching TV", study: "studying math", cook: "cooking dinner", guitar: "practicing the guitar" };
    const [right, later] = acts;
    const t = pick([7, 8, 9]);
    const lines = [
      { who: p.fr[0], en: `I called you at ${NUMW[t]} last night, but you didn't answer.` },
      { who: p.jp, en: `Sorry. I was ${say[right]} then. After that, I was ${say[later]}.` },
      { who: p.fr[0], en: `That's OK.` }
    ];
    return { item: pch("対話と質問を聞いて、質問の答えとして最も適切な絵を、" + SEL_EN, thPic(right), acts.slice(1).map(thPic), `「その時（${t}時）」にしていたのは ${say[right]} です。`), lines: [...lines, { en: `Question: What was ${p.jp} doing at ${NUMW[t]} last night?` }] };
  },
  shirt: (r, K) => {
    const { pick, pch } = K; const p = people(r, pick);
    const mark = pick(["star", "heart"]), other = mark === "star" ? "heart" : "star";
    const fam = pick([["brother", "He", "him"], ["sister", "She", "her"]]);
    const buyTwo = r() < 0.5; // 店員が最初にすすめるのは「2つ」の方。買うのは buyTwo ? 2 : 1
    const n = buyTwo ? 2 : 1;
    const lines = [
      { who: "Clerk", en: `May I help you?` },
      { who: p.jp, en: `Yes. I'm looking for a T-shirt for my ${fam[0]}. ${fam[1]} likes ${mark}s.` },
      { who: "Clerk", en: `How about this one with two ${mark}s? We also have one with only one ${mark}, and one with ${other}s.` },
      { who: p.jp, en: buyTwo ? `Well, the one with one ${mark} is nice, but ${fam[0] === "brother" ? "he" : "she"} likes big designs. I'll take the first one.` : `Hmm, the first one is nice, but ${fam[0] === "brother" ? "he" : "she"} likes simple designs. I'll take the other ${mark} one.` }
    ];
    return { item: pch("対話と質問を聞いて、質問の答えとして最も適切な絵を、" + SEL_EN, shirt(mark, n), [shirt(mark, 3 - n), shirt(other, n), shirt(other, 3 - n)], `${mark} が好きな${fam[0] === "brother" ? "弟（兄）" : "妹（姉）"}へのプレゼントです。店員が最初にすすめたのは ${mark} が2つのTシャツ。${buyTwo ? "「最初のもの（the first one）」" : "「もう一方の " + mark + " のもの（the other " + mark + " one）」"}を買うので、${n === 1 ? "1つ" : "2つ"}の ${mark} です。`), lines: [...lines, { en: `Question: Which T-shirt will ${p.jp} buy?` }] };
  },
  sport: (r, K) => {
    const { pick, shuffle, pch } = K; const p = people(r, pick);
    const sp = shuffle(["soccer", "tennis", "basket", "swim"]);
    const say = { soccer: "soccer", tennis: "tennis", basket: "basketball", swim: "swimming" };
    const [like, right] = sp;
    const lines = [
      { who: p.fr[0], en: `What sport do you like, ${p.jp}?` },
      { who: p.jp, en: `I like ${say[like]} the best. I practice it every day. But this summer, I want to try ${say[right]} with my cousin.` },
      { who: p.fr[0], en: `That sounds fun.` }
    ];
    return { item: pch("対話と質問を聞いて、質問の答えとして最も適切な絵を、" + SEL_EN, thPic(right), sp.filter(k => k !== right).map(thPic), `いちばん好きなのは ${say[like]} ですが、この夏にやってみたいのは ${say[right]} です。`), lines: [...lines, { en: `Question: What does ${p.jp} want to try this summer?` }] };
  }
};

const LISTEN_LEAD = n => `これから、(1)〜(${n})の${n}つの対話を放送します。それぞれの対話のあとに、英語で質問をします。`;

/* ---------- 応答を選ぶ（チャイムの部分に入る文） ---------- */
// 3行の対話（A→B→A）のあと、チャイムで B の応答を選ぶ。who は [Aの役, Bの役]、ja は最後の発言の訳（解説用）
const RESP = [
  { who: ["Girl", "Boy"], lines: ["Did you finish your homework?", "Not yet. The math questions are difficult.", "Shall I help you?"], ja: "手伝おうか？", right: "Yes, please. Thank you.", wr: ["No, I didn't.", "Yes, it is difficult.", "I'm fine, thank you."] },
  { who: ["Man", "Girl"], lines: ["Excuse me. How can I get to the station?", "Go straight and turn left at the second corner.", "How long does it take from here?"], ja: "ここからどのくらい時間がかかりますか。", right: "About five minutes.", wr: ["It's two hundred yen.", "Turn left at the second corner.", "By bus."] },
  { who: ["Boy", "Girl"], lines: ["This cake is really good.", "Thank you. I made it with my sister.", "Can you tell me how to make it?"], ja: "作り方を教えてくれる？", right: "Sure. It's easy.", wr: ["Yes, I made it yesterday.", "No, my sister ate it.", "It was really good."] },
  { who: ["Woman", "Boy"], lines: ["You look tired, Ken.", "I studied until midnight last night.", "You should go to bed early today."], ja: "今日は早く寝たほうがいいよ。", right: "You're right. I will.", wr: ["Yes, I did.", "I'm studying now.", "It was midnight."] },
  { who: ["Girl", "Boy"], lines: ["Let's go to the park after school.", "Sorry, I can't. I have to take care of my little brother today.", "Oh, I see. Then how about tomorrow?"], ja: "じゃあ、明日はどう？", right: "OK. Tomorrow is fine.", wr: ["Yes, I went to the park.", "He is five years old.", "I have a little brother."] },
  { who: ["Girl", "Boy"], lines: ["I'm going to visit Okinawa next month.", "Wow! Is this your first time?", "Yes. I'm so excited."], ja: "うん。すごくわくわくしているよ。", right: "I hope you'll have a good time.", wr: ["You're welcome.", "It's next month.", "No, it isn't."] },
  { who: ["Boy", "Girl"], lines: ["Can I use your dictionary?", "Sorry, I'm using it now.", "When will you finish?"], ja: "いつ終わる？", right: "In ten minutes.", wr: ["For ten years.", "Yes, I will.", "Yesterday."] },
  { who: ["Girl", "Boy"], lines: ["What are you going to do this weekend?", "I'm going to see a movie. Do you want to come with me?", "I'd love to. What time will we meet?"], ja: "行きたい。何時に会う？", right: "At ten in the morning.", wr: ["At the station.", "A movie about space.", "With my brother."] },
  { who: ["Boy", "Woman"], lines: ["Hello. This is Takeshi. May I speak to Emily, please?", "Sorry, she's out now.", "When will she come back?"], ja: "いつ帰ってきますか。", right: "In about an hour.", wr: ["Speaking.", "Yes, she will.", "She is fine, thank you."] },
  { who: ["Mother", "Girl"], lines: ["How was the school festival?", "It was great. Our class sang a song.", "Who played the piano?"], ja: "だれがピアノをひいたの？", right: "Saki did. She was great.", wr: ["We sang a song.", "It was last Saturday.", "In the gym."] },
  { who: ["Boy", "Girl"], lines: ["I can't find my pen.", "What color is it?", "It's black and white."], ja: "黒と白だよ。", right: "Is this yours? It was under your desk.", wr: ["I like black.", "Yes, I can.", "It's not my bag."] },
  { who: ["Boy", "Mother"], lines: ["Mom, I'm hungry.", "Dinner will be ready soon.", "What are we having?"], ja: "何を食べるの？", right: "Curry and rice.", wr: ["At seven.", "In the kitchen.", "Yes, I'm hungry, too."] },
  { who: ["Clerk", "Girl"], lines: ["May I help you?", "Yes. I'm looking for a cap.", "How about this one?"], ja: "こちらはいかがですか。", right: "It's nice. How much is it?", wr: ["You're welcome.", "Yes, I am.", "It's on my head."] },
  { who: ["Girl", "Boy"], lines: ["Did you watch the soccer game on TV last night?", "No, I was busy. Which team won?", "Our town's team did."], ja: "わたしたちの町のチームが勝ったよ。", right: "Really? That's great!", wr: ["No, I didn't.", "I play soccer every day.", "At eight last night."] }
];

/* ---------- リスニングの大問 ---------- */
const L1PICS = (key, title) => r => {
  const K = mk(r);
  const gens = K.sample(Object.keys(L1GEN), 4);
  const outs = gens.map(g => L1GEN[g](r, K));
  return {
    unit: "listen", title, lead: LISTEN_LEAD(outs.length) + "質問の答えとして最も適切な絵を、それぞれ ア〜エ から一つ選び、記号で答えなさい。",
    items: outs.map(o => ({ ...o.item, q: "" })),
    script: outs.map((o, i) => ({ title: `(${i + 1})`, lines: o.lines })),
    scriptIntro: "（絵を見て答える問題）"
  };
};
const ROLE_JA = { Girl: "女の子", Boy: "男の子", Woman: "女性", Man: "男性", Mother: "母親", Clerk: "店員" };
const L1RESP = r => {
  const K = mk(r);
  const qs = K.sample(RESP, 4);
  return {
    unit: "listen", title: "リスニング（対話の応答）",
    lead: "これから、(1)〜(4)の4つの対話を放送します。それぞれの対話の最後の発言のあとに、チャイムが鳴ります。チャイムのところに入る応答として最も適切なものを、それぞれ ア〜エ から一つ選び、記号で答えなさい。",
    items: qs.map(d => ({ ...K.ch("", d.right, d.wr, `最後の発言「${d.lines[2]}（${d.ja}）」に対する、${ROLE_JA[d.who[1]]}の応答を選びます。`), q: "" })),
    script: qs.map((d, i) => ({ title: `(${i + 1})`, lines: [...d.lines.map((t, j) => ({ who: d.who[j % 2], en: t })), { chime: true, en: "（チャイム）" }] }))
  };
};
// 大問2：スピーチやお知らせを聞いてメモを完成させる
const L2MEMO = r => {
  const K = mk(r);
  const { pick, int, word, ch, shuffle } = K;
  const ev = pick([
    { name: "school trip", jp: "校外学習", place1: pick(["the science museum", "the zoo", "the castle"]), place2: pick(["the park", "the river", "the art museum"]) },
    { name: "English camp", jp: "イングリッシュキャンプ", place1: pick(["the lake", "the forest"]), place2: pick(["the campsite", "the nature center"]) }
  ]);
  const meet = pick([[7, 45], [8, 0], [8, 15]]), leave = [meet[0] + (meet[1] === 45 ? 1 : 0), (meet[1] + 15) % 60];
  const items3 = shuffle(["lunch", "a cap", "something to drink", "a notebook", "a towel"]).slice(0, 2);
  const back = pick([3, 4]), backM = pick([0, 30]);
  const rainPlace = pick(["the gym", "the library", "our classroom"]);
  const day = pick(["Friday", "Thursday", "Wednesday"]);
  const sp = `Hello, everyone. I'm going to tell you about our ${ev.name} next ${day}. Please come to school by ${timeW(...meet)}. Our bus will leave at ${timeW(...leave)}. In the morning, we will visit ${ev.place1}. After lunch, we will go to ${ev.place2}. Please bring ${items3[0]} and ${items3[1]}. We will come back to school at about ${timeW(back, backM)}. If it rains, we will stay at school and watch a movie in ${rainPlace}. If you have any questions, please come to the teachers' room.`;
  const memo = tblH(null, [["日にち", `next ${day}`], ["集合時刻", "（ ① ）までに学校へ"], ["出発時刻", timeD(...leave)], ["午前", `visit （ ② ）`], ["午後", ev.place2], ["持ち物", `（ ③ ） と ${items3[1]}`], ["雨の場合", "（ ④ ）"]]);
  return {
    unit: "listen", title: "リスニング（お知らせを聞いてメモを完成）", keepAll: true,
    lead: `中学生の ${pick(GIRLS)} さんは、先生から${ev.jp}についての話を聞いて、メモをとっています。英文を聞いて、メモの ①〜④ にあてはまる内容を答えなさい。①は数字、②③は英語で、④は日本語で答えなさい。`,
    fig: tcap("メモ") + memo,
    items: [
      word("①にあてはまる時刻を、数字で書きなさい。", timeD(...meet), `「come to school by ${timeW(...meet)}」。出発時刻（${timeD(...leave)}）とまちがえないようにします。`),
      word("②にあてはまる英語を書きなさい。", ev.place1, "午前中に行く場所です。"),
      word("③にあてはまる英語を書きなさい。", items3[0], ""),
      word("④にあてはまる内容を、日本語で書きなさい。", `学校にとどまり、${{ "the gym": "体育館", "the library": "図書室", "our classroom": "教室" }[rainPlace]}で映画を見る`, "If it rains, we will stay at school and watch a movie ..."),
      ch("先生への質問があるときは、どうすればよいか。最も適切なものを、" + SEL_EN, "職員室に行く", ["バスの中で聞く", "メールを送る", "帰りの会で聞く"], "please come to the teachers' room")
    ],
    script: [{ title: "", lines: [{ who: "Teacher", en: sp }] }]
  };
};
// 大問2：スピーチを聞いて英問英答
const SPEECH = [
  (K) => {
    const { pick } = K; const n = pick(["Emily", "Kate", "Lisa"]), y = pick([2, 3]), anim = pick(["dogs", "cats"]);
    return {
      speaker: n, text: `Hi, I'm ${n}. I came to Japan from Canada ${y} years ago. In Canada, I lived with two ${anim} and my family. Now I live with a host family in this town. Last month, my host mother took me to a cooking class. I learned how to make miso soup. It was difficult at first, but I made it well in the end. My host family said it was delicious, and I was very happy. Next month, I'm going to cook miso soup for my family in Canada on the internet. I want to tell them about Japanese food.`,
      qs: [
        ["When did she come to Japan?", `She came ${NUMW[y]} years ago.`, [`She came ${NUMW[y + 1]} years ago.`, "She came last month.", "She will come next month."]],
        ["What did she learn in the cooking class?", "She learned how to make miso soup.", ["She learned how to eat sushi.", "She learned about Canada.", "She learned how to use the internet."]],
        ["What is she going to do next month?", "She is going to cook miso soup for her family in Canada on the internet.", ["She is going to go back to Canada.", "She is going to take a cooking class again.", "She is going to visit her host mother."]]
      ],
      write: ["Why was she very happy?", "Because her host family said her miso soup was delicious.", "「ホストファミリーがおいしいと言った」ことが英語で書けていれば正解。"]
    };
  },
  (K) => {
    const { pick } = K; const n = pick(["Mike", "Tom", "Bob"]), s = pick(["baseball", "basketball"]);
    return {
      speaker: n, text: `Hello. My name is ${n}. I'm from Australia. I'm a member of the ${s} team at this school. At first, I couldn't speak Japanese well, so I was nervous. But my teammates always helped me. One day, I made a big mistake in a game, and our team lost. I was sad, but my friend Ryo said to me, "Don't worry. We are a team." His words made me happy. From that day, I started to study Japanese harder. Now I can talk with my teammates in Japanese. I learned that words can give people power.`,
      qs: [
        ["Why was he nervous at first?", "Because he couldn't speak Japanese well.", ["Because he lost a game.", "Because he was from Australia.", "Because he didn't like his team."]],
        ["Who said, \"Don't worry. We are a team.\"?", "Ryo did.", [`${n} did.`, "His teacher did.", "His mother did."]],
        ["What did he learn?", "He learned that words can give people power.", ["He learned how to play " + s + ".", "He learned that the game was difficult.", "He learned that Japanese is easy."]]
      ],
      write: ["What did he start to do after that day?", "He started to study Japanese harder.", "「日本語をもっと熱心に勉強し始めた」ことが英語で書けていれば正解。"]
    };
  },
  (K) => {
    const { pick } = K; const n = pick(["Saki", "Aya", "Yuki"]), place = pick(["the beach", "the river"]), cnt = pick([30, 40, 50]);
    return {
      speaker: n, text: `Hello, everyone. Last Sunday, I joined a volunteer activity. We cleaned ${place} near our town. About ${cnt} people joined it. We found a lot of plastic bottles and bags. I was surprised because there were so many. A man there told us that plastic in the sea is a big problem for fish and birds. Now I always carry my own bag and bottle. I think small actions can change the world. Why don't you join the next activity with me?`,
      qs: [
        ["What did she do last Sunday?", `She cleaned ${place} as a volunteer.`, ["She went fishing.", "She bought a new bag.", "She swam in the sea."]],
        ["How many people joined the activity?", `About ${cnt} people did.`, [`About ${cnt + 10} people did.`, "About fifteen people did.", "Only her family did."]],
        ["Why was she surprised?", "Because there were so many plastic bottles and bags.", ["Because the river was very beautiful.", "Because she saw many fish.", "Because nobody joined the activity."]]
      ],
      write: ["What does she always carry now?", "She carries her own bag and bottle.", "「自分のバッグと水とう（ボトル）」が英語で書けていれば正解。"]
    };
  }
];
const L2SPEECH = r => {
  const K = mk(r);
  const s = K.pick(SPEECH)(K);
  return {
    unit: "listen", title: "リスニング（スピーチと質問）", keepAll: true,
    lead: `これから、留学生や中学生のスピーチを放送します。そのあとに質問を読みます。(1)〜(3)は答えとして最も適切なものを ア〜エ から一つずつ選び、(4)は英語で答えなさい。`,
    items: [
      ...s.qs.map(([q, a, w]) => ({ ...K.ch(`Question: ${q}`, a, w, ""), qHtml: `<span class="en-q">${q.replace(/</g, "&lt;")}</span>` })),
      { ...K.desc(`Question: ${s.write[0]}`, s.write[1], s.write[2], ""), qHtml: `<span class="en-q">${s.write[0]}</span>（英語で答えなさい）` }
    ],
    script: [{ title: "", lines: [{ who: s.speaker, en: s.text }, ...s.qs.map(([q], i) => ({ en: `Question ${i + 1}: ${q}`, pause: 6 })), { en: `Question 4: ${s.write[0]}`, pause: 10 }] }]
  };
};


/* ---------- 文法 ---------- */
// [英文（空所は ( )）, 正解, 誤答3つ, 解説]
const G_CHOICE = [
  ["I ( ) TV when my mother came home.", "was watching", ["am watching", "watch", "have watched"], "「〜していた」は過去進行形 was ＋ -ing。"],
  ["It ( ) rain tomorrow. Take your umbrella.", "will", ["is", "was", "did"], "未来のことは will ＋ 動詞の原形。"],
  ["I'm going ( ) my grandfather next Sunday.", "to visit", ["visit", "visiting", "visited"], "be going to ＋ 動詞の原形。"],
  ["I want ( ) a doctor in the future.", "to be", ["be", "being", "am"], "want to ＋ 動詞の原形「〜したい」。"],
  ["She went to the library ( ) some books.", "to borrow", ["borrow", "borrowing", "borrowed"], "目的を表す不定詞「〜するために」。"],
  ["I have a lot of homework ( ) today.", "to do", ["do", "doing", "did"], "形容詞的用法の不定詞「するべき〜」。"],
  ["My brother enjoys ( ) the guitar.", "playing", ["to play", "play", "played"], "enjoy の後ろは動名詞（-ing）。"],
  ["Thank you for ( ) me.", "helping", ["help", "to help", "helped"], "前置詞 for の後ろは動名詞。"],
  ["( ) English is interesting for me.", "Learning", ["Learn", "Learned", "Learns"], "主語になる動名詞「〜すること」。"],
  ["If it ( ) sunny tomorrow, let's go fishing.", "is", ["will be", "was", "be"], "if の中は未来のことでも現在形。"],
  ["I didn't go out ( ) it was raining.", "because", ["but", "if", "so"], "理由を表す because。"],
  ["I think ( ) this book is useful.", "that", ["what", "when", "because"], "think that 〜「〜だと思う」。"],
  ["There ( ) two cats under the table.", "are", ["is", "be", "was"], "後ろが複数なので are。"],
  ["You ( ) be quiet in the library.", "must", ["have", "are", "can't"], "must「〜しなければならない」。"],
  ["Ken ( ) to get up early tomorrow.", "has", ["have", "must", "is"], "主語が3人称単数なので has to。"],
  ["You ( ) have to come to school tomorrow. It's a holiday.", "don't", ["mustn't", "aren't", "didn't"], "don't have to「〜する必要はない」。"],
  ["This bag is ( ) than that one.", "bigger", ["big", "biggest", "more big"], "than があるので比較級。g を重ねる。"],
  ["Mt. Fuji is the ( ) mountain in Japan.", "highest", ["higher", "high", "most high"], "the ＋ 最上級 ＋ in 〜。"],
  ["This question is ( ) difficult than that one.", "more", ["most", "much", "very"], "長い語の比較級は more ＋ 原級。"],
  ["My bike is as ( ) as yours.", "old", ["older", "oldest", "more old"], "as ＋ 原級 ＋ as。"],
  ["Which do you like ( ), summer or winter?", "better", ["good", "best", "well"], "2つを比べて「どちらが好き」は like 〜 better。"],
  ["This song is loved ( ) many young people.", "by", ["with", "for", "of"], "受け身の「〜によって」は by。"],
  ["English ( ) in many countries.", "is spoken", ["speaks", "spoke", "is speaking"], "「話されている」は受け身 be ＋ 過去分詞。"],
  ["My friends call ( ) Ken.", "me", ["my", "I", "mine"], "call A B「A を B と呼ぶ」。A は目的格。"],
  ["The news made ( ) happy.", "us", ["our", "we", "ours"], "make A B「A を B にする」。"],
  ["My uncle gave ( ) a nice watch.", "me", ["my", "I", "mine"], "give A B「A に B をあたえる」。"],
  ["Do you know how ( ) this machine?", "to use", ["use", "using", "used"], "how to ＋ 動詞の原形「〜のしかた」。"],
  ["When I ( ) home, my sister was cooking.", "got", ["get", "will get", "getting"], "過去のできごとなので過去形。"],
  ["( ) you help me with my homework?", "Will", ["Are", "Did", "Must"], "Will you 〜?「〜してくれませんか」。"],
  ["( ) I open the window? ― Yes, please.", "Shall", ["Will", "Do", "Am"], "Shall I 〜?「〜しましょうか」。"]
];
// 語形変化：[英文（変化させる語は（ ）内）, 答え, 解説]
const G_FORM = [
  ["I (swim) in the river when it started to rain.", "was swimming", "過去進行形。"],
  ["He (write) a letter to his friend yesterday.", "wrote", "write の過去形。"],
  ["My sister is (tall) than my mother.", "taller", "比較級。"],
  ["This is the (good) idea of all.", "best", "good の最上級。"],
  ["Stop (talk) and listen to me.", "talking", "stop の後ろは動名詞。"],
  ["Many people (visit) this temple every year.", "visit", "主語が複数・現在なのでそのまま。"],
  ["This temple was (build) about 500 years ago.", "built", "受け身なので過去分詞。"],
  ["I have two (child).", "children", "child の複数形。"],
  ["She (have) to clean her room last Sunday.", "had", "過去なので had to。"],
  ["Yuki is the (busy) student in our class.", "busiest", "y を i にかえて -est。"],
  ["We (be) in the gym at that time.", "were", "主語が複数・過去。"],
  ["He (study) English for two hours yesterday.", "studied", "y を i にかえて -ed。"],
  ["This book is (interesting) than that one.", "more interesting", "長い語の比較級。"],
  ["Is this cake (make) by your father?", "made", "受け身なので過去分詞。"],
  ["My brother is good at (run).", "running", "前置詞の後ろは動名詞。n を重ねる。"]
];
// 並べかえ：[A の発言, B の発言（並べかえ部分は {}）, 正しい語順]
const G_ORDER = [
  ["What do you want to do this summer?", "I {want / to / Hokkaido / visit}.", "want to visit Hokkaido"],
  ["Why did you go to the park?", "I went there {to / pictures / take / of} flowers.", "to take pictures of"],
  ["Do you have any plans for tomorrow?", "Yes. {going / I'm / to / see} a movie with my brother.", "I'm going to see"],
  ["What were you doing at nine last night?", "{was / I / a / reading} book in my room.", "I was reading a"],
  ["Which is the longest river in Japan?", "The Shinano River {is / longest / the / river} in Japan.", "is the longest river"],
  ["Can you play the piano?", "No, but I {how / know / play / to} the guitar.", "know how to play"],
  ["What's your favorite subject?", "I like math. {is / me / it / for / easy} to solve problems.", "It is easy for me"],
  ["What do you call this dog?", "We {him / call / Pochi}.", "call him Pochi"],
  ["Is this temple old?", "Yes. It {built / was / 300 / years} ago.", "was built 300 years"],
  ["Shall we go out?", "Sorry. I {have / do / to / my} homework now.", "have to do my"],
  ["What do you think of this book?", "I think {more / is / it / interesting} than that one.", "it is more interesting"],
  ["Did you enjoy the party?", "Yes. I enjoyed {with / talking / friends / my}.", "talking with my friends"],
  ["What did your father give you?", "He {me / a / gave / bike} for my birthday.", "gave me a bike"]
];
// 対話文の適文補充
const G_DIALOG = [
  ["A: I'm going to the zoo with my family tomorrow.\nB: ( )\nA: I want to see pandas.", "What animal do you want to see?", ["When did you go there?", "How did you get there?", "Who went with you?"]],
  ["A: You look sad. ( )\nB: I lost my favorite pen.", "What's wrong?", ["Where are you from?", "How much is it?", "Can I help you?"]],
  ["A: Can I use your eraser?\nB: ( ) Here you are.", "Of course.", ["No, thank you.", "I'm sorry.", "You're welcome."]],
  ["A: How was your trip to Kyoto?\nB: ( ) I visited many temples.", "It was wonderful.", ["I went there by train.", "It will be fine.", "For three days."]],
  ["A: Let's play tennis after school.\nB: ( ) I have to go to the dentist.", "Sorry, I can't.", ["Yes, let's.", "That's a good idea.", "Sure, I can."]],
  ["A: Which bus goes to the stadium?\nB: ( ) It leaves at ten.", "Take the No. 5 bus.", ["It takes thirty minutes.", "It's next to the station.", "I like baseball."]],
  ["A: Hello. This is Ken. Is Tom there?\nB: ( ) Hold on, please.", "Yes, he is.", ["No, he isn't.", "Speaking.", "You have the wrong number."]],
  ["A: I'll make dinner tonight.\nB: Really? ( )\nA: Curry. I learned how to make it at school.", "What are you going to make?", ["When did you make it?", "Who made it?", "Where will you eat?"]]
];
const gramChoice = r => {
  const K = mk(r);
  const qs = K.sample(G_CHOICE, 6);
  return { unit: "gram", title: "適切な語句を選ぶ", lead: "次の英文の（ ）に入る最も適切なものを、それぞれ ア〜エ から一つ選び、記号で答えなさい。", items: qs.map(([q, a, w, ex]) => ({ ...K.ch(q, a, w, ex), qHtml: `<span class="en-q">${BL(q)}</span>` })) };
};
const gramForm = r => {
  const K = mk(r);
  const qs = K.sample(G_FORM, 6);
  return { unit: "gram", title: "語の形をかえる", lead: "次の英文の（ ）内の語を、適切な形（1語または2語）にかえて書きなさい。", items: qs.map(([q, a, ex]) => ({ ...K.word(q, a, ex), qHtml: `<span class="en-q">${q}</span>` })) };
};
const gramOrder = r => {
  const K = mk(r);
  const qs = K.sample(G_ORDER, 5);
  return {
    unit: "gram", title: "語の並べかえ（対話文）", lead: "次の対話文の { } 内の語（句）を、意味が通るように並べかえて、{ } 内の英語を正しい順に書きなさい。ただし、文の最初にくる語も小文字で示してある場合があります。",
    items: qs.map(([a, b, ans]) => { const m = b.match(/\{(.+?)\}/), words = K.shuffle(m[1].split(" / ")).join(" / ").replace(/^(\w)/, c => c.toLowerCase()); const bb = b.replace(m[0], `{ ${words} }`); return { ...K.word(`A: ${a}　B: ${bb}`, ans, "", { wide: true }), qHtml: `<span class="en-q">A: ${a}<br>B: ${bb}</span>` }; })
  };
};
const gramDialog = r => {
  const K = mk(r);
  const qs = K.sample(G_DIALOG, 4);
  return { unit: "gram", title: "対話文の空所補充", lead: "次の対話文の（ ）に入る最も適切な英文を、それぞれ ア〜エ から一つ選び、記号で答えなさい。", items: qs.map(([d, a, w]) => ({ ...K.ch(d.replace(/\n/g, " "), a, w, ""), qHtml: `<span class="en-q">${BL(d).replace(/\n/g, "<br>")}</span>` })) };
};
// 書きかえ（同じ意味）
const G_REWRITE = [
  ["I can't swim well. / I'm not a good ( ).", "swimmer"],
  ["Tom is taller than Ken. / Ken is ( ) than Tom.", "shorter"],
  ["Let's go shopping. / ( ) we go shopping?", "Shall"],
  ["She can speak French. / She is ( ) to speak French.", "able"],
  ["Don't run in the room. / You ( ) run in the room.", "mustn't"],
  ["My house has three rooms. / ( ) are three rooms in my house.", "There"],
  ["He began to write a letter. / He began ( ) a letter.", "writing"],
  ["My mother made this cake. / This cake was ( ) by my mother.", "made"],
  ["This box is heavier than that box. / That box is ( ) than this box.", "lighter"],
  ["I was very happy when I heard the news. / The news ( ) me very happy.", "made"]
];
const gramRewrite = r => {
  const K = mk(r);
  const qs = K.sample(G_REWRITE, 5);
  return { unit: "gram", title: "同じ意味の文に書きかえる", lead: "次の各組の英文がほぼ同じ意味になるように、（ ）に入る適切な英語を1語書きなさい。", items: qs.map(([q, a]) => ({ ...K.word(q, a, ""), qHtml: `<span class="en-q">${BL(q).replace(" / ", "<br>")}</span>` })) };
};

/* ---------- 読解 ---------- */
// グラフを使った対話文（数量の読み取り：入試で毎年出る形）
const readGraph = r => {
  const K = mk(r);
  const { pick, shuffle, int, ch, word, desc } = K;
  const p = people(r, pick);
  const acts = shuffle([["go to the sea", "海に行く"], ["read books", "本を読む"], ["play sports", "スポーツをする"], ["travel abroad", "海外旅行をする"], ["see movies", "映画を見る"]]).slice(0, 4);
  const vals = shuffle([14, 9, 7, 5, 4, 12, 3]).slice(0, 4).sort((a, b) => b - a);
  while (vals[0] === vals[1]) vals[1]--;
  const total = vals.reduce((a, b) => a + b, 0) + int(1, 3);
  const others = total - vals.reduce((a, b) => a + b, 0);
  const lab = ["A", "B", "C", "D"];
  const ord = shuffle([0, 1, 2, 3]); // ord[k] = グラフの棒 k に入る活動
  const barOf = i => lab[ord.indexOf(i)];
  const W = 300, H = 170;
  let g = line(40, 140, 290, 140) + line(40, 10, 40, 140);
  for (let v = 0; v <= 16; v += 4) g += line(36, 140 - v * 8, 290, 140 - v * 8, 'stroke="#ccc" stroke-width="0.6"') + `<text x="32" y="${144 - v * 8}" text-anchor="end" font-size="10">${v}</text>`;
  ord.forEach((ai, k) => { g += `<rect x="${58 + k * 46}" y="${140 - vals[ai] * 8}" width="28" height="${vals[ai] * 8}" fill="#cfd8e3" stroke="#222"/><text x="${72 + k * 46}" y="156" text-anchor="middle" font-weight="700">${lab[k]}</text>`; });
  g += `<rect x="${58 + 4 * 46}" y="${140 - others * 8}" width="28" height="${others * 8}" fill="#eee" stroke="#222"/><text x="${72 + 4 * 46}" y="156" text-anchor="middle" font-size="11">others</text><text x="4" y="10" font-size="10">(人)</text>`;
  const fig = figc(svg(W, H, g), `What do you want to do this summer?（${total}人に聞いた結果）`);
  const T = p.fr[0];
  const sents = [
    [T, `${p.jp}, what is this graph about?`],
    [p.jp, `I asked my classmates, "What do you want to do this summer?" ${total} students answered.`],
    [T, `I see. Many students want to ${acts[0][0]}.`],
    [p.jp, `Yes. ${acts[0][0][0].toUpperCase() + acts[0][0].slice(1)} is the most popular. ${NUMW[vals[1]] ? NUMW[vals[1]][0].toUpperCase() + NUMW[vals[1]].slice(1) : vals[1]} students want to ${acts[1][0]}.`],
    [T, `How about ${acts[2][0].replace(/^(\w+)/, "$1ing").replace("going to", "going to").replace("playing sports", "playing sports")}?`],
    [p.jp, `(  ①  ) students chose it. ${acts[3][0][0].toUpperCase() + acts[3][0].slice(1)} is less popular than that.`],
    [T, `Interesting. What do you want to do, ${p.jp}?`],
    [p.jp, `I want to ${acts[3][0]}, because I want to ${pick(["learn about other cultures", "try something new", "relax and enjoy myself"])}.`]
  ];
  const fixIng = s => s.replace("How about go to the sea?", "How about going to the sea?").replace("How about read books?", "How about reading books?").replace("How about play sports?", "How about playing sports?").replace("How about travel abroad?", "How about traveling abroad?").replace("How about see movies?", "How about seeing movies?");
  const html = `<span class="talk en-q">${sents.map(([w, t]) => `<span><b>${w}</b>: ${BL(fixIng(t))}</span>`).join("")}</span>`;
  return {
    unit: "read", title: "グラフを使った対話文", lead: `中学生の ${p.jp} と留学生の ${T} が、${p.jp} の作ったグラフを見ながら話しています。対話文とグラフを読んで、あとの問いに答えなさい。` + html, fig,
    items: [
      ch(`グラフの A〜D のうち、「${acts[1][1]}」を表しているのはどれか。` + SEL, barOf(1), lab.filter(x => x !== barOf(1)), `2番目に多い ${vals[1]} 人の棒です。`),
      word("（ ① ）にあてはまる数を、算用数字で書きなさい。", String(vals[2]), `グラフで3番目に多い棒（${acts[2][1]}）を読み取ります。`),
      ch(`グラフの D の棒が表しているものを、` + SEL, acts[ord[3]][1], acts.filter((_, i) => i !== ord[3]).map(a => a[1]), "対話文に出てくる順番と人数をグラフに当てはめます。"),
      ch("対話文の内容と合うものを、" + SEL, `${p.jp} wants to ${acts[3][0]} this summer.`, [`${T} made the graph.`, `${total + 5} students answered the question.`, `${acts[3][0][0].toUpperCase() + acts[3][0].slice(1)} is the most popular.`], ""),
      desc(`あなたがこの夏にしたいことを、理由をふくめて2文の英語で書きなさい。`, `I want to read books this summer. I want to read many books about history.（例）`, "したいこと（I want to 〜）と理由が、文法的に正しく書けていれば正解。", "")
    ]
  };
};
// ポスター・時刻表の読み取り（数量の計算）
const readPoster = r => {
  const K = mk(r);
  const { pick, int, ch, word } = K;
  const ad = pick([500, 600, 800]), ch1 = ad / 2, fam = ad * 2 + ch1 * 2 - pick([100, 200]);
  const open = pick([9, 10]), close = pick([17, 18]), show = pick([[11, 0], [11, 30]]), show2 = [show[0] + 3, show[1]];
  const day = pick(["Monday", "Tuesday", "Wednesday"]);
  const poster = `<div class="passage en"><p style="text-align:center;text-indent:0"><b>Midori City Science Museum</b></p>
    <p style="text-indent:0">Open: ${open}:00 a.m. − ${close - 12}:00 p.m.（Closed on ${day}s）<br>
    Tickets: Adults ${ad} yen / Students (6−15) ${ch1} yen / Children under 6: free<br>
    Family Ticket (2 adults and 2 students): ${fam} yen<br>
    Planetarium Show: ${timeD(...show)} a.m. and ${timeD(show2[0] - 12, show2[1])} p.m. (40 minutes)<br>
    * You can make your own robot in the Robot Room on weekends.</p></div>`;
  const kids = pick([1, 2]);
  return {
    unit: "read", title: "ポスターの読み取り", lead: `次は、ある科学館のポスターです。これを読んで、あとの問いに答えなさい。` + poster,
    items: [
      word(`大人2人と中学生${kids}人で入館するとき、入館料は最も安くて合計何円か。`, `${kids === 2 ? Math.min(fam, ad * 2 + ch1 * 2) : ad * 2 + ch1}円`, kids === 2 ? `家族チケット ${fam} 円の方が、ふつうに買う ${ad * 2 + ch1 * 2} 円より安い。` : `家族チケットは大人2人・生徒2人なので使えません。${ad}×2＋${ch1}`),
      ch("この科学館が休みの日を、" + SEL, day, DAYS.filter(d => d !== day).slice(0, 3), `Closed on ${day}s`),
      ch(`午後のプラネタリウムが終わる時刻を、` + SEL, `${show2[0] - 12}:${String(show2[1] + 40).padStart(2, "0")} p.m.`, [`${show2[0] - 12}:${String(show2[1]).padStart(2, "0")} p.m.`, `${show[0]}:${String(show[1] + 40).padStart(2, "0")} a.m.`, `${close - 12}:00 p.m.`], "40分間のショーです。"),
      ch("ポスターの内容と合うものを、" + SEL, "Robots can be made by visitors on Saturdays and Sundays.", [`Children under 6 must pay ${ch1} yen.`, "The planetarium show is held three times a day.", `The museum opens at ${open + 1}:00 a.m.`], "on weekends＝土日")
    ]
  };
};
// 長文読解（スピーチ・物語）
const STORIES = [
  {
    title: "祖母の畑",
    paras: [
      "When I was in elementary school, I often visited my grandmother's house in the country. She had a small field behind her house and grew vegetables there. I didn't like vegetables, so I didn't want to help her. ①<u>She always said, \"Vegetables are like people. They grow well when someone cares about them.\"</u> I didn't understand her words then.",
      "Last spring, my grandmother hurt her leg. She couldn't work in her field, so I went to her house every weekend to help her. At first, the work was very hard. I had to carry water and pull weeds under the hot sun. But I gradually began to enjoy it. I talked to the tomatoes when I gave them water. My grandmother laughed and said, \"Now you are a farmer.\"",
      "In summer, we picked a lot of tomatoes. They were red and shiny. I ate one in the field. It was the most delicious tomato I had ever eaten. Then I remembered her words. I understood ②<u>what she meant</u>. The tomatoes grew well because we took care of them every day.",
      "Now I want to be a person who can care about people and things around me, like my grandmother. I'm going to grow vegetables with my family at home this year."
    ],
    qs: K => [
      K.desc("下線部①で、祖母は野菜をどのようなものだと言っているか。日本語で書きなさい。", "人と同じで、だれかが気にかけて世話をするとよく育つもの。", "「人のよう」「世話をする（気にかける）とよく育つ」の両方で正解。", ""),
      K.ch("筆者が春から週末ごとに祖母の家に行った理由を、" + SEL, "祖母が足をけがして、畑仕事ができなかったから。", ["野菜が好きになったから。", "祖母に農業を習いたかったから。", "トマトを食べたかったから。"], ""),
      K.ch("下線部②の内容として最も適切なものを、" + SEL, "毎日世話をしたからトマトがよく育ったということ。", ["トマトは赤くてつやがあるということ。", "畑仕事はとても大変だということ。", "祖母が筆者を農家だと思っていること。"], ""),
      K.word("本文の内容に合うように、次の英文の（ ）に入る英語1語を書きなさい。　The writer talked to the tomatoes when the writer gave them ( ).", "water", ""),
      K.ch("本文の内容と合うものを、" + SEL, "The writer is going to grow vegetables at home this year.", ["The writer liked vegetables when the writer was a child.", "The grandmother hurt her arm last spring.", "The writer couldn't eat any tomatoes in summer."], "")
    ]
  },
  {
    title: "一枚の地図",
    paras: [
      "Last year, a family from Brazil moved into the house next to mine. Their son, Lucas, was a student at my school. He was kind, but he didn't know much about our town, and he couldn't read Japanese well.",
      "One day, Lucas told me that he got lost on his way to the city library. \"All the signs were in Japanese,\" he said. I felt sorry for him. I thought, \"What can I do for him?\"",
      "I decided to make a map of our town in easy Japanese and English. I walked around the town with my camera and took pictures of the station, the library, the hospital, and some shops. When I didn't know the English names of some places, my English teacher helped me. It took about a month to finish ①<u>it</u>.",
      "When I gave the map to Lucas, he looked very happy. He said, \"Thank you! Now I can go anywhere in this town.\" A few weeks later, his mother asked me to make more copies for other families from abroad. Now the map is in the city office, and many people use it.",
      "From this experience, I learned that ②<u>a small idea can help many people</u>. I want to keep thinking about what I can do for people around me."
    ],
    qs: K => [
      K.ch("Lucas が図書館に行く途中で道に迷った理由を、" + SEL, "標識がすべて日本語で書かれていたから。", ["図書館が休みだったから。", "地図を持っていなかったから。", "カメラをなくしたから。"], ""),
      K.word("下線部①の it が指すものを、本文中から英語3語で抜き出しなさい。", "a map of our town（a map of ... でも可）", ""),
      K.ch("筆者が地図を作るときにしたことを、" + SEL, "町を歩いて、駅や図書館などの写真をとった。", ["Lucas といっしょに地図を作った。", "市役所の人に英語を教わった。", "1週間で地図を完成させた。"], ""),
      K.desc("下線部②について、筆者がそう考えたのはなぜか。本文の内容をもとに日本語で書きなさい。", "自分が作った地図を、Lucas だけでなく外国から来た多くの家族や人々が使うようになったから。", "「地図」と「多くの人が使っている（役立った）」の両方が書けていれば正解。", ""),
      K.ch("本文の内容と合うものを、" + SEL, "The map is now used by many people in the city.", ["Lucas could read Japanese very well.", "Lucas's mother made the map.", "The writer's English teacher took the pictures."], "")
    ]
  }
];
const readStory = r => {
  const K = mk(r);
  const s = K.pick(STORIES);
  return { unit: "read", title: `長文読解（${s.title}）`, lead: "次の英文は、中学生が英語の授業で書いた文章です。これを読んで、あとの問いに答えなさい。" + passage(s.paras, { en: true }), items: s.qs(K) };
};
// Eメール（基本）
const readMail = r => {
  const K = mk(r);
  const { pick, ch, word } = K;
  const p = people(r, pick);
  const day = pick(["Saturday", "Sunday"]), t = pick([[10, 0], [1, 30], [2, 0]]), pl = pick([["the station", "駅"], ["the park", "公園"], ["the bookstore", "本屋"]]);
  const mail = `<div class="passage en"><p style="text-indent:0">Hi ${p.jp},<br>Thank you for your e-mail. I'm happy that you can come to my birthday party this ${day}. It will start at ${timeW(...t)}. My house is near ${pl[0]}, so let's meet there fifteen minutes before the party. My mother is going to make a big cake. Please bring your favorite CD. We can listen to music together.<br>See you,<br>${p.fr[0]}</p></div>`;
  const mm = t[1] - 15 < 0 ? [t[0] - 1, t[1] + 45] : [t[0], t[1] - 15];
  return {
    unit: "read", title: "Eメールの読み取り", lead: `次は、${p.fr[0]} が ${p.jp} に送ったEメールです。これを読んで、あとの問いに答えなさい。` + mail,
    items: [
      ch(`${p.jp} は何時にどこで ${p.fr[0]} と会うか。` + SEL, `${timeD(...mm)} に${pl[1]}`, [`${timeD(...t)} に${pl[1]}`, `${timeD(...mm)} に${p.fr[0]}の家`, `${timeD(...t)} に${p.fr[0]}の家`], "パーティーの15分前に待ち合わせます。"),
      ch(`${p.jp} がパーティーに持っていくものを、` + SEL, "好きなCD", ["大きなケーキ", "プレゼントの本", "写真"], ""),
      word(`次の質問に英語で答えなさい。　Who is going to make a cake?`, `${p.fr[0]}'s mother is.（His/Her mother is. も可）`, ""),
      ch("このEメールの目的として最も適切なものを、" + SEL, "パーティーの時間や待ち合わせを知らせること", ["パーティーに招待するかどうかを相談すること", "誕生日プレゼントのお礼を言うこと", "おすすめの音楽を紹介すること"], "")
    ]
  };
};

/* ---------- 英作文 ---------- */
const TOPICS = [
  ["休日にしたいこと", "What do you want to do on holidays?", "I want to go to the mountains with my family. I like walking in nature. I can also take beautiful pictures there."],
  ["あなたの町のおすすめの場所（ALT に紹介する）", "What is a good place in your town?", "Midori Park is a good place in our town. It has many cherry trees. You can see beautiful flowers in spring."],
  ["朝食はご飯とパンのどちらがよいか", "Rice or bread for breakfast?", "I think rice is better for breakfast. It gives us a lot of energy. I can study hard in the morning."],
  ["中学校の思い出に残る行事", "What is your best memory at school?", "My best memory is the chorus contest. We practiced hard every day. We won first prize, and I was very happy."],
  ["将来つきたい仕事", "What do you want to be in the future?", "I want to be a nurse. I want to help sick people. I will study science hard."],
  ["友だちといっしょに勉強するのはよいか", "Is it good to study with friends?", "I think it is good to study with friends. We can teach each other. It is also more fun than studying alone."]
];
const writeTopic = r => {
  const K = mk(r);
  const [jp, en, ex] = K.pick(TOPICS);
  const n = K.pick([3, 4]), w = n === 3 ? 15 : 20;
  return {
    unit: "write", title: "条件英作文", lead: `ALT の先生から「${en}」という質問がありました。あなたの考えを、次の条件にしたがって英語で書きなさい。<span class="exp"><b>【条件】</b><span class="st">・テーマ：${jp}</span><span class="st">・${n}文以上、全体で${w}語以上で書く（, や . は語数にふくめない）</span><span class="st">・理由を1つ以上ふくめる</span></span>`,
    items: [K.desc(`あなたの考えを英語で書きなさい。`, `（例）${ex}`, `条件（${n}文以上・${w}語以上・理由あり）を満たし、内容が伝わればよい。つづり・文法のまちがい1つにつき1点減点（目安）。`, "")]
  };
};
const SCENES = [
  ["相手に、昨日の夜の8時に何をしていたかたずねるとき。", "What were you doing at eight last night?"],
  ["自分は将来、外国で働きたいと伝えるとき。", "I want to work in a foreign country in the future."],
  ["相手に、窓を開けましょうかと申し出るとき。", "Shall I open the window?"],
  ["この本はあの本よりおもしろいと伝えるとき。", "This book is more interesting than that one."],
  ["明日は早く起きなければならないと伝えるとき。", "I have to get up early tomorrow."],
  ["相手に、駅への行き方を知っているかたずねるとき。", "Do you know how to get to the station?"],
  ["もし明日晴れたら、テニスをしようとさそうとき。", "If it is sunny tomorrow, let's play tennis."],
  ["この寺は約400年前に建てられたと説明するとき。", "This temple was built about 400 years ago."],
  ["相手に、宿題を手伝ってくれないかとたのむとき。", "Will you help me with my homework?"],
  ["日本では、たくさんの人が桜を見に行くと説明するとき。", "Many people go to see cherry blossoms in Japan."]
];
const writeScene = r => {
  const K = mk(r);
  const qs = K.sample(SCENES, 4);
  return { unit: "write", title: "場面に合う英文を書く", lead: "次のような場面で、あなたならどのように言うか。それぞれ英語1文で書きなさい。", items: qs.map(([q, a]) => K.desc(q, `（例）${a}`, "場面に合い、文法的に正しければ正解。", "", { wide: true })) };
};
const writeDialog = r => {
  const K = mk(r);
  const p = people(r, K.pick);
  const d = K.pick([
    { a: `I'm going to stay in Japan for one more month. Where should I go?`, ex: "You should go to Kyoto. You can see many old temples there.", jp: "おすすめの場所とその理由" },
    { a: `I want to make a Japanese friend. What should I do?`, ex: "You should join a club. You can make friends there.", jp: "友だちをつくる方法とその理由" },
    { a: `I want to learn Japanese culture. What can I try?`, ex: "You can try shodo. It is fun to write kanji with a brush.", jp: "体験できる日本文化とその理由" }
  ]);
  return {
    unit: "write", title: "対話の空所に英文を書く",
    lead: `留学生の ${p.fr[0]} と ${p.jp} が話しています。${p.fr[0]} の質問に対して、${p.jp} になったつもりで、（ ）に入る英文を2文で書きなさい。` + `<span class="talk en-q"><span><b>${p.fr[0]}</b>: ${d.a}</span><span><b>${p.jp}</b>: (　　　　　　　　　　　　　　　　　　　　)</span><span><b>${p.fr[0]}</b>: Thank you. I'll try it.</span></span>`,
    items: [K.desc(`（ ）に入る英文を、${d.jp}がわかるように2文で書きなさい。`, `（例）${d.ex}`, "質問に合う答えと理由の2文が、文法的に正しく書けていれば正解。", "")]
  };
};

/* ===================================================================== */
register("eng2", { name: "中学2年 英語", grade: 2, minutes: 50, units: { listen: "リスニング", gram: "文法・語法", read: "読解（対話文・長文・資料）", write: "英作文" }, unitMax: { listen: 2 }, defaults: { listen: 2, gram: 2, read: 2, write: 1 } }, ({ add, adv }) => {
  const L = (name, f, group, rank) => add("listen", name, f, { lv: 0, group, rank });
  L("リスニング：絵を選ぶ", L1PICS("pics", "リスニング（絵を選ぶ）"), "L1", 1);
  L("リスニング：対話の応答", L1RESP, "L1", 1);
  L("リスニング：メモの完成", L2MEMO, "L2", 2);
  L("リスニング：スピーチ", L2SPEECH, "L2", 2);
  add("gram", "適語選択", gramChoice);
  add("gram", "語形変化", gramForm);
  add("gram", "書きかえ", gramRewrite);
  adv("gram", "並べかえ", gramOrder);
  adv("gram", "対話文の空所補充", gramDialog);
  add("read", "Eメール", readMail);
  adv("read", "ポスター", readPoster);
  adv("read", "グラフと対話文", readGraph);
  adv("read", "長文読解", readStory);
  add("write", "場面英作文", writeScene);
  adv("write", "条件英作文", writeTopic);
  adv("write", "対話の空所の英作文", writeDialog);
});
})();
