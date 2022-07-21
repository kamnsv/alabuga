from flask import Flask, render_template

app = Flask(__name__, instance_relative_config=True)
  
@app.route('/')
def home():
        return render_template('app.html') 

        
@app.errorhandler(404)
def page_not_found(e):
    return render_template('app.html')
                               
app.run(debug=True)
