const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// Middleware to log request details (IP, date)
app.use(function (req, res, next) {
    console.log("Request URL: " + req.url);
    console.log("Request date: " + new Date());
    next();
});

// Middleware to serve static files from 'client' directory
app.use(function (req, res, next) {
    const staticpath = path.join(__dirname, "static", req.url); // Serving static files from the "client" directory
    fs.stat(staticpath, function (err, fileInfo) {
        if (err) {
            next(); // File not found, proceed to next middleware
            return;
        }
        if (fileInfo.isFile()) {
            res.sendFile(filePath); // Send the file if it exists
        } else {
            next(); // Proceed if not a file (e.g., a folder or invalid file)
        }
    });
});

// Default route for the application (optional)
app.get('/', (req, res) => {
    res.send('Select a collection, e.g., /collection/messages');
});

// 404 error handling for non-existent routes
app.use(function (req, res) {
    res.status(404).send("File not found!");
});

module.exports = app; // Export the app for use in server.js
