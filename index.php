<?php
$fields = [
    'refresh_token' => '1/0jVE4yX7N2hxHUGkBYPIUllg5rhK5b0ieVJR8hDtojM',
    'client_id' => '<client_id>',
    'client_secret' => '<client_secret>',
    'grant_type' => 'refresh_token'
];
$ch = curl_init('https://www.googleapis.com/oauth2/v4/token');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
$response = curl_exec($ch);
curl_close($ch);
$access_token = json_decode($response, true)['access_token'];

$blacklist = ["Richman Family Calendar", "Friends' Birthdays","Holidays in United States","Jewish Holidays", "Facebook Events"];

$accountsRequest = json_decode(file_get_contents("https://www.googleapis.com/calendar/v3/users/me/calendarList?access_token=".$access_token),true);
$timedEvents = [];
$dayEvents = [];
$Birthdays = [];

$account_ids = [];
foreach($accountsRequest['items'] as &$account){
  if(!in_array($account['summary'],$blacklist)){
    $account_ids[] = $account['id'];
  }
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN""http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
  <script>
    var access_token = "<?php echo $access_token;?>";
    var account_ids = <?php echo json_encode($account_ids);?>;
  </script>
	<link rel='stylesheet' type='text/css' href='libs/reset.css' />
    <!--
	<link rel='stylesheet' type='text/css' href='http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/themes/base/jquery-ui.css' />
	-->

  <link rel='stylesheet' type='text/css' href='libs/smoothness/jquery-ui-1.8.11.custom.css' />


	<link rel='stylesheet' type='text/css' href='libs/jquery.weekcalendar.css' />
	<link rel='stylesheet' type='text/css' href='style.css' />

	<link rel='stylesheet' type='text/css' href='libs/skins/default.css' />


	   <!--
	<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js'></script>
    <script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js'></script>
    -->
  <title>Book Jacob Richman</title>
   <script type='text/javascript' src='libs/jquery-1.4.4.min.js'></script>
    <script type='text/javascript' src='libs/jquery-ui-1.8.11.custom.min.js'></script>
	<script type="text/javascript" src="libs/date.js"></script>
	<script type='text/javascript' src='libs/jquery.weekcalendar.js'></script>
	<script type='text/javascript' src='libs/rrecur-parser.js'></script>
	<script type='text/javascript' src='script.js'></script>

</head>
<body>
	<center><h1>Book Jacob Richman</h1></center>
	<div id='calendar'></div>
	<div id="event_edit_container">
		<form>
			<input type="hidden" />
			<ul>
				<li>
					<span>Date: </span><span class="date_holder"></span>
				</li>
				<li>
					<label for="start">Start Time: </label><select name="start"><option value="">Select Start Time</option></select>
				</li>
				<li>
					<label for="end">End Time: </label><select name="end"><option value="">Select End Time</option></select>
				</li>
				<li>
					<label for="name">Name: </label><input type="text" name="name" />
				</li>
				<li>
					<label for="email">Email: </label><input type="text" name="email"/>
				</li>
				<li>
					<label for="event">Event: </label><input type="text" name="event"/>
				</li>
			</ul>
		</form>
	</div>
</body>
</html>
