from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
import sqlite3, sys, os , base64

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from bd_base import Handle_database

app = Flask(__name__)
api = Api(app)
CORS(app)

class EquipeResource(Resource):
    def __init__(self):
        self.Handle = Handle_database()
        self.conn, self.cursor = self.Handle.connecterBD()

    def ligue_nom(self , ligue_id):
        
        query = """
            SELECT ligue_nom from Ligue WHERE ligue_id = ?
        """
        self.cursor.execute(query , (ligue_id,))
        row = self.cursor.fetchone()
        
        if row:
            return row[0]
        else:
            return None

    def Equipe_list(self):
        query = """
            SELECT team_id, team_name, ligue_id FROM Equipe
        """
        self.cursor.execute(query)
        data = self.cursor.fetchall()

        results = []
        for datas in data:
            team_id, team_name, ligue_id = datas
            ligue_nom = self.ligue_nom(ligue_id)


            results.append({
                'team_id': team_id,
                'team_name': team_name,
                'ligue_nom': ligue_nom
            })

        self.conn.close()

        return jsonify(results)
    
    def Equipe_delete(self , equipe_id):
       
        delete_query = """
            DELETE FROM Equipe WHERE team_id = ?
        """
        self.cursor.execute(delete_query , (equipe_id,))
        self.conn.commit()
        self.conn.close()
        return jsonify({'message':'Team deleted'}) , 200

    
    def Equipe_add(self):
        data = request.get_json()
        team_name = data['team_name']
        ligue_id = data['ligue_id']
        try:
            insert_query = """
                INSERT INTO Equipe (team_name , ligue_id ) VALUES (? , ? , ?)
            """
            self.cursor.execute(insert_query , (team_name  , ligue_id,))
            self.conn.commit()
            self.conn.close()
            return jsonify({'message':'Team added'}), 201
        except sqlite3.Error as e:
            return jsonify({'error': f"Error adding team: {e}"}), 500

    def Equipes_dans_ligue(self , ligue_id):

        query = """
            SELECT team_name
            FROM Equipe
            WHERE ligue_id = ?;
        """

        self.cursor.execute(query, (ligue_id,))

        # Fetch all the results
        team_names = self.cursor.fetchall()
  
        return jsonify(team_names) , 200
    
    def get(self , ligue_id=None):
        if ligue_id:
            return self.ligue_nom(ligue_id)
        else:
            return self.Equipe_list()


    

        
    def __del__(self):
        self.conn.close()

api.add_resource(EquipeResource, '/equipes', '/equipes/<int:equipe_id>' , '/equipes/ligues/<int:ligue_id>')

    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
