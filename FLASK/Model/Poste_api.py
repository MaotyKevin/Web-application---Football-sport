from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api
import os , sys 

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from bd_base import Handle_database

class Poste_Resource(Resource):
    def __init__(self):
        self.handle = Handle_database()
        self.conn, self.cursor = self.handle.connecterBD()

    def get(self):
        
        query = """
            SELECT * FROM Poste
        """
        self.cursor.execute(query)
        data = self.cursor.fetchall()
        self.conn.close()

        return data
    
    def delete(self , poste_id):
        
        delete_query = """
            DELETE FROM Poste WHERE poste_id = ?
        """
        self.cursor.execute(delete_query , (poste_id,))
        self.conn.commit()
        return jsonify({'message': 'Poste deleted successfully'})


    def post(self ):
        data = request.get_json()
        poste_nom = data['poste_nom']
        if poste_nom:
            try:
                insert_query = """
                    INSERT INTO Poste (poste_nom) VALUES (?)
                """
                self.cursor.execute(insert_query , (poste_nom,))
                self.conn.commit()
                return jsonify({'message': 'Poste added successfully'})
            except Exception as e:
                return jsonify({'error': f"Error adding Poste: {e}"}), 500
        else:
            return jsonify({'error': 'poste_nom is required'}), 400

    def put(self , poste_id):
        data = request.get_json()
        poste_nom = data.get('poste_nom')
        if poste_nom:
            try:

                update_query = "UPDATE Poste SET poste_nom = ? WHERE poste_id = ?"
                self.cursor.execute(update_query, (poste_nom, poste_id))
                self.conn.commit()
                return jsonify({'message': 'Poste updated successfully'}) 
        
            except Exception as e:
                return jsonify({'error': f"Error updating Poste: {e}"}), 500

        else:
            return jsonify({'error': 'poste_nom is required'}), 400
    
    def __del__(self):
        self.conn.close()
        