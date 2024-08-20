const jwt = require('jsonwebtoken');
const router = require('express').Router();

const { SECRET } = require('../util/config');
const { Note, User } = require('../models');
const { tokenExtractor, noteFinder } = require('../util/middleware');

router.get('/', async (req, res) => {
  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
  });
  res.json(notes);
});

router.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const note = await Note.create({ ...req.body, userId: user.id, date: new Date() });
    res.json(note);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    res.json(req.note);
  } else {
    res.status(404).end();
  }
});

router.delete('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    await req.note.destroy();
  }
  res.status(204).end();
});

router.put('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    req.note.important = req.body.important;
    await req.note.save();
    res.json(req.note);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
