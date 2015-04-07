#!/usr/bin/python

import json
import csv
import sys
import random

from flask import Flask, Response
app = Flask(__name__, static_folder='static') 

winrates = {}
popularities = {}
with open('tempdata.csv', 'r') as statsFile:
    r = csv.DictReader(statsFile)
    for line in r:
        winrates[line['Champion']] = line['Win Rate']
        popularities[line['Champion']] = line['Popularity']

@app.route('/')
def mainPage():
    return app.send_static_file('index.html')

@app.route('/urf.js')
def urfJS():
    return app.send_static_file('urf.js')

@app.route('/urf.css')
def urfCSS():
    return app.send_static_file('urf.css')

@app.route('/questions')
def questions():
    questions = [generateQuestion() for x in range(50)]
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
  app.debug = True
  app.run()
