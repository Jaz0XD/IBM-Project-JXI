const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
    user: "system",
    password: "tiger",
    connectString: "localhost/xe" // Use your service name
};

// Function to handle database queries
async function runQuery(query, binds = []) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(query, binds, { autoCommit: true });
        return result;
    } catch (err) {
        console.error('Database error:', err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}
//CREATE
app.post('/add_reservation', async (req, res) => {
    const { stationName, location, slotNumber, capacity, customerName, vehicleType, contact, reservationTime } = req.body;

    const query = `
        INSERT INTO reservations (station_name, location, slot_number, capacity, customer_name, vehicle_type, contact, reservation_time)
        VALUES (:1, :2, :3, :4, :5, :6, :7, TO_DATE(:8, 'YYYY-MM-DD HH24:MI:SS'))
    `;

    try {
        await runQuery(query, [stationName, location, slotNumber, capacity, customerName, vehicleType, contact, reservationTime]);
        res.status(201).json({ message: 'Reservation added successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===============================
// 🚀 READ (Get All Reservations)
// ===============================
app.get('/get_reservations', async (req, res) => {
    const query = `SELECT * FROM reservations`;

    try {
        const result = await runQuery(query);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===============================
// 🚀 UPDATE
// ===============================
app.put('/update_reservation/:id', async (req, res) => {
    const id = req.params.id;
    const { stationName, location, slotNumber, capacity, customerName, vehicleType, contact, reservationTime } = req.body;

    const query = `
        UPDATE reservations
        SET station_name = :1, location = :2, slot_number = :3, capacity = :4,
            customer_name = :5, vehicle_type = :6, contact = :7, reservation_time = TO_DATE(:8, 'YYYY-MM-DD HH24:MI:SS')
        WHERE reservation_id = :9
    `;

    try {
        await runQuery(query, [stationName, location, slotNumber, capacity, customerName, vehicleType, contact, reservationTime, id]);
        res.status(200).json({ message: 'Reservation updated successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===============================
// 🚀 DELETE
// ===============================
app.delete('/delete_reservation/:id', async (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM reservations WHERE reservation_id = :1`;

    try {
        await runQuery(query, [id]);
        res.status(200).json({ message: 'Reservation deleted successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===============================
// 🚀 Start the Server
// ===============================
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
