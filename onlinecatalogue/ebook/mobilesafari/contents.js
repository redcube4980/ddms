/*! $Id: contents.js 219 2013-11-16 00:46:33Z tomita $ */
function load(){document.title=Lang.ContentsText;document.getElementById("header").innerHTML="<p>"+Lang.ContentsText+"</p>";document.getElementById("item_back").innerHTML=Lang.BackText;var c=document.getElementById("contentsList");for(var b=0;b<IB_listdata.length;b++){var a=document.createElement("li");a.innerHTML=IB_listdata[b];a.className="contentsListRow";a.onclick=(function(d){return function(){var e=IB_listpage[d];if(!window.opener||window.opener.closed){alert("カタログが閉じられています。");window.close();return false}window.opener.GotoPage(e);EBUtil.closeTemporaryWindow()}})(b);c.appendChild(a)}};