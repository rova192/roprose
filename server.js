const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Mongoose yhteys MongoDB:hen (korvaa omalla MongoDB-URL:llasi)
mongoose.connect('mongodb://localhost:27017/aikataulu', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Luo Mongoose Schema ja Model
const entrySchema = new mongoose.Schema({
    task: String,
    dateString: String,
});

const Entry = mongoose.model('Entry', entrySchema);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// API reitit
app.post('/api/entries', async (req, res) => {
    const newEntry = new Entry(req.body);
    try {
        await newEntry.save();
        res.status(201).send(newEntry);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/api/entries', async (req, res) => {
    try {
        const entries = await Entry.find({});
        res.send(entries);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete('/api/entries/:id', async (req, res) => {
    try {
        const entry = await Entry.findByIdAndDelete(req.params.id);
        if (!entry) {
            res.status(404).send();
        }
        res.send(entry);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
