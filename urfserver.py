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
            { 'champ0': 'Annie', 'champ1': "Khz'Zix", 'correct': 'Annie', 'question': 'Who has the higher winrate in URF?'}
    ]
    return json.dumps(questions)

if __name__ == '__main__':
  app.run()
