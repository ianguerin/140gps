<?php
	include_once("phpscripts/connect.php");
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta name="author" content="Ian Guerin - ianguer.in">
		<meta charset="utf-8">
		<meta name="keywords" content=""/>
		<meta name="description" content=""/>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/> <!--320-->
		<title>140gps | v.0.0.1</title>
		<link rel="stylesheet" href="stylesheets/140gps.css">
		<link rel="icon" type="image/png" href="favicon.png" />
		<script type="text/javascript" src="javascripts/jquery-1.10.2.min.js"></script>
		<script type="text/javascript" src="javascripts/plugin/timeago.js"></script>
		<script type="text/javascript" src="javascripts/main.js"></script>
	</head>
	<body>
		<div id="content">
			<span id="my-location">
				finding you...
			</span>
			<input type="text" id="keywords"/>
			<div id="get-tweets">
				find
			</div>
			<div class="clear-floats"></div>
			<div id="tweets">
			</div>
		</div>
	</body>
</html>