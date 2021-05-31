/*! $Id: util.js 225 2013-11-18 06:04:42Z tomita $ */

/*
 * ebook,frames���狤�ʂŎg�p���鏈��
 */

var Util = {
  // functions
  dummy: null};

// Classes

Util.TextProcessor = function () {
}
Util.TextProcessor.srcMultiTbl = ["��","��","��","��","��","��","��","��","��","��","��","��","��","��","��","��","��","��","��","��","��","��","��","��","��","��"];
Util.TextProcessor.dstMultiTbl = ["��","�K","�M","�O","�Q","�S","�U","�W","�Y","�[","�]","�_","�a","�d","�f","�h","�o","�r","�u","�x","�{","�p","�s","�v","�y","�|"];
Util.TextProcessor.srcTbl = "�O�P�Q�R�S�T�U�V�W�X"
  + "�|�{�^�D�C�@"
  + "�`�a�b�c�d�e�f�g�h�i�j�k�l�m�n�o�p�q�r�s�t�u�v�w�x�y"
  + "����������������������������������������������������"
  + "�������������������������������������������ܦݧ���������";
Util.TextProcessor.dstTbl = "0123456789"
  + "-+/., "
  + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  + "abcdefghijklmnopqrstuvwxyz"
  + "�A�C�E�G�I�J�L�N�P�R�T�V�X�Z�\�^�`�c�e�g�i�j�k�l�m�n�q�t�w�z�}�~�����������������������������@�B�D�F�H�b�������[";

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

