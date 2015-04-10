var questions = null;
var questionCount = 0;
var rightCount = 0;
var score = 0;
var time = 10000;
var tickms = 10;
var killStreak = 0;
var killStreakStrings = ['INDEXING', 'CORRECT', 'DOUBLE KILL', 
                         'TRIPLE KILL', 'QUADRA KILL', 'PENTAKILL',
                         'HEXAKILL', 'SEPTAKILL', 'OCTAKILL',
                         'NINE KILLS', 'TOO MANY KILLS', 'BUY A SOULSTEALER ALREADY'];

$(document).ready(function() {
  $.getJSON("/questions", function(data, textStatus, jqXHR) {
    questions = data;
    $('#begin').click(function(event) {
      console.log('click');
      startTimer();
      // Start timer.
      displayNextQuestion();
      // Display first question.
      // Lock button or change it to "stop".
    });
  });
});

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
};

var displayQuestion = function(q) {
    var c0Image = "http://ddragon.leagueoflegends.com/cdn/5.6.1/img/champion/" + q.champ0 + ".png";
    var c1Image = "http://ddragon.leagueoflegends.com/cdn/5.6.1/img/champion/" + q.champ1 + ".png";
    c0Image = convertChampNamesToPngName(c0Image);
    c1Image = convertChampNamesToPngName(c1Image);

    $('#questionText').text(q.question);

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
};

