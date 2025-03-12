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
    connectString: "localhost/xe" 
};


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

app.post('/submit', async (req, res) => {
    const { stationName, location, slotNumber, capacity, customerName, vehicleType, contact, reservationTime } = req.body;

    const query = `
        INSERT INTO reservations (station_name, location, slot_number, capacity, customer_name, vehicle_type, contact, reservation_time)
        VALUES (:1, :2, :3, :4, :5, :6, :7, TO_DATE(:8, 'YYYY-MM-DD HH24:MI:SS'))
    `;

    try {
        await runQuery(query, [stationName, location, slotNumber, capacity, customerName, vehicleType, contact, reservationTime]);
        res.send({ message: 'Data stored successfully!' });
    } catch (err) {
        res.status(500).send('Database Error');
    }
});


app.listen(5000, () => {
    console.log('Server running on port 5000');
});
