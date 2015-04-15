#!./venv/bin/python
#
# By Rachel Ruskin and Adam Lerner.
# This server's real job is to read in winrates for champions and provide
# the urfquiz.com/questions resource which returns a JSON list of questions
# that the quiz should ask. It's also capable of serving the static files
# associated with the site for testing,  but doesn't do so in the actual
# deployed site since it's generally better to let a real webserver do that.
import json
import csv
import sys
import random
import datetime

from flask import Flask, Response, request
app = Flask(__name__, static_folder='static') 
#app.debug = True

# Winrates csv => dict().
winrates = {}
popularities = {}
games = {}
with open('winratebychamp.csv', 'r') as statsFile:
    r = csv.DictReader(statsFile)
    for line in r:
        winrates[line['champion']] = line['winrate']
        games[line['champion']] = line['games']


logfile = open('serverlog.csv', 'a')
logwriter = csv.writer(logfile)

# Endpoint that returns a boatload of questions. We punt and return 500,
# since we found in testing that many users like to just click as fast as
# they can on one of the buttons and hope they get a high score, which honestly
# is a reasonable strategy in URF mode, which is all about action and fun, so
# we accomodate them.
@app.route('/questions')
def questions():
    questions = [generateQuestion() for x in range(500)]
    resp = Response(response=json.dumps(questions),
                    status=200,
                    mimetype="application/json")

    return resp

@app.route('/stats')
def stats():
    score =    request.args.get('score', 'None')
    visitid =  request.args.get('visitid', 'None')
    right =    request.args.get('right', 'None')
    answered = request.args.get('answered', 'None')
    mode =     request.args.get('mode', 'None')
    logwriter.writerow([datetime.datetime.now().isoformat(), score, visitid, right, answered, mode])
    logfile.flush()
    return ''


# Generates a single question consisting of two champions, with their winrates.
def generateQuestion():
    (champ0, champ1) = random.sample(winrates.items(), 2)
    champ0Winrate = champ0[1]
    champ1Winrate = champ1[1]
    if champ0Winrate > champ1Winrate:
        correct = 0
    else:
        correct = 1

    return { 'champ0': champ0[0],
             'champ1': champ1[0],
             'champ0Winrate': champ0Winrate,
             'champ1Winrate': champ1Winrate,
             'correct': correct,
             'question': 'Who has the higher winrate in URF?',
           }

# These static routes are never used in deployment (nginx serves the static
# files directly and only routes /questions to this app.
# We leave them in for ease of debugging.
@app.route('/')
def mainPage():
    return app.send_static_file('index.html')
@app.route('/<path>')
def urfStatic(path):
    return app.send_static_file(path)

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=80)
