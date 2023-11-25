from flask import Flask, jsonify, render_template
import os
import sqlalchemy
from yaml import load, Loader

def init_connect_engine():
    if os.environ.get('GAE_ENV') != 'standard':
        variables = load(open('app.yaml'), Loader=Loader)
        env_variables = variables['env_variables']
        for var in env_variables:
            os.environ[var] = env_variables[var]

    pool = sqlalchemy.create_engine(
        sqlalchemy.engine.url.URL(
            drivername="mysql+pymysql",
            username=os.environ.get('MYSQL_USER'),
            password=os.environ.get('MYSQL_PASSWORD'),
            database=os.environ.get("MYSQL_DB"),
            host=os.environ.get('MYSQL_HOST'),
        )
    )
    return pool

app = Flask(__name__)
db = init_connect_engine()

from app import routes