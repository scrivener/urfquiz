#!/usr/bin/python

import json

from flask import Flask
app = Flask(__name__, static_folder='static') 

@app.route('/')
def mainPage():
    return app.send_static_file('index.html')

@app.route('/urf.js')
def urfJS():
    return app.send_static_file('urf.js')

@app.route('/questions')
def questions():
    questions = [
            { 'champ0': 'Annie', 'champ1': "Kha'zix", 'correct': 0, 'question': 'Who has the higher winrate in URF?'},
            { 'champ0': 'Zilean', 'champ1': "Kha'zix", 'correct': 0, 'question': 'Who has the higher winrate in URF?'},
            { 'champ0': 'Graves', 'champ1': "Kha'zix", 'correct': 0, 'question': 'Who has the higher winrate in URF?'},
            { 'champ0': 'Master Yi', 'champ1': "Kha'zix", 'correct': 0, 'question': 'Who has the higher winrate in URF?'},
            { 'champ0': "Rek'Sai", 'champ1': "Kha'zix", 'correct': 0, 'question': 'Who has the higher winrate in URF?'},
            { 'champ0': 'Brand', 'champ1': "Kha'zix", 'correct': 1, 'question': 'Who has the higher winrate in URF?'},
            { 'champ0': 'Irelia', 'champ1': "Kha'zix", 'correct': 1, 'question': 'Who has the higher winrate in URF?'},
            { 'champ0': 'Cassiopeia', 'champ1': "Kha'zix", 'correct': 1, 'question': 'Who has the higher winrate in URF?'},
            { 'champ0': 'Quinn', 'champ1': "Kha'zix", 'correct': 1, 'question': 'Who has the higher winrate in URF?'},
            { 'champ0': 'Twitch', 'champ1': "Kha'zix", 'correct': 1, 'question': 'Who has the higher winrate in URF?'},
    ]
    return json.dumps(questions)

if __name__ == '__main__':
  app.run()
