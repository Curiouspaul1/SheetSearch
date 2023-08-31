from flask import (
    Flask, render_template,
    request, session, redirect,
    url_for, flash
)
from werkzeug.utils import secure_filename
from flask_session import Session
from utils import ParseNQuery
from dotenv import load_dotenv
import os
import pprint

load_dotenv()


app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('APP_SECRET')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_THRESHOLD'] = 1000


@app.get('/')
def index():
    return render_template('index.html')

@app.post('/')
def parse_file():
    if session['usr_sheet']:
        prevfile = session.get('usr_sheet')
        if prevfile:
            if os.path.exists(f"sheets/{prevfile}"):
                os.remove(f"sheets/{prevfile}")
    data = request.files['sheet']
    session['usr_sheet'] = secure_filename(data.filename)

    # save file
    data.save(f'sheets/{secure_filename(data.filename)}')

    return {
        'status': 'success',
        'msg': 'saved file'
    }, 200


@app.get('/search')
def show_search_page():
    return render_template('search.html')

@app.post('/search')
def find_matches():
    query = request.form['query']
    # read file
    filename = session.get('usr_sheet')
    if not filename:
        flash('No file was found, upload your file to search!', 'error')
        return redirect(url_for('index'))
    
    parse_client = ParseNQuery(name=f'sheets/{filename}')
    results = parse_client.search_xls(query)
    if results:
        return render_template(
            'search.html',
            search_results=results,
            headers=parse_client.headers
        )
    flash('No match found', 'warning')
    return redirect(url_for('show_search_page'))
