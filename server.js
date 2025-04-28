const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req, res) => {
    res.redirect('/slike');
});

app.get('/slike', (req, res)=> {
    const folderPath = path.join(__dirname, 'public','images');
    const files = fs.readdirSync(folderPath);

    const images = files
        .filter(file=> file.endsWith('.png') || file.endsWith('.svg'))
        .map((file,index) => ({
            url: `/images/${file}`,
            id: `slika${index + 1}`,
            title: `Slika ${index +1}`
        }));
    res.render('slike', { images});
});

app.get('/', (req, res) => {
    res.send("Ili obican tekst ako nema HTML datoteke.");
});

app.listen(3000, () => {
    console.log("Server pokrenut na http://localhost:3000");
});
