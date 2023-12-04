from flask import Flask, jsonify, render_template
import os
import sqlalchemy
from yaml import load, Loader
from flask_cors import CORS

def init_connect_engine():
    if os.environ.get('GAE_ENV') != 'standard':
        variables = load(open('app.yaml'), Loader=Loader)
        env_variables = variables['env_variables']
        for var in env_variables:
            os.environ[var] = env_variables[var]
    
    # pool = sqlalchemy.create_engine('mysql+pymysql://root:safewalk@34.28.174.109:3306/safewalk_la')
    pool = sqlalchemy.create_engine(
        sqlalchemy.engine.url.URL(
            drivername="mysql+pymysql",
            username=os.environ.get('MYSQL_USER'),
            password=os.environ.get('MYSQL_PASSWORD'),
            database=os.environ.get('MYSQL_DB'),
            host=os.environ.get('MYSQL_HOST'),
            port=os.environ.get('MYSQL_PORT'),
            query={},
        )
    )
    return pool

app = Flask(__name__)
CORS(app)
db = init_connect_engine()

from app import routes