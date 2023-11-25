from flask import jsonify, render_template
from app import app
from app import database as db_helper

@app.route('/',)
def homepage():
    return render_template("index.html")

@app.route("/areacode", methods=['GET'])
def getAreaCode():
    """ recieved post requests for entry delete """
    try:
        
        result = {'success': True, 'response': db_helper.high_risk_area()}
    except:
        result = {'success': False, 'response': 'Something went wrong'}

    return jsonify(result)