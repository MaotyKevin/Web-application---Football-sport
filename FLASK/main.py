from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api
import sys , os

from Model.Ligue_api import LigueResource
from Model.Equipe_api import EquipeResource
from Model.EquipeLigue_api import EquipeLigueResource

app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}} )

api.add_resource(LigueResource, '/ligue', '/ligue/<int:ligue_id>')

api.add_resource(EquipeResource, '/equipes', '/equipes/<int:equipe_id>' )

api.add_resource(EquipeLigueResource , '/equipesLigue/<int:ligue_id>' )


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)