<?php
  require("../oauth/twitteroauth.php");

  $consumerkey = '6Z94JqR8PR4xd3tc8j0YSQ';
  $consumersecret = 'ySEirtK3TqLLLia9PIqqJGuAVQ01dunROpGenyJ0Gf0';
  $accesstoken = '15400274-qRRjP2Wsa9Wa9bhFupjK3rGJwGOCBwmpX6q1UTDU';
  $accesstokensecret = '7XO6A1VTLVD0GM8eSEuBZkIyWPtie7rGh6AiXVcd0';

  $twitter = new TwitterOAuth($consumerkey, $consumersecret, $accesstoken, 
    $accesstokensecret);
?>