const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // Import MongoClient and ObjectId
require('dotenv').config();

const app = express(); // Initialize Express app

app.use(express.json()); // Middleware to parse incoming JSON requests
app.set('port', process.env.PORT || 3000); // Set the port to environment variable or 3000

// Enable CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    next();
});

// MongoDB Connection URI (using environment variable for security)
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
let db;

// Connect to MongoDB
MongoClient.connect('mongodb+srv://Admin:admin@gettingstarted.quhps.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db('Lessons'); // Use the 'Lessosns' database
        console.log('Connected to MongoDB');

        // Start the server once MongoDB is connected
        app.listen(app.get('port'), () => {
            console.log(`Express.js server running at http://localhost:${app.get('port')}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
    });

// Home Route
app.get('/', (req, res) => {
    res.send('select a collection, e.g., /collection/messages');
});

// Middleware for dynamic collection binding
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName); // Attach the collection to the request object
    return next();
});

// GET all documents from a collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((err, results) => {
        if (err) return next(err);
        res.send(results); // Send all documents in the collection
    });
});

// POST to add a new document to a collection
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insertOne(req.body, (err, result) => {
        if (err) return next(err);
        res.send(result.ops[0]); // Send the inserted document back
    });
});

// PUT to update a document by ID
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.updateOne(
        { _id: new ObjectId(req.params.id) }, // Find document by ObjectId
        { $set: req.body }, // Update fields provided in the request body
        (err, result) => {
            if (err) return next(err);
            res.send(result.matchedCount === 1 ? { msg: 'success' } : { msg: 'error' });
        }
    );
});

// DELETE to remove a document by ID
app.delete('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.deleteOne(
        { _id: new ObjectId(req.params.id) }, // Find document by ObjectId
        (err, result) => {
            if (err) return next(err);
            res.send(result.deletedCount === 1 ? { msg: 'success' } : { msg: 'error' });
        }
    );
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ error: 'An error occurred, please try again later.' });
});
