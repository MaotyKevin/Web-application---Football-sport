from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api
import os , sys 

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from bd_base import Handle_database


class LigueResource(Resource):
    def __init__(self):
        self.handle = Handle_database()
        self.conn, self.cursor = self.handle.connecterBD()

    def get(self):
        query = "SELECT * FROM Ligue"
        self.cursor.execute(query)
        data = self.cursor.fetchall()
        return jsonify(data)

    def delete(self, ligue_id):
        delete_query = "DELETE FROM Ligue WHERE ligue_id = ?"
        self.cursor.execute(delete_query, (ligue_id,))
        self.conn.commit()
        return jsonify({'message': 'Ligue deleted successfully'})

    def post(self):
        data = request.get_json()
        ligue_nom = data.get('ligue_nom')
        if ligue_nom:
            insert_query = "INSERT INTO Ligue (ligue_nom) VALUES (?)"
            self.cursor.execute(insert_query, (ligue_nom,))
            self.conn.commit()
            return jsonify({'message': 'Ligue added successfully'})
        else:
            return jsonify({'error': 'Ligue_nom is required'}), 400

    def put(self, ligue_id):
        data = request.get_json()
        ligue_nom = data.get('ligue_nom')
        if ligue_nom:
            try:
                update_query = "UPDATE Ligue SET ligue_nom = ? WHERE ligue_id = ?"
                self.cursor.execute(update_query, (ligue_nom, ligue_id))
                self.conn.commit()
                return jsonify({'message': 'Ligue updated successfully'})
            except Exception as e:
                return jsonify({'error': f"Error updating Ligue: {e}"}), 500
        else:
            return jsonify({'error': 'Ligue_nom is required'}), 400

    def __del__(self):
        self.conn.close()


