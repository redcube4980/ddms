/*! $Id: searchw.js 244 2013-11-28 10:58:20Z tomita $ */

var pageSize = 10;

function ND(id)
{
  return document.getElementById(id);
}

function putMessage(str, class_name)
{
  if (class_name)
    str = '<span class="' + class_name + '">' + str + '</span>';

  ND("str_msg").innerHTML = str;
}

function createSorter(key)
{
  return function(a,b) {
    if (a[key] == b[key])
      return 0;
    if (a[key] > b[key])
      return 1;
    return -1;
  }
}

function setView(name)
{
  switch (name) {
  case "form":
    document.getElementById("header").innerHTML    = "<p>" + Lang.SearchText + "</p>";
    ND("search_form").style.display   = "block";
    ND("search_result").style.display = "none";
    break;
  case "result":
    document.getElementById("header").innerHTML    = "<p>" + Lang.SearchResultText + "</p>";
    ND("search_form").style.display   = "none";
    ND("search_result").style.display = "block";
    break;
  default:
    break;
  }
}

function buildResultTable(results)
{
  var list = document.getElementById("resultsList");
  list.innerHTML = "";

  var back_li = document.createElement("li");
  back_li.className = "resultsListRow back";
  back_li.onclick = function () {setView('form')};
  back_li.innerHTML = Lang.BackText;
  EBUtil.setTapAnimation(back_li);
  list.appendChild(back_li);

  for (var i = 0 ; i < results.length ; i++) {
    var disp_pg = results[i]["pg"];

    var li = document.createElement("li");
    li.innerHTML = disp_pg + "ページ目を開く";
    li.className = "resultsListRow";
    li.onclick = (function (idx) {
		    return function () {
		      var _disp_pg = results[idx]["pg"];

		      if (!window.opener || window.opener.closed) {
			alert("カタログが閉じられています。");
			window.close();
			return false;
		      }
		      window.opener.GotoPage(_disp_pg + modifiedPage);

		      EBUtil.closeTemporaryWindow();
		    };
		  })(i);
    EBUtil.setTapAnimation(li);
    list.appendChild(li);
  }
}

function onSearch(pg)
{
  // @@@
  var form_q = ND("form_q");

  if (typeof pg == "undefined")
    pg = 1;

  putMessage("");

  var param = {};
  if (form_q && !form_q.value.match(/^\s*$/)) {
    param.word = form_q.value;
  } else {
    putMessage("検索ワードを指定してから<br>「検索」ボタンを押して下さい。", "warn");
    return;
  }

  var ftSearch = new FullTextSearch(FullTexts);
  var results = ftSearch.search(param);
  if (results === false) {
    // error
    return;
  }

  if (results.length == 0) {
    putMessage("該当するデータが見つかりませんでした。", "warn");
    return;
  }

  results.sort(createSorter("pg"));

  updateResultPage(results, pg);
  setView("result");
}

function updateResultPage(results, pg)
{
  var start = (pg - 1) * pageSize;
  var total = results.length;

  var pageResults = results.slice(start, start + pageSize);

  buildResultTable(pageResults);

  if (total > pageSize) {
    // Navigator
    var page_n = parseInt(total / pageSize);
    if (total % pageSize)
      page_n++;

    var nav = new Navigator("result_nav");
    nav.numberElement = function (n) {return n + "ページ";}
    nav.width(1);
    nav.total(page_n);
    nav.current(pg);
    nav.onMove = function (curr) {updateResultPage(results, curr);window.scrollTo(0,1);}
  } else {
    ND("result_nav").innerHTML = "";
  }
}

function cancelEnter(e)
{
  if (!e)
    e = window.event;

  if (e.keyCode == 13) {
    return false;
  }
} 

function load()
{
  document.title = Lang.SearchText;
  document.getElementById("btn_search").innerHTML = Lang.SearchText;
  document.getElementById("btn_return").innerHTML = Lang.BackText;

  var elements = document.getElementsByTagName("input");
  for (var i = 0 ; i < elements.length ; i++) {
    if (elements[i].type.toUpperCase() != "TEXT")
      continue;
    elements[i].onkeypress = cancelEnter;
  }

  setView("form");
}
