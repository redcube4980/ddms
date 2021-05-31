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
		#文字消失対応&サニタイジング↓
		#$value =~ s/</&lt;/g;
		#$value =~ s/>/&gt;/g;
		$value =~ s/</＜/g;
		$value =~ s/>/＞/g;
		$value =~ s/'/’/g;
		$value =~ s/"/”/g;
		$value =~ s/`/｀/g;
		#文字消失対応↑
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
	open(FH, $index_page);
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

	open(FH, $conf_page);
	@file = <FH>;
	close(FH);
	foreach $data (@file) {
		$data =~ s/%company_name%/$FORM{"company_name"}/;
		$data =~ s/%name%/$FORM{"name"}/;
		$data =~ s/%name_furi%/$FORM{"name_furi"}/;
		$data =~ s/%zip1%/$FORM{"zip1"}/;
		$data =~ s/%zip2%/$FORM{"zip2"}/;
		$data =~ s/%pref_name%/$FORM{"pref_name"}/;
		$data =~ s/%address%/$FORM{"address"}/;
		$data =~ s/%tel%/$FORM{"tel"}/;
		$data =~ s/%fax%/$FORM{"fax"}/;
		$data =~ s/%mailaddress%/$FORM{"mailaddress"}/;
		$data =~ s/%industry_select%/$FORM{"industry_select"}/;
		$data =~ s/%industry_other%/$FORM{"industry_other"}/;
		$data =~ s/%description_select%/$FORM{"description_select"}/;
		$data =~ s/%description_other%/$FORM{"description_other"}/;
		$data =~ s/%inq_ontents%/$FORM{"inq_ontents"}/;
		$data =~ s/%inq_ontents_txt%/$inq_ontents_txt/;
		$data =~ s/%inq_select%/$inq_select/;
		$data =~ s/%prop%/$FORM{"prop"}/;
		$data =~ s/%inq_sub%/$FORM{"inq_sub"}/;
		$data =~ s/%freeans%/$FORM{"freeans"}/;
	  print "$data";
	}
}

#--------- comp表示--------------------
sub comp_dsp{
	if($FORM{"inq_ontents"} == "1"){$inq_ontents_txt = "資料請求";}else{$inq_ontents_txt = "お問い合わせ";}
	#$inq_ontents_txt = Jcode->new( $inq_ontents_txt, "sjis")->utf8;

	#if($FORM{"inq_ontents"} == "1"){$inq_select = $chbox;}else{$inq_select = $FORM{"inq_sub"};}

	$sub .= "会社名：".$FORM{"company_name"}."\n";
	$sub .= "お名前：".$FORM{"name"}."\n";
	$sub .= "フリガナ：".$FORM{"name_furi"}."\n";
	$sub .= "住所：〒".$FORM{"zip1"}."-".$FORM{"zip2"}." ".$FORM{"pref_name"}." ".$FORM{"address"}."\n";
	$sub .= "TEL：".$FORM{"tel"}."\n";
	$sub .= "FAX：".$FORM{"fax"}."\n";
	$sub .= "メールアドレス：".$FORM{"mailaddress"}."\n";
	$sub .= "業種：".$FORM{"industry_select"}." ".$FORM{"industry_other"}."\n";
	$sub .= "職種：".$FORM{"description_select"}." ".$FORM{"description_other"}."\n";
	$sub_countermeasure = $sub;
	$sub .= "お問い合わせ内容：".$inq_ontents_txt." ".$FORM{"inq_select"}."\n";
	$sub .= "弊社をどちらでお知りになりましたか：".$FORM{"freeans"}."\n\n";
	$sub_countermeasure .= "お問い合わせ内容：".$inq_ontents_txt." ".$FORM{"inq_select"}."\n《「お問い合わせ内容」の入力はここで完了となります》\n";
	$sub_countermeasure .= "弊社をどちらでお知りになりましたか：".$FORM{"freeans"}."\n《「弊社をどちらでお知りになりましたか」の入力はここで完了となります》\n\n";

	$sendmail = '/usr/lib/sendmail';

#---------- 件名-----------------
	if($FORM{"inq_ontents"} == "2"){
		$subj = "大同ＤＭソリューション株式会社　お問い合わせいただきありがとうございました";$subj2 = "お問い合わせ　";
	}	else {
		$subj = "大同ＤＭソリューション株式会社　資料をご請求いただきありがとうございました";$subj2 = "資料請求について";
	}

#---------- 件名-----------------

#---------- 本文-----------------
	if($FORM{"inq_ontents"} == "2"){
		$sub2 = "【大同ＤＭソリューション株式会社】\n";
		$sub2 .= "下記の内容でお問い合わせがありました。\n\n";

		$sub3 = "【大同ＤＭソリューション株式会社】\n";
		$sub3 .= "お問い合わせいただき、ありがとうございました。\n";
		$sub3 .= "以下のように内容が送信されましたので、\n";
		$sub3 .= "ご確認いただけますようお願い申し上げます。\n\n";

		$footer = "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";
		$footer .= "大同ＤＭソリューション株式会社\n";

		$footer .= "[本社]\n";
		$footer .= "〒574-0062　大阪府大東市氷野3-152\n";
		$footer .= "Tel：072（871）8601　Fax：072（871）9580\n";
		$footer .= "E-mail：E-HELP@daidodms.co.jp\n";
		$footer .= "URL：http://www.daidodms.co.jp/\n";
		$footer .= "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";
	}else{

		$sub2 = "【大同ＤＭソリューション株式会社】\n";
		$sub2 .= "資料請求 （".$FORM{"pref_name"}."）\n";
		$sub2 .= "下記の内容で資料請求がありました。\n\n";

		$sub3 = "【大同ＤＭソリューション株式会社】\n";
		$sub3 .= "資料をご請求いただき、ありがとうございました。\n";
		$sub3 .= "以下のように内容が送信されましたので、\n";
		$sub3 .= "ご確認いただけますようお願い申し上げます。\n\n";

		$footer = "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";
		$footer .= "大同ＤＭソリューション株式会社\n";

		$footer .= "[本社]\n";
		$footer .= "〒574-0062　大阪府大東市氷野3-152\n";
		$footer .= "Tel：072（871）8601　Fax：072（871）9580\n";
		$footer .= "E-mail：E-HELP@daidodms.co.jp\n";
		$footer .= "URL：http://www.daidodms.co.jp/\n";
		$footer .= "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";
	}

#---------- 本文-----------------

#----------- 会社用 -----------------------
	#$to = 'it-t@redcube.jp';
	#$to = 'e-help@daidodms.co.jp, it-t@redcube.jp';
	$to = 'e-help@daidodms.co.jp, ddmsehelp1203@yahoo.co.jp, it-t@redcube.jp';
	$sub_c = $sub2.$sub_countermeasure;
	#$sub_c = $sub2.$sub;

	&Jcode::convert($subj2,'jis');
	$sub_c = Unicode::Japanese->new($sub_c)->jis;

	$subj2 = jcode($subj2)->mime_encode;
	$from = $FORM{"mailaddress"};

	open(MAIL,"| $sendmail -t") || &error_exit("sendmailの起動に失敗しました");
	# ヘッダ情報出力
	print MAIL "To: $to\n";
	print MAIL "From: $from\n";
	print MAIL "Subject: $subj2\n";
	#MailのUTF8出力化
	#print MAIL "Content-Type: text/plain;charset=utf-8\n";
	# 本文出力
	print MAIL "$sub_c\n";
	close(MAIL) || &error_exit("メールの送信に失敗しました");

#----------- 会社用 -----------------------

#------------ お客様用 ---------------------
	$bcc = $to;
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
	print MAIL "Bcc: $bcc\n";
	print MAIL "Subject: $subj\n";
	#MailのUTF8出力化
	#print MAIL "Content-Type: text/plain;charset=utf-8\n";
# 本文出力
	print MAIL "$sub_c\n";
	close(MAIL) || &error_exit("メールの送信に失敗しました");

#------------ お客様用 ---------------------

	open(FH, $comp_page);
	@file = <FH>;
	close(FH);
	foreach $data (@file) {
	$data =~ s/%inq_ontents_txt%/$inq_ontents_txt/;
	  print "$data";
	}

}
#--------- comp表示--------------------

exit;
