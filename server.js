const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();
const PORT = 3000;

// Server
app.listen(PORT, () => {
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
});

// Cu bodyParser procesam datele introduse in formular
app.use(bodyParser.urlencoded({ extended: true }));

//#region  RENDERING
// Randam pagina de index
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Randam pagina form 
app.get('/form', (req,res)=>{
    res.sendFile(__dirname + '/public/form.html');
})

//#endregion

//#region SQL
app.post('/submit', (req, res) => {
    const { nume, prenume, an_universitar, facultate, email, nr_telefon } = req.body;
// Funcții de validare
const numarok = (value) => /^\d+$/.test(value); 
const textok = (value) => /^[a-zA-Z\s]+$/.test(value); 


if (!textok
(nume) || !textok(prenume) || !textok(facultate)) {
    return res.status(400).send('Câmpurile Nume, Prenume și Facultate trebuie să conțină doar litere.');
}

if (!numarok(an_universitar) || parseInt(an_universitar) <= 0) {
    return res.status(400).send('Anul universitar trebuie să fie un număr pozitiv.');
}

if (!numarok(nr_telefon)) {
    return res.status(400).send('Numărul de telefon trebuie să conțină doar cifre.');
}
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
//#endregion