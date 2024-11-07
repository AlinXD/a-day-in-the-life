const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');
const app = express();
const PORT = 3000;

// Server
app.listen(PORT, () => {
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
});

// Middleware 
app.use(bodyParser.urlencoded({ extended: true }));

//#region RENDERING
// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Randam pagina index
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Randam pagina form
app.get('/form', (req, res) => {
    res.sendFile(__dirname + '/public/form.html');
});
//#endregion

//#region SQL
app.post('/submit', (req, res) => {
    const { nume, prenume, an_universitar, facultate, email, nr_telefon } = req.body;
    let error = "<html><head><link rel='stylesheet' href='style.css'></head>";
    let errorStatus = false;
    // Funcții de validare
    const isnr = (value) => /^\d+$/.test(value);
    const istext = (value) => /^[a-zA-Z\s]+$/.test(value);


    if (!istext(nume)) {
        error += '<p>Câmpul Nume trebuie să conțină doar litere.</p>\n'; errorStatus = true;
    }
    if (!istext(prenume)) {
        error += '<p>Câmpul Prenume trebuie să conțină doar litere.</p>\n'; errorStatus = true;
    }
    if (!istext(facultate)) {
        error += '<p>Câmpul Facultate trebuie să conțină doar litere.</p>\n'; errorStatus = true;
    }

    if (!isnr(an_universitar) || an_universitar <= 0) {
        error += '<p>Anul universitar trebuie să fie un număr pozitiv.</p>\n'; errorStatus = true;
    }

    if (!isnr(nr_telefon)) {
        error += '<p>Numărul de telefon trebuie să fie compus doar cifre.</p>\n'; errorStatus = true;
    }

    if (errorStatus) {
        return res.status(200).send(error);
    }
    
    const query = `INSERT INTO students (nume, prenume, an_universitar, facultate, email, nr_telefon)
                    VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(query, [nume, prenume, an_universitar, facultate, email, nr_telefon], function (err) {
        if (err) {
            console.error('Eroare la adaugarea studentului.', err.message);
            res.status(500).send('Eroare la stocarea datelor.');
        } else {
            console.log('Student adăugat cu succes!');
            res.send('<p>Datele au fost stocate cu succes!</p><button><a href="/">Acasa</a></button>');
        }
    });
});
//#endregion