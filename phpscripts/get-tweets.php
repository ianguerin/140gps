<?
  include_once("connect.php");
  include_once("twitter-connect.php");

  $keywords = $_POST["keywords"];
  $latitude = $_POST["latitude"];
  $longitude = $_POST["longitude"];
  $radius = "2mi";
  // $radius = $_POST["radius"];
  // $result_type = popular / recent / mixed?

  $keywords_string = "";
  for($i = 0; $i < sizeof($keywords); $i++){
    if($i + 1 == sizeof($keywords)){
      $keywords_string = $keywords_string."".$keywords[$i];
    }else{
      $keywords_string = $keywords_string."".$keywords[$i]."+";
    }
  }
   
  $tweets = $twitter->get("https://api.twitter.com/1.1/search/tweets.json?q="
    .$keywords_string."&lang=en&geocode=".$latitude.",".$longitude.",".$radius
    ."&count=50&result_type=recent");
  
  echo json_encode($tweets);

  $con->query("INSERT INTO searches (latitude, longitude, query) VALUES 
    ('$latitude', '$longitude', '$keywords_string')");
?>