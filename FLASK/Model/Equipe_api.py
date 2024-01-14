from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
import sqlite3, sys, os , base64

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from bd_base import Handle_database

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

    def get(self):
        query = """
            SELECT team_id, team_name , ligue_id FROM Equipe
        """
        self.cursor.execute(query)
        data = self.cursor.fetchall()

        results = []
        for datas in data:
            team_id, team_name,ligue_id = datas
            ligue_nom = self.ligue_nom(ligue_id)


            results.append({
                'team_id': team_id,
                'team_name': team_name,
                'ligue_nom': ligue_nom
            })

        return results
    
    def delete(self , equipe_id):
       
        delete_query = """
            DELETE FROM Equipe WHERE team_id = ?
        """
        self.cursor.execute(delete_query , (equipe_id,))
        self.conn.commit()
      
        return ({'message':'Team deleted'}) , 200

    
    def post(self):
        data = request.get_json()
        team_name = data['team_name']
        ligue_id = data['ligue_id']
        try:
            insert_query = """
                INSERT INTO Equipe (team_name , ligue_id ) VALUES ( ? , ?)
            """
            self.cursor.execute(insert_query , (team_name  , ligue_id,))
            self.conn.commit()
         
            return ({'message':'Team added'}), 201
        except sqlite3.Error as e:
            return ({'error': f"Error adding team: {e}"}), 500
        
    def put(self , equipe_id):
        data = request.get_json()
        nom_equipe = data.get('team_name')
        ligue_id = data.get('ligue_id')
        if nom_equipe:
            try:
                update_query = "UPDATE Equipe SET team_name = ? , ligue_id = ? WHERE team_id = ? "
                self.cursor.execute(update_query , (nom_equipe ,ligue_id, equipe_id))
                self.conn.commit()
                return jsonify({'Team updated successfuly'})
            except Exception as e:
                return jsonify({'error': f"Team update failed - {e}"})
        else : 
            return jsonify({'error': 'team_name required'})
        

    
    def __del__(self):
        self.conn.close()

class EquipeINdividualResource(Resource):
    def __init__(self):
        self.Handle = Handle_database()
        self.conn, self.cursor = self.Handle.connecterBD()

    def get(self , team_id):
        query = """
            SELECT team_id, team_name FROM Equipe WHERE team_id = ?
        """
        self.cursor.execute(query , (team_id,))
        data = self.cursor.fetchall()



        return data


