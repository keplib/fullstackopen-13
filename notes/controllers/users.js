const router = require('express').Router();

const { User, Note } = require('../models');

const { tokenExtractor, isAdmin } = require('../util/middleware');

// const isAdmin = async (req, res, next) => {
//   const user = await User.findByPk(req.decodedToken.id);
//   if (!user.admin) {
//     return res.status(401).json({ error: 'operation not allowed' });
//   }
//   next();
// };

// const tokenExtractor = (req, res, next) => {
//   const authorization = req.get('authorization');

//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     try {
//       req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
//       console.log(req.decodedToken);
//     } catch {
//       return res.status(401).json({ error: 'token invalid' });
//     }
//   } else {
//     return res.status(401).json({ error: 'token missing' });
//   }
//   next();
// };

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Note,
      attributes: { exclude: ['userId'] },
    },
  });
  res.json(users);
});

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });

  if (user) {
    user.disabled = req.body.disabled;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
