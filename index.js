const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3002;

app.use(cors());

// Configuration de Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route pour uploader une image
app.post('/upload', upload.single('image'), (req, res) => {
    res.send({
        message: 'Image uploadée avec succès',
        filename: req.file.filename
    });
});

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/images', (req, res) => {
    const directoryPath = path.join(__dirname, 'uploads');
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "Impossible de scanner les fichiers!",
                error: err
            });
        } 
        // Filtrer pour ne renvoyer que les fichiers images
        let fileInfos = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file)).map(file => {
            return {
                url: `http://${req.headers.host}/images/${file}`
            };
        });
        res.send(fileInfos);
    });
});

// Middleware pour servir les fichiers statiques
app.use('/images', express.static('uploads'));

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});