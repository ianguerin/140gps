/* main js for site
 * @AUTHOR IAN GUERIN IANGUER.IN
 */
$(document).ready(function(){
  var x = $("#my-location");
  var myPosition;
  getLocation();
  function getLocation(){
    $("#my-location").text("finding you...");
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(showPosition, error);
    }else{
      x.html("geolocation is not supported by this browser.");
    }
  }
  function showPosition(position){
    myPosition = position;
    //x.html("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
    $("#get-tweets").trigger("click");
    $.post("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + myPosition.coords.latitude + "," + myPosition.coords.longitude + "&sensor=true", function(data){
      var address = data["results"][0]["formatted_address"]
      if(address.length > 44){
        address = address.substring(0,41) + "...";
      }
      x.html(address);
    });
  }
  function error(){
    x.html("can't find location...");
  }

  var keywords = "";
  $("#keywords").on("focus", function(){
    keywords = $(this).val();
    $(this).val("");
  });
  $("#keywords").on("blur", function(){
    if($(this).val() != ""){
      keywords = $(this).val();  
    }
    $(this).val(keywords);
  });

  $("#keywords").keyup(function(){
    $(this).val($(this).val().toLowerCase());
  });


  $("#locate").on("click", function(){
    getLocation();
  });

  $("#tweets").on("mouseover", ".intent, .twitter-logo", function(){
    var source = $(this).attr("src");
    source = source.substring(0, source.length - 4) + "-hover.png";
    $(this).attr("src", source);
  });

  $("#tweets").on("mouseout", ".intent, .twitter-logo", function(){
    var source = $(this).attr("src");
    source = source.substring(0, source.length - 10) + ".png";
    $(this).attr("src", source);
  });

  $("#get-tweets").on("click", function(){
    var keywords = $("#keywords").val().split(/\s+/);;
    $("#tweets").text("");
    if($("#keywords").val().trim() == ""){
      $("#tweets").append("<span class='error'>please enter some keywords</span>");
      return;
    }
    if(myPosition){
      $.post("phpscripts/get-tweets.php", {latitude: myPosition.coords.latitude, longitude: myPosition.coords.longitude, keywords: keywords}, function(data){
        data = $.parseJSON(data);
        var some = false;
        for(var i = 0; i < data["statuses"].length; i++){
          some = true;
          var time = $.timeago(new Date(data["statuses"][i]["created_at"]));
          var text = entities(data["statuses"][i]["text"], data["statuses"][i]["entities"]);
          if(data["statuses"][i]["coordinates"] != null){
            var distance = distanceString(distanceBetween(myPosition.coords.latitude, myPosition.coords.longitude, data["statuses"][i]["coordinates"]["coordinates"][1], data["statuses"][i]["coordinates"]["coordinates"][0], "M"));
          }else{
            distance = "unknown location";
          }
          var theTweet = makeTweet(data["statuses"][i]["user"]["name"], data["statuses"][i]["user"]["screen_name"], data["statuses"][i]["user"]["profile_image_url"], text, time, distance, data["statuses"][i]["id_str"]);
          $("#tweets").append(theTweet);
        }
        if(!some){
          $("#tweets").append("<span class='error'>nothing recent matched your criteria</span>");
        }
      });
    }else{
      $("#tweets").append("<span class='error'>no location data, won't do it</span>");
    }
  });

  $("body").keydown(function(e) {
    if (e.keyCode == 13) {
      $("#get-tweets").trigger("click");
    }
  });

  function makeTweet(name, screenName, profilePic, text, time, distance, idStr){
    return "<div class='tweet'>" +
      "<a class='avatar' href='http://twitter.com/" + screenName + "' target='_blank'><img src='" + profilePic + "'/></a>" +
      "<div class='user'>" +
      "<a class='actual-name' href='http://twitter.com/" + screenName + "' target='_blank'>" + name + "</a>" +
      "<br/>" + 
      "<a class='screen-name' href='http://twitter.com/" + screenName + "' target='_blank'>@" + screenName + "</a>" + 
      "</div>" +
      "<div class='clear-floats'></div>" +
      "<a href='https://twitter.com'><img class='twitter-logo' src='images/bird.png'/></a>" +
      "<span class='tweet-text'>" + text + "</span>" +
      "<br/>" +
      "<span class='time-distance'><a href='https://twitter.com/" + screenName + "/status/" + idStr + "' target='_blank'>posted " + time + " from " + distance + "</a></span>" +
      "<div class='intents'>" + 
      "<a href='https://twitter.com/intent/tweet?in_reply_to=" + idStr + "' target='_blank'><img class='intent' src='images/reply.png'/></a>" +
      "<a href='https://twitter.com/intent/retweet?tweet_id=" + idStr + "' target='_blank'><img class='intent' src='images/retweet.png'/></a>" +
      "<a href='https://twitter.com/intent/favorite?tweet_id=" + idStr + "' target='_blank'><img class='intent' src='images/favorite.png'/></a>" +
      "</div>" +
      "</div>";

  }

  function entities(plain, allEntities){
    for(var i in allEntities){
      var items = allEntities[i];
      for(var j in items){
        var item = items[j];
        var url;
        switch(i){
          case "urls": case "media":
            plain = plain.replace(item["url"], "<a href='" + item['expanded_url'] + "'>" + item['display_url'] + "</a>");
            break;
          case "hashtags":
            plain = plain.replace("#" + item["text"], "<a href='https://twitter.com/search/?src=hash&q=%23" + item["text"] + "'>#" + item["text"] + "</a>");
            break;
          case "user_mentions":
            plain = plain.replace("@" + item["screen_name"], "<a href='https://twitter.com/" + item["screen_name"] + "'>@" + item["screen_name"] + "</a>");
            break;
          default:
            break;
        }
      }
    }
    return plain;
  }

  function distanceBetween(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var radlon1 = Math.PI * lon1/180;
    var radlon2 = Math.PI * lon2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit=="K"){ 
      dist = dist * 1.609344; 
    }
    if (unit=="N"){ 
      dist = dist * 0.8684; 
    }
    return dist;
  }   

  function distanceString(dist){
    var miles = Math.floor(dist);
    var feet = Math.floor((dist - miles) * 5280);
    dist = "";
    if(miles > 0){
      if(miles == 1){
        if(feet < 1320){
          dist = "about a mile away";
        }else if(feet < 3960){
          dist = "a mile and a half away";
        }else{
          dist = "almost two miles away";
        }
      }else{
        if(feet < 1320){
          dist = "about " + miles + " miles away";
        }else if(feet < 3960){
          dist = miles + " and a half miles away";
        }else{
          dist = "almost " + (miles + 1) + " miles away";
        }
      }
    }else if(miles == 0){
      if(feet < 1320){
        dist = "very close by";
      }else if(feet < 2640){
        dist = "a few blocks away";
      }else if(feet < 3960){
        dist = "half a mile away";
      }else{
        dist = "almost a mile away";
      }
    }else{
      console.log("this is an error!");
    }

    return dist;
  }

});