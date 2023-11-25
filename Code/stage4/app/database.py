from app import db

def high_risk_area() -> dict:
    conn=db.connect()
    query_result = conn.execute("SELECT AreaCode, AreaName FROM Area ORDER BY AreaCode DESC LIMIT 5;")
    conn.close()
    area_list = []
    for result in query_result:
        areas={
            "AreaCode":result[0],
            "AreaName":result[1]
        }
        area_list.append(areas)
    return area_list

def insert_new_area(AreaCode: int, AreaName: str) -> None:
    conn = db.connect()
    query = 'INSERT INTO Area VALUES ("{}","{}");'.format(AreaCode,AreaName)
    conn.execute(query)
    conn.close()
    

    