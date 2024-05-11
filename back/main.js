const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const client = require("./client");
const cors = require('cors')
const path = require("path");
const multer = require("multer");


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true);
    } else{
        cb(null, false);
    }
}

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')))

// GET all Hero's
app.get("/", (req, res) => {
    client.getAll(null, (err, data) => {
        if (!err) {
            res.json(data);
        } else {
            console.error(err);
            res.status(500).send({
                msg: "There was some issue"
            });
        }
    });
});

// GET hero by ID
app.get('/:id', (req, res) => {
    client.get({ id: req.params.id }, (err, data) => {
        if (!err) {
            res.json(data);
        } else {
            console.error(err);
            res.status(500).send({
                msg: "There was some issue"
            });
        }
    });
});

// Create new hero
app.post("/create", (req, res) => {
    let newMole = {
        id: uuidv4(),
        hero: req.body.hero,
        release: req.body.release,
        role: req.body.role,
        lane: req.body.lane,
        image: req.file.path
    };

    client.insert(newMole, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send({
                msg: "There was some issue"
            });
        } else {
            console.log("Hero created successfully", data);
            res.redirect("/");
        }
    });
});

// Pada sisi server (main.js)

// Update hero
app.patch("/update/:id", (req, res) => {
    const updateMole = { 
        id: req.params.id, // Ambil ID dari parameter URL
        hero: req.body.hero, 
        release: req.body.release, 
        role: req.body.role, 
        lane: req.body.lane,
        image: req.file.path
    };

    client.update(updateMole, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send({
                msg: "There was some issue"
            });
        } else {
            if (!data) {
                console.log("Your ID isn't available");
                res.json("Your ID isn't available");
                return;
            }
            console.log("Hero updated successfully", data);
            res.json(data);
        }
    });
});

// Delete hero
app.delete("/delete/:id", (req, res) => {
    const getId = req.params.id;
    client.remove({ id: getId }, (err, _) => {
        if (err) {
            console.error(err);
            res.status(500).send({
                msg: "There was some issue"
            });
        } else {
            console.log("Hero removed successfully");
            res.json('ID ' + getId + ' deleted successfully');
        }
    });
});

// Start the Express server
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
    console.log("Server running at port %d", PORT);
});
