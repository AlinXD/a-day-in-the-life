const sqlite3 = require('sqlite3').verbose();

// Creează și deschide baza de date
const db = new sqlite3.Database('./students.db', (err) => {
    if (err) {
        console.error('Nu merge db:', err.message);
    } else {
        console.log('Merge db.');
        db.run(`CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nume TEXT,
            prenume TEXT,
            an_universitar INTEGER,
            facultate TEXT,
            email TEXT,
            nr_telefon TEXT
        )`);
    }
});

module.exports = db;
