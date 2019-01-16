<?php

$email = $_GET['email'];
$start = $_GET['start'];
$end = $_GET['end'];
$title = $_GET['title'];
$name = $_GET['name'];

if($email && $start && $end && $title && $name){
  $url = "https://calendar.google.com/calendar/r/eventedit?&text=".urlencode($title)."&dates=".date("Ymd\THis\Z", strtotime($start))."/".date("Ymd\THis\Z", strtotime($end))."&details=Book:+".urlencode($name)."+-+".urlencode($title)."+-+".$email;

  $to      = 'jarichman43@gmail.com';
  $subject = 'Book - '.$name;
  $message = 'Name: '.$name.'<br>Title: '.$title.'<br>Start: '.date("D M jS g:i a", strtotime($start)-60*60*5).'<br>Duration: '.((strtotime($end)-strtotime($start))/60)." Minutes<br>URL: <a href='".$url."'>Add to Calendar</a>";
  $headers = 'From: blank@example.com' . "\r\n" .
      'Reply-To: blank@example.com' . "\r\n" .
      'Content-Type: text/html; charset=ISO-8859-1\r\n'.
      'X-Mailer: PHP/' . phpversion();

  mail($to, $subject, $message, $headers);

  $to      = $email;
  $subject = 'Meeting booked with Blank';
  $message = 'Name: '.$name.'<br>Title: '.$title.'<br>Start: '.date("D M jS g:i a", strtotime($start)-60*60*5).'<br>Duration: '.((strtotime($end)-strtotime($start))/60)." Minutes<br>URL: <a href='".$url."'>Add to Calendar</a>";
  $headers = 'From: blank@example.com' . "\r\n" .
      'Reply-To: blank@example.com' . "\r\n" .
      'Content-Type: text/html; charset=ISO-8859-1\r\n'.
      'X-Mailer: PHP/' . phpversion();

  mail($to, $subject, $message, $headers);

  echo "done";
}
else{
  echo "some fields are missing";
}
