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


app.post('/add-station', async (req, res) => {
    const { stationName, location, capacity, status } = req.body;
    const query = `
        INSERT INTO stations (station_name, station_location, capacity, station_status)
        VALUES (:1, :2, :3, :4)
    `;
    try {
        await runQuery(query, [stationName, location, capacity, status]);
        res.send({ message: 'Station added successfully!' });
    } catch (err) {
        res.status(500).send('Database Error');
    }
});

app.post('/add-customer', async (req, res) => {
    const { customerName, contact, vehicleType } = req.body;
    const query = `
        INSERT INTO customers (cutomer_name, contact, vehicle_type)
        VALUES (:1, :2, :3)
    `;
    try {
        await runQuery(query, [customerName, contact, vehicleType]);
        res.send({ message: 'Customer added successfully!' });
    } catch (err) {
        res.status(500).send('Database Error');
    }
});

app.get('/stations', async (req, res) => {
    const query = `SELECT * FROM stations`;
    try {
        const result = await runQuery(query);
        res.send(result.rows);
    } catch (err) {
        res.status(500).send('Database Error');
    }
});

app.get('/customers', async (req, res) => {
    const query = `SELECT * FROM customers`;
    try {
        const result = await runQuery(query);
        res.send(result.rows);
    } catch (err) {
        res.status(500).send('Database Error');
    }
});



app.put('/update-station/:id', async (req, res) => {
    const { id } = req.params;
    const { stationName, location, capacity, status } = req.body;
    const query = `
        UPDATE stations
        SET station_name = :1, station_location = :2, capacity = :3, station_status = :4
        WHERE station_id = :5
    `;
    try {
        await runQuery(query, [stationName, location, capacity, status, id]);
        res.send({ message: 'Station updated successfully!' });
    } catch (err) {
        res.status(500).send('Database Error');
    }
});

app.put('/update-customer/:id', async (req, res) => {
    const { id } = req.params;
    const { customerName, contact, vehicleType } = req.body;
    const query = `
        UPDATE customers
        SET cutomer_name = :1, contact = :2, vehicle_type = :3
        WHERE customer_id = :4
    `;
    try {
        await runQuery(query, [customerName, contact, vehicleType, id]);
        res.send({ message: 'Customer updated successfully!' });
    } catch (err) {
        res.status(500).send('Database Error');
    }
});
app.delete('/delete-station/:id', async (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM stations WHERE station_id = :1`;
    try {
        await runQuery(query, [id]);
        res.send({ message: 'Station deleted successfully!' });
    } catch (err) {
        res.status(500).send('Database Error');
    }
});

app.delete('/delete-customer/:id', async (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM customers WHERE customer_id = :1`;
    try {
        await runQuery(query, [id]);
        res.send({ message: 'Customer deleted successfully!' });
    } catch (err) {
        res.status(500).send('Database Error');
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
