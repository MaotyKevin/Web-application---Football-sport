from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api
import os , sys 

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from bd_base import Handle_database

class Equipe_titulaireOne_Resource(Resource):
    def __init__(self):
        self.handle = Handle_database()
        self.conn, self.cursor = self.handle.connecterBD()

    def poste_nom(self , poste_id):
        
        query = """
            SELECT poste_nom from Poste WHERE poste_id = ?
        """
        self.cursor.execute(query , (poste_id,))
        row = self.cursor.fetchone()
        
        if row:
            return row[0]
        else:
            return None

    def get(self , team_id):
       
        query = """
            SELECT  T.titulaire_id, T.titulaire_nom , T.poste_id
            FROM EquipeTitulaire et
            LEFT JOIN Titulaire T ON et.titulaire_id = T.titulaire_id
            WHERE et.team_id = ?
        """

        self.cursor.execute(query , (team_id,))
        data = self.cursor.fetchall()

        results = []
        for datas in data:
            titulaire_id , titulaire_nom , poste_id = datas
            poste_nom = self.poste_nom(poste_id)
            results.append({
                'titulaire_id' : titulaire_id , 
                'titulaire_nom' : titulaire_nom,
                'poste_nom' : poste_nom,

            })
        return results 
    
    def __del__(self):
        self.conn.close()
    

class Equipe_titulaireTwo_Resource(Resource):
    def __init__(self):
        self.handle = Handle_database()
        self.conn, self.cursor = self.handle.connecterBD()

    def get(self , team_id):
       
        query = """
            SELECT
                COUNT(et.titulaire_id)
            FROM
                Equipe e
            JOIN EquipeTitulaire et ON e.team_id = et.team_id
            WHERE
                e.team_id = ?
        """

        self.cursor.execute(query , (team_id,))
        data = self.cursor.fetchall()
        return data
    
    def __del__(self):
        self.conn.close()


