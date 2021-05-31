/*! $Id: search.js 226 2013-11-18 06:24:01Z tomita $ */

function FullTextSearch(fullTexts)
{
  this.fullTexts = fullTexts;
  this.msg = "";
}

FullTextSearch.prototype.setMessage = function (msg)
{
  this.msg = msg;
}

FullTextSearch.prototype.getMessage = function ()
{
  return this.msg;
}

/*
 * param 検索条件
 * param.word	検索ワード
 * param.type   AND/OR検索指定("and" or "or") 省略時はAND検索
 * param.bookid	カタログID
 */
FullTextSearch.prototype.search = function (param)
{
  var and_op     = true;
  var keyword    = null;
  var bookid     = null;

  /*
   * 検索条件読み込み
   */
  if (param.type && param.type == "or") {
    and_op = false;
  }
  if (typeof param.word == "string" &&
      !param.word.match(/^\s*$/))
    keyword = param.word;

  if (keyword !== null) {
    var keywords = Util.TextProcessor.normalize(keyword).replace(/^[\s\u3000]+/, "").replace(/[\s\u3000]+$/, "").split(/[\s\u3000]+/);
    var keyword_rexs = new Array();
    for (var i = 0 ; i < keywords.length ; i++)
      keyword_rexs[i] = new RegExp(Util.TextProcessor.escapeRexExp(keywords[i]), "i");
  }
  if (typeof param.bookid != "undefined") {
    bookid = param.bookid;
  }

  var results = new Array();
  for (var i = 0 ; i < this.fullTexts.length ; i++) {
    if (bookid !== null) {
      if (bookid != this.fullTexts[i]["bookid"])
	continue;
    }

    if (keyword !== null) {
      if (and_op) {
	var no_match = false;
	for (var j = 0 ; j < keyword_rexs.length ; j++) {
	  if (!this.fullTexts[i]["text"].match(keyword_rexs[j])) {
	    no_match = true;
	    break;	// no match
	  }
	}
	if (no_match)
	  continue;
      } else {
	// OR検索
	var match = false;
	for (var j = 0 ; j < keyword_rexs.length ; j++) {
	  if (this.fullTexts[i]["text"].match(keyword_rexs[j])) {
	    match = true;
	    break;	// match
	  }
	}
	if (!match)
	  continue;
      }
    }

    results[results.length] = this.fullTexts[i];
  }

  return results;
}
