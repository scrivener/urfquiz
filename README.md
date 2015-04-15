The URF quiz.

This is the source for The URF Quiz (urfquiz.com), including:

  * Data collection scripts, which download and process URF game data.
  * Backend: A Flask application server.
  * Frontend: The website itself.

### Data collection and processing pipeline
The script that downloads data is `dataCollection/matchDownloader.py`. It queries
(well, *queried*, since URF is now finished) the API Challenge endpoint for all NA URF
games and downloads each one's stats into its own file, continually doing so
until stopped. In our run it kept up with all games it was offered, collecting
over 60k games.

We then use `gamesToDataframe.py`, which takes in the game data and outputs a
pickled Pandas dataframe, and then `dataframeToWinrates.py`, which takes in the 
dataframe and outputs winrates. We do some hand massaging of that data, involving
renaming champions ("MonkeyKing" => "Wukong", "MissFortune" => "Miss Fortune", etc.
since our Javascript expects them to be in their normal human readable form.

### Backend application server
`urfserver.py` is a Flask (http://flask.pocoo.org/) server which provides an
endpoing that translates our winrate statistics into quiz questions about those
winrates. Hitting its `/questions/` URL gets you back a JSON list of questions,
which the frontend displays for the player to answer.

In the deployed site, it's run as a uWSGI application behind an nginx server,
but the script itself can serve the static frontend content during testing.

### Frontend website
The website is in the `/static/` directory. It queries the backend server for
questions and presents them to the player, scoring them on their success.
