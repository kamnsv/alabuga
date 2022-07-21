from flask import Flask, render_template, session, request
from api import data_api
import json

app = Flask(__name__, instance_relative_config=True)

@app.route('/api/')
def api():
    data = data_api(request.args)
    print(data)
    if type(data) != str:
        data = json.dumps(data)
    print(data)
    return  data
    

@app.errorhandler(404)
def page_not_found(e):
    return render_template('app.html') 
        
       
                               
app.run(debug=True)
