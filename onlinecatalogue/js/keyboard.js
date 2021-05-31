function onKeyDown(event)
{
  var e = event || window.event;

  // forward to screen.js
  var screen_win = top.document.getElementById("if_screen").contentWindow;
  return screen_win.onKeyDown(e);
}

if (window.attachEvent) {
  document.attachEvent("onkeydown", onKeyDown);
} else {
  document.addEventListener("keydown", onKeyDown, false);
}
