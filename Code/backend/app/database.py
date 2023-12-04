from app import db

def high_risk_area() -> dict:
    conn=db.connect()
    query_result = conn.execute("SELECT AreaCode, AreaName, COUNT(DR_NO) as crime_num FROM Cases c NATURAL JOIN Area a GROUP BY AreaCode ORDER BY crime_num DESC LIMIT 5;")
    conn.close()
    area_list = []
    for result in query_result:
        areas={
            "AreaCode":result[0],
            "AreaName":result[1],
            "crime_num":result[2]
        }
        area_list.append(areas)
    return area_list

# def insert_new_area(AreaCode: int, AreaName: str) -> None:
#     conn = db.connect()
#     query = 'INSERT INTO Area VALUES ("{}","{}");'.format(AreaCode,AreaName)
#     conn.execute(query)
#     conn.close()


# written by Ziye Deng

def get_cases(AreaCode:int) -> dict:
    conn = db.connect()
    query_result = conn.execute("SELECT DR_NO, DateReported, Location, CrimeCodeDesc FROM Cases WHERE Cases.AreaCode={} LIMIT 5;".format(AreaCode))
    conn.close()
    case_list = []
    for result in query_result:
        cases={
            "DR_NO":result[0],
            "DateReported":result[1],
            "Location":result[2],
            "CrimeCodeDesc":result[3]
        }
        case_list.append(cases)
    return case_list

def search_area(AreaName: str) -> dict:
    conn = db.connect()
    query = 'SELECT AreaCode, AreaName, COUNT(DR_NO) as crime_num FROM Cases c NATURAL JOIN Area a WHERE AreaName LIKE "%%{}%%" GROUP BY AreaCode ORDER BY crime_num DESC LIMIT 5;'.format(AreaName)
    query_result = conn.execute(query)
    conn.close()
    area_list = []
    for result in query_result:
        areas={
            "AreaCode":result[0],
            "AreaName":result[1],
            "crime_num":result[2]
        }
        area_list.append(areas)
    return area_list    

def delete_case(DR_NO: int) -> None:
    conn = db.connect()
    query = 'DELETE FROM Cases WHERE DR_NO = "{}";'.format(DR_NO)
    conn.execute(query)
    conn.close()

def getValidAreaCode() -> dict:
    conn=db.connect()
    query_result = conn.execute("SELECT AreaCode FROM Area")
    conn.close()
    area_list = []
    for result in query_result:
        area_list.append(result[0])
    return area_list

def getValidCrimeCode() -> dict:
    conn=db.connect()
    query_result = conn.execute("SELECT CrimeCode FROM Crime")
    conn.close()
    area_list = []
    for result in query_result:
        area_list.append(result[0])
    return area_list
    
def insert_new_case(dateReported: str, crimeCode: str, location: str, areaCode: str) ->  int:
    """Insert new task to todo table.

    Args:
        text (str): Task description

    Returns: The task ID for the inserted entry
    """

    conn = db.connect()
    query = 'INSERT INTO Cases (DateReported, CrimeCode, Location, AreaCode) VALUES ("{}", "{}", "{}", "{}");'.format(dateReported, crimeCode, location, areaCode)
    conn.execute(query)
    query_results = conn.execute("Select LAST_INSERT_ID();")
    query_results = [x for x in query_results]
    Case_id = query_results[0][0]
    conn.close()

    return Case_id

def calAvgAge(CrimeCode: int) -> dict:
    conn = db.connect()
    call_procedure = 'CALL myProcedure;'
    query = 'SELECT * FROM CrimeVictimAgeRels WHERE CrimeCode={};'.format(CrimeCode)
    conn.execute(call_procedure)
    query_result=conn.execute(query)
    conn.close()
    age_list = []
    for result in query_result:
        age={
            "CrimeCode":result[0],
            "ageGroup":result[1],
            "avgAge":result[2],
            "CrimeDesc":result[3],
        }
        age_list.append(age)
    return age_list

def calRate() -> dict:
    conn = db.connect()
    call_procedure = 'CALL myProcedure;'
    query = 'SELECT * FROM CrimeIncreaseByMonth;'
    conn.execute(call_procedure)
    query_result=conn.execute(query)
    conn.close()
    rate_list = []
    for result in query_result:
        rate={
            "Month":result[0],
            "y21cnt":result[1],
            "y22cnt":result[2],
            "diff":result[3],
            "rate":result[4]
        }
        rate_list.append(rate)
    return rate_list

def update_case(case_id: int, dateReported: str, location: str, areaCode: str) -> None:
    conn = db.connect()
    query = 'Update Cases SET DateReported = "{}", Location = "{}", AreaCode = {} where DR_NO = {};'.format(dateReported, location, areaCode, case_id)
    conn.execute(query)
    conn.close()