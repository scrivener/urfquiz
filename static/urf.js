var questions = null;
var questionCount = 0;
var rightCount = 0;
var score = 0;
var time = 10000;
var tickms = 10;
var killStreak = 0;
var killStreakStrings = ['__INDEXING__', 'CORRECT', 'DOUBLE KILL', 
                         'TRIPLE KILL', 'QUADRA KILL', 'PENTAKILL',
                         'HEXAKILL', 'SEPTAKILL', 'OCTAKILL',
                         'NINE KILLS', 'TOO MANY KILLS', 'BUY A SOULSTEALER ALREADY'];
var preloadedImages = [];

$(document).ready(function() {
  // Firefox is weird and keeps button state between reloads of the page.
  // This will make our buttons enabled after reload if they were disabled.
  $('.btn').prop("disabled", false);

  $.getJSON("/questions", function(data, textStatus, jqXHR) {
    questions = data;

    // Preload all the image thumbnails for seamless quizzing.
    $.each(questions, function(index, q) {
      var c0img = new Image();
      var c1img = new Image();
      c0img.src = convertChampNameToPngName(q.champ0);
      c1img.src = convertChampNameToPngName(q.champ1);
      preloadedImages.push(c0img);
      preloadedImages.push(c1img);
    });

    // Set-up quiz start button.
    $('#begin').click(function(event) {
      startTimer();
      displayNextQuestion();
      lockBeginButton();
    });
  });
});

var lockBeginButton = function() {
  $('#begin').prop("disabled", true);
}
var endQuiz = function() {
    $('#champ0').unbind("click");
    $('#champ1').unbind("click");
};

var startTimer = function() {
  var timerID = setInterval(function() {
    time -= tickms;
    $("#timer").text('00:0' + (time/1000).toFixed(2));
    if (time <= 0) {
      clearInterval(timerID);
      $("#timer").text('00:00.00');
      endQuiz();
    }
  }, tickms);
};

var displayNextQuestion = function() {
  displayQuestion(questions[questionCount]);
  questionCount++;
  $('#questionCounter').text('Question ' + questionCount); // Display 1-index to user.
};

var addScore = function(points) {
  score += points;
  $("#score").text(score);
};

var answered = function(right) {
  if (right) {
    rightCount++;
    addScore(10);
    killStreak++;
    $("#instantFeedback").text(killStreakStrings[killStreak]);
  } else {
    killStreak = 0;
    addScore(-10);
    $("#instantFeedback").text("WRONG");
  } 
  displayNextQuestion();
};

var convertChampNameToPngName = function(name) {
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
    return "http://ddragon.leagueoflegends.com/cdn/5.6.1/img/champion/" + name + ".png";
};

var displayQuestion = function(q) {
    var c0Image = convertChampNameToPngName(q.champ0);
    var c1Image = convertChampNameToPngName(q.champ1);

    $('#questionText').text(q.question);

    $('#champ0Image').html($('<img alt="'+q.champ0+'" src="'+c0Image+'" />'));
    $('#champ0Name').text(q.champ0);
    $('#champ0').unbind("click").click(function(e) {
      answered(q.correct === 0);
    });
    $('#champ1Image').html($('<img alt="'+q.champ1+'" src="'+c1Image+'" />'));
    $('#champ1Name').text(q.champ1);
    $('#champ1').unbind("click").click(function(e) {
      answered(q.correct === 1);
    });
};

