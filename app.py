from brain import score_draft
from flask import Flask
from flask import abort, request, render_template, Response


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/score', methods=['POST'])
def api():
    if request.method == 'POST':
        draft = request.values.get('text')
        email_addr = request.values.get('email')
        return score_draft(draft, email_addr)
    else:
        return abort(405)
