import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const port = 3001;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= DATABASE =================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bpbd_ews'
});

db.connect(err => {
    if (err) {
        console.error('❌ MySQL error:', err);
        return;
    }
    console.log('✅ MySQL connected');
});

// ================= API EWS =================
app.get('/api/ews', (req, res) => {
    console.log('GET /api/ews called');

    const query = `
        SELECT
            fid,
            tipe_ews,
            jenis_ews,
            nama_ews,
            alamat,
            pengelola,
            lat,
            lon,
            kondisi
        FROM ews_tsunami
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching EWS data:', err);
            return res.status(500).json({ error: 'Database query failed', details: err.message });
        }

        // Return data with original database field names as required
        const data = results.map((row) => {
            return {
                fid: row.fid,
                nama_ews: row.nama_ews,
                lat: parseFloat(row.lat),
                lon: parseFloat(row.lon),
                tipe_ews: row.tipe_ews,
                jenis_ews: row.jenis_ews,
                kondisi: row.kondisi,
                alamat: row.alamat,
                pengelola: row.pengelola
            };
        });

        console.log(`Fetched ${data.length} EWS points from database`);
        res.json(data);
    });
});

// ================= SERVER =================
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
