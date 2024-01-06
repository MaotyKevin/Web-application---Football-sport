import sqlite3 , os , sys

class Handle_database:
    def __init__(self):
        self.database_name = 'Foot_data.sqlite'

    def connecterBD(self):
        conn = sqlite3.connect(self.database_name)
        cursor = conn.cursor()
        return conn , cursor
    

        