const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { Lesson, Order } = require("./models");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json()); // for parsing application/json

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Lessons', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// API Routes

// Create a new lesson
app.post("/lessons", async (req, res) => {
    const { title, description, price, image } = req.body;
    try {
        const newLesson = new Lesson({ title, description, price, image });
        await newLesson.save();
        res.status(201).json(newLesson);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create lesson', details: err.message });
    }
});

// Get all lessons
app.get("/lessons", async (req, res) => {
    try {
        const lessons = await Lesson.find();
        res.status(200).json(lessons);
    } catch (err) {
        res.status(400).json({ error: 'Failed to retrieve lessons', details: err.message });
    }
});

// Get a single lesson by ID
app.get("/lessons/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const lesson = await Lesson.findById(id);
        if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
        res.status(200).json(lesson);
    } catch (err) {
        res.status(400).json({ error: 'Failed to retrieve lesson', details: err.message });
    }
});

// Update a lesson by ID
app.put("/lessons/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, price, image } = req.body;
    try {
        const updatedLesson = await Lesson.findByIdAndUpdate(id, { title, description, price, image }, { new: true });
        if (!updatedLesson) return res.status(404).json({ error: 'Lesson not found' });
        res.status(200).json(updatedLesson);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update lesson', details: err.message });
    }
});

// Delete a lesson by ID
app.delete("/lessons/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLesson = await Lesson.findByIdAndDelete(id);
        if (!deletedLesson) return res.status(404).json({ error: 'Lesson not found' });
        res.status(200).json({ message: 'Lesson deleted' });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete lesson', details: err.message });
    }
});

// Create a new order
app.post("/orders", async (req, res) => {
    const { lessonId, quantity, total, customerName, customerEmail } = req.body;
    try {
        const newOrder = new Order({ lessonId, quantity, total, customerName, customerEmail });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create order', details: err.message });
    }
});

// Get all orders
app.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find().populate('lessonId');
        res.status(200).json(orders);
    } catch (err) {
        res.status(400).json({ error: 'Failed to retrieve orders', details: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend server is running at http://localhost:${PORT}`);
});
