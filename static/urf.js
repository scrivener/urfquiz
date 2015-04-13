var questions = null;
var questionCount = 0;
var rightCount = 0;
var score = 0;
var time = 10000;
var mode = 'ultra-rapid';
var tickms = 10;
var killStreak = 0;
var killStreakStrings = ['__INDEXING__', 'CORRECT', 'DOUBLE KILL', 
                         'TRIPLE KILL', 'QUADRA KILL', 'PENTAKILL',
                         'HEXAKILL', 'SEPTAKILL', 'OCTAKILL',
                         'NINE KILLS', 'TOO MANY KILLS', 'BUY A SOULSTEALER ALREADY'];
var preloadedImages = [];
var pointsPerQuestion = {
  'ultra': 10,
  'rapid': 20,
  'ultra-rapid': 30
}
var timePerMode = {
  'ultra': 30000,
  'rapid': 20000,
  'ultra-rapid': 10000
}

$(document).ready(function() {
  // Firefox is weird and keeps button state between reloads of the page.
  // This will make our buttons enabled after reload if they were disabled.
  $('.btn').prop("disabled", false);
  $('#begin').prop("disabled", true);

  loadQuestionsFromBackend();

  // Set-up quiz start button.
  $('#begin').unbind('click').click(startQuiz);

  $('.btn-speed').click(function(event) {
    $('.btn-speed').removeClass('active');
    $(event.target).addClass('active');
    mode = $(event.target).prop('id');
    setTimeToSelectedMode();
  });

  setTimeToSelectedMode();
});

var setTimeToSelectedMode = function() {
  time = timePerMode[mode];
  updateTimerDisplay();
}

var loadQuestionsFromBackend = function() {
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
    
    // Don't let the button be pushed until we have questions.
    $('#begin').prop("disabled", false);

  });
}

var resetQuiz = function() {
  // These setters also render to the page.
  setScore(0);
  setQuestionCount(0);

  rightCount = 0;
  killStreak = 0;
  setTimeToSelectedMode();  

  $('#questionContainer').removeClass('hidden');
  $('#resultsContainer').addClass('hidden');

  $('#champ0Image').empty();
  $('#champ1Image').empty();
  $('#champ0Name').empty();
  $('#champ1Name').empty();
  $("#instantFeedback").empty();
  $("#score").text(score);
  $("#questionText").empty();
  
  $('#begin').text('Begin');
  $('#begin').unbind('click').click(startQuiz);
}
var startQuiz = function() {
  setTimeToSelectedMode();  
  startTimer();
  displayNextQuestion();
  $('.btn').prop("disabled", true);
}

var endQuiz = function() {
  $('#champ0').unbind("click");
  $('#champ1').unbind("click");

  // Hide the question area, replace it with the results area.
  $('#questionContainer').addClass('hidden');
  $('#resultsContainer').removeClass('hidden');

  // Put the results into the results area.
  $('#resultsFinalScore').text(score);
  $('#resultsRatio').text(rightCount + '/' + questionCount);

  // New set of questions each time.
  loadQuestionsFromBackend();

  $('#begin').unbind('click').click(resetQuiz);

  $('#begin').text('Play Again');
  $('.btn').prop("disabled", false);
};

var updateTimerDisplay = function() { 
  if (time < 10000) {
    $("#timer").text('00:0' + (time/1000).toFixed(2));
  } else {
    $("#timer").text('00:' + (time/1000).toFixed(2));
  }
  if (time <= 0) {
    $("#timer").text('00:00.00');
  }
}

var startTimer = function() {
  var timerID = setInterval(function() {
    time -= tickms;
    updateTimerDisplay();
    if (time <= 0) {
      clearInterval(timerID);
      endQuiz();
    }
  }, tickms);
};

var displayNextQuestion = function() {
  displayQuestion(questions[questionCount]);
  setQuestionCount(questionCount + 1);
};

var setQuestionCount = function(count) {
  questionCount = count;
  $('#questionCounter').text('Question ' + questionCount); // Display 1-index to user.
  
}

var addScore = function(points) {
  setScore(score + points);
};

var setScore = function(points) {
  score = points;
  $("#score").text(score);
}

var answered = function(right) {
  if (right) {
    rightCount++;
    addScore(pointsPerQuestion[mode]);
    killStreak++;
    $("#instantFeedback").text(killStreakStrings[killStreak]);
  } else {
    killStreak = 0;
    addScore(-pointsPerQuestion[mode]);
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

