const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();
const PORT = 1234;
// Serverul
app.listen(PORT, () => {
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
// Cu bodyParser procesam datele introduse in formular
app.use(bodyParser.urlencoded({ extended: true }));

// Ce avem in form.html apare in site prin ruta de mai jos
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/form.html');
});

// Cu cele doua rute de mai jos de tip post si run se stocheaza datele inscrise in formular in baza de date.
app.post('/submit', (req, res) => {
    const { nume, prenume, an_universitar, facultate, email, nr_telefon } = req.body;

    const query = `INSERT INTO students (nume, prenume, an_universitar, facultate, email, nr_telefon)
                   VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [nume, prenume, an_universitar, facultate, email, nr_telefon], function (err) {
        if (err) {
            console.error('Eroare la adaugarea studentului.', err.message);
            res.status(500).send('Eroare la stocarea datelor.');
        } else {
            console.log('Student adăugat cu succes!');
            res.send('Datele au fost stocate cu succes!');
        }
    });
});


