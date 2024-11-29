const express = require("express");
const { MongoClient, ObjectID } = require("mongodb"); // Include MongoClient and ObjectID

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// CORS Headers to allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

// MongoDB connection
const dbUrl = "mongodb+srv://Admin:admin@gettingstarted.quhps.mongodb.net/";
let db;

MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    }
    db = client.db("Lessons");
    console.log("Connected to MongoDB successfully!");
});

// Welcome route
app.get("/", (req, res) => {
    res.send("Welcome to the API! Use endpoints like /collection/lessons to interact.");
});

// Collection parameter middleware
app.param("collectionName", (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName);
    return next();
});

// Get all documents from a collection
app.get("/collection/:collectionName", (req, res, next) => {
    req.collection.find({}).toArray((err, results) => {
        if (err) return next(err);
        res.send(results);
    });
});

// Add a document to a collection
app.post("/collection/:collectionName", (req, res, next) => {
    req.collection.insertOne(req.body, (err, result) => {
        if (err) return next(err);
        res.send(result.ops[0]); // Send the inserted document
    });
});

// Update a document in a collection
app.put("/collection/:collectionName/:id", (req, res, next) => {
    req.collection.updateOne(
        { _id: new ObjectID(req.params.id) },
        { $set: req.body },
        (err, result) => {
            if (err) return next(err);
            res.send(result.matchedCount === 1 ? { msg: "success" } : { msg: "error" });
        }
    );
});

// Delete a document from a collection
app.delete("/collection/:collectionName/:id", (req, res, next) => {
    req.collection.deleteOne({ _id: new ObjectID(req.params.id) }, (err, result) => {
        if (err) return next(err);
        res.send(result.deletedCount === 1 ? { msg: "success" } : { msg: "error" });
    });
});

// Listen on the specified port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Express.js server running at http://localhost:${port}`);
});
