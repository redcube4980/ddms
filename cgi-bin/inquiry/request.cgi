#!/usr/local/bin/perl

use CGI qw(:standard :escapeHTML -nosticky);
use CGI::Util qw(unescape);
use CGI::Carp qw(fatalsToBrowser set_message);

#送信されたデータを受け取る
if ($ENV{'REQUEST_METHOD'} eq 'POST') {
  read(STDIN, $alldata, $ENV{'CONTENT_LENGTH'});
} else {
  $alldata = $ENV{'QUERY_STRING'};
}
foreach $data (split(/&/, $alldata)) {
  ($key, $value) = split(/=/, $data);

  $value =~ s/\+/ /g;
  $value =~ s/%([a-fA-F0-9][a-fA-F0-9])/pack('C', hex($1))/eg;
  $value =~ s/\t//g;

  $value =~ s/'/’/g;
  $value =~ s/"/”/g;
  $value =~ s/`/｀/g;

  $in{"$key"} = $value;
}

print "Content-Type: text/html; charset=utf-8\n\n";
print "<html>\n";
print "<head><title>フォームサンプル</title></head>\n";
print "<body>\n";
print "<form action='request.cgi' method='post'>";
print "<input type='text' name='message' /><br>\n";
print "<input type='submit' name='submit' value='Submit' /><br>\n";
print "</form>\n";
#受け取ったデータを表示する
print "<p>入力されたメッセージは<br>\n$in{'message'}<br>\nです!!</p>\n";
print "</body>\n";
print "</html>\n";

use Mail::Sendmail;
&mailto('hideki.t-ca@f-spirits.in', 'hideki.t-ca@f-spirits.in', '日本語表記題名', "入力されたメッセージは\n$in{'message'}\nです。\n\n"); # メール送信

$sendmail = '/usr/lib/sendmail';
open(MAIL,"| $sendmail -t") || &error_exit("sendmailの起動に失敗しました");
# ヘッダ情報出力
print MAIL "To: test@f-spirits.in\n";
print MAIL "From: from@f-spirits.in\n";
print MAIL "Subject: Test\n";
#MailのUTF8出力化
#print MAIL "MIME-Version: 1.0\n";
#print MAIL "Content-Transfer-Encoding: 7bit\n";
print MAIL "Content-Type: text/plain;charset=utf-8\n\n";
# 本文出力
print MAIL "入力されたメッセージは\n$in{'message'}\nです。\n\n";
close(MAIL) || print "メールの送信に失敗しました";

sub mailto{
use Encode;
	my ($from, $to, $subject, $body) = @_;
	$subject = encode('MIME-Header-ISO_2022_JP', $subject);
	#$body = encode('utf-8', $body);
	my %mail;
	$mail{'Content-Type'} = 'text/plain; charset="utf-8"';
	$mail{'From'} = $from;
	$mail{'To'} = $to;
	$mail{'Subject'} = $subject;
	$mail{'message'} = $body."\n";
	sendmail %mail;
}

exit;
