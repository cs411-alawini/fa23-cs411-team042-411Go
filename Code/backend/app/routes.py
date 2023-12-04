from flask import jsonify, render_template, request
from app import app
from app import database as db_helper

@app.route('/')
def homepage():

    return getAreaCode()

@app.route("/areacode", methods=['GET'])
def getAreaCode():
    """ recieved post requests for entry delete """
    try:
        result = {'success': True, 'response': db_helper.high_risk_area()}
    except:
        result = {'success': False, 'response': 'Something went wrong'}

    return jsonify(result)

@app.route("/cases/<AreaCode>", methods=['GET'])
def getCases(AreaCode):

    try:
        result = {'success': True, 'response': db_helper.get_cases(AreaCode)}
    except:
        result = {'success': False, 'response': 'Something went wrong'}

    return jsonify(result)

@app.route("/search/<searchTerm>", methods=['GET'])
def searchAreaName(searchTerm):
    try:

        result = {'success': True, 'response': db_helper.search_area(searchTerm)}
    except:
        result = {'success': False, 'response': 'Something went wrong'}
    return jsonify(result)

@app.route("/validareacode", methods=['GET'])
def getValidAreaCode():
    try:
        result = {'success': True, 'response': db_helper.getValidAreaCode()}
    except:
        result = {'success': False, 'response': 'Something went wrong'}

    return jsonify(result)

@app.route("/validcrimecode", methods=['GET'])
def getValidCrimeCode():
    try:
        result = {'success': True, 'response': db_helper.getValidCrimeCode()}
    except:
        result = {'success': False, 'response': 'Something went wrong'}

    return jsonify(result)

@app.route("/insertnewcase", methods=['POST'])
def insertNewCase():
    """ recieves post requests to add new task """
    data = request.get_json()
    id = db_helper.insert_new_case(data['DateReported'], data["CrimeCode"], data["Location"], data["AreaCode"])
    result = {'success': True, 'response': id}
    return jsonify(result)

@app.route("/delete", methods=['POST'])
def deleteCases():
    data = request.get_json()  # Assuming data is sent as JSON
    print(data)
    DR_NO = data['DR_NO']
    db_helper.delete_case(DR_NO)
    result = {'success': True, 'response': 'Done'}
    return jsonify(result)

@app.route("/avgAge/<CrimeCode>", methods=['GET'])
def calAvgAge(CrimeCode):
    try:
        result = {'success': True, 'response': db_helper.calAvgAge(CrimeCode)}
    except:
        result = {'success': False, 'response': 'Something went wrong'}

    return jsonify(result)

@app.route("/rate", methods=['GET'])
def calRate():
    try:
        result = {'success': True, 'response': db_helper.calRate()}
    except:
        result = {'success': False, 'response': 'Something went wrong'}

    return jsonify(result)

@app.route("/edit/<int:case_id>", methods=['POST'])
def update(case_id):
    """ recieved post requests for entry updates """

    data = request.get_json()

    try:

        db_helper.update_case(case_id, data['DateReported'], data["Location"], data["AreaCode"])
        result = {'success': True, 'response': 'Case Updated'}
        # if "status" in data:
        #     db_helper.update_status_entry(case_id, data["status"])
        #     result = {'success': True, 'response': 'Status Updated'}
        # elif "description" in data:
        #     db_helper.update_task_entry(case_id, data["description"])
        #     result = {'success': True, 'response': 'Task Updated'}
        # else:
        #     result = {'success': True, 'response': 'Nothing Updated'}
    except:
        result = {'success': False, 'response': 'Something went wrong'}

    return jsonify(result)