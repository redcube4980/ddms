/*! $Id: util.js 225 2013-11-18 06:04:42Z tomita $ */

/*
 * ebook,framesから共通で使用する処理
 */

var Util = {
  // functions
  dummy: null};

// Classes

Util.TextProcessor = function () {
}
Util.TextProcessor.srcMultiTbl = ["ｳﾞ","ｶﾞ","ｷﾞ","ｸﾞ","ｹﾞ","ｺﾞ","ｻﾞ","ｼﾞ","ｽﾞ","ｾﾞ","ｿﾞ","ﾀﾞ","ﾁﾞ","ﾂﾞ","ﾃﾞ","ﾄﾞ","ﾊﾞ","ﾋﾞ","ﾌﾞ","ﾍﾞ","ﾎﾞ","ﾊﾟ","ﾋﾟ","ﾌﾟ","ﾍﾟ","ﾎﾟ"];
Util.TextProcessor.dstMultiTbl = ["ヴ","ガ","ギ","グ","ゲ","ゴ","ザ","ジ","ズ","ゼ","ゾ","ダ","ヂ","ヅ","デ","ド","バ","ビ","ブ","ベ","ボ","パ","ピ","プ","ペ","ポ"];
Util.TextProcessor.srcTbl = "０１２３４５６７８９"
  + "－＋／．，　"
  + "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ"
  + "ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ"
  + "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮｰ";
Util.TextProcessor.dstTbl = "0123456789"
  + "-+/., "
  + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  + "abcdefghijklmnopqrstuvwxyz"
  + "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョー";

// static method
Util.TextProcessor.normalize = function (str)
{
  var result = "";
  var i;

  for(i = 0 ; i < Util.TextProcessor.srcMultiTbl.length ; i++){
    var reg = new RegExp(Util.TextProcessor.srcMultiTbl[i], "g"); 
    str = str.replace(reg, Util.TextProcessor.dstMultiTbl[i]);
  }

  for (i = 0 ; i < str.length ; i++){
    var ch = str.charAt(i);
    pos = Util.TextProcessor.srcTbl.indexOf(ch,0);
    ch = pos >= 0 ? Util.TextProcessor.dstTbl.charAt(pos) : ch;
    result += ch;
  }

  return result;
}

// static method
Util.TextProcessor.escapeHtml = function (str)
{
  return str.replace(/&/g, "&amp;").replace(/\x22/g, "&quot;").replace(/\x27/g, "&#039;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// static method
Util.TextProcessor.escapeRexExp = function (str)
{
  return str.replace(/\\/g, "\\\\").replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/\^/g, "\\^").replace(/\$/g, "\\$").replace(/\./g, "\\.").replace(/\*/g, "\\*").replace(/\+/g, "\\+").replace(/\?/g, "\\?");
}

