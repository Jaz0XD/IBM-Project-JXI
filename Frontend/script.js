const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change if necessary
    password: '', // Change if necessary
    database: 'ev_charging'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL Database');
    }
});

// API Route to store form data
app.post('/submit', (req, res) => {
    const { stationName, location, slotNumber, capacity, customerName, vehicleType, contact, reservationTime } = req.body;

    const query = `
        INSERT INTO reservations (station_name, location, slot_number, capacity, customer_name, vehicle_type, contact, reservation_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [stationName, location, slotNumber, capacity, customerName, vehicleType, contact, reservationTime], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Database Error');
        } else {
            res.send({ message: 'Data stored successfully!' });
        }
    });
});

// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
