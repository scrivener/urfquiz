$(document).ready(function() {
  console.log("victory");
  $.get("/questions", function(data, textStatus, jqXHR) {
    console.log(data);
  });
});
