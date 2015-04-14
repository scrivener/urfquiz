#!./venv/bin/python

import json
import csv
import sys
import random

from flask import Flask, Response
app = Flask(__name__, static_folder='static') 
#app.debug = True

winrates = {}
popularities = {}
games = {}
with open('winratebychamp.csv', 'r') as statsFile:
    r = csv.DictReader(statsFile)
    for line in r:
        winrates[line['champion']] = line['winrate']
        games[line['champion']] = line['games']

# These static routes are never used in deployment (nginx serves the static
# files directly and only routes /questions to this app.
# We leave them in for ease of debugging.
@app.route('/')
def mainPage():
    return app.send_static_file('index.html')
@app.route('/<path>')
def urfStatic(path):
    return app.send_static_file(path)


@app.route('/questions')
def questions():
    questions = [generateQuestion() for x in range(500)]
    resp = Response(response=json.dumps(questions),
                    status=200,
                    mimetype="application/json")

    return resp

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

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=80)
