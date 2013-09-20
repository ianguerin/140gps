<?
  require("../oauth/twitteroauth.php"); // path to twitteroauth library

  $keywords = $_POST["keywords"];
  $latitude = $_POST["latitude"];
  $longitude = $_POST["longitude"];
  $radius = "2mi";
  // $radius = $_POST["radius"];
  // $result_type = popular / recent / mixed?

  $keywords_string = "";
  for($i = 0; $i < sizeof($keywords); $i++){
    if($i+1 == sizeof($keywords)){
      $keywords_string = $keywords_string."".$keywords[$i];
    }else{
      $keywords_string = $keywords_string."".$keywords[$i]."+";
    }
  }

  $consumerkey = '6Z94JqR8PR4xd3tc8j0YSQ';
  $consumersecret = 'ySEirtK3TqLLLia9PIqqJGuAVQ01dunROpGenyJ0Gf0';
  $accesstoken = '15400274-qRRjP2Wsa9Wa9bhFupjK3rGJwGOCBwmpX6q1UTDU';
  $accesstokensecret = '7XO6A1VTLVD0GM8eSEuBZkIyWPtie7rGh6AiXVcd0';

  $twitter = new TwitterOAuth($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
   
  $tweets = $twitter->get("https://api.twitter.com/1.1/search/tweets.json?q=".$keywords_string."&lang=en&geocode=".$latitude.",".$longitude.",".$radius."&count=50&result_type=recent");
  
  echo json_encode($tweets);
?>