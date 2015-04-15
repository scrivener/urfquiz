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

var banners = {
  'wood': "You placed into URF Quiz <strong>Wood 5!</strong><br> Failed quiz gank.",
  'bronze': "You placed into URF Quiz <strong>Bronze!</strong><br> Are you sure you're a doctor?",
  'silver': "You placed into URF Quiz <strong>Silver!</strong><br> Keep trying for a brighter tomorrow!",
  'gold': "You placed into URF Quiz <strong>Gold!</strong><br> Such fascinating Urfolution...what else can you discover?",
  'diamond': "You placed into URF Quiz <strong>Diamond!</strong><br> The glorious Urfolution.",
  'challenger': "You placed into URF Quiz <strong>Challenger!</strong><br> I theorize...your success!",
};
var firstPersonPlacements = {
  'wood': "I placed into URF Quiz Wood 5!",
  'bronze': "I placed into URF Quiz Bronze!",
  'silver': "I placed into URF Quiz Silver!",
  'gold': "I placed into URF Quiz Gold!",
  'diamond': "I placed into URF Quiz Diamond!",
  'challenger': "I placed into URF Quiz Challenger!",
};

var bannerImages = {
  'wood': "Amumu",
  'bronze': "Dr. Mundo",
  'silver': "Jayce", 
  'gold': "Vel'Koz",
  'diamond': "Viktor",
  'challenger': "Heimerdinger",
}

$(document).ready(function() {
  // Firefox is weird and keeps button state between reloads of the page.
  // This will make our buttons enabled after reload if they were disabled.
  $('.btn').prop("disabled", false);
  $('#begin').prop("disabled", true);

  loadQuestionsFromBackend();

  // Set-up quiz start button.
  $('#begin').unbind('click').click(startQuiz);

  $('#spoilersButton').click(function(event) {
    $('#spoilersContent').removeClass('hidden');
    $('#spoilersButton').prop('disabled', true);
  });

  $('.btn-speed').click(function(event) {
    $('.btn-speed').removeClass('active');
    $(event.target).addClass('active');
    mode = $(event.target).prop('id');
    setTimeToSelectedMode();
  });

  setTimeToSelectedMode();

  convertGamesToPopularity();
});

var totalGames = 60994;
var convertGamesToPopularity = function() {
  $('td:last-child').each(function(index, elem) {
    console.log($(elem).text());
    $(elem).text((100 * parseInt($(elem).text())/totalGames).toFixed(2) + '%');
  });

}
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
  $('#resultsFinalScore').text(score + ' (' + rightCount + '/' + (questionCount-1) + ')');

  displayBanner();

  // New set of questions each time.
  loadQuestionsFromBackend();

  $('#begin').unbind('click').click(resetQuiz);

  $('#begin').text('Play Again');
  $('.btn').prop("disabled", false);
};

var rankToColor = {
  'wood': 'brown',
  'bronze': 'tan',
  'silver': 'silver',
  'gold': 'gold',
  'diamond': 'lightblue',
  'challenger': 'lightblue'
}
var displayBanner = function() {
  var rank = getRankFromScore(score);
  var scientist = bannerImages[rank];
  $('#bannerText').html(banners[rank]);
  $('#bannerImage').html($('<img alt="A portrait of "'+scientist+'" src="'+convertChampNameToPngName(scientist)+'" />'));
  $('#bannerImage img').css('border-color', rankToColor[rank]);
  tweetText = firstPersonPlacements[rank];
  $('#twitterButton').html('<a href="https://twitter.com/intent/tweet?button_hashtag=URFQuiz" class="twitter-hashtag-button" data-url="http://urfquiz.com" data-text="%s">Tweet your result!</a>'.replace('%s', tweetText));
  twttr.widgets.load();
}

var getRankFromScore = function(score) {
  if (score <= -100) {
    return 'wood';
  } else if (score <= 0) {
    return 'bronze';
  } else if (score <= 60) {
    return 'silver';
  } else if (score <= 120) {
    return 'gold';
  } else if (score <= 180) {
    return 'diamond';
  } else {
    return 'challenger';
  }
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

