from brain import score_draft
from flask import Flask
from flask import abort, request, render_template, jsonify, Response


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/score', methods=['POST'])
def api():
    if request.method == 'POST':
        data = request.get_json()
        draft = data.get('text')
        email_addr = data.get('email')
        return jsonify(score_draft(draft, email_addr))
    else:
        return abort(405)
