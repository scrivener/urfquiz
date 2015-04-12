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

$(document).ready(function() {
  // Firefox is weird and keeps button state between reloads of the page.
  // This will make our buttons enabled after reload if they were disabled.
  $('.btn').prop("disabled", false);

  loadQuestionsFromBackend();

  $('.btn-speed').click(function(event) {
    $('.btn-speed').removeClass('active');
    $(event.target).addClass('active');
    mode = $(event.target).prop('id');
    setTimeToSelectedMode();
    updateTimerDisplay();
  });
});

var setTimeToSelectedMode = function() {
  if (mode === 'ultra') {
    time = 30000;
  } else if (mode === 'rapid') {
    time = 20000;
  } else if (mode === 'ultra-rapid') {
    time = 10000;
  }
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

    // Set-up quiz start button.
    // We do this upon completing load of questions from the backend
    // because we want to avoid trying to start the quiz before 
    // questions are loaded.
    $('#begin').unbind('click').click(startQuiz);
  });
}

var startQuiz = function() {
  score = 0;
  rightCount = 0;
  questionCount = 0; 
  killStreak = 0;
  setTimeToSelectedMode();  
  updateTimerDisplay();
  startTimer();
  $('#questionContainer').removeClass('hidden');
  $('#resultsContainer').addClass('hidden');
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

  readyToRestart()
};

var readyToRestart = function() {
  $('#begin').text('Play Again');
  $('.btn').prop("disabled", false);
}
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

