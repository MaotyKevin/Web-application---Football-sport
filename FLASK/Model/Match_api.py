from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api
import os , sys 

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from bd_base import Handle_database

class Match_Ressource(Resource):
    def __init__(self):
        self.handle = Handle_database()
        self.conn, self.cursor = self.handle.connecterBD()

    def adversaire_nom(self , adversaire_id):
       
        query = """
            SELECT team_name from Equipe WHERE team_id = ?
        """
        self.cursor.execute(query , (adversaire_id,))
        row = self.cursor.fetchone()
       
        if row:
            return row[0]
        else:
            return None


    def get(self):
        
        query = """
            SELECT m.match_adversaire , m.match_date , m.match_lieu , e.team_name
            FROM Match m
            LEFT JOIN EquipeMatch em ON m.match_id = em.match_id
            LEFT JOIN Equipe e ON em.team_id = e.team_id
            
        """
        self.cursor.execute(query)
        data = self.cursor.fetchall()
        results = []
        for datas in data :
            adversaire_id , date_match , lieu_match , equipe_match = datas 
            adversaire_nom=self.adversaire_nom(adversaire_id)
            results.append((adversaire_nom, date_match, lieu_match, equipe_match))

        return results


    def post(self):
        data = request.get_json()
        match_adversaire = data['match_adversaire']
        match_date = data['match_date']
        match_lieu = data['match_lieu']

        if match_adversaire and match_date and match_lieu : 
            try:
        
                insert_query = """
                    INSERT INTO Match (match_adversaire ,match_date, match_lieu ) VALUES (? , ? , ?)
                """
                self.cursor.execute(insert_query , (match_adversaire , match_date , match_lieu,))
                self.conn.commit()
                return jsonify({'message': 'Match added successfully'})
            except Exception as e:
                return jsonify({'error': f"Error adding Match: {e}"}), 500
        else:
            return jsonify({'error': 'adversaire , date , lieu are required'}), 400


    def __del__(self):
        self.conn.close() 

        