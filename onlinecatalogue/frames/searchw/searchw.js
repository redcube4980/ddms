var pageSize = 5;
var textMaxLength = 60;

function ND(id)
{
  return document.getElementById(id);
}

function NDByName(name)
{
  var nodes = document.getElementsByName(name);
  if (nodes.length == 0)
    return null;
  return nodes[0];
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

function buildResultTable(results)
{
  var words = Util.TextProcessor.normalize(document.forms[0].q.value).replace(/^[\s\u3000]+/, "").replace(/[\s\u3000]+$/, "").split(/[\s\u3000]+/);

  var html = '<table class="tbl_reso">';
  for (var i = 0 ; i < results.length ; i++) {
    var pg = results[i]["pg"];
    var text = results[i]["text"];

    // マッチ部分の頭出し
    if (words && words.length) {
      for (var j = 0 ; j < words.length ; j++) {
	var pos = text.toLowerCase().indexOf(words[j].toLowerCase(),0);
	if (pos == -1)
	  continue;
	var start = pos - 4;
	if (start > 0)
	  text = text.slice(start);
	break;
      }
    }

    if (text.length > textMaxLength) {
      text = text.slice(0, textMaxLength);
      text += "...";
    }

    // 強調語句の処理
    if (words && words.length) {
      var arr = [];
      for (j = 0 ; j < words.length ; j++)
	arr.push(Util.TextProcessor.escapeRexExp(words[j]));
      var rex = new RegExp("(" + arr.join("|") + ")", "gi");
      text = text.replace(rex, '<span class="str_reso4">$1</span>');
    }

    html += '<tr><td>';
    html += '<a href="javascript:void(0)" onclick="FrameUtil.gotoPage(' + pg + ');">';
    html += '<span class="str_reso1">' + pg + 'ページ</span></a><br>';
    html += '<span class="str_reso2">' + text + '</span><br>';
    html += '<a href="javascript:void(0)" onclick="FrameUtil.gotoPage(' + pg + ');">';
    html += '<span class="str_reso3">' + pg + 'ページを開く</span></a><br><br>';
    html += '</td></tr>';
  }
  html += '</table>';

  return html;
}

function onFormInit()
{
}

function onClear()
{
  var form = document.forms[0];

  if (form.q)
    form.q.value = "";
}

function onSearch(pg)
{
  var form = document.forms[0];

  if (typeof pg == "undefined")
    pg = 1;

  document.body.scrollTop = 0;

  var param = {};
  if (form.q && !form.q.value.match(/^\s*$/)) {
    param.word = form.q.value;
  } else {
    putMessage("検索ワードを指定してから<br>「検索」ボタンを押して下さい。", "warn");
    return;
  }

  if (form.type) {
    for(i = 0; i < form.type.length; i++) {
      if(form.type[i].checked && form.type[i].value == "or") {
	param.type = "or";
	break;
      }
    }
  }

  var ftSearch = new FullTextSearch(FullTexts);
  var results = ftSearch.search(param);
  if (results === false) {
    // error
    ND("result_table").innerHTML = "";
    ND("result_nav").innerHTML = "";
    return;
  }

  if (results.length == 0) {
    putMessage("該当するデータが見つかりませんでした。", "warn");
    ND("result_table").innerHTML = "";
    ND("result_nav").innerHTML = "";
    return;
  }

  var total = results.length;
  results.sort(createSorter("pg"));

  var start = (pg - 1) * pageSize;

  results = results.slice(start, start + pageSize);

  putMessage(total + "件中" + (start + 1) + "～" + (start + results.length) +
	     "件を表示中" );

  ND("result_table").innerHTML = buildResultTable(results);

  // Navigator
  var page_n = parseInt(total / pageSize);
  if (total % pageSize)
    page_n++;

  var nav = new Navigator("result_nav");
  nav.total(page_n);
  nav.current(pg);
  nav.onMove = function (curr) {onSearch(curr);}
}

window.onload = onFormInit;

