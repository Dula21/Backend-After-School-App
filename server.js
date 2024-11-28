const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // Import MongoClient and ObjectId
require('dotenv').config();

const app = express(); // Initialize Express app
const PORT = process.env.PORT || 3001; // Define backend port
app.use(express.json()); // Middleware to parse incoming JSON requests

// Enable CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
    );
    next();
});

// MongoDB Connection URI
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017'; // Fallback to local MongoDB if no URI in environment
let db;

// Connect to MongoDB
MongoClient.connect(mongoUri)
    .then(client => {
        db = client.db('Lessons'); // Connect to the 'Lessons' database
        console.log('Connected to MongoDB');

        // Start the server once MongoDB is connected
        app.listen(PORT, () => {
            console.log(`Backend server is running at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
    });

// Home Route
app.get('/', (req, res) => {
    res.send('Welcome to the Lessons API! Try /collection/lessons or /collection/orders');
});

// Dynamic Collection Middleware
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName); // Attach the collection to the request object
    return next();
});

// GET all documents from a collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((err, results) => {
        if (err) return next(err);
        res.json(results); // Send all documents in the collection
    });
});

// GET a document by ID from a collection
app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne({ _id: new ObjectId(req.params.id) }, (err, result) => {
        if (err) return next(err);
        if (!result) {
            res.status(404).send({ error: 'Document not found' });
        } else {
            res.json(result); // Send the document
        }
    });
});

// POST to add a new document to a collection
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insertOne(req.body, (err, result) => {
        if (err) return next(err);
        res.status(201).json(result.ops[0]); // Send the inserted document
    });
});

// PUT to update a document by ID
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.updateOne(
        { _id: new ObjectId(req.params.id) }, // Find document by ObjectId
        { $set: req.body }, // Update fields provided in the request body
        (err, result) => {
            if (err) return next(err);
            res.json(result.matchedCount === 1 ? { msg: 'success' } : { msg: 'error' });
        }
    );
});

// DELETE to remove a document by ID
app.delete('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.deleteOne(
        { _id: new ObjectId(req.params.id) }, // Find document by ObjectId
        (err, result) => {
            if (err) return next(err);
            res.json(result.deletedCount === 1 ? { msg: 'success' } : { msg: 'error' });
        }
    );
});

// Special route to get all lessons (alias for /collection/lessons)
app.get('/lessons', async (req, res) => {
    try {
        const lessons = await db.collection('lessons').find({}).toArray();
        res.json(lessons); // Send lessons as JSON
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch lessons' });
    }
});

// Special route to create an order
app.post('/orders', async (req, res) => {
    try {
        const result = await db.collection('orders').insertOne(req.body);
        res.status(201).json(result.ops[0]); // Send the created order
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'An error occurred, please try again later.' });
});
