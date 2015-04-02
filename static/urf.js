$(document).ready(function() {
  console.log("victory");
  $.get("/questions", function(data, textStatus, jqXHR) {
    console.log(data);

    // URL for getting champion image.
    //http://ddragon.leagueoflegends.com/cdn/5.6.1/img/champion/Annie.png
  });
});
