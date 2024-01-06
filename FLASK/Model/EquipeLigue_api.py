from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api
import os , sys 

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from bd_base import Handle_database

class EquipeLigueResource(Resource):
    def __init__(self):
        self.handle = Handle_database()
        self.conn, self.cursor = self.handle.connecterBD()

    def get(self , ligue_id):

        query = """
            SELECT team_name
            FROM Equipe
            WHERE ligue_id = ?;
        """

        self.cursor.execute(query, (ligue_id,))

        # Fetch all the results
        team_names = self.cursor.fetchall()
  
        return team_names

    def __del__(self):
        self.conn.close()

    