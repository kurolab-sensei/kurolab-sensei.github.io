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
  var add = function () { document.body.appendChild(d); };
  if (document.body) add(); else document.addEventListener("DOMContentLoaded", add);
})();
