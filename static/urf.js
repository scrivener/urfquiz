var questions = null;
var questionCount = 0;
var rightCount = 0;

$(document).ready(function() {
  $.getJSON("/questions", function(data, textStatus, jqXHR) {
    questions = data;
    $('#begin').click(function(event) {
      startTimer();
      // Start timer.
      displayNextQuestion();
      // Display first question.
      // Lock button or change it to "stop".
    });
  });
});

var startTimer = function() {
  //
}

var displayNextQuestion = function() {
  displayQuestion(questions[questionCount]);
  questionCount++;
  $('#questionCounter').text(questionCount + "/" + questions.length ); // Display 1-index to user.

  if (questionCount >= 10) {
    // Done.
  }
}

var answered = function(right) {
  if (right) {
    rightCount++;
  }  
  displayNextQuestion();
}

var convertChampNamesToPngName = function(name) {
    name = name.replace("Kha'Zix", "Khazix");
    name = name.replace("Wukong", "MonkeyKing");
    name = name.replace("Vel'Koz", "Velkoz");
    name = name.replace("Fiddlesticks", "FiddleSticks");
    name = name.replace("Kog'Maw", "KogMaw");
    name = name.replace("Rek'Sai", "RekSai");
    name = name.replace("Dr. Mundo", "DrMundo");
    name = name.replace("Cho'Gath", "Chogath");
    name = name.replace("LeBlanc", "Leblanc");
    name = name.replace(" ", "");
    return name;
}

var displayQuestion = function(q) {
    var c0Image = "http://ddragon.leagueoflegends.com/cdn/5.6.1/img/champion/" + q.champ0 + ".png";
    var c1Image = "http://ddragon.leagueoflegends.com/cdn/5.6.1/img/champion/" + q.champ1 + ".png";
    c0Image = convertChampNamesToPngName(c0Image);
    c1Image = convertChampNamesToPngName(c1Image);

    $('#champ0Image').html($('<img src="'+c0Image+'" />'));
    $('#champ0Name').text(q.champ0);
    $('#champ0').unbind("click").click(function(e) {
      answered(q.correct === 0);
    });
    $('#champ1Image').html($('<img src="'+c1Image+'" />'));
    $('#champ1Name').text(q.champ1);
    $('#champ1').unbind("click").click(function(e) {
      answered(q.correct === 1);
    });
}

