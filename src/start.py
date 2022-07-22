from flask import Flask, render_template, session, request, g
from flask_mail import Mail
from api import data_api
from mail import send_email
import cfg
import json
import os
import random

app = Flask(__name__, instance_relative_config=True)

app.config['SECRET_KEY'] = cfg.SECRET_KEY
# MAIL
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USE_TLS'] = True if 'True' == os.getenv('MAIL_USE_TLS') else False
app.config['MAIL_USE_SSL'] = True if 'True' == os.getenv('MAIL_USE_SSL') else False
app.config['MAIL_DEBUG'] = True if 'True' == os.getenv('MAIL_DEBUG') else False
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

@app.route('/api/')
def api():
    data = data_api(request.args)
    print(data)
    if type(data) != str:
        data = json.dumps(data)
    print(data)
    return data
    
@app.route('/mail/<string:email>')
def mail_send(email):
    session['email'] = email
    session['code'] = random.randrange(1000, 10000)
    txt = cfg.TMP_MAIL_CODE % session['code']
    if send_email(mail, "Авторизация", email, txt):
        return 'ok', 200 
    return 'invalid', 403

@app.route('/auth/<int:code>')
def auth_user(code):
    if session.get('code', None) is None: return 'invalid', 403
    if session.pop('code') == code:
        session['user'] = session['email'].split('@')[0]
        return 'ok', 200 
    return 'invalid', 403

@app.route('/logout/')
def out_user():
    if session.get('user'): session.pop('user')
    if session.get('email'): session.pop('email')
    return render_template('app.html') 
    
@app.errorhandler(404)
def page_not_found(e):
    return render_template('app.html', user=session.get('user')) 
        
mail = Mail(app)          
app.run(debug=cfg.DEBUG , use_reloader=False, use_debugger=cfg.DEBUG )