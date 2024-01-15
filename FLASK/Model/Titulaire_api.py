from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api
import os , sys 

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from bd_base import Handle_database


class TitulaireResource(Resource):
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

    def get(self):
        query = """
            SELECT titulaire_id, titulaire_nom , poste_id FROM TItulaire
        """
        self.cursor.execute(query)
        data = self.cursor.fetchall()

        results = []
        for datas in data:
            titulaire_id, titulaire_nom,poste_id = datas
            poste_nom = self.poste_nom(poste_id)


            results.append({
                'titulaire_id': titulaire_id,
                'titulaire_nom': titulaire_nom,
                'poste_nom': poste_nom
            })

        return results

    def delete(self, titulaire_id):
        delete_query = "DELETE FROM Titulaire WHERE titulaire_id = ?"
        self.cursor.execute(delete_query, (titulaire_id,))
        self.conn.commit()
        return jsonify({'message': 'Titulaire deleted successfully'})

    def post(self):
        data = request.get_json()
        titulaire_nom = data.get('titulaire_nom')
        poste_id = data.get('poste_id')
        if titulaire_nom and poste_id:
            insert_query = "INSERT INTO Titulaire (titulaire_nom , poste_id) VALUES (? , ?)"
            self.cursor.execute(insert_query, (titulaire_nom,poste_id,))
            self.conn.commit()
            return jsonify({'message': 'Titulaire added successfully'})
        else:
            return jsonify({'error': 'Titulaire name or poste missing'}), 400

    def put(self, titulaire_id):
        data = request.get_json()
        titulaire_nom = data.get('titulaire_nom')
        poste_id = data.get('poste_id')
        if titulaire_nom and poste_id:
            try:
                update_query = "UPDATE Titulaire SET titulaire_nom = ? , poste_id = ? WHERE titulaire_id = ?"
                self.cursor.execute(update_query, (titulaire_nom, poste_id , titulaire_id,))
                self.conn.commit()
                return jsonify({'message': 'Titulaire updated successfully'})
            except Exception as e:
                return jsonify({'error': f"Error updating Titulaire: {e}"}), 500
        else:
            return jsonify({'error': 'Titulaire name and poste are required'}), 400

    def __del__(self):
        self.conn.close()

class TitulaireINdividualResource(Resource):
    def __init__(self):
        self.Handle = Handle_database()
        self.conn, self.cursor = self.Handle.connecterBD()

    def get(self , titulaire_id):
        query = """
            SELECT titulaire_id, titulaire_nom FROM Titulaire WHERE titulaire_id = ?
        """
        self.cursor.execute(query , (titulaire_id,))
        data = self.cursor.fetchall()



        return data


