#!/usr/bin/perl

use lib './lib';
use Jcode;
use Unicode::Japanese;

print "Content-Type: text/html; charset=utf-8\n\n";
$index_page = "./1.html";
$conf_page = "./2.html";
$comp_page = "./3.html";

$method_check = "";


#--------------POST受信・処理-----------------------

if($ENV{'REQUEST_METHOD'} eq 'POST'){
read(STDIN, $query, $ENV{'CONTENT_LENGTH'});
if($query){$method_check++;}
}
$count = 0;

if($method_check){

foreach $pair (split(/&/, $query)){
($key, $value) = split(/=/, $pair);

#print '$key:'. "$key<BR>\n";
#print '$value:'. "$value<BR>\n";
#print "<BR>\n";

$value =~ tr/+/ /;
$value =~ s/%([0-9a-fA-F][0-9a-fA-F])/chr(hex($1))/eg;
$value =~ s/</&lt;/g;
$value =~ s/>/&gt;/g;
$value =~ s/\n//g;
$value =~ s/\,/./g;
$FORM{$key} = $value;

if($key =~ /prop/){

$chbox .= $value." ";
$CHECKBOX[$count] = $value;
$count++;
}
}


if($FORM{"conf"}){&conf_dsp;exit;}
if($FORM{"comp"}){&comp_dsp;exit;}



}else{
&index_dsp;
exit;
}
#--------------POST受信-----------------------


#--------- index表示--------------------
sub index_dsp{

open(FH, "1.html");
@file = <FH>;
close(FH);
foreach $data (@file) {
  print "$data";
}

}
#--------- index表示--------------------

#--------- conf表示--------------------
sub conf_dsp{

if($FORM{"inq_ontents"} == "1"){$inq_ontents_txt = "資料請求";}else{$inq_ontents_txt = "お問い合わせ";}
#$inq_ontents_txt = Jcode->new( $inq_ontents_txt, "sjis")->utf8;


if($FORM{"inq_ontents"} == "1"){$inq_select = $chbox;}else{$inq_select = $FORM{"inq_sub"};}


open(FH, "2.html");
@file = <FH>;
close(FH);
foreach $data (@file) {
$data =~ s/%name%/$FORM{"name"}/;
$data =~ s/%name_furi%/$FORM{"name_furi"}/;
$data =~ s/%year%/$FORM{"year"}/;
$data =~ s/%month%/$FORM{"month"}/;
$data =~ s/%day%/$FORM{"day"}/;
$data =~ s/%uni%/$FORM{"uni"}/;

if($FORM{"inq_ontents"} == "1"){$inq_content = "大学院";}
elsif($FORM{"inq_ontents"} == "2"){$inq_content = "大学";}
elsif($FORM{"inq_ontents"} == "3"){$inq_content = "短大";}
elsif($FORM{"inq_ontents"} == "4"){$inq_content = "専門";}
else{$inq_content = "高校";}
$data =~ s/%inq_ontents%/$inq_content/;
$data =~ s/%zip1%/$FORM{"zip1"}/;
$data =~ s/%zip2%/$FORM{"zip1"}/;
$data =~ s/%pref_name%/$FORM{"pref_name"}/;
$data =~ s/%address%/$FORM{"address"}/;
$data =~ s/%tel%/$FORM{"tel"}/;
$data =~ s/%fax%/$FORM{"fax"}/;
$data =~ s/%tel_hp%/$FORM{"tel_hp"}/;
$data =~ s/%mailaddress%/$FORM{"mailaddress"}/;
$data =~ s/%license%/$FORM{"license"}/;
$data =~ s/%freeans%/$FORM{"freeans"}/;
  print "$data";
}

}
#--------- conf表示--------------------



#--------- comp表示--------------------
sub comp_dsp{

if($FORM{"inq_ontents"} == "1"){$inq_ontents_txt = "資料請求";}else{$inq_ontents_txt = "お問い合わせ";}
#$inq_ontents_txt = Jcode->new( $inq_ontents_txt, "sjis")->utf8;



$sub .= "お名前：".$FORM{"name"}."\n";
$sub .= "フリガナ：".$FORM{"name_furi"}."\n";
$sub .= "生年月日：".$FORM{"year"}."年".$FORM{"month"}."月".$FORM{"day"}."日\n";
$sub .= "最終学歴(見込含む)：".$FORM{"uni"}." ".$FORM{"inq_ontents"}."\n";

$sub .= "住所：〒".$FORM{"zip1"}."-".$FORM{"zip2"}." ".$FORM{"pref_name"}." ".$FORM{"address"}."\n";
$sub .= "TEL：".$FORM{"tel"}."\n";
$sub .= "FAX：".$FORM{"fax"}."\n";
$sub .= "携帯電話：".$FORM{"tel_hp"}."\n";
$sub .= "メールアドレス：".$FORM{"mailaddress"}."\n";
$sub .= "免許・資格など：".$FORM{"license"}."\n";
$sub .= "当社に対する質問：".$FORM{"freeans"}."\n\n";


$sendmail = '/usr/lib/sendmail';

#---------- 件名-----------------

$subj = "大同ＤＭソリューション株式会社　採用のお問い合わせ";
$subj2 = "採用のお問い合わせ　";



#---------- 件名-----------------

#---------- 本文-----------------


$sub2 = "【大同ＤＭソリューション株式会社】\n";
$sub2 .= "下記の内容で採用のお問い合わせがありました。\n\n";

$sub3 = "【大同ＤＭソリューション株式会社】\n";
$sub3 .= "お問い合わせいただき、ありがとうございました。\n";
$sub3 .= "以下のように内容が送信されましたので、\n";
$sub3 .= "ご確認いただけますようお願い申し上げます。\n\n";


$footer = "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";
$footer .= "大同ＤＭソリューション株式会社\n";

$footer .= "[本社]\n";
$footer .= "〒574-0062　大阪府大東市氷野3-152\n";
$footer .= "Tel：072（871）8601　Fax：072（871）9580\n";
$footer .= "E-mail：e-help@daidodms.co.jp\n";
$footer .= "URL：http://www.daidodms.co.jp/\n";
$footer .= "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";



#---------- 本文-----------------



#----------- 会社用 -----------------------

$to = 'e-help@daidodms.co.jp';
$sub_c = $sub2.$sub;

&Jcode::convert(\$subj2,'jis');
$sub_c = Unicode::Japanese->new($sub_c)->jis;
$subj2 = jcode($subj2)->mime_encode;
$from = $FORM{"mailaddress"};

open(MAIL,"| $sendmail -t") || &error_exit("sendmailの起動に失敗しました");
# ヘッダ情報出力
print MAIL "To: $to\n";
print MAIL "From: $from\n";
print MAIL "Subject: $subj2\n";
# 本文出力
print MAIL "$sub_c\n";
close(MAIL) || &error_exit("メールの送信に失敗しました");


#----------- 会社用 -----------------------



#------------ お客様用 ---------------------

$to = $FORM{"mailaddress"};
$sub_c = $sub3.$sub.$footer;

&Jcode::convert(\$subj,'jis');
$sub_c = Unicode::Japanese->new($sub_c)->jis;
$subj = jcode($subj)->mime_encode;
$from = 'e-help@daidodms.co.jp';

open(MAIL,"| $sendmail -t") || &error_exit("sendmailの起動に失敗しました");
# ヘッダ情報出力
print MAIL "To: $to\n";
print MAIL "From: $from\n";
print MAIL "Subject: $subj\n";
# 本文出力
print MAIL "$sub_c\n";
close(MAIL) || &error_exit("メールの送信に失敗しました");


#------------ お客様用 ---------------------


open(FH, "3.html");
@file = <FH>;
close(FH);
foreach $data (@file) {
$data =~ s/%inq_ontents_txt%/$inq_ontents_txt/;
  print "$data";
}

}
#--------- comp表示--------------------




exit;
