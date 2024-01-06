from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api
import os , sys 

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from bd_base import Handle_database


class EquipeMatchOne_Resource(Resource):
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

    def get(self , team_id):

        query = """
            SELECT m.match_adversaire , m.match_date , m.match_lieu
            FROM EquipeMatch em
            LEFT JOIN Match m ON em.match_id = m.match_id
            WHERE em.team_id = ?
        """

        self.cursor.execute(query , (team_id,))
        data = self.cursor.fetchall()
        results = []
        for datas in data :
            adversaire_id , date_match , lieu_match = datas 
            adversaire_nom=self.adversaire_nom(adversaire_id)
            results.append((adversaire_nom, date_match, lieu_match))
        return results 
    
    def __del__(self):
        self.conn.close()
    
class EquipeMatchTwo_Resource(Resource):
    def __init__(self):
        self.handle = Handle_database()
        self.conn, self.cursor = self.handle.connecterBD()

    def get(self , team_id):
        
        query = """
            SELECT
                COUNT(em.match_id)
            FROM
                Equipe e
            JOIN EquipeMatch em ON e.team_id = em.team_id
            WHERE
                e.team_id = ?
        """

        self.cursor.execute(query , (team_id,))
        data = self.cursor.fetchall()
        return data
    
    def __del__(self):
        self.conn.close()