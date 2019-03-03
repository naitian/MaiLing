from flask import Flask
app = Flask(__name__)

from flask import abort, request, render_template, Response
from brain import *

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/score', methods=['POST'])
def api():
    if flask.request.method == 'POST':
        draft = flask.request.values.get('text')
        email_addr = flask.request.values.get('email')
        return score_draft(draft, email_addr)
    else:
        return abort(405)

