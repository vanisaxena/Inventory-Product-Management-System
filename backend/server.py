from flask import Flask
from flask_cors import CORS
import os
from models import db
from routes import register_blueprints

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL', 
    'postgresql://myuser:mypassword@db:5432/inventory_management'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)

register_blueprints(app)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)