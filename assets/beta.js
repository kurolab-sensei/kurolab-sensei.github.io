// β版のお知らせ（各アプリのページの一番下に出す）。印刷には出さない。
(function () {
  var home = location.pathname.indexOf("/games/") >= 0 || location.pathname.indexOf("/tests/") >= 0 || location.pathname.indexOf("/tools/") >= 0 ? "../index.html#feedback" : "index.html#feedback";
  var form = "https://docs.google.com/forms/d/e/1FAIpQLSfimPgnPoBi_XNWT6m3Sh8ceKHxzAIVu8mKS_zi1ShHjb9iQA/viewform";
  var st = document.createElement("style");
  st.textContent = ".kl-beta{box-sizing:border-box;max-width:760px;margin:24px auto 16px;padding:10px 16px;border:2px dashed #e8b64c;border-radius:10px;background:#fffdf6;color:#23302a;font:14px/1.7 'Zen Maru Gothic','Hiragino Sans',sans-serif;text-align:center}.kl-beta b.bb{background:#e8b64c;border-radius:5px;padding:0 6px;margin-right:6px}.kl-beta a{color:#1f4a3c;font-weight:700}@media print{.kl-beta{display:none!important}}";
  document.head.appendChild(st);
  var d = document.createElement("div");
  d.className = "kl-beta";
  d.innerHTML = '<b class="bb">β版</b>このアプリは試作中です。使ってみた感想・要望・まちがいを<a href="' + form + '" target="_blank" rel="noopener">匿名フォーム</a>から教えてください。声をもとにバージョンアップします。（<a href="' + home + '">ほかのアプリ</a>）';
  // 先生向けページ（テスト・ツール）だけに本の案内を出す。生徒向けゲームには出さない。
  var book = null;
  if (location.pathname.indexOf("/tests/") >= 0 || location.pathname.indexOf("/tools/") >= 0) {
    var shiji = location.pathname.indexOf("shiji") >= 0;
    var img = "../assets/books/ai-shijibun-57.jpg";
    st.textContent += ".kl-book{box-sizing:border-box;max-width:760px;margin:24px auto 0;padding:14px 16px;display:flex;gap:14px;align-items:center;border:2px solid #1f4a3c;border-radius:12px;background:#fff;color:#23302a;text-decoration:none;font:14px/1.7 'Zen Maru Gothic','Hiragino Sans',sans-serif}.kl-book img{width:64px;height:auto;border-radius:3px;box-shadow:0 2px 6px rgba(0,0,0,.2);flex:none}.kl-book b{display:block;font-size:16px;color:#1f4a3c}.kl-book .go{display:inline-block;margin-top:4px;background:#e8b64c;color:#23302a;border-radius:6px;padding:2px 10px;font-weight:700}@media print{.kl-book{display:none!important}}";
    book = document.createElement("a");
    book.className = "kl-book";
    book.href = "https://amzn.asia/d/0fsUaMfr";
    book.rel = "noopener";
    book.innerHTML = '<img src="' + img + '" alt="中学校の先生のための AI指示文57 の表紙"><span>' +
      (shiji ? 'このツールの所見・学級通信に加えて、保護者対応・授業準備・テスト・行事まで' : '所見・学級通信・保護者対応・授業準備に使える') +
      '<b>コピーして使えるAI指示文57本（Kindle 480円）</b>生徒の名前を入れずに使える形です。Kindle Unlimitedなら追加料金なし。<br><span class="go">Amazonで見る →</span></span>';
  }
  var add = function () { if (book) document.body.appendChild(book); document.body.appendChild(d); };
  if (document.body) add(); else document.addEventListener("DOMContentLoaded", add);
})();
