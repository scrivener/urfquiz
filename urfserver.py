#!/usr/bin/python

from flask import Flask
app = Flask(__name__, static_folder='static', static_url_path='/')

@app.route('/')
def mainPage():
    return app.send_static_file('index.html')

@app.route('/questions')
def questions():
  return 'These are the questions'

if __name__ == '__main__':
  app.run()
