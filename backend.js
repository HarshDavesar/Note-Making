const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/noteMaking", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected!"))
.catch(err => console.log('Mongo Error:', err));

// Note Schema
const noteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    
    bgColor: {
        type: String,
        required: true
    }
});

// Note Model
const Note = mongoose.model("Note", noteSchema);

// Routes

// Save Note
app.post('/save-note', async (req, res) => {
    const { text, bgColor } = req.body;

    try {
        const newNote = new Note({ text, bgColor });
        await newNote.save();

        res.json({ success: true, message: 'Note saved successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to save note', error: err.message });
    }
});

// Delete Note
app.delete('/delete-note', async (req, res) => {
    const { text, bgColor } = req.body;

    try {
        const deletedNote = await Note.findOneAndDelete({ text, bgColor });

        if (deletedNote) {
            res.json({ success: true, message: 'Note deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Note not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete note', error: err.message });
    }
});


app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch notes', error: err.message });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
