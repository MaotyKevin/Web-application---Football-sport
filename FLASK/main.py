from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api
import sys , os
from dotenv import load_dotenv

from Model.Ligue_api import LigueResource
from Model.Equipe_api import EquipeResource , EquipeINdividualResource
from Model.EquipeLigue_api import EquipeLigueResource
from Model.Poste_api import Poste_Resource
from Model.Match_api import Match_Ressource
from Model.EquipeMatch_api import EquipeMatchOne_Resource , EquipeMatchTwo_Resource
from Model.EquipeTitulaire_api import Equipe_titulaireOne_Resource , Equipe_titulaireTwo_Resource

load_dotenv()
app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}} )

api.add_resource(LigueResource, '/ligue', '/ligue/<int:ligue_id>')

api.add_resource(EquipeResource, '/equipes', '/equipes/<int:equipe_id>' )

api.add_resource(EquipeINdividualResource, '/equipeIndividual/<int:team_id>' )

api.add_resource(EquipeLigueResource , '/equipesLigue/<int:ligue_id>' )

api.add_resource(Poste_Resource , '/poste' , '/poste/<int:poste_id>' )

api.add_resource(Match_Ressource , '/match'  )

api.add_resource(EquipeMatchOne_Resource , '/equipesMatchOne/<int:team_id>' )

api.add_resource(EquipeMatchTwo_Resource , '/equipesMatchTwo/<int:team_id>'  )

api.add_resource(Equipe_titulaireOne_Resource , '/equipesTitulaireOne/<int:team_id>' )

api.add_resource(Equipe_titulaireTwo_Resource , '/equipesTitulaireTwo/<int:team_id>'  )


debug = os.getenv('DEBUG', 'False').lower() == 'true'
host = os.getenv('host', '0.0.0.0')
port = int(os.getenv('port', 8080))




if __name__ == '__main__':
    app.run(host=host, port=port, debug=debug)