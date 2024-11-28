const express = require('express');
const { ObjectID } = require('mongodb');
const router = express.Router();

// MongoDB collection setup
const db = require('./server').db; // Access the db from server.js

// Lessons API
router.get('/lessons', (req, res, next) => {
  db.collection('lessons').find({}).toArray((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch lessons' });
    }
    res.json(results);
  });
});

router.post('/lessons', (req, res, next) => {
  db.collection('lessons').insertOne(req.body, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create lesson' });
    }
    res.status(201).json(result.ops[0]); // Return the inserted lesson
  });
});

router.put('/lessons/:id', (req, res, next) => {
  const lessonId = req.params.id;

  if (!ObjectID.isValid(lessonId)) {
    return res.status(400).json({ error: 'Invalid lesson ID' });
  }

  db.collection('lessons').updateOne({ _id: new ObjectID(lessonId) }, { $set: req.body }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update lesson' });
    }
    res.json(result.result.n === 1 ? { msg: 'Success' } : { msg: 'Lesson not found' });
  });
});

router.delete('/lessons/:id', (req, res, next) => {
  const lessonId = req.params.id;

  if (!ObjectID.isValid(lessonId)) {
    return res.status(400).json({ error: 'Invalid lesson ID' });
  }

  db.collection('lessons').deleteOne({ _id: new ObjectID(lessonId) }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete lesson' });
    }
    res.json(result.result.n === 1 ? { msg: 'Success' } : { msg: 'Lesson not found' });
  });
});

// Orders API
router.get('/orders', (req, res, next) => {
  db.collection('orders').find({}).toArray((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
    res.json(results);
  });
});

router.post('/orders', (req, res, next) => {
  db.collection('orders').insertOne(req.body, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create order' });
    }
    res.status(201).json(result.ops[0]); // Return the inserted order
  });
});

router.put('/orders/:id', (req, res, next) => {
  const orderId = req.params.id;

  if (!ObjectID.isValid(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  db.collection('orders').updateOne({ _id: new ObjectID(orderId) }, { $set: req.body }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update order' });
    }
    res.json(result.result.n === 1 ? { msg: 'Success' } : { msg: 'Order not found' });
  });
});

router.delete('/ orders/:id', (req, res, next) => {
  const orderId = req.params.id;

  if (!ObjectID.isValid(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  db.collection('orders').deleteOne({ _id: new ObjectID(orderId) }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete order' });
    }
    res.json(result.result.n === 1 ? { msg: 'Success' } : { msg: 'Order not found' });
  });
});

module.exports = router;