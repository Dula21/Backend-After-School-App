const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const router = express.Router();

// MongoDB collection setup
const db = require('./server').db; // Access the db from server.js

// Lessons API
router.get('/lessons', (req, res, next) => {
  db.collection('lessons').find({}).toArray((err, results) => {
    if (err) return next(err);
    res.json(results);
  });
});

router.post('/lessons', (req, res, next) => {
  db.collection('lessons').insertOne(req.body, (err, result) => {
    if (err) return next(err);
    res.status(201).json(result.ops);
  });
});

router.put('/lessons/:id', (req, res, next) => {
  const lessonId = new ObjectID(req.params.id);
  db.collection('lessons').updateOne({ _id: lessonId }, { $set: req.body }, (err, result) => {
    if (err) return next(err);
    res.json(result.result.n === 1 ? { msg: 'Success' } : { msg: 'Error' });
  });
});

router.delete('/lessons/:id', (req, res, next) => {
  const lessonId = new ObjectID(req.params.id);
  db.collection('lessons').deleteOne({ _id: lessonId }, (err, result) => {
    if (err) return next(err);
    res.json(result.result.n === 1 ? { msg: 'Success' } : { msg: 'Error' });
  });
});

// Orders API
router.get('/orders', (req, res, next) => {
  db.collection('orders').find({}).toArray((err, results) => {
    if (err) return next(err);
    res.json(results);
  });
});

router.post('/orders', (req, res, next) => {
  db.collection('orders').insertOne(req.body, (err, result) => {
    if (err) return next(err);
    res.status(201).json(result.ops);
  });
});

router.put('/orders/:id', (req, res, next) => {
  const orderId = new ObjectID(req.params.id);
  db.collection('orders').updateOne({ _id: orderId }, { $set: req.body }, (err, result) => {
    if (err) return next(err);
    res.json(result.result.n === 1 ? { msg: 'Success' } : { msg: 'Error' });
  });
});

router.delete('/orders/:id', (req, res, next) => {
  const orderId = new ObjectID(req.params.id);
  db.collection('orders').deleteOne({ _id: orderId }, (err, result) => {
    if (err) return next(err);
    res.json(result.result.n === 1 ? { msg: 'Success' } : { msg: 'Error' });
  });
});

module.exports = router;
