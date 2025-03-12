from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import cx_Oracle

app = Flask(__name__)
CORS(app)

# Oracle connection
dsn = cx_Oracle.makedsn('localhost', 1521, service_name='JXIPDB1')  # Use your actual service name
conn = cx_Oracle.connect(user='system', password='your_password', dsn=dsn)
cursor = conn.cursor()

#CREATE
@app.route('/add_station', methods=['POST'])
def add_station():
    data = request.json
    try:
        cursor.execute(
            "INSERT INTO stations (station_id, station_name, station_location, capacity, station_status) VALUES (:1, :2, :3, :4, :5)",
            (data['station_id'], data['station_name'], data['station_location'], data['capacity'], data['station_status'])
        )
        conn.commit()
        return jsonify({"message": "Station added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
#READ
@app.route('/get_stations', methods=['GET'])
def get_stations():
    cursor.execute("SELECT * FROM stations")
    stations = cursor.fetchall()
    result = [
        {"station_id": row[0], "station_name": row[1], "station_location": row[2], "capacity": row[3], "station_status": row[4]}
        for row in stations
    ]
    return jsonify(result)
#UPDATE
@app.route('/update_station/<int:id>', methods=['PUT'])
def update_station(id):
    data = request.json
    try:
        cursor.execute(
            "UPDATE stations SET station_name=:1, station_location=:2, capacity=:3, station_status=:4 WHERE station_id=:5",
            (data['station_name'], data['station_location'], data['capacity'], data['station_status'], id)
        )
        conn.commit()
        return jsonify({"message": "Station updated successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
#DELETE
@app.route('/delete_station/<int:id>', methods=['DELETE'])
def delete_station(id):
    try:
        cursor.execute("DELETE FROM stations WHERE station_id = :1", (id,))
        conn.commit()
        return jsonify({"message": "Station deleted successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
#HOME PAGE
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
