const express = require("express");

// List of allowed IPs (add your specific IPs here)
const ALLOWED_IPS = [
    "123.001.1",
    "123.456.7.89",
];

const api = express.Router();

// Middleware to restrict access based on allowed IPs
api.use((req, res, next) => {
    const userIsAllowed = ALLOWED_IPS.indexOf(req.ip) !== -1;
    if (!userIsAllowed) {
        res.status(403).send("You are not allowed to access this resource");
    } else {
        next();
    }
});

// Placeholder endpoint (can be modified later)
api.get("/welcome", (req, res) => {
    res.send("Welcome to the application's API!");
});

// Lessons API routes (no handling here, logic in server.js)
api.get("/lessons", (req, res) => {
    res.send("Fetching lessons... (Handled in server.js)");
});
api.post("/lessons", (req, res) => {
    res.send("Creating a lesson... (Handled in server.js)");
});

// Orders API routes
api.get("/orders", (req, res) => {
    res.send("Fetching orders... (Handled in server.js)");
});
api.post("/orders", (req, res) => {
    res.send("Creating an order... (Handled in server.js)");
});

// Export the API router
module.exports = api;
